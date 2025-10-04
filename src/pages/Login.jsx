import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context";
import { getUserByWallet } from "../utils/storage";

export default function Login() {
  const { isConnected, account, connectWallet } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      const user = getUserByWallet(account);
      if (user) navigate("/profile", { replace: true });
    }
  }, [isConnected, account, navigate]);

  const onLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await connectWallet();
      if (!res || res.success === false) {
        setError(res?.error || "Connection cancelled");
        return;
      }
      const user = getUserByWallet(res.account);
      if (!user) {
        setError("User not found. Please sign up first.");
        return;
      }
      navigate("/profile", { replace: true });
    } catch {
      setError("Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const format = (a) => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "");

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 mx-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🦊 Sign In</h1>
          <p className="text-gray-600">Continue with MetaMask</p>
        </div>

        <div
          className="mb-6 p-4 rounded-lg border"
          style={{
            backgroundColor: isConnected ? "#dcfce7" : "#fef3c7",
            borderColor: isConnected ? "#16a34a" : "#f59e0b",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">
                {isConnected
                  ? "🟢 Wallet Connected"
                  : "🟡 Wallet Not Connected"}
              </p>
              {isConnected && account && (
                <p className="text-sm text-gray-600 mt-1">{format(account)}</p>
              )}
            </div>

            {!isConnected && (
              <button
                onClick={onLogin}
                disabled={isLoading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Connecting..." : "🦊 Sign in with MetaMask"}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
