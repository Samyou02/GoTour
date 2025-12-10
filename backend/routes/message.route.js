import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import { listConversation, sendMessage, listAdminRecent, broadcastMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/conversation/:userId/:peerId", requireSignIn, listConversation);
router.post("/send", requireSignIn, sendMessage);
router.get("/admin-recent", requireSignIn, isAdmin, listAdminRecent);
router.post("/broadcast", requireSignIn, isAdmin, broadcastMessage);

export default router;
