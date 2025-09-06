import React from "react";
import RoomCardSkeleton from "./RoomCardSkeleton";

const SearchResultsSkeleton = ({ count = 6 }) => {
  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-10 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <div className="lg:hidden">
              <div className="h-12 bg-gray-200 rounded-2xl w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex gap-6">
          {/* Filters Sidebar Skeleton */}
          <div className="w-80 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>

              {/* Filter Content */}
              <div className="p-4 space-y-6">
                {/* Room Types */}
                <div>
                  <div className="h-5 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    {Array(4).fill("").map((_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <div className="h-5 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Amenities */}
                <div>
                  <div className="h-5 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    {Array(6).fill("").map((_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Star Rating */}
                <div>
                  <div className="h-5 bg-gray-200 rounded w-16 mb-3 animate-pulse"></div>
                  <div className="flex gap-1">
                    {Array(5).fill("").map((_, index) => (
                      <div key={index} className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>

                {/* Guest Capacity */}
                <div>
                  <div className="h-5 bg-gray-200 rounded w-28 mb-3 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Sort Options */}
                <div>
                  <div className="h-5 bg-gray-200 rounded w-16 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    {Array(3).fill("").map((_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rooms Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array(count).fill("").map((_, index) => (
                <RoomCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsSkeleton;
