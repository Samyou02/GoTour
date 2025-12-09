import express from "express";
import { getSettings, upsertSettings } from "../controllers/settings.controller.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", requireSignIn, isAdmin, upsertSettings);

export default router;
