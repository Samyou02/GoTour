import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import { listNotifications, markNotificationRead, listAllNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/user/:userId", requireSignIn, listNotifications);
router.post("/mark-read/:id", requireSignIn, markNotificationRead);
router.get("/all", requireSignIn, isAdmin, listAllNotifications);

export default router;
