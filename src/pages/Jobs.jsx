// src/pages/Jobs.jsx
import React, { useMemo, useState } from "react";

const mockJobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    salary: "$100,000 - $140,000",
    type: "Full-time",
    remote: true,
    postedDate: "2025-09-28",
    description:
      "Lead our frontend team building modern, accessible web apps with React and TypeScript.",
    requirements: ["React", "TypeScript", "Testing", "Node.js"],
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "DataNest",
    location: "New York",
    salary: "$90,000 - $130,000",
    type: "Full-time",
    remote: false,
    postedDate: "2025-09-26",
    description:
      "Scale our API platform. Work with Node.js, PostgreSQL, Redis, and cloud tooling.",
    requirements: ["Node.js", "PostgreSQL", "Redis", "AWS"],
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    company: "Innovation Labs",
    location: "San Francisco",
    salary: "$110,000 - $150,000",
    type: "Contract",
    remote: false,
    postedDate: "2025-09-21",
    description:
      "Own features end-to-end across React and Node services. Ship fast with quality.",
    requirements: ["React", "Node.js", "MongoDB", "Docker"],
  },
  {
    id: 4,
    title: "React Native Developer",
    company: "MobileTech",
    location: "Austin",
    salary: "$85,000 - $120,000",
    type: "Full-time",
    remote: true,
    postedDate: "2025-09-30",
    description:
      "Build smooth mobile experiences with RN, hooks, and performant animations.",
    requirements: ["React Native", "iOS", "Android", "JavaScript"],
  },
  {
    id: 5,
    title: "Frontend Engineer",
    company: "PixelWorks",
    location: "Remote",
    salary: "$80,000 - $115,000",
    type: "Part-time",
    remote: true,
    postedDate: "2025-10-02",
    description:
      "Implement delightful UIs using React, Tailwind, and strong accessibility practices.",
    requirements: ["React", "Tailwind", "Accessibility"],
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "CloudCraft",
    location: "San Francisco",
    salary: "$120,000 - $160,000",
    type: "Full-time",
    remote: false,
    postedDate: "2025-09-18",
    description:
      "Own CI/CD, observability, and infra-as-code with Terraform and Kubernetes.",
    requirements: ["Kubernetes", "Terraform", "AWS", "CI/CD"],
  },
];

const locations = [
  "All locations",
  "Remote",
  "New York",
  "San Francisco",
  "Austin",
];
const types = ["All types", "Full-time", "Part-time", "Contract"];

function parseMaxSalary(s) {
  // "$80,000 - $120,000" -> 120000 ; "$120,000" -> 120000
  if (!s) return 0;
  const numbers = s.match(/\d[\d,]*/g);
  if (!numbers) return 0;
  const last = numbers[numbers.length - 1].replace(/,/g, "");
  return Number(last);
}

function JobCard({ job }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-emerald-900 mb-1">
            {job.title}
          </h3>
          <p className="text-gray-700 font-medium">{job.company}</p>
        </div>

        <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
          {new Date(job.postedDate).toLocaleDateString()}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📍</span>
          <span>{job.location}</span>
          {job.remote && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
              Remote
            </span>
          )}
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">💰</span>
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">⏰</span>
          <span>{job.type}</span>
        </div>
      </div>

      {job.description && (
        <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
      )}

      {job.requirements?.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
              >
                {req}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-gray-500 text-sm">Posted: {job.postedDate}</span>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
          Apply
        </button>
      </div>
    </div>
  );
}

export default function Jobs() {
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("All locations");
  const [type, setType] = useState("All types");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sort, setSort] = useState("newest");

  const jobs = useMemo(() => {
    let list = [...mockJobs];

    // Filter: search
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter((j) => {
        const hay = `${j.title} ${j.company} ${j.location} ${j.type} ${
          j.description
        } ${j.requirements?.join(" ")}`.toLowerCase();
        return hay.includes(needle);
      });
    }

    // Filter: location
    if (loc !== "All locations") {
      list = list.filter((j) => j.location === loc);
    }

    // Filter: type
    if (type !== "All types") {
      list = list.filter((j) => j.type === type);
    }

    // Filter: remote
    if (remoteOnly) {
      list = list.filter((j) => j.remote);
    }

    // Sort
    if (sort === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      );
    } else if (sort === "salary") {
      list.sort((a, b) => parseMaxSalary(b.salary) - parseMaxSalary(a.salary));
    }

    return list;
  }, [q, loc, type, remoteOnly, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-emerald-900">Jobs</h1>
            <p className="mt-2 text-emerald-600">
              Browse opportunities and find your next role.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-5">
          {/* 1 → 2 → 6 columns; each control w-full to avoid overflow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Search (2 columns on lg) */}
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search job title, company, or skill (e.g. React)"
              className="lg:col-span-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />

            {/* Location */}
            <select
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            {/* Type */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Remote only */}
            <label className="w-full inline-flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-lg cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
              />
              <span className="text-gray-700">Remote only</span>
            </label>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              title="Sort by"
            >
              <option value="newest">Newest</option>
              <option value="salary">Salary (high → low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{jobs.length}</span> job
            {jobs.length !== 1 ? "s" : ""}
          </p>
        </div>

        {jobs.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔎</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">
              Try changing filters or clearing your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
