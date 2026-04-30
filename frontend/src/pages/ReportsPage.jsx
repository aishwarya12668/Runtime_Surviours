import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const load = async () => setReports((await api.get("/reports")).data);
  useEffect(() => { load(); }, []);
  const upload = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const formData = new FormData(); formData.append("file", f);
    await api.post("/reports/upload", formData);
    load();
  };
  return (
    <div className="page">
      <div className="container list-stack">
        <h1 className="page-title">Medical Reports</h1>
        <p className="page-subtitle">Upload and manage your medical documents securely.</p>
        <div className="panel">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <label className="btn" style={{ cursor: "pointer" }}>
              Upload Report
              <input type="file" accept=".pdf,image/*" onChange={upload} style={{ display: "none" }} />
            </label>
          </div>
          {reports.length === 0 ? (
            <div className="panel" style={{ textAlign: "center", padding: "2.4rem 1rem" }}>
              <p className="muted">No reports uploaded yet.</p>
            </div>
          ) : (
            <div className="list-stack">
              {reports.map((r) => (
                <a key={r._id} className="panel" href={r.fileUrl} target="_blank" rel="noreferrer">
                  {r.originalName}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <button className="floating-help" type="button" onClick={() => navigate("/chat")}>◎</button>
    </div>
  );
}
