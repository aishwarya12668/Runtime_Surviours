import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function TreatmentPage() {
  const navigate = useNavigate();
  const [med, setMed] = useState("");
  const [checklist, setChecklist] = useState({ meds: false, hydration: false, exercise: false });
  const [date, setDate] = useState("");
  const saveReminder = async () => { await api.post("/reminders", { type: "Medication", date }); alert("Reminder saved"); };
  const completed = Object.values(checklist).filter(Boolean).length;
  const total = Object.values(checklist).length;

  return (
    <div className="page">
      <div className="container list-stack">
        <h1 className="page-title">Treatment Companion</h1>
        <p className="page-subtitle">Track your medications, appointments, and daily health tasks.</p>
        <div className="stats-grid">
          <div className="panel"><p className="stat-value">{total}</p><p className="muted">Total Tasks</p></div>
          <div className="panel"><p className="stat-value">{completed}</p><p className="muted">Completed</p></div>
          <div className="panel"><p className="stat-value">{total - completed}</p><p className="muted">Pending</p></div>
          <div className="panel"><p className="stat-value">{Math.round((completed / total) * 100)}%</p><p className="muted">Completion</p></div>
        </div>
        <div className="panel list-stack">
          <h3 style={{ margin: 0 }}>Pending Tasks ({total - completed})</h3>
          <input placeholder="Medication tracker notes" value={med} onChange={(e) => setMed(e.target.value)} />
          <label><input style={{ width: "auto" }} type="checkbox" onChange={(e) => setChecklist({ ...checklist, meds: e.target.checked })} /> Medicine taken</label>
          <label><input style={{ width: "auto" }} type="checkbox" onChange={(e) => setChecklist({ ...checklist, hydration: e.target.checked })} /> Hydration done</label>
          <label><input style={{ width: "auto" }} type="checkbox" onChange={(e) => setChecklist({ ...checklist, exercise: e.target.checked })} /> Light exercise done</label>
          <input type="datetime-local" onChange={(e) => setDate(e.target.value)} />
          <button className="btn" onClick={saveReminder} type="button">Add Reminder</button>
        </div>
      </div>
      <button className="floating-help" type="button" onClick={() => navigate("/chat")}>◎</button>
    </div>
  );
}
