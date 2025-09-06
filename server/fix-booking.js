import mongoose from "mongoose";
import Booking from "./models/Booking.js";
import "dotenv/config";

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Fix all paid bookings that are still pending
const fixAllPaidBookings = async () => {
  try {
    
    const paidPendingBookings = await Booking.find({
      isPaid: true,
      status: "pending"
    });

    if (paidPendingBookings.length > 0) {

      const result = await Booking.updateMany(
        {
          isPaid: true,
          status: "pending"
        },
        {
          status: "confirmed"
        }
      );

    }
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
