import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import api from "../api";
import { getSocket } from "../socket";
import Layout from "../components/Layout";
import RideCard from "../components/RideCard";

export default function MyRides() {
  const [mine, setMine] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const load = async () => {
    const [a, b] = await Promise.all([api.get("/rides/mine"), api.get("/requests/incoming")]);
    setMine(a.data); setIncoming(b.data);
  };
  useEffect(() => {
    load();
    const s = getSocket();
    s?.on("notification", load);
    return () => s?.off("notification", load);
  }, []);

  const respond = async (id, status) => { await api.patch(`/requests/${id}`, { status }); load(); };
  const pending = incoming.filter((r) => r.status === "pending");

  return (
    <Layout title="My Rides">
      <h3>Seat requests for you</h3>
      {pending.length === 0 && <p className="muted empty">No pending requests.</p>}
      {pending.map((r) => (
        <div key={r._id} className="card ride">
          <div className="grow">
            <b>{r.passenger.name}</b>
            <div className="muted">{r.passenger.phone} · Route {r.ride.route}</div>
          </div>
          <button className="icon-btn ok" onClick={() => respond(r._id, "accepted")}><Check size={18} /></button>
          <button className="icon-btn no" onClick={() => respond(r._id, "rejected")}><X size={18} /></button>
        </div>
      ))}

      <h3>Rides you posted</h3>
      {mine.length === 0 && <p className="muted empty">Nothing yet. <Link to="/post/offer">Offer a ride</Link></p>}
      {mine.map((r) => (
        <div key={r._id}>
          <RideCard ride={{ ...r, user: { name: `${r.type === "offer" ? "Offer" : "Request"} · ${r.status}` } }} />
        </div>
      ))}
    </Layout>
  );
}
