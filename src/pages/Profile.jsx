import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context";
import { getUserByWallet, updateUser } from "../utils/storage";

function Section({ title, items, onAdd }) {
  const [text, setText] = useState("");
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add item..."
            className="px-3 py-1.5 border rounded-md text-sm"
          />
          <button
            onClick={() => {
              if (!text.trim()) return;
              onAdd(text.trim());
              setText("");
            }}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
          >
            Add
          </button>
        </div>
      </div>
      {!items || items.length === 0 ? (
        <p className="text-sm text-gray-500">No items yet.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-1">
          {items.map((it, idx) => (
            <li key={idx} className="text-sm text-gray-800">
              {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Profile() {
  const { isConnected, account, disconnect } = useWeb3();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      navigate("/login", { replace: true });
      return;
    }
    const u = getUserByWallet(account);
    if (!u) {
      navigate("/register", { replace: true });
      return;
    }
    setUser(u);
  }, [isConnected, account, navigate]);

  const format = (a) => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "");

  const onLogout = () => {
    disconnect();
    navigate("/login", { replace: true });
  };

  // Foto yükleme → base64 olarak sakla
  const onPhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result; // base64
      const updated = updateUser(account, { photoUrl: dataUrl });
      setUser(updated);
    };
    reader.readAsDataURL(file);
  };

  // Listeye item ekleme helper
  const pushItem = (key, value) => {
    const arr = Array.isArray(user[key]) ? [...user[key]] : [];
    arr.push(value);
    const updated = updateUser(account, { [key]: arr });
    setUser(updated);
  };

  if (!user) return null;

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Foto */}
            <label className="relative">
              <img
                src={
                  user.photoUrl ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(user.username || "User") +
                    "&background=10B981&color=ffffff"
                }
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border border-emerald-200"
              />
              <input
                type="file"
                accept="image/*"
                onChange={onPhotoChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Upload photo"
              />
            </label>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.username}
              </h1>
              <p className="text-gray-600">
                Role: <span className="font-medium">{user.role || "-"}</span>
                {" · "}Wallet: {format(user.walletAddress)}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Log out
          </button>
        </div>

        {/* Role-based sections */}
        <div className="grid grid-cols-1 gap-6">
          {user.role === "Employee" && (
            <>
              <Section
                title="Completed Jobs"
                items={user.completedJobs}
                onAdd={(v) => pushItem("completedJobs", v)}
              />
              <Section
                title="Applied Jobs"
                items={user.appliedJobs}
                onAdd={(v) => pushItem("appliedJobs", v)}
              />
            </>
          )}

          {user.role === "Employer" && (
            <Section
              title="Posted Jobs"
              items={user.postedJobs}
              onAdd={(v) => pushItem("postedJobs", v)}
            />
          )}

          {user.role === "Middleman" && (
            <Section
              title="Past Mediations"
              items={user.pastMediations}
              onAdd={(v) => pushItem("pastMediations", v)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
