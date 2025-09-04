import React from "react";

const RoomCardSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0">
      {/* Image Skeleton */}
      <div className="max-h-65 md:w-1/2 rounded-xl shadow-lg bg-gray-200 animate-pulse">
        <div className="w-full h-64 bg-gray-300 rounded-xl"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="md:w-1/2 flex flex-col gap-2 w-full">
        {/* City */}
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        
        {/* Hotel Name */}
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array(5).fill("").map((_, index) => (
              <div key={index} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-1 mt-2">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        {/* Amenities */}
        <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
          {Array(3).fill("").map((_, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
        
        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
    </div>
  );
};

export default RoomCardSkeleton;
