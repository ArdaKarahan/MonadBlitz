// src/pages/Agreements.jsx
import React, { useEffect, useState } from "react";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

const Agreements = () => {
  const [activeTab, setActiveTab] = useState("active"); // active | completed | disputes
  const [transactions, setTransactions] = useState([]);
  const [completedTransactions, setCompletedTransactions] = useState([]);
  const [disputes, setDisputes] = useState([]);

  // ---- Mock data (frontend-only gösterim) ----
  useEffect(() => {
    const mockActive = [
      {
        id: 1,
        jobTitle: "Frontend Developer",
        employer: "TechCorp Inc.",
        employee: "John Smith",
        amount: "$5,000",
        commission: "$250",
        commissionRate: "5%",
        status: "In Progress",
        startDate: "2024-10-01",
        expectedCompletion: "2024-10-15",
        description: "Development of responsive web application",
        milestones: [
          {
            id: 1,
            name: "Project Setup",
            status: "Completed",
            amount: "$1,000",
          },
          {
            id: 2,
            name: "UI Development",
            status: "In Progress",
            amount: "$2,000",
          },
          {
            id: 3,
            name: "Backend Integration",
            status: "Pending",
            amount: "$1,500",
          },
          {
            id: 4,
            name: "Testing & Deployment",
            status: "Pending",
            amount: "$500",
          },
        ],
        escrowAmount: "$5,000",
        nextPayment: "$2,000",
      },
      {
        id: 2,
        jobTitle: "Mobile App Development",
        employer: "StartupXYZ",
        employee: "Sarah Johnson",
        amount: "$8,000",
        commission: "$400",
        commissionRate: "5%",
        status: "Awaiting Approval",
        startDate: "2024-09-28",
        expectedCompletion: "2024-11-15",
        description: "Cross-platform mobile application development",
        milestones: [
          {
            id: 1,
            name: "Requirements Analysis",
            status: "Completed",
            amount: "$1,500",
          },
          {
            id: 2,
            name: "Design & Prototyping",
            status: "Completed",
            amount: "$2,000",
          },
          {
            id: 3,
            name: "Development Phase 1",
            status: "Under Review",
            amount: "$3,000",
          },
          {
            id: 4,
            name: "Development Phase 2",
            status: "Pending",
            amount: "$1,500",
          },
        ],
        escrowAmount: "$8,000",
        nextPayment: "$3,000",
      },
      {
        id: 3,
        jobTitle: "Database Optimization",
        employer: "DataTech Solutions",
        employee: "Mike Chen",
        amount: "$3,500",
        commission: "$175",
        commissionRate: "5%",
        status: "Payment Pending",
        startDate: "2024-09-20",
        expectedCompletion: "2024-10-10",
        description: "PostgreSQL database performance optimization",
        milestones: [
          {
            id: 1,
            name: "Database Analysis",
            status: "Completed",
            amount: "$1,000",
          },
          {
            id: 2,
            name: "Optimization Implementation",
            status: "Completed",
            amount: "$2,000",
          },
          {
            id: 3,
            name: "Testing & Documentation",
            status: "Awaiting Payment",
            amount: "$500",
          },
        ],
        escrowAmount: "$3,500",
        nextPayment: "$500",
      },
    ];

    const mockCompleted = [
      {
        id: 101,
        jobTitle: "E-commerce Website",
        employer: "ShopMart Inc.",
        employee: "Emma Wilson",
        amount: "$12,000",
        commission: "$600",
        commissionRate: "5%",
        status: "Completed",
        startDate: "2024-08-15",
        completedDate: "2024-09-25",
        rating: { employer: 5, employee: 4.8 },
        description: "Full-stack e-commerce platform development",
      },
      {
        id: 102,
        jobTitle: "API Integration",
        employer: "CloudCorp",
        employee: "David Brown",
        amount: "$4,500",
        commission: "$225",
        commissionRate: "5%",
        status: "Completed",
        startDate: "2024-09-01",
        completedDate: "2024-09-20",
        rating: { employer: 4.9, employee: 4.7 },
        description: "Third-party API integration and documentation",
      },
    ];

    const mockDisputes = [
      {
        id: 201,
        jobTitle: "Website Redesign",
        employer: "DesignStudio",
        employee: "Alex Thompson",
        amount: "$6,000",
        commission: "$300",
        issue: "Scope disagreement",
        status: "Under Review",
        submittedDate: "2024-09-30",
        description: "Disagreement on final deliverables and scope changes",
      },
    ];

    setTransactions(mockActive);
    setCompletedTransactions(mockCompleted);
    setDisputes(mockDisputes);
  }, []);
  // -------------------------------------------

  const statusBadge = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Awaiting Approval":
        return "bg-yellow-100 text-yellow-800";
      case "Payment Pending":
        return "bg-orange-100 text-orange-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const milestoneBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Awaiting Payment":
        return "bg-orange-100 text-orange-800";
      case "Pending":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const moneyNumber = (s) => Number(String(s).replace(/[^0-9.-]+/g, "")) || 0;

  const TransactionCard = ({ tx, isCompleted = false }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-emerald-900 mb-2">
            {tx.jobTitle}
          </h3>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">Employer:</span> {tx.employer}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Employee:</span> {tx.employee}
            </p>
          </div>
        </div>
        <span
          className={classNames(
            "px-3 py-1 rounded-full text-sm font-medium",
            statusBadge(tx.status)
          )}
        >
          {tx.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-emerald-50 p-3 rounded-lg">
          <p className="text-sm text-emerald-600 font-medium">Total Amount</p>
          <p className="text-xl font-bold text-emerald-800">{tx.amount}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600 font-medium">
            Your Commission ({tx.commissionRate})
          </p>
          <p className="text-xl font-bold text-green-800">{tx.commission}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📅</span>
          <span>Started: {tx.startDate}</span>
        </div>
        {isCompleted ? (
          <div className="flex items-center text-gray-600">
            <span className="mr-2">✅</span>
            <span>Completed: {tx.completedDate}</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-600">
            <span className="mr-2">⏰</span>
            <span>Expected: {tx.expectedCompletion}</span>
          </div>
        )}
        {tx.escrowAmount && (
          <div className="flex items-center text-emerald-600 font-medium">
            <span className="mr-2">🔒</span>
            <span>Escrow: {tx.escrowAmount}</span>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4">{tx.description}</p>

      {!isCompleted && tx.milestones && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Project Milestones:
          </h4>
          <div className="space-y-2">
            {tx.milestones.map((m) => (
              <div
                key={m.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    {m.name}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({m.amount})
                  </span>
                </div>
                <span
                  className={classNames(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    milestoneBadge(m.status)
                  )}
                >
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCompleted && tx.rating && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Ratings:</h4>
          <div className="flex justify-between">
            <span className="text-sm">Employer: ⭐ {tx.rating.employer}/5</span>
            <span className="text-sm">Employee: ⭐ {tx.rating.employee}/5</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        {!isCompleted && tx.nextPayment && (
          <span className="text-sm text-gray-600">
            Next Payment: {tx.nextPayment}
          </span>
        )}
        <div className="flex space-x-2 ml-auto">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            {isCompleted ? "View Details" : "Manage"}
          </button>
          {!isCompleted && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Release Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const DisputeCard = ({ dispute }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-red-900 mb-2">
            {dispute.jobTitle}
          </h3>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">Employer:</span> {dispute.employer}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Employee:</span> {dispute.employee}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Issue:</span> {dispute.issue}
            </p>
          </div>
        </div>
        <span
          className={classNames(
            "px-3 py-1 rounded-full text-sm font-medium",
            statusBadge(dispute.status)
          )}
        >
          {dispute.status}
        </span>
      </div>

      <div className="bg-red-50 p-3 rounded-lg mb-4">
        <p className="text-sm text-red-600 font-medium">Amount in Dispute</p>
        <p className="text-xl font-bold text-red-800">{dispute.amount}</p>
      </div>

      <p className="text-gray-600 mb-4">{dispute.description}</p>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Submitted: {dispute.submittedDate}
        </span>
        <div className="flex space-x-2">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            Resolve Dispute
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            View Evidence
          </button>
        </div>
      </div>
    </div>
  );

  // ---- Toplam istatistikler ----
  const pendingCommission = transactions.reduce(
    (acc, t) => acc + moneyNumber(t.commission),
    0
  );
  const totalEarned = completedTransactions.reduce(
    (acc, t) => acc + moneyNumber(t.commission),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-emerald-900">
              Agreements Dashboard
            </h1>
            <p className="mt-2 text-emerald-600">
              Facilitate secure agreements, track milestones and resolve
              disputes
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-1 flex space-x-1">
          <button
            onClick={() => setActiveTab("active")}
            className={classNames(
              "flex-1 py-3 px-4 rounded-md font-medium transition-colors duration-200",
              activeTab === "active"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            Active Agreements ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={classNames(
              "flex-1 py-3 px-4 rounded-md font-medium transition-colors duration-200",
              activeTab === "completed"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            Completed ({completedTransactions.length})
          </button>
          <button
            onClick={() => setActiveTab("disputes")}
            className={classNames(
              "flex-1 py-3 px-4 rounded-md font-medium transition-colors duration-200",
              activeTab === "disputes"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            Disputes ({disputes.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {activeTab === "active" && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-emerald-900">
                Active Agreements
              </h2>
              <div className="flex space-x-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option>All Status</option>
                  <option>In Progress</option>
                  <option>Awaiting Approval</option>
                  <option>Payment Pending</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option>All Amounts</option>
                  <option>Under $5,000</option>
                  <option>$5,000 - $10,000</option>
                  <option>Over $10,000</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {transactions.map((t) => (
                <TransactionCard key={t.id} tx={t} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "completed" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-emerald-900">
                Completed Agreements
              </h2>
              <p className="text-emerald-600 mt-2">
                Successfully facilitated projects and earned commissions
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedTransactions.map((t) => (
                <TransactionCard key={t.id} tx={t} isCompleted />
              ))}
            </div>
          </div>
        )}

        {activeTab === "disputes" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-emerald-900">
                Dispute Resolution
              </h2>
              <p className="text-emerald-600 mt-2">
                Manage conflicts and ensure fair resolution for all parties
              </p>
            </div>

            {disputes.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {disputes.map((d) => (
                  <DisputeCard key={d.id} dispute={d} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                  No Active Disputes
                </h3>
                <p className="text-emerald-600">
                  All transactions are proceeding smoothly!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {transactions.length}
              </div>
              <div className="text-gray-600 mt-1">Active Deals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                ${pendingCommission.toLocaleString()}
              </div>
              <div className="text-gray-600 mt-1">Pending Commission</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {completedTransactions.length}
              </div>
              <div className="text-gray-600 mt-1">Completed Deals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                ${totalEarned.toLocaleString()}
              </div>
              <div className="text-gray-600 mt-1">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">5%</div>
              <div className="text-gray-600 mt-1">Commission Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Secure Transaction Management
            </h3>
            <p className="text-emerald-100 max-w-3xl mx-auto">
              As a trusted middleman, we facilitate secure transactions between
              employers and employees, providing escrow services, milestone
              management, and dispute resolution. Our platform ensures fair
              dealing for all parties while earning competitive commissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agreements;
