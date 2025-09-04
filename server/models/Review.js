import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, ref: "User" },
    hotel: { type: String, required: true, ref: "Hotel" },
    room: { type: String, required: true, ref: "Room" },
    booking: { type: String, required: true, ref: "Booking" },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5'
      }
    },
    title: { 
      type: String, 
      required: true, 
      maxLength: 100,
      trim: true
    },
    comment: { 
      type: String, 
      required: true, 
      maxLength: 500,
      trim: true
    },
    images: [{ type: String }], // URLs to review images
    isVerified: { type: Boolean, default: false }, // Verified guest
    isApproved: { type: Boolean, default: false }, // Admin approval
    helpful: { type: Number, default: 0 }, // Helpful votes
    helpfulVoters: [{ type: String, ref: "User" }], // Users who voted helpful
    hotelResponse: {
      response: { type: String, maxLength: 500 },
      respondedAt: { type: Date },
      respondedBy: { type: String, ref: "User" }
    }
  },
  { timestamps: true }
);

// Index for better query performance
reviewSchema.index({ hotel: 1, isApproved: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ booking: 1 });

// Virtual for average rating calculation
reviewSchema.virtual('hotelAverageRating', {
  ref: 'Hotel',
  localField: 'hotel',
  foreignField: '_id',
  justOne: true
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
