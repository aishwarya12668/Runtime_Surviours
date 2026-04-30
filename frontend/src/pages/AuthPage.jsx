import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (!form.name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (isSignup) await api.post("/signup", { ...form, role: "patient" });
      const { data } = await api.post("/login", { email: form.email, password: form.password });
      login(data.token, { ...data.user, name: form.name.trim() || data.user.name });
      nav("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Authentication failed. Please try again.");
    }
  };

  return (
    <div className="page auth-page">
      <div className="container auth-wrap">
        <div className="auth-side panel">
          <h1 className="page-title">Nivara Care</h1>
          <p className="page-subtitle">Compassionate support for every woman's health journey.</p>
          <p className="muted">Sign in to continue your care plan, screening and appointments.</p>
        </div>
        <div className="auth-card panel">
          <h2>{isSignup ? "Create Account" : "Login"}</h2>
          <form onSubmit={submit} className="list-stack">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            {error && <p className="auth-error">{error}</p>}
            <button className="btn" type="submit">{isSignup ? "Sign Up" : "Login"}</button>
          </form>
          <button className="btn secondary-btn" type="button" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Already have an account? Login" : "New user? Create account"}
          </button>
        </div>
      </div>
    </div>
  );
}
