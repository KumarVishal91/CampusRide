import { Router } from "express";
import Ride from "../models/Ride.js";
import RideRequest from "../models/RideRequest.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { notify } from "../utils/notify.js";

const router = Router();
router.use(protect);

// Passenger asks for a seat on an offer
router.post("/ride/:rideId", async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride || ride.status !== "active" || ride.type !== "offer")
      return res.status(400).json({ message: "Ride is not available" });
    if (ride.user.equals(req.user._id)) return res.status(400).json({ message: "This is your own ride" });
    const r = await RideRequest.create({ ride: ride._id, passenger: req.user._id });
    await notify(req.app.get("io"), ride.user, `${req.user.name} requested a seat on your ride`, ride._id);
    res.status(201).json(r);
  } catch (e) {
    res.status(e.code === 11000 ? 409 : 500).json({ message: e.code === 11000 ? "Already requested" : e.message });
  }
});

// Requests coming in to my rides
router.get("/incoming", async (req, res) => {
  const myRides = await Ride.find({ user: req.user._id }).select("_id");
  const list = await RideRequest.find({ ride: { $in: myRides.map((r) => r._id) } })
    .populate("passenger", "name phone").populate("ride", "direction route").sort("-createdAt");
  res.json(list);
});

// Rider accepts/rejects. Accepting completes the ride and awards points.
router.patch("/:id", async (req, res) => {
  const { status } = req.body; // "accepted" | "rejected"
  if (!["accepted", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });
  const rr = await RideRequest.findById(req.params.id).populate("ride");
  if (!rr || !rr.ride.user.equals(req.user._id)) return res.status(404).json({ message: "Request not found" });
  rr.status = status; await rr.save();
  const io = req.app.get("io");
  await notify(io, rr.passenger, `Your seat request was ${status}`, rr.ride._id);
  if (status === "accepted") {
    rr.ride.status = "completed"; await rr.ride.save();
    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 10, ridesCompleted: 1 } });
    io.emit("ride:update", rr.ride._id);
  }
  res.json(rr);
});

export default router;
