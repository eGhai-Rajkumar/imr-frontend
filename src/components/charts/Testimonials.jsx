import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const MOCK_TESTIMONIALS = [
  {
    id: 1,
    name: "Sahil Bhardwaj",
    location: "New Delhi, India",
    trip: "Manali Expedition",
    rating: 5,
    review: "We had a wonderful trip to Manali, and it was truly a memorable experience. We stayed there for four days, and every moment was pleasant and well-spent. The arrangements were excellent—comfortable stay & smooth logistics.",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    name: "Vansh Pratap",
    location: "Mumbai, India",
    trip: "Family Holiday in Shimla",
    rating: 5,
    review: "I had a wonderful time with the team of Indian Mountain Rovers. Comfortable, smooth, and beautifully planned. Will travel again soon!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 3,
    name: "Abhishek Gupta",
    location: "Bangalore, India",
    trip: "Jibhi & Tirthan Valley",
    rating: 5,
    review: "Amazing experience in Jibhi & Manali. Perfectly curated itinerary. Professional team. Highly recommended for anyone looking to explore the hidden gems of Himachal.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTestimonial = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_TESTIMONIALS.length);
      setIsAnimating(false);
    }, 500);
  }, [isAnimating]);

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? MOCK_TESTIMONIALS.length - 1 : prev - 1));
      setIsAnimating(false);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 8000);
    return () => clearInterval(interval);
  }, [nextTestimonial]);

  const current = MOCK_TESTIMONIALS[currentIndex];

  return (
    <section className="relative py-24 bg-primary overflow-hidden">
      {/* Background Image / Texture */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-primary/80"></div>

      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-2 text-accent/80 font-bold tracking-widest uppercase text-xs mb-4">
              <span className="w-8 h-px bg-accent/50"></span>
              <span>Guest Diaries</span>
              <span className="w-8 h-px bg-accent/50"></span>
            </div>
            <Quote className="w-12 h-12 text-accent mx-auto mb-6 opacity-80" />
          </div>

          {/* Testimonial Content */}
          <div className={`transition-all duration-500 transform ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-white italic leading-relaxed mb-10">
              "{current.review}"
            </h2>

            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full border-2 border-accent p-1 mb-4">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Author Info */}
              <h3 className="text-xl font-bold text-white mb-1">{current.name}</h3>
              <p className="text-accent text-sm uppercase tracking-wide font-medium mb-4">{current.trip}</p>

              {/* Rating */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < current.rating ? "text-accent fill-accent" : "text-gray-500"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {MOCK_TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (isAnimating) return;
                    setIsAnimating(true);
                    setTimeout(() => {
                      setCurrentIndex(idx);
                      setIsAnimating(false);
                    }, 500);
                  }}
                  className={`transition-all duration-300 rounded-full h-2 ${idx === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
