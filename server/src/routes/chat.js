import { Router } from "express";
import Message from "../models/Message.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

// Conversation list: latest message per other user
router.get("/", async (req, res) => {
  const me = req.user._id;
  const msgs = await Message.find({ $or: [{ from: me }, { to: me }] })
    .sort("-createdAt").populate("from to", "name");
  const seen = new Map();
  for (const m of msgs) {
    const other = m.from._id.equals(me) ? m.to : m.from;
    if (!seen.has(String(other._id))) seen.set(String(other._id), { user: other, last: m });
  }
  res.json([...seen.values()]);
});

router.get("/:userId", async (req, res) => {
  const me = req.user._id, other = req.params.userId;
  const msgs = await Message.find({
    $or: [{ from: me, to: other }, { from: other, to: me }],
  }).sort("createdAt");
  await Message.updateMany({ from: other, to: me, read: false }, { read: true });
  res.json(msgs);
});

router.post("/:userId", async (req, res) => {
  if (!req.body.text?.trim()) return res.status(400).json({ message: "Message is empty" });
  const msg = await Message.create({ from: req.user._id, to: req.params.userId, text: req.body.text.trim() });
  req.app.get("io").to(`user:${req.params.userId}`).emit("message", msg);
  res.status(201).json(msg);
});

export default router;
