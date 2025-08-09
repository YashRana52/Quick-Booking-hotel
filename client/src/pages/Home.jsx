import React from "react";
import Hero from "../components/Hero";
import FeatureDestination from "../components/FeatureDestination";
import ExclusiveOffers from "../components/ExclusiveOffers";
import Testimonial from "../components/Testimonial";
import NewsLatter from "../components/NewsLatter";
import RecommendedHotels from "../components/RecommendedHotels";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Hero />
      <RecommendedHotels />
      <FeatureDestination />
      <ExclusiveOffers />
      <Testimonial />
      <NewsLatter />
      <Footer />
    </>
  );
}

export default Home;
