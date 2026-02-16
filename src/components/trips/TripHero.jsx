import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const BASE_URL = "https://api.yaadigo.com/secure/api/trips/";

const TripHero = ({ tripId }) => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch hero + gallery images
  useEffect(() => {
    if (!tripId) return;

    const fetchTripImages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}${tripId}/`, {
          headers: { "x-api-key": API_KEY },
        });

        console.log("TripHero → API Response:", res.data);

        const trip = res.data.data || res.data;
        const hero = trip.hero_image ? [trip.hero_image] : [];
        const gallery = Array.isArray(trip.gallery_images)
          ? trip.gallery_images
          : [];

        setImages([...hero, ...gallery]);
      } catch (error) {
        console.error("TripHero fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripImages();
  }, [tripId]);

  // 🔹 Auto slideshow
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 600);
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);

  // 🔹 Manual controls
  const goToImage = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  const goToPrevious = () => {
    if (!images.length) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
      setIsTransitioning(false);
    }, 300);
  };

  const goToNext = () => {
    if (!images.length) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 300);
  };

  // 🔹 Loading / fallback
  if (loading) {
    return (
      <div className="relative w-full h-[600px] flex items-center justify-center bg-gray-100 text-gray-500">
        Loading images...
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="relative w-full h-[600px] flex items-center justify-center bg-gray-100 text-gray-500">
        No hero image uploaded
      </div>
    );
  }

  // 🔹 Render hero
  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={images[currentImageIndex]}
          alt="Trip Hero"
          className={`w-full h-full object-cover transition-all duration-700 ${
            isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        />
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      >
        <svg
          className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      >
        <svg
          className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`transition-all duration-300 rounded-full ${
              currentImageIndex === index
                ? "w-8 md:w-12 h-2 md:h-3 bg-white shadow-lg"
                : "w-2 md:w-3 h-2 md:h-3 bg-white/50 hover:bg-white/80 hover:scale-125"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TripHero;
