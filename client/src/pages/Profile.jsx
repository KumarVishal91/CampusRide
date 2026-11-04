import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Car, LogOut, Mail, Pencil, Phone, ShieldCheck, Star, User, Users } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Field, { Select } from "../components/Field";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: user.name, phone: user.phone, gender: user.gender });
  useEffect(() => { api.get("/auth/me").then((r) => setUser(r.data)); }, []);

  const save = async () => {
    const { data } = await api.patch("/users/me", form);
    setUser(data); setEdit(false);
  };

  return (
    <Layout title="Profile" right={<button className="icon-btn" onClick={() => setEdit(!edit)}><Pencil size={18} /></button>}>
      <div className="grid2">
        <div className="tile stat"><Star size={20} /><b>{user.points}</b><small>Total score (pts)</small></div>
        <div className="tile stat"><Car size={20} /><b>{user.ridesCompleted}</b><small>Rides completed</small></div>
      </div>
      <h3>Account Details</h3>
      <Field icon={User} label="Full Name" value={form.name} disabled={!edit} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Field icon={Phone} label="Phone Number" value={form.phone} disabled={!edit} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Select icon={Users} label="Gender" value={form.gender} disabled={!edit} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
        <option value="male">Male</option><option value="female">Female</option>
      </Select>
      <Field icon={Mail} label="Email Address" value={user.email} disabled readOnly />
      {edit && <button className="btn" onClick={save}>Save changes</button>}
      {user.role === "admin" && <Link to="/admin" className="btn ghost" style={{ marginTop: 10 }}><ShieldCheck size={16} /> Admin Panel</Link>}
      <button className="btn danger" style={{ marginTop: 10 }} onClick={logout}><LogOut size={16} /> Log out</button>
    </Layout>
  );
}
