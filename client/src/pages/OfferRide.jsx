import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Crosshair, MapPin, Navigation, Truck, Users } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Field, { Select } from "../components/Field";
import RideMap from "../components/RideMap";

export default function OfferRide() {
  const { type } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ direction: "TO_UNI", vehicle: "CNG", route: "R1", seats: 1, note: "", departureTime: "", femaleOnly: false });
  const [loc, setLoc] = useState(null);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const useMyLocation = () =>
    navigator.geolocation?.getCurrentPosition(
      (p) => setLoc({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setError("Could not get your location. Tap the map to drop a pin instead.")
    );

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/rides", {
        ...form, type, seats: +form.seats, location: loc || undefined,
        departureTime: form.departureTime || undefined,
      });
      nav("/");
    } catch (err) { setError(err.response?.data?.message || "Could not post ride"); }
  };

  return (
    <Layout title={type === "offer" ? "Offer a Ride" : "Request a Ride"} back nav={false}>
      <form onSubmit={submit}>
        <Select icon={Navigation} label="Direction" value={form.direction} onChange={set("direction")}>
          <option value="TO_UNI">To Campus</option><option value="FROM_UNI">From Campus</option>
        </Select>
        <Select icon={MapPin} label="Route" value={form.route} onChange={set("route")}>
          {["R1", "R2", "R3", "R4"].map((r) => <option key={r}>{r}</option>)}
        </Select>
        <Select icon={Truck} label="Vehicle" value={form.vehicle} onChange={set("vehicle")}>
          {["CNG", "Bike", "Car", "Any"].map((v) => <option key={v}>{v}</option>)}
        </Select>
        <Field icon={Users} label="Seats" type="number" min="1" max="6" value={form.seats} onChange={set("seats")} />
        <Field icon={Clock} label="Departure time" type="datetime-local" value={form.departureTime} onChange={set("departureTime")} />
        <Field label="Note" value={form.note} onChange={set("note")} placeholder="Meeting point, fare split..." />

        <span className="lbl">Pickup location (tap the map to drop a pin)</span>
        <RideMap location={loc} onPick={setLoc} height={200} />
        <button type="button" className="btn ghost" onClick={useMyLocation}><Crosshair size={16} /> Use my location</button>

        {user.gender === "female" && (
          <label className="check"><input type="checkbox" checked={form.femaleOnly}
            onChange={(e) => setForm({ ...form, femaleOnly: e.target.checked })} /> Female riders only</label>
        )}
        {error && <p className="error">{error}</p>}
        <button className="btn">Post</button>
      </form>
    </Layout>
  );
}
