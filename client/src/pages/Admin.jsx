import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Ban, Car, CalendarDays, ClipboardList, Users } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { dirLabel } from "../utils";

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const load = () => {
    api.get("/admin/stats").then((r) => setStats(r.data));
    api.get("/admin/users").then((r) => setUsers(r.data));
    api.get("/admin/rides").then((r) => setRides(r.data));
  };
  useEffect(() => { user.role === "admin" && load(); }, []);
  if (user.role !== "admin") return <Navigate to="/" replace />;

  const cards = [
    [Users, stats.totalUsers, "Total Users"], [Ban, stats.bannedUsers, "Banned Users"],
    [Car, stats.activeRides, "Active Rides"], [ClipboardList, stats.activeRequests, "Active Requests"],
    [CalendarDays, stats.ridesToday, "Rides Today"], [CalendarDays, stats.requestsToday, "Requests Today"],
  ];
  const list = rides.filter((r) => r.status === "active" && r.type === (tab === "requests" ? "request" : "offer"));

  return (
    <Layout title="Admin Panel" back>
      <div className="tabs">
        {["stats", "users", "rides", "requests"].map((t) => (
          <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === "stats" && (
        <div className="grid2">
          {cards.map(([Icon, n, label]) => (
            <div key={label} className="tile stat"><Icon size={20} /><b>{n ?? 0}</b><small>{label}</small></div>
          ))}
        </div>
      )}

      {tab === "users" && users.map((u) => (
        <div key={u._id} className="card ride">
          <div className="grow"><b>{u.name}</b> {u.role === "admin" && <span className="chip">admin</span>}
            {u.isBanned && <span className="chip warn">banned</span>}<div className="muted">{u.email}</div></div>
          {u.role !== "admin" && (
            <button className="btn sm ghost" onClick={async () => { await api.patch(`/admin/users/${u._id}/ban`, { ban: !u.isBanned }); load(); }}>
              {u.isBanned ? "Unban" : "Ban"}
            </button>
          )}
        </div>
      ))}

      {(tab === "rides" || tab === "requests") && list.map((r) => (
        <div key={r._id} className="card ride">
          <div className="grow"><b>{r.user?.name}</b><div className="muted">{dirLabel(r.direction)} · {r.route} · {r.vehicle}</div></div>
          <button className="btn sm danger" onClick={async () => { await api.delete(`/admin/rides/${r._id}`); load(); }}>Remove</button>
        </div>
      ))}
    </Layout>
  );
}
