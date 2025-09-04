import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import InteractiveStarRating from "./InteractiveStarRating";
import { validateRequired, validateMinLength, validateMaxLength } from "../utils/formValidator";

const ReviewForm = ({ booking, onReviewSubmitted }) => {
  const { axios, getToken } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
    images: []
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, ...validFiles].slice(0, 5) 
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!validateRequired(formData.rating) || formData.rating < 1) {
      errors.rating = "Please select a rating";
    }

    if (!validateRequired(formData.title)) {
      errors.title = "Title is required";
    } else if (!validateMinLength(formData.title, 5)) {
      errors.title = "Title must be at least 5 characters";
    } else if (!validateMaxLength(formData.title, 100)) {
      errors.title = "Title must be less than 100 characters";
    }

    if (!validateRequired(formData.comment)) {
      errors.comment = "Comment is required";
    } else if (!validateMinLength(formData.comment, 10)) {
      errors.comment = "Comment must be at least 10 characters";
    } else if (!validateMaxLength(formData.comment, 500)) {
      errors.comment = "Comment must be less than 500 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('bookingId', booking._id);
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('comment', formData.comment.trim());
      
      // Append images
      formData.images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const { data } = await axios.post('/api/reviews', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        toast.success("Review submitted successfully!");
        onReviewSubmitted(data.review);
        // Reset form
        setFormData({
          rating: 0,
          title: "",
          comment: "",
          images: []
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Write a Review
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          <InteractiveStarRating
            rating={formData.rating}
            onRatingChange={(rating) => handleInputChange('rating', rating)}
            size="lg"
            showLabel={true}
          />
          {formErrors.rating && (
            <p className="text-red-500 text-xs mt-1">{formErrors.rating}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Summarize your experience"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={100}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            {formErrors.title && <span className="text-red-500">{formErrors.title}</span>}
            <span>{formData.title.length}/100</span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            placeholder="Tell others about your experience..."
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.comment ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={500}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            {formErrors.comment && <span className="text-red-500">{formErrors.comment}</span>}
            <span>{formData.comment.length}/500</span>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
            Photos (Optional)
          </label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload up to 5 images (max 5MB each)
          </p>
          
          {/* Image previews */}
          {formData.images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
