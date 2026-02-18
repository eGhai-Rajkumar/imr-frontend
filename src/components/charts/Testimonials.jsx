import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, MapPin } from "lucide-react";

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
    }, 400);
  }, [isAnimating]);

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? MOCK_TESTIMONIALS.length - 1 : prev - 1));
      setIsAnimating(false);
    }, 400);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 8000);
    return () => clearInterval(interval);
  }, [nextTestimonial]);

  const current = MOCK_TESTIMONIALS[currentIndex];

  return (
    <section className="relative py-20 bg-[#1F4D39] overflow-hidden">
      {/* Subtle mountain texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-8"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1F4D39]/95 via-[#2C6B4F]/90 to-[#1F4D39]/95" />

      {/* Gold glow blob */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Section label */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="w-10 h-px bg-[#D4AF37]/60" />
          <span className="text-[#D4AF37] text-xs font-bold tracking-[0.25em] uppercase">Guest Diaries</span>
          <span className="w-10 h-px bg-[#D4AF37]/60" />
        </div>

        {/* Cards row — show all 3, highlight current */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {MOCK_TESTIMONIALS.map((t, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={t.id}
                onClick={() => {
                  if (isAnimating || idx === currentIndex) return;
                  setIsAnimating(true);
                  setTimeout(() => { setCurrentIndex(idx); setIsAnimating(false); }, 400);
                }}
                className="text-left w-full focus:outline-none"
              >
                <div
                  className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-500 cursor-pointer"
                  style={{
                    background: isActive
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(255,255,255,0.04)",
                    border: isActive
                      ? "1px solid rgba(212,175,55,0.5)"
                      : "1px solid rgba(255,255,255,0.08)",
                    transform: isActive ? "translateY(-4px)" : "translateY(0)",
                    boxShadow: isActive
                      ? "0 16px 40px rgba(0,0,0,0.25)"
                      : "none",
                  }}
                >
                  {/* Quote icon */}
                  <Quote
                    className="w-6 h-6 flex-shrink-0"
                    style={{ color: isActive ? "#D4AF37" : "rgba(212,175,55,0.35)" }}
                  />

                  {/* Review text */}
                  <p
                    className="text-sm leading-relaxed flex-1 transition-colors duration-300"
                    style={{ color: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.45)" }}
                  >
                    "{t.review}"
                  </p>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5"
                        style={{
                          fill: i < t.rating ? "#D4AF37" : "transparent",
                          color: i < t.rating ? "#D4AF37" : "rgba(255,255,255,0.2)",
                        }}
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      style={{
                        border: isActive ? "2px solid #D4AF37" : "2px solid rgba(255,255,255,0.15)",
                      }}
                    />
                    <div>
                      <p
                        className="text-sm font-bold leading-tight transition-colors duration-300"
                        style={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)" }}
                      >
                        {t.name}
                      </p>
                      <p
                        className="text-[11px] transition-colors duration-300"
                        style={{ color: isActive ? "#D4AF37" : "rgba(212,175,55,0.4)" }}
                      >
                        {t.trip}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation arrows */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={prevTestimonial}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-1.5">
            {MOCK_TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (isAnimating) return;
                  setIsAnimating(true);
                  setTimeout(() => { setCurrentIndex(idx); setIsAnimating(false); }, 400);
                }}
                className="transition-all duration-300 rounded-full h-1.5"
                style={{
                  width: idx === currentIndex ? "24px" : "6px",
                  background: idx === currentIndex ? "#D4AF37" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
