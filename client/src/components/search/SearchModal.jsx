import React, { useState } from "react";
import { assets, cities } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import SearchSuggestions from "./SearchSuggestions";

const SearchModal = ({ isOpen, onClose }) => {
  const { navigate, getToken, axios, setSearchedCities, searchedCities } = useAppContext();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const onSearch = async (e) => {
    e.preventDefault();
    if (!destination.trim()) return;
    
    // Navigate to rooms page with search parameters
    const params = new URLSearchParams();
    params.append('destination', destination);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests > 1) params.append('guests', guests);
    
    navigate(`/rooms?${params.toString()}`);
    
    // Save recent search
    try {
      await axios.post("/api/user/store-recent-search", {
        recentSearchedCity: destination,
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      // Add destination to searched cities (max 3 recent searched cities)
      setSearchedCities((prevSearchedCities) => {
        const updatedSearchedCities = [...prevSearchedCities, destination];
        if (updatedSearchedCities.length > 3) {
          updatedSearchedCities.shift(); // remove the oldest city if more than 3
        }
        return updatedSearchedCities;
      });
    } catch (error) {
      console.error("Error saving search:", error);
    }
    
    // Close modal and reset form
    onClose();
    setDestination("");
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-light text-gray-900">Search Hotels</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={onSearch} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Destination */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <img src={assets.locationIcon} alt="location" className="h-4 w-4" />
                <label htmlFor="destinationInput" className="text-sm font-medium text-gray-700">
                  Destination
                </label>
              </div>
              <SearchSuggestions
                value={destination}
                onChange={setDestination}
                onSelect={(selectedDestination) => {
                  setDestination(selectedDestination);
                }}
                placeholder="Where are you going?"
                recentSearches={searchedCities}
                popularDestinations={cities}
              />
            </div>

            {/* Check In */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={assets.calenderIcon} alt="calendar" className="h-4 w-4" />
                <label htmlFor="checkIn" className="text-sm font-medium text-gray-700">
                  Check In
                </label>
              </div>
              <input
                id="checkIn"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Check Out */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={assets.calenderIcon} alt="calendar" className="h-4 w-4" />
                <label htmlFor="checkOut" className="text-sm font-medium text-gray-700">
                  Check Out
                </label>
              </div>
              <input
                id="checkOut"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Guests */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={assets.guestsIcon} alt="guests" className="h-4 w-4" />
                <label htmlFor="guests" className="text-sm font-medium text-gray-700">
                  Guests
                </label>
              </div>
              <input
                id="guests"
                type="number"
                min={1}
                max={10}
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="1"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={!destination.trim()}
              className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <img src={assets.searchIcon} alt="search" className="h-5 w-5" />
              <span>Search Hotels</span>
            </button>
          </div>
        </form>

        {/* Quick Search Suggestions */}
        <div className="px-6 pb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Popular Destinations</h3>
          <div className="flex flex-wrap gap-2">
            {cities.slice(0, 8).map((city, index) => (
              <button
                key={index}
                onClick={() => {
                  setDestination(city);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
