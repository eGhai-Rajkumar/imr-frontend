import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- LOCAL IMAGE ASSET IMPORTS ---
// Assuming these files are placed in the public/ folder and referenced via root path '/'
// or directly via relative path if they are in the same folder as the component.
// Based on the structure (components/charts/PromotionalBanner.jsx),
// using a relative path like './promo-manali-sissu.png' is generally correct for React
// but since the image is in /public, it's safer to use the root public path: /image-name.png

const IMAGE_PATHS = {
    manaliSissu: '/promo-manali-sissu.png',
    spitiAdventure: '/promo-spiti-adventure.png',
    kashmirHoliday: '/promo-kashmir.png',
};


// --- Original PromoBanner Component Logic ---
export default function PromoBanner() {
  // ADMIN CONFIG - Fixed slides using local paths
  const slides = [
    {
      type: 'image',
      desktopSrc: IMAGE_PATHS.manaliSissu,
      mobileSrc: IMAGE_PATHS.manaliSissu,
      link: 'https://indianmountainrovers.com/trip-preview/3-days-2-nights-in-manali-sissu/135',
      altText: '3 Days 2 Nights in Manali & Sissu - Himalayan Views',
      title: 'Manali & Sissu: 3 Days 2 Nights Getaway'
    },
    {
      type: 'image',
      desktopSrc: IMAGE_PATHS.spitiAdventure,
      mobileSrc: IMAGE_PATHS.spitiAdventure,
      link: 'https://indianmountainrovers.com/trip-preview/manali-to-spiti-5-day-himalayan-adventure/185',
      altText: 'Manali to Spiti 5 Day Himalayan Adventure',
      title: 'Manali to Spiti: 5 Day Himalayan Adventure'
    },
    {
      type: 'image',
      desktopSrc: IMAGE_PATHS.kashmirHoliday,
      mobileSrc: IMAGE_PATHS.kashmirHoliday,
      link: 'https://indianmountainrovers.com/trip-preview/4-nights-kashmir-signature-holiday/196',
      altText: '4 Nights Kashmir Signature Holiday on Dal Lake',
      title: 'Kashmir: 4 Nights Signature Holiday'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);

  const totalSlides = slides.length;
  
  // Auto-play functionality
  useEffect(() => {
    if (totalSlides > 0 && !isPaused) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5000); // Change slide every 5 seconds
    } else if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPaused, totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  // Since we are using static image paths, no loading spinner is needed based on API status.
  // The component renders directly using the local paths.

  return (
    <section 
      className="relative w-full max-w-7xl mx-auto px-4 py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gray-900 shadow-2xl">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <a href={slide.link} className="block w-full h-full group">
              {slide.type === 'image' ? (
                <picture>
                  {/* Mobile Image */}
                  <source
                    media="(max-width: 768px)"
                    srcSet={slide.mobileSrc}
                  />
                  {/* Desktop Image */}
                  <source
                    media="(min-width: 769px)"
                    srcSet={slide.desktopSrc}
                  />
                  <img
                    src={slide.desktopSrc}
                    alt={slide.altText}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </picture>
              ) : (
                // Video rendering remains for future use
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={slide.desktopSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              
              {/* Overlay with Title and CTA */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-8 bg-black/30 group-hover:bg-black/40 transition-all duration-300">
                  
                  {/* Title */}
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white text-shadow-lg drop-shadow-lg max-w-2xl">
                      {slide.title}
                  </h2>

                  {/* CTA Button */}
                  <div className="flex justify-start">
                      <button
                          onClick={(e) => { e.preventDefault(); window.location.href = slide.link; }}
                          className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-lg shadow-xl uppercase tracking-wide text-sm md:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none"
                      >
                          Book Now / View Trip!
                      </button>
                  </div>
              </div>
            </a>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg opacity-80 hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg opacity-80 hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}