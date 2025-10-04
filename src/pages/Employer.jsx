// src/pages/Employer.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context";
import { useChainLance } from "../hooks/useChainLance";

export default function Employer() {
  const { isConnected, connectWallet, account } = useWeb3();
  const {
    // farklı hook isimleri için fallback
    employerWorks,
    getMyOfferedWorks,
    myWorks,
    offerWork,
    getCandidates,
    deleteWork: deleteWorkTx,
    recruitEmployee: recruitEmployeeTx,
  } = useChainLance();

  const [activeTab, setActiveTab] = useState("myJobs");
  const [rows, setRows] = useState([]); // on-chain offered works
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create Job modal
  const [showJobForm, setShowJobForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    type: "",
    salaryRange: "",
    stakeEth: "", // on-chain için gerekli: employer stake (ETH)
    description: "",
    requirementsText: "",
  });

  // Applications modal
  const [appsFor, setAppsFor] = useState(null); // offeredWorkId
  const [appsLoading, setAppsLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [recruiting, setRecruiting] = useState(null);

  // helpers
  const shortAddr = (a) => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "-");
  const shortId = (id) => (id ? `${id.slice(0, 10)}...${id.slice(-6)}` : "");
  const formatETH = (wei) => {
    try {
      return `${ethers.formatEther(wei)} ETH`;
    } catch {
      const asStr =
        typeof wei === "bigint" ? wei.toString() : String(wei ?? "0");
      return `${asStr} wei`;
    }
  };

  // Load my offered works (on-chain)
  const load = async () => {
    try {
      setError("");
      setLoading(true);
      const fn = employerWorks || getMyOfferedWorks || myWorks;
      let w = [];
      if (fn) {
        w = await fn();
      } else {
        // Hook’ta özel fonksiyon yoksa, minimum fallback: boş liste
        w = [];
      }
      setRows(w || []);
    } catch (e) {
      setError(e?.shortMessage || e?.message || "Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  // UI’ye uygun kart verisi
  const uiJobs = useMemo(() => {
    return (rows || []).map((w) => ({
      id: w.offeredWorkId,
      title: newJob.title || `On-chain Job ${shortId(w.offeredWorkId)}`,
      company: "—", // UI amaçlı; istersen sabit şirket adı koyabilirsin
      location: newJob.location || "Remote",
      salary: newJob.salaryRange || formatETH(w.amountToStake),
      type: newJob.type || "Contract",
      description:
        newJob.description ||
        "On-chain escrowed job. Funds are staked by the employer and released on validation.",
      requirements: newJob.requirementsText
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) || ["Web3", "Solidity basics", "Ethers.js"],
      postedDate: "—",
      applicationsCount: Array.isArray(w.candidates) ? w.candidates.length : 0,
      status: w.isSealed ? "Closed" : "Active",
      employer: w.employer,
      amountToStake: w.amountToStake,
      raw: w,
    }));
  }, [rows, newJob]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const loadCandidates = async (offeredWorkId) => {
    try {
      setAppsLoading(true);
      setError("");
      const list = await getCandidates?.(offeredWorkId);
      setCandidates(list || []);
      setAppsFor(offeredWorkId);
    } catch (e) {
      setError(e?.shortMessage || e?.message || "Failed to load applications");
    } finally {
      setAppsLoading(false);
    }
  };

  const handleRecruit = async (offeredWorkId, index) => {
    try {
      setRecruiting(`${offeredWorkId}:${index}`);
      setError("");
      await recruitEmployeeTx?.(offeredWorkId, index);
      alert("Candidate recruited. Agreement created on-chain.");
      setAppsFor(null);
      setCandidates([]);
      await load();
    } catch (e) {
      setError(e?.shortMessage || e?.message || "Recruit failed");
    } finally {
      setRecruiting(null);
    }
  };

  const handleCloseJob = async (offeredWorkId) => {
    try {
      if (!confirm("Close this job and refund stake?")) return;
      setError("");
      await deleteWorkTx?.(offeredWorkId);
      alert("Job closed and stake refunded.");
      await load();
    } catch (e) {
      setError(e?.shortMessage || e?.message || "Close failed");
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      if (!isConnected) {
        const res = await connectWallet();
        if (!res?.success)
          throw new Error(res?.error || "Wallet not connected");
      }
      if (!offerWork) {
        throw new Error("offerWork() is not implemented in hook");
      }
      const { stakeEth } = newJob;
      if (!stakeEth || Number(stakeEth) <= 0) {
        throw new Error("Please enter a positive stake (ETH)");
      }
      const value = ethers.parseEther(stakeEth.toString());
      setCreating(true);
      setError("");
      await offerWork({ value });
      alert("Job posted on-chain!");
      setShowJobForm(false);
      setNewJob({
        title: "",
        location: "",
        type: "",
        salaryRange: "",
        stakeEth: "",
        description: "",
        requirementsText: "",
      });
      await load();
    } catch (e) {
      setError(e?.shortMessage || e?.message || "Failed to create job");
    } finally {
      setCreating(false);
    }
  };

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-emerald-900 mb-2">
            {job.title}
          </h3>
          <p className="text-lg text-gray-700 font-medium">
            Employer: {shortAddr(job.employer)}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            job.status
          )}`}
        >
          {job.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📍</span>
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">💰</span>
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">⏰</span>
          <span>{job.type}</span>
        </div>
        <div className="flex items-center text-emerald-600 font-medium">
          <span className="mr-2">👥</span>
          <span>{job.applicationsCount} Applications</span>
        </div>
      </div>

      {job.description && (
        <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
      )}

      {job.requirements?.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
              >
                {req}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-gray-500 text-sm">
          Stake: {formatETH(job.amountToStake)}
        </span>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadCandidates(job.id)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            View Applications
          </button>

          {job.status === "Active" ? (
            <button
              onClick={() => handleCloseJob(job.id)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Close Job
            </button>
          ) : (
            <span className="px-3 py-2 rounded-lg bg-gray-100 text-gray-500 text-sm">
              Closed
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const JobForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-emerald-900">
            Post New On-chain Job
          </h2>
          <button
            onClick={() => setShowJobForm(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleCreateJob} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title (UI only)
            </label>
            <input
              type="text"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g. Senior React Developer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (UI only)
              </label>
              <input
                type="text"
                value={newJob.location}
                onChange={(e) =>
                  setNewJob({ ...newJob, location: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="e.g. Remote, New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type (UI only)
              </label>
              <select
                value={newJob.type}
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="Contract">Contract</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range (UI only)
            </label>
            <input
              type="text"
              value={newJob.salaryRange}
              onChange={(e) =>
                setNewJob({ ...newJob, salaryRange: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g. $80,000 - $120,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stake (ETH) — sent to contract
            </label>
            <input
              type="number"
              step="0.0001"
              min="0"
              required
              value={newJob.stakeEth}
              onChange={(e) =>
                setNewJob({ ...newJob, stakeEth: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g. 0.1"
            />
            <p className="text-xs text-gray-500 mt-1">
              This amount will be staked on-chain (escrow). Use test ETH on
              testnet if applicable.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description (UI only)
            </label>
            <textarea
              rows={4}
              value={newJob.description}
              onChange={(e) =>
                setNewJob({ ...newJob, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Describe the role, responsibilities, and expectations…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements (comma separated, UI only)
            </label>
            <input
              type="text"
              value={newJob.requirementsText}
              onChange={(e) =>
                setNewJob({ ...newJob, requirementsText: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g. React, TypeScript, Node.js"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={creating}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
            >
              {creating ? "Posting…" : "Post Job"}
            </button>
            <button
              type="button"
              onClick={() => setShowJobForm(false)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-emerald-900">
              Employer Dashboard
            </h1>
            <p className="mt-2 text-emerald-600">
              Manage your on-chain job postings and track applications
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("myJobs")}
              className={`py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === "myJobs"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              My Job Posts ({loading ? "…" : uiJobs.length})
            </button>
          </div>
          <button
            onClick={() => setShowJobForm(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center"
          >
            <span className="mr-2">+</span>
            Post New Job
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {activeTab === "myJobs" && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-emerald-900">
                Your Job Postings
              </h2>
              <div className="flex space-x-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Closed</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option>All Locations</option>
                  <option>Remote</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-gray-500">Loading…</div>
            ) : uiJobs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {uiJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💼</span>
                </div>
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                  No Job Postings Yet
                </h3>
                <p className="text-emerald-600 mb-6">
                  Start by posting your first on-chain job!
                </p>
                <button
                  onClick={() => setShowJobForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Post Your First Job
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {loading
                  ? "…"
                  : uiJobs.filter((j) => j.status === "Active").length}
              </div>
              <div className="text-gray-600 mt-1">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {loading
                  ? "…"
                  : uiJobs.reduce((t, j) => t + (j.applicationsCount || 0), 0)}
              </div>
              <div className="text-gray-600 mt-1">Total Applications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {loading ? "…" : uiJobs.length}
              </div>
              <div className="text-gray-600 mt-1">Posted Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">—</div>
              <div className="text-gray-600 mt-1">Successful Hires</div>
            </div>
          </div>
          {account && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Signed in as{" "}
              <span className="font-medium">{shortAddr(account)}</span>
            </p>
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      {showJobForm && <JobForm />}

      {/* Applications Modal */}
      {appsFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-emerald-900">
                Applications — {shortId(appsFor)}
              </h3>
              <button
                onClick={() => {
                  setAppsFor(null);
                  setCandidates([]);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {appsLoading ? (
              <div className="text-gray-500">Loading…</div>
            ) : candidates.length === 0 ? (
              <div className="text-gray-600">No applications yet.</div>
            ) : (
              <div className="space-y-2">
                {candidates.map((addr, idx) => (
                  <div
                    key={`${addr}-${idx}`}
                    className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2"
                  >
                    <div className="text-slate-800">{shortAddr(addr)}</div>
                    <button
                      onClick={() => handleRecruit(appsFor, idx)}
                      disabled={recruiting === `${appsFor}:${idx}`}
                      className={`px-3 py-1.5 rounded-lg text-white ${
                        recruiting === `${appsFor}:${idx}`
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {recruiting === `${appsFor}:${idx}`
                        ? "Recruiting…"
                        : "Recruit"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
