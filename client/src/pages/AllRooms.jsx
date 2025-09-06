import React, { useMemo, useState, useEffect } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import LuxuryStarRating from "../components/LuxuryStarRating";
import { useAppContext } from "../context/AppContext";
import SearchResultsSkeleton from "../components/SearchResultsSkeleton";
import PriceRangeSlider from "../components/PriceRangeSlider";
import AmenityFilter from "../components/AmenityFilter";
import StarRatingFilter from "../components/StarRatingFilter";
import GuestCapacityFilter from "../components/GuestCapacityFilter";
import LazyImage from "../components/LazyImage";

const AllRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { rooms, navigate, currency, fetchRooms } = useAppContext();

  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    roomTypes: [],
    priceRange: [0, 3000],
    amenities: [],
    starRating: 0,
    guestCapacity: 0,
  });
  const [selectedSort, setSelectedSort] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];

  const sortOptions = [
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
  ];

  // Handle filter and sort changes
  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (checked) {
        updatedFilters[type].push(value);
      } else {
        updatedFilters[type] = updatedFilters[type].filter(
          (item) => item !== value
        );
      }
      return updatedFilters;
    });
  };

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  };

  // Filter functions
  const matchesRoomTypes = (room) => {
    return (
      selectedFilters.roomTypes.length === 0 ||
      selectedFilters.roomTypes.includes(room.roomType)
    );
  };

  const matchesPriceRange = (room) => {
    const [minPrice, maxPrice] = selectedFilters.priceRange;
    return room.pricePerNight >= minPrice && room.pricePerNight <= maxPrice;
  };

  const matchesAmenities = (room) => {
    return (
      selectedFilters.amenities.length === 0 ||
      selectedFilters.amenities.every((amenity) =>
        room.amenities.includes(amenity)
      )
    );
  };

  const matchesStarRating = (room) => {
    return true; // Placeholder for future implementation
  };

  const matchesGuestCapacity = (room) => {
    return true; // Placeholder for future implementation
  };

  const sortRooms = (a, b) => {
    if (selectedSort === "Price: Low to High") {
      return a.pricePerNight - b.pricePerNight;
    } else if (selectedSort === "Price: High to Low") {
      return b.pricePerNight - a.pricePerNight;
    } else if (selectedSort === "Newest First") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  };

  const filterDestination = (room) => {
    const destination = searchParams.get("destination");
    if (!destination) return true;
    return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
  };

  // Filter rooms based on selected filters and sort option
  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => matchesRoomTypes(room))
      .filter((room) => matchesPriceRange(room))
      .filter((room) => matchesAmenities(room))
      .filter((room) => matchesStarRating(room))
      .filter((room) => matchesGuestCapacity(room))
      .filter((room) => filterDestination(room))
      .sort(sortRooms);
  }, [rooms, selectedFilters, selectedSort, searchParams]);

  // Clear filters and sort
  const clearFilters = () => {
    setSelectedFilters({
      roomTypes: [],
      priceRange: [0, 3000],
      amenities: [],
      starRating: 0,
      guestCapacity: 0,
    });
    setSelectedSort("");
    setSearchParams({});
  };

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [rooms]);

  // Show skeleton loading while data is loading
  if (isLoading) {
    return <SearchResultsSkeleton count={4} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-gray-900 tracking-tight mb-2">
                Hotel Rooms
              </h1>
              <p className="text-lg text-gray-500 font-light">
                {filteredRooms.length} room
                {filteredRooms.length !== 1 ? "s" : ""} available
              </p>
            </div>
            <button
              onClick={() => setOpenFilters(!openFilters)}
              className="lg:hidden flex items-center gap-3 px-6 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all duration-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span className="font-medium text-gray-700">Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div
            className={`w-80 flex-shrink-0 ${
              openFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Clear all
                </button>
              </div>

              {/* Filter Content */}
              <div className="p-4 space-y-6">
                {/* Room Types */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Room Type</h4>
                  <div className="space-y-2">
                    {roomTypes.map((roomType, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.roomTypes.includes(roomType)}
                          onChange={(e) =>
                            handleFilterChange(
                              e.target.checked,
                              roomType,
                              "roomTypes"
                            )
                          }
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">
                          {roomType}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Price Range
                  </h4>
                  <PriceRangeSlider
                    min={0}
                    max={3000}
                    step={50}
                    value={selectedFilters.priceRange}
                    onChange={(value) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        priceRange: value,
                      }))
                    }
                    currency={currency}
                  />
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Amenities</h4>
                  <AmenityFilter
                    selectedAmenities={selectedFilters.amenities}
                    onChange={(amenities) =>
                      setSelectedFilters((prev) => ({ ...prev, amenities }))
                    }
                  />
                </div>

                {/* Star Rating */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                  <StarRatingFilter
                    selectedRating={selectedFilters.starRating}
                    onChange={(rating) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        starRating: rating,
                      }))
                    }
                  />
                </div>

                {/* Guest Capacity */}
                <div>
                  <GuestCapacityFilter
                    selectedCapacity={selectedFilters.guestCapacity}
                    onChange={(capacity) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        guestCapacity: capacity,
                      }))
                    }
                  />
                </div>

                {/* Sort Options */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                  <div className="space-y-2">
                    {sortOptions.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="sortOption"
                          checked={selectedSort === option}
                          onChange={() => setSelectedSort(option)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="flex-1">
            {filteredRooms.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No rooms found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to see more results.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredRooms.map((room) => (
                  <article
                    key={room._id}
                    className="group bg-white rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 ease-out border-0 hover:border border-gray-100/50"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        onClick={() => {
                          navigate(`/rooms/${room._id}`);
                          scrollTo(0, 0);
                        }}
                        src={room.images[0]}
                        className="absolute inset-0 w-full h-full object-cover object-center cursor-pointer group-hover:scale-110 transition-transform duration-700 ease-out"
                        alt={`${room.hotel.name} - ${room.roomType}`}
                        title="View Room Details"
                        loading="lazy"
                      />

                      {/* Rating Badge */}
                      <div className="absolute top-5 left-5">
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-3 py-2 shadow-lg">
                          <LuxuryStarRating
                            rating={4.8}
                            size="sm"
                            showNumber={true}
                          />
                        </div>
                      </div>

                      {/* Price Overlay */}
                      <div className="absolute bottom-5 right-5">
                        <div className="bg-black/70 backdrop-blur-md rounded-2xl px-4 py-2.5 text-white">
                          <div className="text-right">
                            <p className="text-xs font-medium text-white/80 leading-none">
                              from
                            </p>
                            <p className="text-lg font-bold leading-none">
                              {currency}
                              {room.pricePerNight}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      {/* Location */}
                      <div className="flex items-center gap-2 mb-4">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-500 tracking-wide uppercase">
                          {room.hotel.city}
                        </span>
                      </div>

                      {/* Hotel Name */}
                      <h3
                        onClick={() => {
                          navigate(`/rooms/${room._id}`);
                          scrollTo(0, 0);
                        }}
                        className="text-2xl font-light text-gray-900 cursor-pointer hover:text-gray-700 transition-colors mb-3 leading-tight"
                        style={{
                          lineHeight: "1.2",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {room.hotel.name}
                      </h3>

                      {/* Room Type */}
                      <p className="text-base text-gray-600 mb-6 font-normal leading-relaxed">
                        {room.roomType}
                      </p>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50/80 rounded-xl text-xs text-gray-600 font-medium"
                          >
                            <img
                              src={facilityIcons[amenity]}
                              alt={amenity}
                              className="w-3.5 h-3.5 opacity-70"
                            />
                            <span className="whitespace-nowrap">{amenity}</span>
                          </div>
                        ))}
                        {room.amenities.length > 3 && (
                          <div className="px-3 py-2 bg-gray-50/80 rounded-xl text-xs text-gray-600 font-medium">
                            +{room.amenities.length - 3}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          navigate(`/rooms/${room._id}`);
                          scrollTo(0, 0);
                        }}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all duration-300 text-sm font-medium tracking-wide uppercase letter-spacing-wider"
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
