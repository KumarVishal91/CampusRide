import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, Car, History, Home, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const tabs = [["/", Home, "Home"], ["/rides", History, "Rides"], ["/leaderboard", BarChart3, "Ranking"], ["/profile", UserIcon, "Profile"]];

export default function Layout({ title, back, right, nav = true, children }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <div className={"app" + (nav ? "" : " nonav")}>
      <header className="top">
        {back && <button className="icon-btn" title="Back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>}
        <h1>{title}</h1><div className="grow" />{right}
      </header>
      <main>{children}</main>
      {nav && (
        <nav className="bottom">
          <div className="side-only brand-side"><span className="logo-sm"><Car size={18} /></span><b>CampusRide</b></div>
          {tabs.map(([to, Icon, label]) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => "tab" + (isActive ? " on" : "")}>
              <Icon size={20} /><span>{label}</span>
            </NavLink>
          ))}
          {user && (
            <Link to="/profile" className="side-only side-user">
              <span className="avatar sm">{user.name[0]}</span>
              <span className="grow"><b className="clip">{user.name}</b><small>{user.points} pts</small></span>
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
