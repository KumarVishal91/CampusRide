import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  points: { type: Number, default: 0 },
  ridesCompleted: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.model("User", userSchema);
