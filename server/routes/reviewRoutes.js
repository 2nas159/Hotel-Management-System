import express from "express";
import upload from "../middleware/uploadMiddleWare.js";
import { protect } from "./../middleware/authMiddleWare.js";
import {
  createReview,
  getHotelReviews,
  getUserReviews,
  markReviewHelpful,
  respondToReview,
  getHotelOwnerReviews
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// Public routes
reviewRouter.get("/hotel/:hotelId", getHotelReviews);

// Protected routes
reviewRouter.post("/", upload.array("images", 5), protect, createReview);
reviewRouter.get("/user", protect, getUserReviews);
reviewRouter.post("/:reviewId/helpful", protect, markReviewHelpful);
reviewRouter.post("/:reviewId/respond", protect, respondToReview);
reviewRouter.get("/hotel-owner", protect, getHotelOwnerReviews);

export default reviewRouter;
