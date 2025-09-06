import React, { useState } from "react";
import { assets } from "../../assets/assets";

const InteractiveStarRating = ({ 
  rating = 0, 
  onRatingChange = () => {},
  size = "md",
  readOnly = false,
  showLabel = false
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleStarClick = (starRating) => {
    if (readOnly) return;
    
    setCurrentRating(starRating);
    onRatingChange(starRating);
  };

  const handleStarHover = (starRating) => {
    if (readOnly) return;
    setHoverRating(starRating);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "lg":
        return "w-6 h-6";
      case "xl":
        return "w-8 h-8";
      default:
        return "w-5 h-5";
    }
  };

  const getLabel = (rating) => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  const displayRating = hoverRating || currentRating;

  return (
    <div className="flex items-center gap-2">
      <div 
        className="flex gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {Array(5).fill("").map((_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= displayRating;
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(starRating)}
              onMouseEnter={() => handleStarHover(starRating)}
              disabled={readOnly}
              className={`
                ${getSizeClasses()}
                ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                transition-transform duration-150
              `}
            >
              <img
                src={isFilled ? assets.starIconFilled : assets.starIconOutlined}
                alt={`star-${starRating}`}
                className={`${getSizeClasses()} transition-colors duration-150 ${
                  !readOnly && isFilled ? 'drop-shadow-sm' : ''
                }`}
              />
            </button>
          );
        })}
      </div>
      
      {showLabel && displayRating > 0 && (
        <span className="text-sm text-gray-600 font-medium">
          {getLabel(displayRating)}
        </span>
      )}
      
      {!readOnly && currentRating > 0 && (
        <span className="text-sm text-gray-500">
          ({currentRating}/5)
        </span>
      )}
    </div>
  );
};

export default InteractiveStarRating;
