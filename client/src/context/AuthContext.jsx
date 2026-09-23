import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import { connectSocket, getSocket } from "../socket";

const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);
    api.get("/auth/me")
      .then((r) => { setUser(r.data); connectSocket(token); })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const saveSession = async (token) => {
    localStorage.setItem("token", token);
    const { data } = await api.get("/auth/me");
    setUser(data);
    connectSocket(token);
  };
  const logout = () => {
    localStorage.removeItem("token");
    getSocket()?.disconnect();
    setUser(null);
  };

  return <AuthCtx.Provider value={{ user, setUser, loading, saveSession, logout }}>{children}</AuthCtx.Provider>;
}
