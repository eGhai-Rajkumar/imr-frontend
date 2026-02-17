// ... (imports remain the same)
import React, { useEffect, useState, useRef } from "react";
import TripCard from "../trips/TripCard";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react"; // Updated icons

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

// Helper function to get full image URL
const getFullImageUrl = (path) => {
  if (!path || typeof path !== "string") return "";
  return path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;
};

const PopularTrips = ({ destinationData }) => {
  const [popularTrips, setPopularTrips] = useState([]);
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View More State
  const [viewAllFeatured, setViewAllFeatured] = useState(false);
  const [viewAllPopular, setViewAllPopular] = useState(false);

  // Fetch featured trips for this destination
  useEffect(() => {
    if (destinationData?.id) {
      fetchFeaturedTrips();
    }
  }, [destinationData?.id]);

  const fetchFeaturedTrips = async () => {
    try {
      const response = await fetch(
        `${API_URL}/trips/?feature_trip_type=Destination Page&destination_id=${destinationData.id}`,
        { headers: { "x-api-key": API_KEY } }
      );
      if (!response.ok) throw new Error("Failed to fetch featured trips");
      const data = await response.json();

      if (data.success && data.data) {
        const sortedTrips = [...data.data].sort((a, b) => (a.display_order || 999) - (b.display_order || 999));
        setFeaturedTrips(sortedTrips);
      } else {
        setFeaturedTrips([]);
      }
    } catch (err) {
      console.error("Error fetching featured trips:", err);
      setFeaturedTrips([]);
    }
  };

  // Process popular trips
  useEffect(() => {
    const popularTripsFromAPI = destinationData?.popular_trips || [];
    if (popularTripsFromAPI.length === 0) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setPopularTrips(popularTripsFromAPI);
    } catch (err) {
      console.error("Error processing popular trips:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [destinationData]);

  // Process pricing logic and image URLs
  const getProcessedTripData = (trip) => {
    const fixedPrice = trip.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.final_price;
    const customPrice = trip.pricing?.customized?.final_price;
    let finalPrice = (fixedPrice > 0 ? fixedPrice : (customPrice > 0 ? customPrice : 0));
    const finalPriceDisplay = finalPrice > 0 ? finalPrice.toLocaleString("en-IN") : "N/A";

    // Process images
    const heroImage = getFullImageUrl(trip.hero_image);
    let galleryImages = [];
    if (Array.isArray(trip.gallery_images)) {
      galleryImages = trip.gallery_images.map(getFullImageUrl);
    } else if (typeof trip.gallery_images === 'string' && trip.gallery_images) {
      galleryImages = trip.gallery_images.split(',').map(img => getFullImageUrl(img.trim()));
    }

    return { ...trip, hero_image: heroImage, gallery_images: galleryImages, final_price_display: finalPriceDisplay };
  };

  const destinationName = destinationData?.title || destinationData?.name || "Destination";

  // Grid Render Helper
  const renderGrid = (trips, viewAll, setViewAll, title) => {
    const visibleTrips = viewAll ? trips : trips.slice(0, 4);

    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-black text-[#2C6B4F] mb-3">{title}</h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleTrips.map((trip) => (
              <div key={trip.id || trip._id} className="h-full">
                <TripCard trip={getProcessedTripData(trip)} />
              </div>
            ))}
          </div>

          {trips.length > 4 && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setViewAll(!viewAll)}
                className="group flex items-center gap-2 px-8 py-3 bg-white border-2 border-[#D4AF37] text-[#2C6B4F] hover:bg-[#2C6B4F] hover:text-white hover:border-[#2C6B4F] rounded-full font-bold transition-all duration-300 shadow-md"
              >
                {viewAll ? "Show Less" : "Show More"}
                {viewAll ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Featured Trips Section */}
      {featuredTrips.length > 0 && renderGrid(featuredTrips, viewAllFeatured, setViewAllFeatured, `Featured ${destinationName} Trips`)}

      {/* Popular Trips Section */}
      {!loading && !error && popularTrips.length > 0 && renderGrid(popularTrips, viewAllPopular, setViewAllPopular, "Popular Trip Packages")}

      {/* Loading & Error States */}
      {loading && (
        <div className="py-16 bg-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C6B4F]"></div>
          <p className="text-gray-500 mt-4">Loading trips...</p>
        </div>
      )}
      {error && <div className="py-12 text-center text-red-600">Error: {error}</div>}
    </>
  );
};

export default PopularTrips;