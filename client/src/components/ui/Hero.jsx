import React, { useState } from "react";
import { assets, cities } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import SearchSuggestions from "../search/SearchSuggestions";

const Hero = () => {
  const { navigate, getToken, axios, setSearchedCities, searchedCities } =
    useAppContext();
  const [destination, setDestination] = useState("");

  const onSearch = async (e) => {
    e.preventDefault();
    navigate(`/rooms?destination=${destination}`);
    // call api to save recent searched cities
    await axios.post("/api/user/store-recent-search", {
      recentSearchedCity: destination,
      headers: { Authorization: `Bearer ${await getToken()}` },
    });

    // add destination to searched cities max 3 recent searched cities
    setSearchedCities((prevSearchedCities) => {
      const updatedSearchedCities = [...prevSearchedCities, destination];
      if (updatedSearchedCities.length > 3) {
        updatedSearchedCities.shift(); // remove the oldest city if more than 3
      }
      return updatedSearchedCities;
    });
  };

  return (
    <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>
      <p className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20 text-xs md:text-sm">
        The Ultimate Hotel Experience
      </p>
      <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold md:font-extrabold max-w-xl mt-4 leading-tight">
        Discover Your Perfect Gateway Destination
      </h1>
      <p className="max-w-130 mt-3 text-sm md:text-base text-white/90">
        Unparalleled luxury and comfort await at the world's most exclusive
        hotels and resorts. Start your journey today.
      </p>

      <form
        onSubmit={onSearch}
        className="mt-8 bg-white text-gray-500 rounded-xl shadow-lg p-5 md:p-6 lg:p-8 flex flex-col md:flex-row items-stretch md:items-center gap-4 lg:gap-6 w-full max-w-5xl"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src={assets.calenderIcon}
              alt="calendar"
              className="h-4 opacity-70"
            />
            <label
              htmlFor="destinationInput"
              className="text-xs font-semibold uppercase tracking-wider"
            >
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

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src={assets.calenderIcon}
              alt="calendar"
              className="h-4 opacity-70"
            />
            <label
              htmlFor="checkIn"
              className="text-xs font-semibold uppercase tracking-wider"
            >
              Check in
            </label>
          </div>
          <input
            id="checkIn"
            type="date"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black transition-all"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src={assets.calenderIcon}
              alt="calendar"
              className="h-4 opacity-70"
            />
            <label
              htmlFor="checkOut"
              className="text-xs font-semibold uppercase tracking-wider"
            >
              Check out
            </label>
          </div>
          <input
            id="checkOut"
            type="date"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black transition-all"
          />
        </div>

        <div className="w-full md:w-24">
          <div className="flex items-center gap-2 mb-1.5">
            <label
              htmlFor="guests"
              className="text-xs font-semibold uppercase tracking-wider"
            >
              Guests
            </label>
          </div>
          <input
            min={1}
            max={10}
            id="guests"
            type="number"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black transition-all"
            placeholder="0"
          />
        </div>

        <button className="flex items-center justify-center gap-2 rounded-md bg-black py-3 px-6 text-white font-medium hover:bg-gray-800 active:scale-[0.98] transition-all cursor-pointer mt-2 md:mt-auto">
          <img
            src={assets.searchIcon}
            alt="search"
            className="h-5 brightness-0 invert"
          />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;
