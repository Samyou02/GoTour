import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env", override: true });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
}

export const uploadImage = async (req, res) => {
  try {
    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).send({ success: false, message: "Cloudinary not configured" });
    }
    if (!req.file)
      return res.status(400).send({ success: false, message: "No file uploaded" });

    if (!req.file.mimetype?.startsWith("image/")) {
      return res.status(400).send({ success: false, message: "Only image files are allowed" });
    }
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(413).send({ success: false, message: "File too large (max 10MB)" });
    }

    const folder = req.body.folder || "uploads";

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder, resource_type: "image" }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      stream.end(req.file.buffer);
    });

    return res.status(201).send({ success: true, url: result.secure_url });
  } catch (error) {
    console.log(error?.message || error);
    return res.status(500).send({ success: false, message: error?.message || "Upload failed" });
  }
};