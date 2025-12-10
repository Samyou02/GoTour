import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const listConversation = async (req, res) => {
  try {
    const { userId, peerId } = req.params;
    if (req.user?.id !== userId && req.user?.id !== peerId && req.user?.user_role !== 1) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }
    const items = await Message.find({
      $or: [
        { from: userId, to: peerId },
        { from: peerId, to: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("from", "username avatar")
      .populate("to", "username avatar");
    return res.status(200).send({ success: true, messages: items });
  } catch (e) {
    return res.status(500).send({ success: false, message: "Failed to load messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { from, to, text } = req.body;
    if (req.user?.id !== from && req.user?.user_role !== 1) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }
    if (!from || !to || !text) return res.status(400).send({ success: false, message: "Missing fields" });
    const msg = await Message.create({ from, to, text });
    try {
      const Notification = (await import("../models/notification.model.js")).default;
      await Notification.create({
        userRef: to,
        title: `New message from ${req.user?.user_role === 1 ? "Admin" : "User"}`,
        body: text.slice(0, 180),
        type: "message",
        link: `/profile/${req.user?.user_role === 1 ? "admin" : "user"}`,
      });
    } catch (e) {
      console.log("notify-message-error", e?.message || e);
    }
    return res.status(201).send({ success: true, message: msg });
  } catch (e) {
    return res.status(500).send({ success: false, message: "Failed to send message" });
  }
};

export const listAdminRecent = async (req, res) => {
  try {
    const adminId = req.user.id;
    const adminObjId = new mongoose.Types.ObjectId(adminId);
    const items = await Message.aggregate([
      { $match: { to: adminObjId } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$from", lastText: { $first: "$text" }, lastAt: { $first: "$createdAt" } } },
      { $sort: { lastAt: -1 } },
    ]);
    const populated = await User.populate(items, { path: "_id", select: "username email avatar" });
    return res.status(200).send({ success: true, recent: populated });
  } catch (e) {
    return res.status(500).send({ success: false, message: "Failed to load" });
  }
};

export const broadcastMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).send({ success: false, message: "Text required" });
    const users = await User.find({ user_role: 0 }).select("_id");
    const adminId = req.user.id;
    const Notification = (await import("../models/notification.model.js")).default;
    await Promise.all(
      users.map(async (u) => {
        await Message.create({ from: adminId, to: u._id, text });
        await Notification.create({ userRef: u._id, title: "Admin announcement", body: text.slice(0, 180), type: "broadcast", link: "/profile/user" });
      })
    );
    return res.status(201).send({ success: true, count: users.length });
  } catch (e) {
    return res.status(500).send({ success: false, message: "Broadcast failed" });
  }
};
