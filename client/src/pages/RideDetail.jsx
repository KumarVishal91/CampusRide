import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MessageSquare, Phone, User as UserIcon } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import RideMap from "../components/RideMap";
import { dirLabel, fmt, vehicleIcon } from "../utils";

export default function RideDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [ride, setRide] = useState(null);
  const load = () => api.get(`/rides/${id}`).then((r) => setRide(r.data)).catch(() => nav("/"));
  useEffect(() => { load(); }, [id]);
  if (!ride) return <Layout title="Ride Detail" back nav={false}><p className="muted">Loading…</p></Layout>;

  const own = ride.user._id === user._id;
  const Icon = vehicleIcon[ride.vehicle] || vehicleIcon.Any;
  const act = async (fn, msg) => {
    try { await fn(); if (msg) alert(msg); load(); }
    catch (e) { alert(e.response?.data?.message || "Something went wrong"); }
  };

  return (
    <Layout title="Ride Detail" back nav={false}>
      <RideMap location={ride.location} height={190} />
      <div className="card">
        <h2 style={{ margin: 0 }}>{dirLabel(ride.direction)}</h2>
        <div className="row-chips">
          <span className="chip"><Icon size={12} /> {ride.vehicle}</span>
          <span className="chip">Route {ride.route}</span>
          <span className="chip">{ride.seats} seat{ride.seats > 1 ? "s" : ""}</span>
          <span className="chip">{ride.type}</span>
          {ride.status !== "active" && <span className="chip warn">{ride.status}</span>}
        </div>
        {ride.departureTime && <p className="muted">Departs {fmt(ride.departureTime)}</p>}
        {ride.note && <p>{ride.note}</p>}
      </div>

      <div className="card ride">
        <div className="vi"><UserIcon size={20} /></div>
        <div className="grow"><b>{ride.user.name}</b><div className="muted">{ride.user.phone}</div></div>
      </div>

      {!own && (
        <div className="grid2">
          <a className="btn" href={`tel:${ride.user.phone}`}><Phone size={16} /> Call {ride.type === "offer" ? "Rider" : "Passenger"}</a>
          <Link className="btn ghost" to={`/chat/${ride.user._id}`}><MessageSquare size={16} /> Chat</Link>
        </div>
      )}
      {!own && ride.type === "offer" && ride.status === "active" && (
        <button className="btn" style={{ marginTop: 10 }}
          onClick={() => act(() => api.post(`/requests/ride/${ride._id}`), "Seat requested. The rider was notified.")}>
          Request a seat
        </button>
      )}
      {own && ride.status === "active" && (
        <div className="grid2">
          <button className="btn" onClick={() => act(() => api.patch(`/rides/${ride._id}/complete`))}>Mark as booked</button>
          <button className="btn danger" onClick={() => act(() => api.delete(`/rides/${ride._id}`))}>Cancel ride</button>
        </div>
      )}
    </Layout>
  );
}
