import React from "react";

const RoomCardSkeleton = () => {
  return (
    <article className="group bg-white rounded-3xl overflow-hidden border-0">
      {/* Image Container Skeleton */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse"></div>
        
        {/* Rating Badge Skeleton */}
        <div className="absolute top-5 left-5">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl px-3 py-2 shadow-lg">
            <div className="flex items-center gap-1">
              {Array(5).fill("").map((_, index) => (
                <div key={index} className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
              ))}
              <div className="h-3 bg-gray-200 rounded w-8 animate-pulse ml-1"></div>
            </div>
          </div>
        </div>

        {/* Price Overlay Skeleton */}
        <div className="absolute bottom-5 right-5">
          <div className="bg-black/70 backdrop-blur-md rounded-2xl px-4 py-2.5">
            <div className="text-right">
              <div className="h-3 bg-gray-300 rounded w-8 animate-pulse mb-1"></div>
              <div className="h-5 bg-gray-300 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-8">
        {/* Location */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>

        {/* Hotel Name */}
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse mb-3"></div>

        {/* Room Type */}
        <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse mb-6"></div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Array(3).fill("").map((_, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-50/80 rounded-xl">
              <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
            </div>
          ))}
          <div className="px-3 py-2 bg-gray-50/80 rounded-xl">
            <div className="h-3 bg-gray-200 rounded w-6 animate-pulse"></div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    </article>
  );
};

export default RoomCardSkeleton;
