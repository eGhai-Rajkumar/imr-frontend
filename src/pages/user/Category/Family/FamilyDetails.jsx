import React, { useEffect, useState } from 'react';
import DestinationHero from '../../../../components/destinations/DestinationHero';
import TripOverview from '../../../../components/trips/TripOverview'; // Import TripOverview
import FAQ from '../../../../components/charts/FAQ';
import Form from '../../../../components/forms/LeadGeneration';
import Banner from '../../../../components/charts/PromotionalBanner';
import Related from '../../../../components/destinations/RelatedTrips';
import Honeymoon from '../../../../components/trips/CtripTab'
import { useLocation, useNavigate } from 'react-router-dom';

const Destinations = () => {
  const [tripId, setTripId] = useState('jibhi');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get tripId from URL query parameters
    const params = new URLSearchParams(location.search);
    const id = params.get('tripId');

    console.log('URL tripId:', id); // For debugging

    if (id) {
      setTripId(id);
    }
  }, [location.search]);

  // Listen for URL changes (when user navigates)
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('tripId');
      if (id) {
        setTripId(id);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  return (
    <div>
      <DestinationHero tripId={tripId} />
      <TripOverview tripId={tripId} /> {/* Pass tripId here */}
        <Honeymoon tripId={tripId} />
      <Related />
      <Banner />
      <Form />
      <FAQ />
    </div>
  );
};

export default Destinations;