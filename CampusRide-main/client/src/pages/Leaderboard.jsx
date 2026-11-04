import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

export default function Leaderboard() {
  const [list, setList] = useState([]);
  const { user } = useAuth();
  useEffect(() => { api.get("/leaderboard").then((r) => setList(r.data)); }, []);

  const order = [[list[1], 2, 70], [list[0], 1, 100], [list[2], 3, 52]];
  return (
    <Layout title="Leaderboard">
      <div className="podium">
        {order.map(([u, rank, h]) => (
          <div key={rank} className={`pod r${rank}`}>
            {u && (<>
              {rank === 1 && <Crown size={18} className="crown" />}
              <div className="avatar">{u.name[0]}<i>{rank}</i></div>
              <b className="pname">{u.name}</b>
              <small>{u.points} pts</small>
            </>)}
            <div className="bar" style={{ height: h }} />
          </div>
        ))}
      </div>
      <h3>Other Contributors</h3>
      {list.slice(3).map((u, i) => (
        <div key={u._id} className={"card ride" + (u._id === user._id ? " me" : "")}>
          <span className="rank">{i + 4}</span>
          <div className="avatar sm">{u.name[0]}</div>
          <b className="grow">{u.name}</b><span className="pts">{u.points} pts</span>
        </div>
      ))}
      {list.length === 0 && <p className="muted empty">No points yet. Complete a ride to get on the board.</p>}
    </Layout>
  );
}
