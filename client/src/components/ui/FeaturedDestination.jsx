import React from "react";
import HotelCard from "../hotel/HotelCard";
import Title from "../ui/Title";
import { useAppContext } from "../../context/AppContext";

const FeaturedDestination = () => {
  const { rooms, navigate } = useAppContext();

  return (
    rooms.length > 0 && (
      <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-16 md:py-24">
        <Title
          title="Featured Destination"
          subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center gap-6 mt-12 md:mt-16 w-full max-w-7xl mx-auto">
          {rooms.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))}
        </div>

        <button
          className="mt-12 md:mt-16 px-6 py-2.5 text-sm font-medium border border-gray-300 rounded-md bg-white hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shadow-sm"
          onClick={() => {
            navigate("/rooms");
            scrollTo(0, 0);
          }}
        >
          View All Destinations
        </button>
      </div>
    )
  );
};

export default FeaturedDestination;
