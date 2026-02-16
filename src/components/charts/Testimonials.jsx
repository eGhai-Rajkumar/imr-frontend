import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const MOCK_TESTIMONIALS = [
  {
    id: 1,
    name: "Sahil Bhardwaj",
    avatar: "",
    trip: "Manali Trip",
    rating: 5,
    review: `We had a wonderful trip to Manali, and it was truly a memorable experience.
We stayed there for four days, and every moment was pleasant and well-spent.
The arrangements were excellent—comfortable stay & smooth logistics.`,
  },
  {
    id: 2,
    name: "Vansh Pratap",
    avatar: "",
    trip: "Family Holiday",
    rating: 5,
    review: `I had a wonderful time with the team of Holidays Planners.
Comfortable, smooth, and beautifully planned. Will travel again soon!`,
  },
  {
    id: 3,
    name: "Abhishek Gupta",
    avatar: "",
    trip: "Jibhi & Manali",
    rating: 5,
    review: `Amazing experience in Jibhi & Manali.
Perfectly curated itinerary. Professional team. Highly recommended!`,
  },
];

// ⭐ UPDATED WITH CONDITION
const TravelTestimonialCard = ({ name, avatar, trip, rating, review }) => {
  const initials = name.charAt(0).toUpperCase();
  const [isExpanded, setIsExpanded] = useState(false);

  const previewLength = 200; // You can adjust this
  const needsReadMore = review.length > previewLength;

  return (
    <div className="min-w-full px-4 md:px-8">
      <div className="
        bg-white rounded-3xl p-8 shadow-xl border border-gray-100
        transition-all duration-300
        hover:bg-blue-50 hover:border-blue-200 hover:shadow-2xl
      ">

        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-300 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover rounded-full" />
            ) : (
              initials
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              {trip}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>

        {/* Review Text */}
        <p
          className={`
            text-gray-700 text-[15px] leading-relaxed mb-3 whitespace-pre-line transition-all duration-300
            ${!isExpanded ? "line-clamp-2" : ""}
          `}
        >
          {review}
        </p>

        {/* Read More ONLY when needed */}
        {needsReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 font-medium hover:text-blue-800 text-sm"
          >
            {isExpanded ? "← Show Less" : "Read More →"}
          </button>
        )}
      </div>
    </div>
  );
};

export default function TravellerTestimonials() {
  const reviews = MOCK_TESTIMONIALS;
  const reviewsCount = reviews.length;
  const infiniteReviews = [...reviews, ...reviews];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      if (currentSlide === reviewsCount) setCurrentSlide(0);
      else if (currentSlide === -1) setCurrentSlide(reviewsCount - 1);
    }, 700);

    return () => clearTimeout(timer);
  }, [currentSlide, isTransitioning, reviewsCount]);

  const handleSlideChange = (i) => {
    setIsTransitioning(true);
    setCurrentSlide(i);
  };

  const nextSlide = () => handleSlideChange(currentSlide + 1);
  const prevSlide = () => handleSlideChange(currentSlide - 1);

  const autoPlayNext = useCallback(() => {
    if (!isTransitioning) nextSlide();
  }, [isTransitioning]);

  useEffect(() => {
    const interval = setInterval(autoPlayNext, 6000);
    return () => clearInterval(interval);
  }, [autoPlayNext]);

  const dotIndex =
    currentSlide === -1 ? reviewsCount - 1 : currentSlide % reviewsCount;

  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-blue-50 py-20 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Traveller Stories That Inspire <span className="inline-block animate-bounce">😊</span>
          </h2>
          <p className="text-gray-600 text-lg mt-2">Real journeys. Real memories.</p>
        </div>

        <div className="relative">
          <div className="flex items-center">

            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-4 shadow-md hover:shadow-lg"
            >
              <ChevronLeft className="w-6 h-6 text-blue-600" />
            </button>

            {/* Viewport */}
            <div className="overflow-hidden w-full rounded-2xl">
              <div
                className="flex items-start"
                style={{
                  width: `${infiniteReviews.length * 100}%`,
                  transform: `translateX(-${currentSlide * 100}%)`,
                  transition: isTransitioning ? "transform 0.7s ease-in-out" : "none",
                }}
              >
                {infiniteReviews.map((item, i) => (
                  <TravelTestimonialCard key={i} {...item} />
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-4 shadow-md hover:shadow-lg"
            >
              <ChevronRight className="w-6 h-6 text-blue-600" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-10 space-x-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSlideChange(i)}
                className={`h-2 rounded-full ${
                  i === dotIndex ? "w-8 bg-blue-600" : "w-3 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
