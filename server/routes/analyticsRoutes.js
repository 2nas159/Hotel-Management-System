import express from "express";
import { protect } from "./../middleware/authMiddleWare.js";
import {
  getRevenueAnalytics,
  getBookingTrends,
  getOccupancyAnalytics,
  getRoomTypeAnalytics
} from "../controllers/analyticsController.js";

const analyticsRouter = express.Router();

// Test endpoint to check if analytics API is working
analyticsRouter.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Analytics API is working!",
    timestamp: new Date().toISOString()
  });
});

// All analytics routes require authentication
analyticsRouter.get("/revenue", protect, getRevenueAnalytics);
analyticsRouter.get("/bookings", protect, getBookingTrends);
analyticsRouter.get("/occupancy", protect, getOccupancyAnalytics);
analyticsRouter.get("/room-types", protect, getRoomTypeAnalytics);

export default analyticsRouter;
