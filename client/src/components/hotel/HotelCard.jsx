import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const HotelCard = ({ room, index }) => {
  return (
    <Link
      to={"/rooms/" + room._id}
      onClick={() => scrollTo(0, 0)}
      key={room._id}
      className="relative max-w-70 w-full flex flex-col rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] transition-transform hover:scale-[1.02]"
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={room.images[0]}
          alt="room-image"
          className="w-full h-full object-cover"
        />
      </div>
      {index % 2 === 0 && (
        <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full shadow-sm z-10">
          Best Seller
        </p>
      )}
      <div className="p-4 pt-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="font-playfair text-xl font-medium text-gray-800 line-clamp-1">
            {room.hotel.name}
          </p>
          <div className="flex items-center gap-1 shrink-0 mt-1">
            <img
              src={assets.starIconFilled}
              alt="star-icon"
              className="h-3.5 w-3.5"
            />
            <span className="text-sm font-semibold">4.5</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          <img
            src={assets.locationFilledIcon}
            alt="location-icon"
            className="h-3.5 shrink-0 opacity-80"
          />
          <span className="text-sm text-gray-500 line-clamp-1">
            {room.hotel.address}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-6">
          <p className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900">
              ${room.pricePerNight}
            </span>
            <span className="text-xs text-gray-400">/night</span>
          </p>
          <button className="px-5 py-2 text-sm font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:scale-95 transition-all cursor-pointer">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
