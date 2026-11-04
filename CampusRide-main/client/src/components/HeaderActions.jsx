import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, MessageSquare } from "lucide-react";
import api from "../api";
import { getSocket } from "../socket";

export default function HeaderActions() {
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    api.get("/notifications").then((r) => setUnread(r.data.filter((n) => !n.read).length)).catch(() => {});
    const s = getSocket();
    if (!s) return;
    const on = () => setUnread((n) => n + 1);
    s.on("notification", on);
    return () => s.off("notification", on);
  }, []);
  return (
    <>
      <Link to="/messages" className="icon-btn" title="Messages"><MessageSquare size={20} /></Link>
      <Link to="/notifications" className="icon-btn" title="Notifications"><Bell size={20} />{unread > 0 && <i className="badge">{unread}</i>}</Link>
    </>
  );
}
