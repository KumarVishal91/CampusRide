import { Router } from "express";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Ride from "../models/Ride.js";
import { protect, adminOnly } from "../middleware/auth.js";

export const notifications = Router();
notifications.use(protect);
notifications.get("/", async (req, res) =>
  res.json(await Notification.find({ user: req.user._id }).sort("-createdAt").limit(50)));
notifications.patch("/read-all", async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ message: "ok" });
});

export const leaderboard = Router();
leaderboard.get("/", protect, async (_req, res) =>
  res.json(await User.find({ isVerified: true }).select("name points ridesCompleted")
    .sort("-points").limit(20)));

export const users = Router();
users.use(protect);
users.patch("/me", async (req, res) => {
  const update = {};
  ["name", "phone", "gender"].forEach((k) => req.body[k] && (update[k] = req.body[k]));
  try {
    const u = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true }).select("-password -otp");
    res.json(u);
  } catch (e) { res.status(400).json({ message: e.message }); }
});
users.get("/:id", async (req, res) => {
  try {
    const u = await User.findById(req.params.id).select("name phone gender");
    u ? res.json(u) : res.status(404).json({ message: "User not found" });
  } catch { res.status(404).json({ message: "User not found" }); }
});

export const admin = Router();
admin.use(protect, adminOnly);
const startOfDay = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
admin.get("/stats", async (_req, res) => res.json({
  totalUsers: await User.countDocuments(),
  bannedUsers: await User.countDocuments({ isBanned: true }),
  activeRides: await Ride.countDocuments({ status: "active", type: "offer" }),
  activeRequests: await Ride.countDocuments({ status: "active", type: "request" }),
  ridesToday: await Ride.countDocuments({ type: "offer", createdAt: { $gte: startOfDay() } }),
  requestsToday: await Ride.countDocuments({ type: "request", createdAt: { $gte: startOfDay() } }),
}));
admin.get("/users", async (_req, res) => res.json(await User.find().select("-password -otp").sort("-createdAt")));
admin.patch("/users/:id/ban", async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u || u.role === "admin") return res.status(400).json({ message: "Cannot ban this user" });
  u.isBanned = !!req.body.ban; await u.save();
  res.json(u);
});
admin.get("/rides", async (_req, res) =>
  res.json(await Ride.find().populate("user", "name").sort("-createdAt").limit(100)));
admin.delete("/rides/:id", async (req, res) => {
  await Ride.findByIdAndUpdate(req.params.id, { status: "cancelled" });
  req.app.get("io").emit("ride:update", req.params.id);
  res.json({ message: "Ride removed" });
});
