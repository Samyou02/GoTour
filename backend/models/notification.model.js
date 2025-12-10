import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userRef: { type: mongoose.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, default: "" },
    type: { type: String, default: "info" },
    link: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
