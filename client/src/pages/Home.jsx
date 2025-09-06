import React from "react";
import Hero from "../components/ui/Hero";
import FeaturedDestination from "../components/ui/FeaturedDestination";
import ExclusiveOffers from "../components/ui/ExclusiveOffers";
import Testimonial from "../components/ui/Testimonial";
import NewsLetter from "../components/ui/NewsLetter";
import RecommendedHotels from "../components/ui/RecommendedHotels";

const Home = () => {
  return (
    <>
      <Hero />
      <RecommendedHotels />
      <FeaturedDestination />
      <ExclusiveOffers />
      <Testimonial />
      <NewsLetter />
    </>
  );
};

export default Home;
