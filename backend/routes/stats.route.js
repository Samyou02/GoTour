import express from "express";
import { getOverviewStats } from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/overview", getOverviewStats);

export default router;