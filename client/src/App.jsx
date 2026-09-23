import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OfferRide from "./pages/OfferRide";
import RideDetail from "./pages/RideDetail";
import MyRides from "./pages/MyRides";
import Leaderboard from "./pages/Leaderboard";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

function Private({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading…</p>;
  return user ? children : <Navigate to="/login" replace />;
}
const P = (el) => <Private>{el}</Private>;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={P(<Dashboard />)} />
      <Route path="/post/:type" element={P(<OfferRide />)} />
      <Route path="/rides" element={P(<MyRides />)} />
      <Route path="/rides/:id" element={P(<RideDetail />)} />
      <Route path="/leaderboard" element={P(<Leaderboard />)} />
      <Route path="/messages" element={P(<Messages />)} />
      <Route path="/chat/:userId" element={P(<Chat />)} />
      <Route path="/notifications" element={P(<Notifications />)} />
      <Route path="/profile" element={P(<Profile />)} />
      <Route path="/admin" element={P(<Admin />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
