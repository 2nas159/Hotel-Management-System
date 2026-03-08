import React from "react";
import Title from "../ui/Title";
import { assets } from "../../assets/assets";

const NewsLetter = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24">
      <div className="flex flex-col items-center max-w-6xl w-full rounded-3xl px-6 py-12 md:py-20 lg:py-24 mx-auto my-16 md:my-24 bg-gray-900 text-white shadow-2xl overflow-hidden relative">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <Title
          title="Stay Inspired"
          subTitle="Subscribe to our newsletter for exclusive deals, travel tips, and new destination alerts."
        />

        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 mt-10 w-full max-w-md">
          <input
            type="email"
            className="bg-white/10 px-5 py-3.5 border border-white/20 rounded-xl outline-none w-full focus:bg-white/20 focus:border-white/40 transition-all text-sm md:text-base"
            placeholder="Enter your email"
          />
          <button className="flex items-center justify-center gap-2 group bg-white text-gray-900 px-8 py-3.5 rounded-xl font-bold active:scale-95 transition-all whitespace-nowrap hover:bg-gray-100 cursor-pointer shadow-lg shadow-black/20">
            Subscribe
            <img
              src={assets.arrowIcon}
              alt="arrow-icon"
              className="w-4 group-hover:translate-x-1 transition-all"
            />
          </button>
        </div>
        <p className="text-gray-400 mt-8 text-xs text-center max-w-sm leading-relaxed">
          By subscribing, you agree to our{" "}
          <a href="#" className="underline hover:text-white transition-colors">
            Privacy Policy
          </a>{" "}
          and consent to receive marketing updates.
        </p>
      </div>
    </div>
  );
};

export default NewsLetter;
