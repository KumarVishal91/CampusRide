import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const base = "https://unpkg.com/leaflet@1.9.4/dist/images/";
L.Icon.Default.mergeOptions({
  iconUrl: base + "marker-icon.png", iconRetinaUrl: base + "marker-icon-2x.png", shadowUrl: base + "marker-shadow.png",
});
export const DEFAULT_CENTER = { lat: 24.8949, lng: 91.8687 }; // Sylhet - change to your campus

function Recenter({ c }) {
  const map = useMap();
  useEffect(() => { map.setView([c.lat, c.lng]); }, [c.lat, c.lng]);
  return null;
}
function Picker({ onPick }) {
  useMapEvents({ click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }) });
  return null;
}

export default function RideMap({ location, onPick, height = 180 }) {
  const c = location?.lat ? location : DEFAULT_CENTER;
  return (
    <MapContainer center={[c.lat, c.lng]} zoom={15} style={{ height, borderRadius: 14 }}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap &copy; CARTO" />
      <Recenter c={c} />
      {location?.lat && <Marker position={[location.lat, location.lng]} />}
      {onPick && <Picker onPick={onPick} />}
    </MapContainer>
  );
}
