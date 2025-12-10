import Booking from "../models/booking.model.js";
import Package from "../models/package.model.js";
import RatingReview from "../models/ratings_reviews.model.js";

export const getOverviewStats = async (req, res) => {
  try {
    const completedTrips = await Booking.countDocuments({ status: "Completed" });

    const destinations = await Package.distinct("packageDestination");
    const totalDestinations = destinations.length;

    const ratingsAgg = await RatingReview.aggregate([
      { $group: { _id: null, avg: { $avg: "$rating" }, total: { $sum: 1 } } },
    ]);
    const averageTravelerRating = ratingsAgg.length ? Math.round(ratingsAgg[0].avg * 10) / 10 : 0;
    const totalReviews = ratingsAgg.length ? ratingsAgg[0].total : 0;

    return res.status(200).send({
      success: true,
      completedTrips,
      totalDestinations,
      averageTravelerRating,
      totalReviews,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Failed to load stats" });
  }
};
