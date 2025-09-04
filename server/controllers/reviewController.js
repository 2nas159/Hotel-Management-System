import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, title, comment } = req.body;
    const userId = req.user.id;

    // Verify the booking exists and belongs to the user
    const booking = await Booking.findById(bookingId)
      .populate('room hotel')
      .populate('user');

    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.user._id !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized to review this booking"
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.json({
        success: false,
        message: "Review already exists for this booking"
      });
    }

    // Check if booking is completed (check-out date has passed)
    const today = new Date();
    if (booking.checkOutDate > today) {
      return res.json({
        success: false,
        message: "Cannot review before check-out date"
      });
    }

    // Upload images if provided
    let reviewImages = [];
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(async (file) => {
        const response = await cloudinary.uploader.upload(file.path);
        return response.secure_url;
      });
      reviewImages = await Promise.all(uploadedImages);
    }

    // Create the review
    const review = await Review.create({
      user: userId,
      hotel: booking.hotel._id,
      room: booking.room._id,
      booking: bookingId,
      rating: parseInt(rating),
      title: title.trim(),
      comment: comment.trim(),
      images: reviewImages,
      isVerified: true, // Auto-verify if user has completed booking
      isApproved: true // Auto-approve for now, can be changed to require moderation
    });

    // Populate the review with user and hotel data
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username image')
      .populate('hotel', 'name')
      .populate('room', 'roomType');

    res.json({
      success: true,
      message: "Review submitted successfully",
      review: populatedReview
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.json({
      success: false,
      message: "Error creating review"
    });
  }
};

// Get reviews for a hotel
export const getHotelReviews = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    const query = { 
      hotel: hotelId, 
      isApproved: true 
    };

    // Filter by rating if provided
    if (rating) {
      query.rating = parseInt(rating);
    }

    const reviews = await Review.find(query)
      .populate('user', 'username image')
      .populate('hotel', 'name')
      .populate('room', 'roomType')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalReviews = await Review.countDocuments(query);
    const averageRating = await Review.aggregate([
      { $match: { hotel: hotelId, isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    // Rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { hotel: hotelId, isApproved: true } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      success: true,
      reviews,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(totalReviews / limit),
        total: totalReviews
      },
      averageRating: averageRating[0]?.avgRating || 0,
      ratingDistribution
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.json({
      success: false,
      message: "Error fetching reviews"
    });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: userId })
      .populate('hotel', 'name')
      .populate('room', 'roomType')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalReviews = await Review.countDocuments({ user: userId });

    res.json({
      success: true,
      reviews,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(totalReviews / limit),
        total: totalReviews
      }
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.json({
      success: false,
      message: "Error fetching user reviews"
    });
  }
};

// Mark review as helpful
export const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if user already voted
    const hasVoted = review.helpfulVoters.includes(userId);
    
    if (hasVoted) {
      // Remove vote
      review.helpfulVoters = review.helpfulVoters.filter(id => id !== userId);
      review.helpful = Math.max(0, review.helpful - 1);
    } else {
      // Add vote
      review.helpfulVoters.push(userId);
      review.helpful += 1;
    }

    await review.save();

    res.json({
      success: true,
      helpful: review.helpful,
      hasVoted: !hasVoted
    });
  } catch (error) {
    console.error("Error marking review helpful:", error);
    res.json({
      success: false,
      message: "Error updating review"
    });
  }
};

// Hotel owner response to review
export const respondToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;
    const userId = req.user.id;

    // Verify the user is the hotel owner
    const review = await Review.findById(reviewId).populate('hotel');
    if (!review) {
      return res.json({
        success: false,
        message: "Review not found"
      });
    }

    if (review.hotel.owner !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized to respond to this review"
      });
    }

    // Update review with hotel response
    review.hotelResponse = {
      response: response.trim(),
      respondedAt: new Date(),
      respondedBy: userId
    };

    await review.save();

    res.json({
      success: true,
      message: "Response added successfully"
    });
  } catch (error) {
    console.error("Error responding to review:", error);
    res.json({
      success: false,
      message: "Error adding response"
    });
  }
};

// Get reviews for hotel owner dashboard
export const getHotelOwnerReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status = 'all' } = req.query;

    // Find hotel owned by user
    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.json({
        success: false,
        message: "Hotel not found"
      });
    }

    const query = { hotel: hotel._id };
    
    // Filter by approval status
    if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'approved') {
      query.isApproved = true;
    }

    const reviews = await Review.find(query)
      .populate('user', 'username image')
      .populate('room', 'roomType')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalReviews = await Review.countDocuments(query);

    res.json({
      success: true,
      reviews,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(totalReviews / limit),
        total: totalReviews
      }
    });
  } catch (error) {
    console.error("Error fetching hotel owner reviews:", error);
    res.json({
      success: false,
      message: "Error fetching reviews"
    });
  }
};
