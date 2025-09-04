import express from "express";
import {
  checkAvailabilityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings,
  stripePayment,
  updateBookingStatus,
  cancelBooking,
  cancelUnpaidBookings,
  fixPaidBookingStatus,
  fixAllPaidBookings,
} from "../controllers/bookingController.js";
import { protect } from "./../middleware/authMiddleWare.js";

const bookingRouter = express.Router();

// Public routes
bookingRouter.post("/check-availability", checkAvailabilityAPI);

// Protected routes
bookingRouter.post("/book", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/hotel", protect, getHotelBookings);
bookingRouter.post("/stripe-payment", protect, stripePayment);

// Booking management routes
bookingRouter.put("/:id/status", protect, updateBookingStatus);
bookingRouter.put("/:id/cancel", protect, cancelBooking);

// Admin route to cleanup unpaid bookings
bookingRouter.post("/cleanup-unpaid", cancelUnpaidBookings);

// Route to fix all paid bookings that are still pending
bookingRouter.post("/fix-all-paid", fixAllPaidBookings);

// Route to manually fix booking status for paid bookings
bookingRouter.put("/:id/fix-status", protect, fixPaidBookingStatus);

export default bookingRouter;