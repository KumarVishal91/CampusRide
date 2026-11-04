import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Phone, User, Users } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Field, { Select } from "../components/Field";

export default function Register() {
  const [form, setForm] = useState({ name: "", phone: "", gender: "male", email: "", password: "" });
  const [step, setStep] = useState("form");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { saveSession } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const register = async (e) => {
    e.preventDefault();
    try { await api.post("/auth/register", form); setError(""); setStep("otp"); }
    catch (err) { setError(err.response?.data?.message || "Registration failed"); }
  };
  const verify = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/verify-otp", { email: form.email, otp: otp.trim() });
      await saveSession(data.token);
      nav("/");
    } catch (err) { setError(err.response?.data?.message || "Verification failed"); }
  };

  if (step === "otp")
    return (
      <div className="auth">
        <h1>Check your email</h1>
        <p className="muted">Enter the code we sent to {form.email}.</p>
        <form onSubmit={verify} className="card panel">
          <Field icon={Lock} label="Verification code" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="8-digit code" required />
          {error && <p className="error">{error}</p>}
          <button className="btn">Verify email</button>
        </form>
      </div>
    );

  return (
    <div className="auth">
      <h1>Create account</h1>
      <form onSubmit={register} className="card panel">
        <Field icon={User} label="Full Name" value={form.name} onChange={set("name")} required />
        <Field icon={Phone} label="Phone Number" value={form.phone} onChange={set("phone")} placeholder="017XXXXXXXX" required />
        <Select icon={Users} label="Gender" value={form.gender} onChange={set("gender")}>
          <option value="male">Male</option><option value="female">Female</option>
        </Select>
        <Field icon={Mail} label="University Email" type="email" value={form.email} onChange={set("email")} placeholder="you@university.edu" required />
        <Field icon={Lock} label="Password" type="password" value={form.password} onChange={set("password")} required />
        {error && <p className="error">{error}</p>}
        <button className="btn">Register</button>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
