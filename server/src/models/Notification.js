import mongoose from "mongoose";
const s = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride" },
  read: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model("Notification", s);
