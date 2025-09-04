import React from "react";
import RoomCardSkeleton from "./RoomCardSkeleton";

const SearchResultsSkeleton = ({ count = 4 }) => {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div>
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Explore our wide range of hotel rooms
          </p>
        </div>

        {/* Render skeleton cards */}
        {Array(count).fill("").map((_, index) => (
          <RoomCardSkeleton key={index} />
        ))}
      </div>
      
      {/* Filter Skeleton */}
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16">
        <div className="flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300">
          <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
        </div>
        
        <div className="px-5 pt-5">
          <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
          {Array(4).fill("").map((_, index) => (
            <div key={index} className="flex items-center gap-3 mt-2">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
        
        <div className="px-5 pt-5">
          <div className="h-4 bg-gray-200 rounded w-20 mb-4 animate-pulse"></div>
          {Array(4).fill("").map((_, index) => (
            <div key={index} className="flex items-center gap-3 mt-2">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsSkeleton;
