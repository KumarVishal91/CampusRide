import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car } from "lucide-react";
import api from "../api";
import { getSocket } from "../socket";
import Layout from "../components/Layout";
import { fmt } from "../utils";

export default function Notifications() {
  const [list, setList] = useState([]);
  const nav = useNavigate();
  useEffect(() => {
    api.get("/notifications").then((r) => { setList(r.data); api.patch("/notifications/read-all"); });
    const s = getSocket();
    const on = (n) => setList((p) => [n, ...p]);
    s?.on("notification", on);
    return () => s?.off("notification", on);
  }, []);
  return (
    <Layout title="Notifications" back nav={false}>
      {list.length === 0 && <p className="muted empty">You're all caught up.</p>}
      {list.map((n) => (
        <div key={n._id} className={"card ride" + (n.read ? "" : " unread")} onClick={() => n.ride && nav(`/rides/${n.ride}`)}>
          <div className="vi"><Car size={20} /></div>
          <div className="grow"><b>{n.text}</b><div className="muted">{fmt(n.createdAt)}</div></div>
        </div>
      ))}
    </Layout>
  );
}
