import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { User } from "lucide-react";

export default function Header() {
  const { isConnected, account, disconnect } = useWeb3();
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const base =
    "px-2 py-1 text-[16px] font-medium text-slate-900 hover:text-[var(--brand)] transition-colors";
  const navLinkClass = ({ isActive }) =>
    `${base} ${isActive ? "border-b-2 border-[var(--brand)]" : ""}`;
  const short = (a) => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "");

  const goProfile = () => {
    setOpenMenu(false);
    navigate("/profile");
  };
  const onLogout = () => {
    setOpenMenu(false);
    disconnect();
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-emerald-100 sticky top-0 z-50 border-b border-slate-700">
      <nav className="w-full px-4 py-3">
        <div
          className="flex items-center justify-between"
          style={{ height: 64 }}
        >
          {/* Left: logo + brand */}
          <Link to="/" className="flex items-center gap-3 ml-2">
            <div className="w-16 h-16 overflow-hidden">
              <img
                src="/logo.png"
                alt="Freelandser"
                className="block w-full h-full object-contain"
              />
            </div>
            <span className="text-slate-900 font-semibold leading-none text-[20px]">
              Freelandser
            </span>
          </Link>

          {/* Right: nav + profile */}
          <div className="flex items-center gap-6 pr-1">
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
            {/* ADDED LINKS */}
            <NavLink to="/jobs" className={navLinkClass}>
              Jobs
            </NavLink>
            <NavLink to="/employer" className={navLinkClass}>
              Employer
            </NavLink>
            <NavLink to="/agreements" className={navLinkClass}>
              Agreements
            </NavLink>

            {!isConnected ? (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={navLinkClass}>
                  Register
                </NavLink>
              </>
            ) : (
              <div className="relative flex items-center">
                {/* Profile chip */}
                <button
                  onClick={goProfile}
                  className="group flex items-center gap-2 border border-emerald-200 shadow-sm px-3 py-1.5 rounded-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                  title={short(account)}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--brand)] text-white">
                    <User size={16} />
                  </span>
                  <span className="text-sm">{short(account)}</span>
                </button>

                {/* caret to open dropdown */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu((v) => !v);
                  }}
                  className="ml-2 px-2 py-1 rounded-md text-slate-900 hover:text-[var(--brand)]"
                  aria-label="Account menu"
                  title="Account menu"
                >
                  ▾
                </button>

                {/* Dropdown */}
                {openMenu && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
                    <button
                      onClick={goProfile}
                      className="w-full text-left px-3 py-2 text-slate-800 hover:bg-emerald-50"
                    >
                      Profile
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-emerald-50"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
