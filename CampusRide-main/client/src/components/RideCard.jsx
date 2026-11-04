import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { dirLabel, fmt, timeAgo, vehicleIcon } from "../utils";

export default function RideCard({ ride }) {
  const Icon = vehicleIcon[ride.vehicle] || vehicleIcon.Any;
  return (
    <Link to={`/rides/${ride._id}`} className={"card ride hoverable " + ride.type}>
      <div className="vi"><Icon size={22} /></div>
      <div className="grow">
        <div className="rtop"><b className="clip">{ride.user?.name}</b><span className="chip">{dirLabel(ride.direction)}</span></div>
        <div className="muted clip">
          Route {ride.route} · {ride.vehicle}{ride.departureTime && ` · ${fmt(ride.departureTime)}`}
        </div>
      </div>
      <div className="meta">
        <span className="seats"><Users size={12} /> {ride.seats}</span>
        <small className="muted">{timeAgo(ride.createdAt)}</small>
      </div>
    </Link>
  );
}
