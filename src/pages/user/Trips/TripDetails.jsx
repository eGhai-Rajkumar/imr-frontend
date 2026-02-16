import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import TripHero from "../../../components/trips/TripHero";
import TripOverview from "../../../components/trips/TripOverview";
import TripTab from "../../../components/trips/TripTab";
import RelatedTrips from "../../../components/trips/RelatedTrips";
import Blog from "../../../components/charts/BlogComponent";
import FAQ from "../../../components/charts/FAQ";
import TripInquiryModal from "../../../components/forms/CustomizedTripForm";

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";

const TripDetails = () => {
  const { id, slug } = useParams();
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [tripData, setTripData] = useState(null);

  console.log("TripDetails → Route Params:", { slug, id });

  // Fetch trip data for the modal and SEO
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`${API_URL}/trips/${id}`, {
          headers: { "x-api-key": API_KEY }
        });
        if (response.ok) {
          const data = await response.json();
          setTripData(data.data || data);
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    if (id) {
      fetchTripData();
    }
  }, [id]);

  // Generate SEO-friendly page title and description
  const pageTitle = tripData?.meta_title || tripData?.title || "Trip Details";
  const pageDescription = tripData?.meta_description || tripData?.overview || "Discover amazing travel experiences";
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={tripData?.meta_tags || tripData?.title || ""} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {tripData?.hero_image && <meta property="og:image" content={tripData.hero_image} />}
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={pageUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        {tripData?.hero_image && <meta property="twitter:image" content={tripData.hero_image} />}
        
        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      <div className="trip-container">
        {/* HERO IMAGE SECTION */}
        <TripHero tripId={id} />

        {/* OVERVIEW / DETAILS */}
        <TripOverview tripId={id} />

        {/* ITINERARY & OTHER TABS */}
        <TripTab tripId={id} />

        {/* RELATED TRIPS */}
        <RelatedTrips currentTripId={id} />

        {/* FAQ SECTION */}
        <FAQ tripId={id} />

        {/* BLOG SECTION (temporarily hidden) */}
        {false && <Blog currentTripId={id} />}

        {/* TRIP INQUIRY MODAL */}
        <TripInquiryModal
          isOpen={showInquiryModal}
          onClose={() => setShowInquiryModal(false)}
          tripName={tripData?.title || tripData?.name || "This Trip"}
          availableDates={tripData?.available_dates || tripData?.departure_dates || []}
        />

        {/* Floating Book Now Button */}
        <button
          onClick={() => setShowInquiryModal(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <span>Enquire Now</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default TripDetails;