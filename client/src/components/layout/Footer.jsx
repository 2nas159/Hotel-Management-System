import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="bg-[#F6F9FC] text-gray-500/80 pt-16 pb-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <div className="max-w-xs">
          <img
            src={assets.logo}
            alt="logo"
            className="mb-6 h-8 md:h-9 invert opacity-80"
          />
          <p className="text-sm leading-relaxed">
            Experience the pinnacle of hospitality. From urban sanctuaries to
            remote island paradises, we connect you with the world's most
            extraordinary stays.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <a href="#" className="hover:opacity-100 transition-opacity">
              <img src={assets.instagramIcon} alt="instagram" className="w-5" />
            </a>
            <a href="#" className="hover:opacity-100 transition-opacity">
              <img src={assets.facebookIcon} alt="facebook" className="w-5" />
            </a>
            <a href="#" className="hover:opacity-100 transition-opacity">
              <img src={assets.twitterIcon} alt="twitter" className="w-5" />
            </a>
            <a href="#" className="hover:opacity-100 transition-opacity">
              <img src={assets.linkendinIcon} alt="linkedin" className="w-5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-playfair text-lg font-bold text-gray-900 tracking-wide">
            StayX
          </p>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <a href="#" className="hover:text-black transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Press Release
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Latest Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Our Partners
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-playfair text-lg font-bold text-gray-900 tracking-wide">
            Support
          </p>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Safety Hub
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Cancellation Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Contact Support
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition-colors">
                Accessibility
              </a>
            </li>
          </ul>
        </div>

        <div className="max-w-xs">
          <p className="font-playfair text-lg font-bold text-gray-900 tracking-wide">
            Stay Updated
          </p>
          <p className="mt-4 text-sm leading-relaxed">
            Join our mailing list for exclusive luxury travel inspiration and
            member-only offers.
          </p>
          <div className="flex items-center mt-6 group">
            <input
              type="text"
              className="bg-white rounded-l-lg border border-gray-300 h-11 px-4 w-full outline-none focus:border-black transition-colors text-sm"
              placeholder="Your email address"
            />
            <button className="flex items-center justify-center bg-black text-white h-11 px-4 rounded-r-lg hover:bg-gray-800 transition-all cursor-pointer">
              <img
                className="w-4 invert"
                src={assets.arrowIcon}
                alt="arrow-icon"
              />
            </button>
          </div>
        </div>
      </div>

      <hr className="border-gray-200 mt-16" />

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between py-8">
        <p className="text-xs tracking-wide uppercase font-medium">
          © {new Date().getFullYear()} QuickStay. All rights reserved.
        </p>
        <ul className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider">
          <li>
            <a href="#" className="hover:text-black transition-colors">
              Privacy
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-black transition-colors">
              Terms
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-black transition-colors">
              Sitemap
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
