import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

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
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.error(error.message);
  }
};

// API to check avalability of room
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

// API to create a new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user.id; // Assuming user ID is available in req.user

    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Room is not available for the selected dates",
      });
    }

    // Get total price from the room
    const roomDetails = await Room.findById(room).populate("hotel");
    let totalPrice = roomDetails.pricePerNight;

    // calculate total price based on number of nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomDetails.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL, // Sender email
      to: req.user.email, // User's email
      subject: "Booking Confirmation",
      html: `
        <h1>Booking Confirmation</h1>
        <p>Dear ${req.user.username},</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Hotel Name:</strong> ${roomDetails.hotel.name}</li>
          <li><strong>Location:</strong> ${roomDetails.hotel.address}</li>
          <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
          <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || "$"} 
           ${booking.totalPrice} /night
          </li>
        </ul>
        <p>We look forward to welcoming you!</p>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best regards,</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
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

export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({
        success: false,
        message: "Hotel not found",
      });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    // Total Bookings
    const totalBookings = bookings.length;
    // Total Revenue
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    res.json({
      success: true,
      dashboardData: {
        bookings,
        totalBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error fetching hotel bookings",
    });
  }
};
