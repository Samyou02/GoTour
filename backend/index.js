import express from "express";
import { connectDB } from "./db.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import packageRoute from "./routes/package.route.js";
import ratingRoute from "./routes/rating.route.js";
import bookingRoute from "./routes/booking.route.js";
import uploadRoute from "./routes/upload.route.js";
import statsRoute from "./routes/stats.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import User from "./models/user.model.js";
import bcryptjs from "bcryptjs";
const app = express();
dotenv.config({ path: "./backend/.env", override: true });

const __dirname = path.resolve();

console.log(process.env.MONGO_URL);

await connectDB();

async function ensureSingleAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "admin";
  const username = process.env.ADMIN_USERNAME || "Admin";
  const address = process.env.ADMIN_ADDRESS || "Admin";
  const phone = process.env.ADMIN_PHONE || "0000000000";

  let adminUser = await User.findOne({ email });
  const hashedPassword = bcryptjs.hashSync(password, 10);

  if (!adminUser) {
    adminUser = await User.create({
      username,
      email,
      password: hashedPassword,
      address,
      phone,
      user_role: 1,
    });
  } else {
    await User.findByIdAndUpdate(adminUser._id, {
      $set: { password: hashedPassword, user_role: 1 },
    });
  }

  await User.updateMany(
    { user_role: 1, email: { $ne: email } },
    { $set: { user_role: 0 } }
  );
}

await ensureSingleAdmin();

app.use(
  cors({
    origin: process.env.SERVER_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/package", packageRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/stats", statsRoute);

if (process.env.NODE_ENV_CUSTOM === "devolopment ") {
  //static files
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
} else {
  // //rest api
  app.use("/", (req, res) => {
    res.send("Welcome to travel and tourism app");
  });
}

//port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
