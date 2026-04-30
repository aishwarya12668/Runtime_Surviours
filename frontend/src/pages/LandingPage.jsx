import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="page">
      <div className="container">
        <motion.section className="hero card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1>Nivara - AI-Powered Integrated Breast Cancer Care</h1>
          <p>From risk screening to treatment support, all your care in one secure platform.</p>
          <Link to="/auth" className="btn">Get Started</Link>
        </motion.section>
        <section className="grid grid-3">
          {["Risk Screening", "Appointment Booking", "AI Care Assistant"].map((t) => <div key={t} className="card">{t}</div>)}
        </section>
      </div>
    </div>
  );
}
