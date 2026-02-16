import React, { useEffect, useState, useRef } from "react";
import TripCard from "../trips/TripCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";

const CategoryFeaturedTrips = ({ categoryId, categoryName }) => {
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const scrollRef = useRef(null);
  const scrollStep = 340; // card width (w-80) + gap

  useEffect(() => {
    if (categoryId) {
      fetchFeaturedTrips();
    }
  }, [categoryId]);

  const fetchFeaturedTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch trips with feature_trip_type=Category Page AND matching category_id
      const response = await fetch(
        `${API_URL}/trips/?feature_trip_type=Category Page&category_ids=${categoryId}`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch featured trips");
      }

      const data = await response.json();

      if (data.success && data.data) {
        // Sort by display_order (ascending - lower numbers first)
        const sortedTrips = [...data.data].sort((a, b) => {
          const orderA = a.display_order || 999;
          const orderB = b.display_order || 999;
          return orderA - orderB;
        });

        setFeaturedTrips(sortedTrips);
      } else {
        setFeaturedTrips([]);
      }
    } catch (err) {
      console.error("Error fetching category featured trips:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Process pricing logic
  const getProcessedTripData = (trip) => {
    const fixedPrice =
      trip.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.final_price;
    const customPrice = trip.pricing?.customized?.final_price;

    let finalPrice;
    let discountAmount = 0;

    if (fixedPrice !== undefined && fixedPrice !== null && fixedPrice > 0) {
      finalPrice = fixedPrice;
      discountAmount =
        trip.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.discount || 0;
    } else if (customPrice !== undefined && customPrice !== null && customPrice > 0) {
      finalPrice = customPrice;
      discountAmount = trip.pricing?.customized?.discount || 0;
    } else {
      finalPrice = 0;
    }

    const finalPriceDisplay =
      finalPrice > 0 ? finalPrice.toLocaleString("en-IN") : "N/A";

    return {
      ...trip,
      final_price_display: finalPriceDisplay,
      discount: discountAmount,
    };
  };

  // Scroll navigation
  const scrollCarousel = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const currentScroll = container.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollStep
          : currentScroll + scrollStep;
      container.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-4">Loading featured trips...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">Error loading featured trips: {error}</p>
        </div>
      </div>
    );
  }

  // Empty state - don't show section if no featured trips
  if (!featuredTrips || featuredTrips.length === 0) {
    return null;
  }

  // Main render
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-4xl font-extrabold text-blue-900 mb-2">
                Featured {categoryName} Trips
              </h2>
              <p className="text-gray-600">
                Top picks for your perfect {categoryName.toLowerCase()} experience
              </p>
            </div>

            {/* Scroll Controls - Show only if more than 3 trips */}
            {featuredTrips.length > 3 && (
              <div className="hidden sm:flex space-x-3">
                <button
                  onClick={() => scrollCarousel("left")}
                  className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors shadow-md"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors shadow-md"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Trip Cards Carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll pb-4 space-x-6 custom-scrollbar-hide"
        >
          {featuredTrips.map((trip) => {
            const processedTrip = getProcessedTripData(trip);
            return (
              <div
                key={processedTrip.id}
                className="w-80 flex-shrink-0"
              >
                <TripCard trip={processedTrip} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Scrollbar Hide */}
      <style jsx>{`
        .custom-scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryFeaturedTrips;