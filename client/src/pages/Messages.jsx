import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { getSocket } from "../socket";
import Layout from "../components/Layout";

export default function Messages() {
  const [convos, setConvos] = useState([]);
  const load = () => api.get("/chat").then((r) => setConvos(r.data));
  useEffect(() => {
    load();
    const s = getSocket();
    s?.on("message", load);
    return () => s?.off("message", load);
  }, []);
  return (
    <Layout title="Messages" back nav={false}>
      <p className="muted">{convos.length} conversation{convos.length === 1 ? "" : "s"}</p>
      {convos.length === 0 && <p className="muted empty">Open a ride and tap Chat to start a conversation.</p>}
      {convos.map((c) => (
        <Link key={c.user._id} to={`/chat/${c.user._id}`} className="card ride">
          <div className="avatar sm">{c.user.name[0]}</div>
          <div className="grow"><b>{c.user.name}</b><div className="muted clip">{c.last.text}</div></div>
          <small className="muted">{new Date(c.last.createdAt).toLocaleDateString([], { day: "numeric", month: "short" })}</small>
        </Link>
      ))}
    </Layout>
  );
}
