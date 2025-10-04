import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context";
import { useChainLance } from "../hooks/useChainLance";

export default function Register() {
  const { isConnected, connectWallet } = useWeb3();
  const { createAccount } = useChainLance();
  const [role, setRole] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!isConnected) {
      await connectWallet();
    }
    if (!role) return setErr("Please choose one role");
    try {
      setLoading(true);
      await createAccount(role);
      alert(`Registered on-chain as ${role}`);
      navigate("/profile");
    } catch (e) {
      setErr(e?.shortMessage || e?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center">Sign Up (on-chain)</h1>

        <div className="grid grid-cols-3 gap-3">
          {["Employee", "Employer", "Middleman"].map((r) => (
            <label
              key={r}
              className={`cursor-pointer rounded-lg border p-3 text-center ${
                role === r
                  ? "border-emerald-500 ring-2 ring-emerald-500"
                  : "border-gray-300 hover:border-emerald-300"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={(e) => setRole(e.target.value)}
                className="sr-only"
              />
              {r}
            </label>
          ))}
        </div>

        {err && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {err}
          </div>
        )}

        <button
          disabled={isLoading}
          className="w-full py-3 rounded-lg text-white font-medium bg-emerald-600 hover:bg-emerald-700"
        >
          {isLoading ? "Submitting..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
