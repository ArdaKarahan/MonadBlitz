// src/pages/Employee.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context";
import { useChainLance } from "../hooks/useChainLance";

export default function Employee() {
  const { isConnected, connectWallet, account } = useWeb3();
  const { openWorks, applyToWork } = useChainLance();

  const [activeTab, setActiveTab] = useState("jobListings");
  const [rows, setRows] = useState([]); // on-chain open works
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [error, setError] = useState("");

  // Persisted applied jobs (local only — UI için)
  const [appliedJobs, setAppliedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem("appliedJobs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  // On-chain açık işleri çek
  const load = async () => {
    try {
      setError("");
      setLoading(true);
      const r = await openWorks(); // [{ offeredWorkId, employer, amountToStake (bigint), isSealed }]
      setRows(r || []);
    } catch (e) {
      setError(e?.shortMessage || e?.message || "Failed to load works");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  // helpers
  const shortAddr = (a) => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "-");
  const formatETH = (wei) => {
    try {
      return `${ethers.formatEther(wei)} ETH`;
    } catch {
      // fallback bigint/string
      const asStr =
        typeof wei === "bigint" ? wei.toString() : String(wei ?? "0");
      return `${asStr} wei`;
    }
  };
  const shortId = (id) => (id ? `${id.slice(0, 10)}...${id.slice(-6)}` : "");

  // UI’ye uygun “job” objesi üret (on-chain datasından)
  const uiJobs = useMemo(() => {
    return (rows || []).map((w) => ({
      id: w.offeredWorkId,
      title: `On-chain Job ${shortId(w.offeredWorkId)}`,
      company: shortAddr(w.employer),
      location: "Remote",
      salary: formatETH(w.amountToStake),
      type: "Contract",
      description:
        "On-chain escrowed freelance engagement. Stake is funded by the employer and paid upon validation.",
      requirements: ["Solidity basics", "Web3", "Ethers.js"],
      postedDate: new Date().toISOString().split("T")[0],
    }));
  }, [rows]);

  const onApply = async (id) => {
    try {
      if (!isConnected) {
        const res = await connectWallet();
        if (!res?.success)
          throw new Error(res?.error || "Wallet not connected");
      }
      setApplying(id);
      setError("");
      await applyToWork(id);

      // UI: uygulanan işi “My Applications” tab’ına ekle
      const job = uiJobs.find((j) => j.id === id);
      const newApplied = {
        ...(job || {
          id,
          title: `On-chain Job ${shortId(id)}`,
          company: "—",
          location: "Remote",
          salary: "—",
          type: "Contract",
          description: "",
          requirements: [],
        }),
        status: "Applied",
        appliedDate: new Date().toISOString().split("T")[0],
        statusColor: "bg-green-100 text-green-800",
      };
      setAppliedJobs((prev) => {
        // aynı id tekrar eklenmesin
        if (prev.some((p) => p.id === id)) return prev;
        return [...prev, newApplied];
      });

      alert("Application submitted on-chain!");
    } catch (e) {
      setError(e?.shortMessage || e?.message || "Apply failed");
    } finally {
      setApplying(null);
    }
  };

  // Job Card (tasarımını senin attığın mock’a sadık tuttum)
  const JobCard = ({ job, isApplied = false }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
          <p className="text-lg text-gray-700 font-medium">{job.company}</p>
        </div>
        {isApplied && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${job.statusColor}`}
          >
            {job.status}
          </span>
        )}
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
        {isApplied && (
          <div className="flex items-center text-gray-600">
            <span className="mr-2">📅</span>
            <span>Applied: {job.appliedDate}</span>
          </div>
        )}
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
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {req}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-gray-500 text-sm">
          {isApplied
            ? `Applied: ${job.appliedDate}`
            : `Posted: ${job.postedDate}`}
        </span>
        {!isApplied && (
          <button
            onClick={() => onApply(job.id)}
            disabled={applying === job.id}
            className={`${
              applying === job.id
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            } text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200`}
          >
            {applying === job.id ? "Applying..." : "Apply Now"}
          </button>
        )}
      </div>
    </div>
  );

  // Stats
  const inProgressCount = appliedJobs.filter((j) =>
    ["Applied", "Under Review", "Interview Scheduled"].includes(j.status)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-emerald-900">
              Employee Dashboard
            </h1>
            <p className="mt-2 text-emerald-600">
              Discover opportunities and track your applications
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-1 flex space-x-1">
          <button
            onClick={() => setActiveTab("jobListings")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
              activeTab === "jobListings"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Available Jobs ({loading ? "…" : uiJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("appliedJobs")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
              activeTab === "appliedJobs"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            My Applications ({appliedJobs.length})
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {activeTab === "jobListings" ? (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-emerald-900">
                Available Job Opportunities
              </h2>
              <div className="flex space-x-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option>All Locations</option>
                  <option>Remote</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option>All Types</option>
                  <option>Contract</option>
                  <option>Full-time</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : uiJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🗂️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No open works
                </h3>
                <p className="text-gray-600">
                  Please check back later for new opportunities.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {uiJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-emerald-900">
                My Job Applications
              </h2>
              <p className="text-emerald-600 mt-2">
                Track the status of your job applications
              </p>
            </div>

            {appliedJobs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {appliedJobs.map((job) => (
                  <JobCard key={job.id} job={job} isApplied={true} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Applications Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't applied to any jobs yet. Start exploring
                  opportunities!
                </p>
                <button
                  onClick={() => setActiveTab("jobListings")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Browse Jobs
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {loading ? "…" : uiJobs.length}
              </div>
              <div className="text-gray-600 mt-1">Available Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {appliedJobs.length}
              </div>
              <div className="text-gray-600 mt-1">Applications Sent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {inProgressCount}
              </div>
              <div className="text-gray-600 mt-1">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">15</div>
              <div className="text-gray-600 mt-1">Profile Views</div>
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
    </div>
  );
}
