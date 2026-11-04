import { Router } from "express";
import Ride from "../models/Ride.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { notify } from "../utils/notify.js";

const router = Router();
router.use(protect);

// List active rides. Filters: ?type=offer&direction=TO_UNI&route=R1
router.get("/", async (req, res) => {
  const q = { status: "active" };
  ["type", "direction", "route"].forEach((k) => req.query[k] && (q[k] = req.query[k]));
  if (req.user.gender !== "female") q.femaleOnly = { $ne: true };
  const rides = await Ride.find(q).populate("user", "name phone gender").sort("-createdAt");
  res.json(rides);
});

// Count of active requests per route (the "Route Demand" tiles)
router.get("/demand", async (_req, res) => {
  const data = await Ride.aggregate([
    { $match: { status: "active", type: "request" } },
    { $group: { _id: "$route", count: { $sum: 1 } } },
  ]);
  res.json(Object.fromEntries(data.map((d) => [d._id, d.count])));
});

router.get("/mine", async (req, res) =>
  res.json(await Ride.find({ user: req.user._id }).sort("-createdAt")));

router.get("/:id", async (req, res) => {
  const ride = await Ride.findById(req.params.id).populate("user", "name phone gender");
  ride ? res.json(ride) : res.status(404).json({ message: "Ride not found" });
});

router.post("/", async (req, res) => {
  try {
    const ride = await Ride.create({ ...req.body, user: req.user._id });
    const io = req.app.get("io");
    io.emit("ride:new", ride._id); // dashboards refetch
    const label = ride.type === "offer" ? "posted a ride" : "requested a ride";
    const others = await User.find({ _id: { $ne: req.user._id }, isVerified: true, isBanned: false }).select("_id");
    await Promise.all(others.map((u) => notify(io, u._id, `${req.user.name} ${label} (${ride.direction})`, ride._id)));
    res.status(201).json(ride);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// Owner marks ride completed (manual "Booked" flow) -> awards points
router.patch("/:id/complete", async (req, res) => {
  const ride = await Ride.findOne({ _id: req.params.id, user: req.user._id });
  if (!ride) return res.status(404).json({ message: "Ride not found" });
  if (ride.status !== "active") return res.status(400).json({ message: "Ride is not active" });
  ride.status = "completed"; await ride.save();
  await User.findByIdAndUpdate(req.user._id, { $inc: { points: 10, ridesCompleted: 1 } });
  req.app.get("io").emit("ride:update", ride._id);
  res.json(ride);
});

router.delete("/:id", async (req, res) => {
  const ride = await Ride.findOne({ _id: req.params.id, user: req.user._id });
  if (!ride) return res.status(404).json({ message: "Ride not found" });
  ride.status = "cancelled"; await ride.save();
  req.app.get("io").emit("ride:update", ride._id);
  res.json({ message: "Ride cancelled" });
});

export default router;
