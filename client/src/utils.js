import { Bike, Car, Truck } from "lucide-react";
export const vehicleIcon = { CNG: Truck, Bike, Car, Any: Car };
export const dirLabel = (d) => (d === "TO_UNI" ? "To Campus" : "From Campus");
export const fmt = (d) =>
  new Date(d).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
export const timeAgo = (d) => {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
};
