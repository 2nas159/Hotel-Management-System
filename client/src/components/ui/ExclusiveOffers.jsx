import React from "react";
import { assets, exclusiveOffers } from "../../assets/assets";
import Title from "../ui/Title";

const ExclusiveOffers = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 py-16 md:py-24">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-6">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle="Unlock special deals and discounts on our most sought-after properties."
        />
        <button className="group flex items-center gap-2 font-medium cursor-pointer shrink-0">
          View All Offers
          <img
            src={assets.arrowIcon}
            alt="arrow-icon"
            className="group-hover:translate-x-1 transition-all"
          />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 md:mt-16 w-full">
        {exclusiveOffers.map((item) => (
          <div
            key={item._id}
            className="group relative flex flex-col items-start justify-between gap-1 pt-24 sm:pt-18 px-6 pb-6 rounded-2xl text-white bg-no-repeat bg-cover bg-center min-h-[320px] shadow-md border border-white/10"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1)), url(${item.image})`,
            }}
          >
            <p className="px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-bold rounded-full shadow-sm">
              {item.priceOff}% OFF
            </p>
            <div className="mt-auto">
              <p className="text-2xl font-semibold font-playfair leading-tight">
                {item.title}
              </p>
              <p className="text-sm text-white/90 mt-1 line-clamp-2">
                {item.description}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-white/60 mt-4">
                Valid until {item.expiryDate}
              </p>
            </div>
            <button className="flex items-center gap-2 text-sm font-semibold cursor-pointer mt-5 hover:gap-3 transition-all">
              Claim Offers
              <img
                src={assets.arrowIcon}
                alt="arrow-icon"
                className="w-3 invert group-hover:translate-x-1 transition-all"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveOffers;
