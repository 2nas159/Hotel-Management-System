import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import InteractiveStarRating from "./InteractiveStarRating";
import { assets } from "../assets/assets";

const ReviewCard = ({ review, showHelpful = true, onHelpfulChange }) => {
  const { user, axios, getToken } = useAppContext();
  const [isMarkingHelpful, setIsMarkingHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);
  const [hasVoted, setHasVoted] = useState(false); // This would come from API in real implementation

  const handleMarkHelpful = async () => {
    if (!user) {
      toast.error("Please login to mark reviews as helpful");
      return;
    }

    setIsMarkingHelpful(true);

    try {
      const { data } = await axios.post(
        `/api/reviews/${review._id}/helpful`,
        {},
        {
          headers: { Authorization: `Bearer ${await getToken()}` }
        }
      );

      if (data.success) {
        setHelpfulCount(data.helpful);
        setHasVoted(data.hasVoted);
        if (onHelpfulChange) {
          onHelpfulChange(review._id, data.helpful);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error marking review helpful:", error);
      toast.error("Error updating review");
    } finally {
      setIsMarkingHelpful(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={review.user.image}
            alt={review.user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{review.user.username}</h4>
              {review.isVerified && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <img src={assets.badgeIcon} alt="verified" className="w-3 h-3 mr-1" />
                  Verified Guest
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <InteractiveStarRating
                rating={review.rating}
                readOnly={true}
                size="sm"
              />
              <span className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {review.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  // In a real app, this would open a lightbox/modal
                  window.open(image, '_blank');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hotel Response */}
      {review.hotelResponse && review.hotelResponse.response && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-center gap-2 mb-2">
            <h6 className="font-medium text-blue-900">Hotel Response</h6>
            <span className="text-xs text-blue-600">
              {formatDate(review.hotelResponse.respondedAt)}
            </span>
          </div>
          <p className="text-blue-800">{review.hotelResponse.response}</p>
        </div>
      )}

      {/* Review Actions */}
      {showHelpful && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={handleMarkHelpful}
              disabled={isMarkingHelpful}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                hasVoted
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isMarkingHelpful ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              )}
              <span>Helpful</span>
              {helpfulCount > 0 && (
                <span className="ml-1">({helpfulCount})</span>
              )}
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            {review.room?.roomType && (
              <span>Stayed in {review.room.roomType}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
