import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import ReviewCard from "./ReviewCard";
import InteractiveStarRating from "./InteractiveStarRating";

const ReviewList = ({ hotelId, showFilters = true }) => {
  const { axios } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    rating: "",
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState([]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (filters.rating) params.append('rating', filters.rating);
      params.append('page', filters.page);
      params.append('limit', filters.limit);

      const { data } = await axios.get(`/api/reviews/hotel/${hotelId}?${params}`);
      
      if (data.success) {
        setReviews(data.reviews);
        setPagination(data.pagination);
        setAverageRating(data.averageRating);
        setRatingDistribution(data.ratingDistribution);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Error loading reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hotelId) {
      fetchReviews();
    }
  }, [hotelId, filters]);

  const handleRatingFilter = (rating) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? "" : rating,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getRatingPercentage = (rating) => {
    const total = ratingDistribution.reduce((sum, item) => sum + item.count, 0);
    const ratingData = ratingDistribution.find(item => item._id === rating);
    return total > 0 ? ((ratingData?.count || 0) / total) * 100 : 0;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill("").map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Reviews</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <InteractiveStarRating
              rating={Math.round(averageRating)}
              readOnly={true}
              size="lg"
            />
            <p className="text-sm text-gray-600 mt-2">
              Based on {pagination.total} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentage = getRatingPercentage(rating);
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-8">{rating}</span>
                  <InteractiveStarRating
                    rating={1}
                    readOnly={true}
                    size="sm"
                  />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {Math.round(percentage)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Filter by rating:</span>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingFilter(rating)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filters.rating === rating.toString()
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {rating} stars
              </button>
            ))}
            {filters.rating && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, rating: "", page: 1 }))}
                className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews found.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md text-sm ${
                  filters.page === page
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === pagination.pages}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
