import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Eye, EyeOff, Lock, Mail } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Field from "../components/Field";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const { saveSession } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      await saveSession(data.token);
      nav("/");
    } catch (err) { setError(err.response?.data?.message || "Login failed"); }
  };

  return (
    <div className="auth">
      <div className="logo"><Car size={28} /></div>
      <h2 className="brand">CampusRide</h2>
      <h1>Welcome back</h1>
      <p className="muted">Sign in to book your next ride across campus.</p>
      <form onSubmit={submit} className="card panel">
        <Field icon={Mail} label="University Email" type="email" placeholder="you@university.edu" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Field icon={Lock} label="Password" type={show ? "text" : "password"} value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} required
          right={<button type="button" className="eye" onClick={() => setShow(!show)}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>} />
        {error && <p className="error">{error}</p>}
        <button className="btn">Login</button>
      </form>
      <p className="muted">Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}
