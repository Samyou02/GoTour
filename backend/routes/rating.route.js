import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  averageRating,
  getAllRatings,
  giveRating,
  ratingGiven,
  respondToRating,
  respondAllForPackage,
} from "../controllers/rating.controller.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

//create a rating/review
router.post("/give-rating", requireSignIn, giveRating);

//get average rating of package
router.get("/average-rating/:id", averageRating);

//check if rating given by user to a package
router.get("/rating-given/:userId/:packageId", requireSignIn, ratingGiven);

//get all ratings by package id
router.get("/get-ratings/:id/:limit", getAllRatings);

// admin respond to rating once
router.post("/respond/:ratingId", requireSignIn, isAdmin, respondToRating);

// admin respond to all ratings for a package (once per user)
router.post("/respond-all/:packageId", requireSignIn, isAdmin, respondAllForPackage);

export default router;
