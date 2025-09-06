import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import stripe from "stripe";
import mongoose from "mongoose";

// Function to check Availability of Room
export const checkAvailability = async ({
  checkInDate,
  checkOutDate,
  room,
}) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
      status: { $ne: "cancelled" }, // Exclude cancelled bookings
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.error(error.message);
    return false; // Return false on error to be safe
  }
};

// API to check availability of room
// POST /api/booking/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });
    res.json({
      success: true,
      isAvailable,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to create a new booking with atomic transaction
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const { room, checkInDate, checkOutDate, guests } = req.body;
      const paymentMethod = "Stripe"; // Only Stripe payment method
      const user = req.user.id;

      // Double-check availability within transaction
      const isAvailable = await checkAvailability({
        room,
        checkInDate,
        checkOutDate,
      });

      if (!isAvailable) {
        throw new Error("Room is not available for the selected dates");
      }

      // Get total price from the room
      const roomDetails = await Room.findById(room).populate("hotel");
      if (!roomDetails) {
        throw new Error("Room not found");
      }

      let totalPrice = roomDetails.pricePerNight;

      // Calculate total price based on number of nights
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

      totalPrice *= nights;

      // Create booking with all required fields
      const booking = await Booking.create(
        [
          {
            user,
            room,
            hotel: roomDetails.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
            status: "pending", // Set initial status
            paymentMethod, // Use the payment method from request
            isPaid: false, // Stripe payments are initially unpaid until webhook confirms
          },
        ],
        { session }
      );

      // Send confirmation email
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: req.user.email,
        subject: "Booking Created - Payment Required",
        html: `
          <h1>Booking Created - Payment Required</h1>
          <p>Dear ${req.user.username},</p>
          <p>Your booking has been created successfully, but payment is required to confirm your reservation.</p>
          <ul>
            <li><strong>Booking ID:</strong> ${booking[0]._id}</li>
            <li><strong>Hotel Name:</strong> ${roomDetails.hotel.name}</li>
            <li><strong>Location:</strong> ${roomDetails.hotel.address}</li>
            <li><strong>Check-in:</strong> ${booking[0].checkInDate.toDateString()}</li>
            <li><strong>Check-out:</strong> ${booking[0].checkOutDate.toDateString()}</li>
            <li><strong>Total Amount:</strong> ${process.env.CURRENCY || "$"}${
          booking[0].totalPrice
        }</li>
            <li><strong>Payment Method:</strong> ${paymentMethod}</li>
            <li><strong>Status:</strong> ${booking[0].status}</li>
          </ul>
          <p><strong>Important:</strong> Please complete your payment to confirm your booking. Your reservation will be cancelled if payment is not completed within 24 hours.</p>
          <p>If you have any questions, feel free to contact us.</p>
          <p>Best regards,</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.json({
        success: true,
        message: "Booking created successfully",
        booking: booking[0],
      });
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  } finally {
    await session.endSession();
  }
};

// API to get all bookings of a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user.id;
    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get hotel bookings for owner
export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user.id });
    if (!hotel) {
      return res.json({
        success: false,
        message: "Hotel not found",
      });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalBookings = bookings.length;
    const totalRevenue = bookings
      .filter((booking) => booking.status !== "cancelled")
      .reduce((acc, booking) => acc + booking.totalPrice, 0);

    const confirmedBookings = bookings.filter(
      (booking) => booking.status === "confirmed"
    ).length;
    const pendingBookings = bookings.filter(
      (booking) => booking.status === "pending"
    ).length;
    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "cancelled"
    ).length;

    res.json({
      success: true,
      dashboardData: {
        bookings,
        totalBookings,
        totalRevenue,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error fetching hotel bookings",
    });
  }
};

// API to update booking status
// PUT /api/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.json({
        success: false,
        message:
          "Invalid status. Must be one of: pending, confirmed, cancelled",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("room hotel user");

    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found",
      });
    }

    // Send status update email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: booking.user.email,
      subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      html: `
        <h1>Booking Status Update</h1>
        <p>Dear ${booking.user.username},</p>
        <p>Your booking status has been updated to: <strong>${status.toUpperCase()}</strong></p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Hotel:</strong> ${booking.hotel.name}</li>
          <li><strong>Room:</strong> ${booking.room.name}</li>
          <li><strong>Check-in:</strong> ${booking.checkInDate.toDateString()}</li>
          <li><strong>Check-out:</strong> ${booking.checkOutDate.toDateString()}</li>
        </ul>
        <p>Thank you for choosing our service!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to cancel a booking
// PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status: "cancelled",
        cancellationReason: reason,
        cancelledAt: new Date(),
      },
      { new: true }
    ).populate("room hotel user");

    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found",
      });
    }

    // Send cancellation email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: booking.user.email,
      subject: "Booking Cancelled",
      html: `
        <h1>Booking Cancelled</h1>
        <p>Dear ${booking.user.username},</p>
        <p>Your booking has been cancelled.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Hotel:</strong> ${booking.hotel.name}</li>
          <li><strong>Room:</strong> ${booking.room.name}</li>
          <li><strong>Check-in:</strong> ${booking.checkInDate.toDateString()}</li>
          <li><strong>Check-out:</strong> ${booking.checkOutDate.toDateString()}</li>
        </ul>
        <p>If you have any questions, please contact us.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Stripe payment processing
export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.json({
        success: false,
        message: "Cannot process payment for cancelled booking",
      });
    }

    const roomData = await Room.findById(booking.room).populate("hotel");
    const totalPrice = booking.totalPrice;
    const { origin } = req.headers;

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${roomData.hotel.name} - ${roomData.name}`,
            description: `Check-in: ${booking.checkInDate.toDateString()}, Check-out: ${booking.checkOutDate.toDateString()}`,
          },
          unit_amount: totalPrice * 100, // Convert to cents
        },
        quantity: 1,
      },
    ];

    // Create a checkout session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: {
        bookingId,
      },
    });

    res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe payment error:", error);
    res.json({
      success: false,
      message: "Payment failed",
    });
  }
};

// Function to manually fix booking status for paid bookings
export const fixPaidBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.isPaid && booking.status === "pending") {
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: "confirmed" },
        { new: true }
      );

      res.json({
        success: true,
        message: "Booking status updated to confirmed",
        booking: updatedBooking,
      });
    } else {
      res.json({
        success: false,
        message: `Booking isPaid: ${booking.isPaid}, status: ${booking.status}. No update needed.`,
      });
    }
  } catch (error) {
    console.error("Error fixing booking status:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Function to fix all paid bookings that are still in pending status
export const fixAllPaidBookings = async () => {
  try {
    const paidPendingBookings = await Booking.find({
      isPaid: true,
      status: "pending",
    });

    if (paidPendingBookings.length > 0) {
      await Booking.updateMany(
        {
          isPaid: true,
          status: "pending",
        },
        {
          status: "confirmed",
        }
      );
    }
  } catch (error) {
    console.error("Error fixing paid bookings:", error);
  }
};

// Function to cancel unpaid bookings older than 24 hours
export const cancelUnpaidBookings = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const unpaidBookings = await Booking.find({
      isPaid: false,
      status: "pending",
      createdAt: { $lt: twentyFourHoursAgo },
    });

    if (unpaidBookings.length > 0) {
      await Booking.updateMany(
        {
          isPaid: false,
          status: "pending",
          createdAt: { $lt: twentyFourHoursAgo },
        },
        {
          status: "cancelled",
          cancellationReason: "Payment not completed within 24 hours",
          cancelledAt: new Date(),
        }
      );
    }
  } catch (error) {
    console.error("Error cancelling unpaid bookings:", error);
  }
};
