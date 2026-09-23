import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import rideRoutes from "./routes/rides.js";
import requestRoutes from "./routes/requests.js";
import chatRoutes from "./routes/chat.js";
import { notifications, leaderboard, admin, users } from "./routes/misc.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } });
app.set("io", io);

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notifications);
app.use("/api/leaderboard", leaderboard);
app.use("/api/admin", admin);
app.use("/api/users", users);

// Socket auth: each user joins a private room "user:<id>"
io.use((socket, next) => {
  try {
    const { id } = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
    socket.userId = id;
    next();
  } catch { next(new Error("unauthorized")); }
});
io.on("connection", (socket) => socket.join(`user:${socket.userId}`));

const PORT = process.env.PORT || 5000;
connectDB().then(() => server.listen(PORT, () => console.log(`API on :${PORT}`)));
