import React, { useEffect, useState, useRef } from "react";
import TripCard from "../../components/trips/TripCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";

const DestCategory = ({ currentDestinationId }) => {
  const [destinationData, setDestinationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollRefs = useRef({});
  const scrollStep = 340; // card width (w-80) + gap

  useEffect(() => {
    if (!currentDestinationId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Fetching destination ID:", currentDestinationId);

        const response = await fetch(
          `${API_URL}/destinations/${currentDestinationId}/`,
          { headers: { "x-api-key": API_KEY } }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();
        setDestinationData(json.data || json);
      } catch (err) {
        console.error("🚨 Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDestinationId]);

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
  const scrollCarousel = (pkgIndex, direction) => {
    const container = scrollRefs.current[pkgIndex];
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
      <div className="py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 mt-4">Loading...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  // Empty state
  if (!destinationData) {
    return null;
  }

  const customPackages = destinationData.custom_packages || [];

  if (customPackages.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">
          No custom packages found for this destination.
        </p>
      </div>
    );
  }

  // Main render
  return (
    <div className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {customPackages.map((pkg, index) => (
          <div
            key={index}
            className={`pt-10 ${index > 0 ? "border-t border-gray-200 mt-10" : ""}`}
          >
            {/* Header and controls */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-extrabold text-blue-900">
                  {pkg.title || "Untitled Package"}
                </h3>

                {Array.isArray(pkg.trips) && pkg.trips.length > 3 && (
                  <div className="hidden sm:flex space-x-3">
                    <button
                      onClick={() => scrollCarousel(index, "left")}
                      className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors shadow-md"
                      aria-label={`Scroll Left ${pkg.title}`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => scrollCarousel(index, "right")}
                      className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors shadow-md"
                      aria-label={`Scroll Right ${pkg.title}`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {pkg.description && (
                <p className="text-gray-600 mb-6">{pkg.description}</p>
              )}

              {/* Trip cards */}
              {Array.isArray(pkg.trips) && pkg.trips.length > 0 ? (
                <div
                  ref={(el) => (scrollRefs.current[index] = el)}
                  className="flex overflow-x-scroll pb-4 space-x-6 custom-scrollbar-hide"
                >
                  {pkg.trips.map((trip) => {
                    const processedTrip = getProcessedTripData(trip);
                    return (
                      <div
                        key={processedTrip.id || processedTrip._id}
                        className="w-80 flex-shrink-0"
                      >
                        <TripCard trip={processedTrip} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No trips found for this package.
                </p>
              )}
            </div>
          </div>
        ))}
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

export default DestCategory;