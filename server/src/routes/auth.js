import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { sendOtp } from "../utils/mailer.js";

const router = Router();
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const makeOtp = () => String(Math.floor(10000000 + Math.random() * 90000000)); // 8 digits

router.post("/register", async (req, res) => {
  try {
    const { name, phone, gender, email, password } = req.body;
    if (!name || !phone || !gender || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
    if (!email.toLowerCase().endsWith(`@${process.env.ALLOWED_EMAIL_DOMAIN}`))
      return res.status(400).json({ message: `Only @${process.env.ALLOWED_EMAIL_DOMAIN} emails are allowed` });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user?.isVerified) return res.status(409).json({ message: "Email already registered" });

    const otp = makeOtp();
    const data = {
      name, phone, gender, email, password: await bcrypt.hash(password, 10),
      otp: await bcrypt.hash(otp, 8), otpExpires: Date.now() + 10 * 60 * 1000,
    };
    if (user) Object.assign(user, data); else user = new User(data);
    await user.save();
    await sendOtp(user.email, otp);
    res.status(201).json({ message: "OTP sent to your university email" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || !user.otp || user.otpExpires < Date.now() || !(await bcrypt.compare(otp, user.otp)))
      return res.status(400).json({ message: "Invalid or expired code" });
    user.isVerified = true; user.otp = undefined; user.otpExpires = undefined;
    await user.save();
    res.json({ token: sign(user._id), user: { id: user._id, name: user.name, role: user.role } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Wrong email or password" });
    if (!user.isVerified) return res.status(403).json({ message: "Verify your email first" });
    if (user.isBanned) return res.status(403).json({ message: "Account banned" });
    res.json({ token: sign(user._id), user: { id: user._id, name: user.name, role: user.role } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get("/me", protect, (req, res) => res.json(req.user));

export default router;
