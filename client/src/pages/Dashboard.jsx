import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Car, Search, SearchX } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../socket";
import Layout from "../components/Layout";
import HeaderActions from "../components/HeaderActions";
import RideCard from "../components/RideCard";

const dirs = [["all", "All"], ["TO_UNI", "To Campus"], ["FROM_UNI", "From Campus"]];
const greet = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

function Empty({ text }) {
  return <div className="emptybox"><SearchX size={20} /><p>{text}</p></div>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [demand, setDemand] = useState({});
  const [dir, setDir] = useState("all");
  const [route, setRoute] = useState("all");

  const load = useCallback(async () => {
    const [r, d] = await Promise.all([api.get("/rides"), api.get("/rides/demand")]);
    setRides(r.data); setDemand(d.data);
  }, []);

  useEffect(() => {
    load();
    const s = getSocket();
    if (!s) return;
    s.on("ride:new", load); s.on("ride:update", load);
    return () => { s.off("ride:new", load); s.off("ride:update", load); };
  }, [load]);

  const shown = rides.filter((r) => (dir === "all" || r.direction === dir) && (route === "all" || r.route === route));
  const offers = shown.filter((r) => r.type === "offer");
  const requests = shown.filter((r) => r.type === "request");
  const totalOffers = rides.filter((r) => r.type === "offer").length;
  const totalRequests = rides.length - totalOffers;

  return (
    <Layout title="Campus Ride" right={<HeaderActions />}>
      <section className="hero">
        <div>
          <h2>{greet()}, {user.name.split(" ")[0]}</h2>
          <p>{totalOffers} ride{totalOffers === 1 ? "" : "s"} on offer and {totalRequests} {totalRequests === 1 ? "person" : "people"} looking for a lift right now.</p>
        </div>
        <div className="hero-stats">
          <div><b>{totalOffers}</b><small>Offers</small></div>
          <div><b>{totalRequests}</b><small>Requests</small></div>
          <div><b>{user.points}</b><small>Your pts</small></div>
        </div>
      </section>

      <div className="grid2">
        <Link to="/post/offer" className="tile primary hoverable"><Car size={22} /><b>Offer Ride</b><small>Share journey</small></Link>
        <Link to="/post/request" className="tile hoverable"><Search size={22} /><b>Request Ride</b><small>Need a lift</small></Link>
      </div>

      <h3>Route Demand <span className="muted">tap a route to filter</span></h3>
      <div className="grid4">
        {["R1", "R2", "R3", "R4"].map((r) => (
          <button key={r} className={`tile small ${demand[r] ? "hot" : ""} ${route === r ? "sel" : ""}`}
            onClick={() => setRoute(route === r ? "all" : r)}>
            <b>{demand[r] || 0}</b><small>{r}</small>
          </button>
        ))}
      </div>

      <div className="chips">
        {dirs.map(([v, l]) => <button key={v} className={"fchip" + (dir === v ? " on" : "")} onClick={() => setDir(v)}>{l}</button>)}
      </div>

      <h3>Available Rides <span className="count">{offers.length}</span></h3>
      {offers.length === 0 ? <Empty text="No ride offers match. Post one to get things moving." /> :
        <div className="list-grid">{offers.map((r) => <RideCard key={r._id} ride={r} />)}</div>}

      <h3>Ride Requests <span className="count">{requests.length}</span></h3>
      {requests.length === 0 ? <Empty text="No one is asking for a ride right now." /> :
        <div className="list-grid">{requests.map((r) => <RideCard key={r._id} ride={r} />)}</div>}
    </Layout>
  );
}
