import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebHooks from "./controllers/clerkWebHooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import analyticsRouter from "./routes/analyticsRoutes.js";
import { stripeWebHooks, testWebhook } from "./controllers/stripeWebHooks.js";
import { cancelUnpaidBookings, fixAllPaidBookings } from "./controllers/bookingController.js";

connectDB();
connectCloudinary();

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing

// API to listen to Stripe webhooks
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebHooks
);

// Test endpoint for webhook debugging
app.get("/api/stripe/test", testWebhook);

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(clerkMiddleware()); // Use Clerk middleware for authentication

// API to listen to Clerk webhooks
app.use("/api/clerk", clerkWebHooks);

app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/analytics", analyticsRouter);

const PORT = process.env.PORT || 3000;

// Set up automatic cleanup of unpaid bookings every hour
setInterval(() => {
  console.log("Running cleanup for unpaid bookings...");
  cancelUnpaidBookings();
}, 60 * 60 * 1000); // Run every hour

// Set up automatic fix for paid bookings every 30 minutes
setInterval(() => {
  console.log("Running fix for paid bookings...");
  fixAllPaidBookings();
}, 30 * 60 * 1000); // Run every 30 minutes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Automatic cleanup for unpaid bookings scheduled every hour");
  console.log("Automatic fix for paid bookings scheduled every 30 minutes");
  
  // Run initial fixes on startup
  setTimeout(() => {
    console.log("Running initial fixes on startup...");
    fixAllPaidBookings();
  }, 5000); // Wait 5 seconds for database connection
});
