import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FinancialAidPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const ngos = [
    {
      name: "Indian Cancer Society",
      eligibility: "Patients with annual household income below Rs 5 lakhs.",
      support: "Up to Rs 5,00,000",
      type: "NGO",
      url: "https://indiancancersociety.org/",
    },
    {
      name: "Ayushman Bharat - PMJAY",
      eligibility: "Families listed in SECC database. No enrollment fee required.",
      support: "Up to Rs 5,00,000/year",
      type: "Government",
      url: "https://pmjay.gov.in/",
    },
    {
      name: "Cancer Patients Aid Association",
      eligibility: "Financial help for underprivileged cancer patients.",
      support: "Treatment grants and medicine aid",
      type: "Trust",
      url: "https://cancer.org.in/",
    },
    {
      name: "CanSupport",
      eligibility: "Home-based palliative care and support programs.",
      support: "Medical and emotional support services",
      type: "NGO",
      url: "https://www.cansupport.org/",
    },
  ];

  const filteredNgos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ngos;
    return ngos.filter((n) =>
      `${n.name} ${n.type} ${n.eligibility}`.toLowerCase().includes(q)
    );
  }, [ngos, search]);

  return (
    <div className="page">
      <div className="container list-stack">
        <h1 className="page-title">Financial Aid & Support</h1>
        <p className="page-subtitle">Find organizations that can help with treatment costs.</p>
        <input placeholder="Search organizations..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="panel" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h3 style={{ margin: 0 }}>Support a Patient</h3>
            <p className="muted">Your contribution can make a real difference in someone's cancer care journey.</p>
          </div>
          <a className="btn" href="https://www.giveindia.org/" target="_blank" rel="noreferrer">Donate Now</a>
        </div>
        <div className="stats-grid">
          {filteredNgos.map((n) => (
            <div key={n.name} className="panel">
              <h3 style={{ marginTop: 0 }}>{n.name}</h3>
              <p className="muted">{n.type}</p>
              <p>{n.eligibility}</p>
              <strong>{n.support}</strong>
              <div style={{ marginTop: "0.9rem" }}>
                <a className="btn" href={n.url} target="_blank" rel="noreferrer">Visit & Donate</a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="floating-help" type="button" onClick={() => navigate("/chat")}>◎</button>
    </div>
  );
}
