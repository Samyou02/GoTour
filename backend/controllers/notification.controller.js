import Notification from "../models/notification.model.js";

export const listNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user?.id !== userId && req.user?.user_role !== 1) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }
    const items = await Notification.find({ userRef: userId }).sort({ createdAt: -1 });
    return res.status(200).send({ success: true, notifications: items });
  } catch (e) {
    return res.status(500).send({ success: false, message: "Failed to load notifications" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Notification.findByIdAndUpdate(id, { $set: { isRead: true } }, { new: true });
    if (!item) return res.status(404).send({ success: false, message: "Notification not found" });
    return res.status(200).send({ success: true });
  } catch (e) {
    return res.status(500).send({ success: false, message: "Failed to update notification" });
  }
};

export const listAllNotifications = async (req, res) => {
  try {
    if (req.user?.user_role !== 1) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }
    const items = await Notification.find({}).sort({ createdAt: -1 }).limit(200).populate("userRef", "username email avatar");
    return res.status(200).send({ success: true, notifications: items });
  } catch (e) {
    return res.status(500).send({ success: false, message: "Failed to load notifications" });
  }
};
