import React from 'react';
import HeroSection from '../../../components/home/HeroSection';
import TravelStyle from '../../../components/home/TravelStyle';
import TrendingDestination from '../../../components/home/TrendingDestination';
import PromoBanner from '../../../components/charts/PromotionalBanner';
import FeaturedTrips from '../../../components/home/FeaturedTrips';
import FixedDeparture from '../../../components/home/FixedDeparture';
import CustomizedDeparture from '../../../components/home/CustomizedDeparture';
import LeadGeneration from '../../../components/forms/LeadGeneration';
import AboutUs from '../../../components/charts/AboutUs';
import ComanyHighlights from '../../../components/charts/ComanyHighlights';
import Testimonials from '../../../components/charts/Testimonials';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <TravelStyle />
      <TrendingDestination />
      <PromoBanner />
      <FeaturedTrips />
      <FixedDeparture />
      <CustomizedDeparture />
      <LeadGeneration />
      <AboutUs />
      <ComanyHighlights />
      <Testimonials />
    </div>
  );
};

export default Home;