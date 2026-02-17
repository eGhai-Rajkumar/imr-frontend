import React, { useEffect, useState, useRef } from "react";
import TripCard from "../trips/TripCard";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";

const FeaturedTrips = () => {
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);
  const scrollStep = 340; // card width + gap

  useEffect(() => {
    fetchFeaturedTrips();
  }, []);

  const fetchFeaturedTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/trips/?feature_trip_type=Homepage`,
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
      console.error("Error fetching featured trips:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProcessedTripData = (trip) => {
    // ... existing pricing logic ...
    const fixedPrice = trip.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.final_price;
    const customPrice = trip.pricing?.customized?.final_price;

    let finalPrice = 0;
    let discountAmount = 0;

    if (fixedPrice && fixedPrice > 0) {
      finalPrice = fixedPrice;
      discountAmount = trip.pricing?.fixed_departure?.[0]?.costingPackages?.[0]?.discount || 0;
    } else if (customPrice && customPrice > 0) {
      finalPrice = customPrice;
      discountAmount = trip.pricing?.customized?.discount || 0;
    }

    return {
      ...trip,
      final_price_display: finalPrice > 0 ? finalPrice.toLocaleString("en-IN") : "N/A",
      discount: discountAmount,
    };
  };

  const scrollCarousel = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const currentScroll = container.scrollLeft;
      const newScroll = direction === "left" ? currentScroll - scrollStep : currentScroll + scrollStep;
      container.scrollTo({ left: newScroll, behavior: "smooth" });
    }
  };

  if (loading) return null; // Minimal loading state for smoother UX
  if (!featuredTrips || featuredTrips.length === 0) return null;

  return (
    <div className="py-24 bg-surface relative overflow-hidden">
      {/* Decorative background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3">
              <Sparkles className="h-4 w-4" />
              <span>Handpicked Collections</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-dark mb-4 leading-tight">
              Featured Adventures
            </h2>
            <p className="text-gray-600 text-lg font-light">
              Explore our most sought-after journeys, curated to deliver unforgettable memories in the heart of nature.
            </p>
          </div>

          {/* Scroll Controls */}
          {featuredTrips.length > 3 && (
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => scrollCarousel("left")}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Trip Cards Carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto pb-12 gap-8 custom-scrollbar-hide snap-x snap-mandatory px-4 md:px-0"
          style={{ scrollBehavior: 'smooth' }}
        >
          {featuredTrips.map((trip) => {
            const processedTrip = getProcessedTripData(trip);
            return (
              <div
                key={processedTrip._id || processedTrip.id}
                className="w-80 md:w-96 flex-shrink-0 snap-center"
              >
                <TripCard trip={processedTrip} />
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default FeaturedTrips;