import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import RiskPage from "./pages/RiskPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ReportsPage from "./pages/ReportsPage";
import ChatPage from "./pages/ChatPage";
import TreatmentPage from "./pages/TreatmentPage";
import CommunityPage from "./pages/CommunityPage";
import FinancialAidPage from "./pages/FinancialAidPage";

const links = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Screening", path: "/screening" },
  { label: "Appointments", path: "/appointments" },
  { label: "Reports", path: "/reports" },
  { label: "Treatment", path: "/treatment" },
  { label: "Community", path: "/community" },
  { label: "Financial Aid", path: "/financial-aid" },
];

export default function App() {
  const { user, logout } = useAuth();
  const displayName = user?.name || "Patient";

  return (
    <div className="app-shell">
      {user && (
        <nav className="topbar">
          <div className="brand">Nivara</div>
          <div className="nav-links">
            {links.map((link) => (
              <NavLink key={link.path} to={link.path} className={({ isActive }) => (isActive ? "active" : "")}>
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="user-pill">
            <div className="user-meta">
              <strong>{displayName}</strong>
              <span>Patient</span>
            </div>
            <button className="avatar-btn" onClick={logout} title="Logout">
              A
            </button>
          </div>
        </nav>
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/auth" />} />
        <Route path="/risk" element={<Navigate to="/screening" />} />
        <Route path="/screening" element={user ? <RiskPage /> : <Navigate to="/auth" />} />
        <Route path="/appointments" element={user ? <AppointmentsPage /> : <Navigate to="/auth" />} />
        <Route path="/reports" element={user ? <ReportsPage /> : <Navigate to="/auth" />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/auth" />} />
        <Route path="/treatment" element={user ? <TreatmentPage /> : <Navigate to="/auth" />} />
        <Route path="/community" element={user ? <CommunityPage /> : <Navigate to="/auth" />} />
        <Route path="/aid" element={<Navigate to="/financial-aid" />} />
        <Route path="/financial-aid" element={user ? <FinancialAidPage /> : <Navigate to="/auth" />} />
      </Routes>
    </div>
  );
}
