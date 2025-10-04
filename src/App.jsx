import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Employer from "./pages/Employer.jsx";
import Jobs from "./pages/Jobs.jsx";
import Agreements from "./pages/Agreements.jsx";

function Layout() {
  return (
    <div className="bg-slate-800 min-h-screen">
      <Header />
      <main className="min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Açılışta login */}
        <Route index element={<Navigate to="/login" replace />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />
        <Route path="about" element={<AboutUs />} />

        {/* Yeni */}
        <Route path="employer" element={<Employer />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="agreements" element={<Agreements />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}
