import mongoose from "mongoose";
const rideSchema = new mongoose.Schema({
  type: { type: String, enum: ["offer", "request"], required: true }, // offer = has seats, request = needs a lift
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  direction: { type: String, enum: ["TO_UNI", "FROM_UNI"], required: true },
  vehicle: { type: String, enum: ["CNG", "Bike", "Car", "Any"], default: "Any" },
  route: { type: String, enum: ["R1", "R2", "R3", "R4"], required: true },
  seats: { type: Number, default: 1 },
  note: String,
  departureTime: Date,
  location: { lat: Number, lng: Number },
  femaleOnly: { type: Boolean, default: false },
  status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
}, { timestamps: true });
export default mongoose.model("Ride", rideSchema);
