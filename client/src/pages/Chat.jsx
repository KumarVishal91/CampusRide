import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Send } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../socket";
import Layout from "../components/Layout";

export default function Chat() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [other, setOther] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const end = useRef();

  useEffect(() => {
    api.get(`/users/${userId}`).then((r) => setOther(r.data));
    api.get(`/chat/${userId}`).then((r) => setMsgs(r.data));
    const s = getSocket();
    const on = (m) => m.from === userId && setMsgs((p) => [...p, m]);
    s?.on("message", on);
    return () => s?.off("message", on);
  }, [userId]);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const { data } = await api.post(`/chat/${userId}`, { text });
    setMsgs((p) => [...p, data]); setText("");
  };

  return (
    <Layout title={other?.name || "Chat"} back nav={false}>
      <div className="msgs">
        {msgs.map((m) => (
          <div key={m._id} className={"bubble " + (m.from === user._id ? "mine" : "theirs")}>
            {m.text}<small>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
          </div>
        ))}
        <div ref={end} />
      </div>
      <form className="composer" onSubmit={send}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
        <button className="send"><Send size={18} /></button>
      </form>
    </Layout>
  );
}
