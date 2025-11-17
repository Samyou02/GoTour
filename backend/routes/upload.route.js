import express from "express";
import multer from "multer";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/image", requireSignIn, upload.single("file"), uploadImage);

router.use((err, req, res, next) => {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).send({ success: false, message: "File too large (max 10MB)" });
  }
  if (err) {
    return res.status(500).send({ success: false, message: "Upload error" });
  }
  next();
});

export default router;