import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TripCard from "../../../components/trips/TripCard";
import CategoryFeaturedTrips from "../../../components/categories/CategoryFeaturedTrips.jsx";

const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const API_URL = "https://api.yaadigo.com/secure/api/";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

const getFullImageUrl = (path) =>
  !path || typeof path !== "string"
    ? ""
    : path.startsWith("http")
    ? path
    : `${IMAGE_BASE_URL}${path}`;

const CategoryPreview = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [categoryData, setCategoryData] = useState({});
  const [trips, setTrips] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Helper function to transform trip data to match TripCard expectations
  const transformTripData = (trip) => {
    // Extract price based on pricing model
    let finalPrice = null;
    let discount = 0;

    if (trip.pricing_model === 'customized' || trip.pricing_model === 'custom' || trip.is_custom) {
      finalPrice = trip.pricing?.customized?.final_price || 
                   trip.pricing?.customized?.base_price || 
                   trip.base_price || 
                   trip.price;
      
      const basePrice = trip.pricing?.customized?.base_price || 0;
      if (basePrice > 0 && finalPrice > 0) {
        discount = basePrice - finalPrice;
      }
    } else if (trip.pricing_model === 'fixed_departure') {
      const departures = trip.pricing?.fixed_departure || [];
      if (departures.length > 0) {
        finalPrice = departures[0]?.final_price || departures[0]?.price;
        const originalPrice = departures[0]?.price || 0;
        if (originalPrice > finalPrice) {
          discount = originalPrice - finalPrice;
        }
      }
    } else {
      finalPrice = trip.price || trip.base_price;
    }

    // Format price for display
    const final_price_display = finalPrice 
      ? Number(finalPrice).toLocaleString('en-IN')
      : 'N/A';

    // Extract duration
    const duration = trip.duration || trip.total_days || 0;
    const days = duration;
    const nights = duration > 0 ? duration - 1 : 0;

    // Return transformed trip object
    return {
      ...trip,
      final_price_display,
      discount: discount > 0 ? discount : 0,
      days,
      nights,
      destination_type: trip.destination || trip.location || trip.pickup_location,
      _id: trip.id,
      slug: trip.slug || trip.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
  };

  const fetchCategoryDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}categories/${id}`, {
        headers: { "x-api-key": API_KEY },
      });
      if (res.data?.success) {
        const data = res.data.data;
        setCategoryData(data);
        const fullUrls = Array.isArray(data.image)
          ? data.image.map(getFullImageUrl)
          : [];
        setImages(fullUrls);
      }
    } catch (err) {
      console.error("Category Details Fetch Error:", err);
      setError("Failed to load category details.");
    }
  };

  const fetchTripsByCategory = async () => {
    try {
      const res = await axios.get(`${API_URL}categories/trip_details/${id}`, {
        headers: { "x-api-key": API_KEY },
      });
      
      // Transform trips data to match TripCard expectations
      const rawTrips = res.data?.data || [];
      const transformedTrips = rawTrips.map(transformTripData);
      
      setTrips(transformedTrips);
    } catch (err) {
      console.error("Trips Fetch Error:", err);
      setError("Failed to load trips.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchCategoryDetails();
      fetchTripsByCategory();
    }
  }, [id]);

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
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    if (!images.length) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
      setIsTransitioning(false);
    }, 300);
  }, [images.length]);

  const goToNext = useCallback(() => {
    if (!images.length) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 300);
  }, [images.length]);

  const goToImage = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  if (isLoading)
    return <p className="text-center text-lg py-20">Loading category...</p>;

  if (error)
    return <p className="text-center text-red-500 py-20">{error}</p>;

  return (
    <div className="category-preview">
      {/* --- Hero Section --- */}
      {images.length > 0 && (
        <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-black">
          <img
            src={images[currentImageIndex]}
            alt={`Category Hero - ${categoryData.name}`}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center max-w-4xl text-white">
              <h3 className="text-4xl sm:text-6xl font-extrabold mb-3">
                {categoryData.name}
              </h3>
              <p className="text-white/90 text-lg sm:text-xl font-light">
                {categoryData.description}
              </p>
            </div>
          </div>
          {/* Navigation */}
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 w-12 h-12 rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 w-12 h-12 rounded-full flex items-center justify-center"
          >
            <ChevronRight className="text-white" />
          </button>
          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`transition-all rounded-full ${
                  currentImageIndex === index
                    ? "w-6 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* --- Featured Trips Section --- */}
      <CategoryFeaturedTrips 
        categoryId={id} 
        categoryName={categoryData.name || "Category"} 
      />

      {/* --- All Trip List --- */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Explore All {categoryData.name} Packages
        </h2>

        {trips.length === 0 ? (
          <p className="text-center text-gray-500">
            No trips available for this category.
          </p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPreview;