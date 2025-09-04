import mongoose from "mongoose";
import Booking from "./models/Booking.js";
import "dotenv/config";

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Fix all paid bookings that are still pending
const fixAllPaidBookings = async () => {
  try {
    console.log("🔍 Looking for paid bookings with pending status...");
    
    const paidPendingBookings = await Booking.find({
      isPaid: true,
      status: "pending"
    });

    console.log(`Found ${paidPendingBookings.length} paid bookings with pending status`);

    if (paidPendingBookings.length > 0) {
      console.log("📋 Bookings to fix:");
      paidPendingBookings.forEach(booking => {
        console.log(`- Booking ID: ${booking._id}`);
        console.log(`  User: ${booking.user}`);
        console.log(`  Hotel: ${booking.hotel}`);
        console.log(`  Total Price: $${booking.totalPrice}`);
        console.log(`  Check-in: ${booking.checkInDate}`);
        console.log(`  Status: ${booking.status} (isPaid: ${booking.isPaid})`);
        console.log("---");
      });

      const result = await Booking.updateMany(
        {
          isPaid: true,
          status: "pending"
        },
        {
          status: "confirmed"
        }
      );

      console.log(`✅ Fixed ${result.modifiedCount} bookings from pending to confirmed`);
    } else {
      console.log("✅ No paid bookings with pending status found");
    }
  } catch (error) {
    console.error("❌ Error fixing paid bookings:", error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await fixAllPaidBookings();
  process.exit(0);
};

main();
