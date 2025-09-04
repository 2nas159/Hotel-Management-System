import React from "react";
import { assets } from "../assets/assets";

const StarRatingFilter = ({ 
  selectedRating = 0, 
  onChange = () => {},
  minRating = 1,
  maxRating = 5
}) => {
  const handleRatingClick = (rating) => {
    if (selectedRating === rating) {
      // If clicking the same rating, deselect it
      onChange(0);
    } else {
      onChange(rating);
    }
  };

  const clearRating = () => {
    onChange(0);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-gray-800">Star Rating</span>
        {selectedRating > 0 && (
          <button
            onClick={clearRating}
            className="text-xs text-blue-500 hover:text-blue-600 underline"
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {Array.from({ length: maxRating }, (_, index) => {
          const rating = maxRating - index;
          const isSelected = selectedRating === rating;
          
          return (
            <label
              key={rating}
              className={`
                flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors
                ${isSelected ? 'bg-blue-50 border border-blue-200' : ''}
              `}
            >
              <input
                type="radio"
                name="starRating"
                checked={isSelected}
                onChange={() => handleRatingClick(rating)}
                className="w-4 h-4 accent-blue-500"
              />
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array(5).fill("").map((_, starIndex) => (
                    <img
                      key={starIndex}
                      src={
                        starIndex < rating 
                          ? assets.starIconFilled 
                          : assets.starIconOutlined
                      }
                      alt="star"
                      className="w-4 h-4"
                    />
                  ))}
                </div>
                <span className="text-sm font-light select-none">
                  {rating} star{rating > 1 ? 's' : ''} & up
                </span>
              </div>
            </label>
          );
        })}
      </div>
      
      {selectedRating > 0 && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 font-medium">
            Showing hotels with {selectedRating} star{selectedRating > 1 ? 's' : ''} or higher
          </p>
        </div>
      )}
    </div>
  );
};

export default StarRatingFilter;
