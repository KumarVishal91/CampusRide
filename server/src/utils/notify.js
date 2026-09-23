import Notification from "../models/Notification.js";
// Saves a notification and pushes it live to the user's socket room
export async function notify(io, userId, text, rideId) {
  const n = await Notification.create({ user: userId, text, ride: rideId });
  io.to(`user:${userId}`).emit("notification", n);
  return n;
}
