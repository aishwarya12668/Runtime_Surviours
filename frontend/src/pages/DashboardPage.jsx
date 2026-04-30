import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [riskLevel, setRiskLevel] = useState("-");
  const [localAppointmentCount, setLocalAppointmentCount] = useState(0);
  useEffect(() => { api.get("/dashboard").then((r) => setData(r.data)); }, []);
  useEffect(() => {
    const saved = localStorage.getItem("nivaraRiskAssessment");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setRiskLevel(parsed.level || "-");
    } catch (_error) {
      setRiskLevel("-");
    }
  }, []);
  useEffect(() => {
    try {
      const local = JSON.parse(localStorage.getItem("dummyAppointments") || "[]");
      setLocalAppointmentCount(local.length);
    } catch (_error) {
      setLocalAppointmentCount(0);
    }
  }, []);
  if (!data) return <div className="page container">Loading dashboard...</div>;

  const steps = ["Screening", "Diagnosis", "Treatment", "Recovery", "Follow-up"];

  return (
    <div className="page">
      <div className="container list-stack">
        <h1 className="page-title">Welcome back, {user?.name || "Patient"}</h1>
        <p className="page-subtitle">Your breast cancer care dashboard - everything at a glance.</p>

        <div className="stats-grid">
          <div className="panel">
            <p className="muted">Appointments</p>
            <p className="stat-value">{(data.overview.appointments || 0) + localAppointmentCount}</p>
            <p className="muted">Upcoming</p>
          </div>
          <div className="panel">
            <p className="muted">Reports</p>
            <p className="stat-value">{data.overview.reports}</p>
            <p className="muted">Uploaded</p>
          </div>
          <div className="panel">
            <p className="muted">Reminders</p>
            <p className="stat-value">{data.overview.reminders}</p>
            <p className="muted">Pending</p>
          </div>
          <div className="panel">
            <p className="muted">Risk Level</p>
            <p className="stat-value">{riskLevel !== "-" ? riskLevel : data.alerts?.[0] || "-"}</p>
          </div>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
          <div className="panel">
            <h3>Treatment Journey</h3>
            <div className="list-stack">
              <div style={{ height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.1)" }}>
                <div style={{ width: "20%", height: "100%", background: "linear-gradient(90deg,#4e82ff,#8f46ff)", borderRadius: "999px" }} />
              </div>
              <div className="stats-grid" style={{ gridTemplateColumns: "repeat(5,1fr)", gap: "0.4rem" }}>
                {steps.map((step) => (
                  <div key={step} className="panel" style={{ padding: "0.6rem 0.45rem", textAlign: "center" }}>
                    <p className="muted" style={{ margin: 0 }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="panel" style={{ display: "grid", placeItems: "center" }}>
            <h3 style={{ marginTop: 0 }}>Care Continuity Score</h3>
            <p className="stat-value" style={{ fontSize: "3rem" }}>{data.careContinuityScore ?? 0}</p>
            <p className="muted">Complete more tasks to improve.</p>
          </div>
        </div>
      </div>
      <button className="floating-help" type="button" onClick={() => navigate("/chat")}>◎</button>
    </div>
  );
}
