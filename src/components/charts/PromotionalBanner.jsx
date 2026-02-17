import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

// --- LOCAL IMAGE ASSET IMPORTS ---
const IMAGE_PATHS = {
  manaliSissu: '/promo-manali-sissu.png',
  spitiAdventure: '/promo-spiti-adventure.png',
  kashmirHoliday: '/promo-kashmir.png',
};

export default function PromoBanner() {
  // ADMIN CONFIG - Fixed slides using local paths
  const slides = [
    {
      type: 'image',
      desktopSrc: IMAGE_PATHS.manaliSissu,
      mobileSrc: IMAGE_PATHS.manaliSissu,
      link: 'https://indianmountainrovers.com/trip-preview/3-days-2-nights-in-manali-sissu/135',
      altText: '3 Days 2 Nights in Manali & Sissu - Himalayan Views',
      title: 'Manali & Sissu: Himalayan Escape',
      subtitle: '3 Days, 2 Nights of Pure Bliss'
    },
    {
      type: 'image',
      desktopSrc: IMAGE_PATHS.spitiAdventure,
      mobileSrc: IMAGE_PATHS.spitiAdventure,
      link: 'https://indianmountainrovers.com/trip-preview/manali-to-spiti-5-day-himalayan-adventure/185',
      altText: 'Manali to Spiti 5 Day Himalayan Adventure',
      title: 'Spiti Valley Expedition',
      subtitle: '5 Days on the Top of the World'
    },
    {
      type: 'image',
      desktopSrc: IMAGE_PATHS.kashmirHoliday,
      mobileSrc: IMAGE_PATHS.kashmirHoliday,
      link: 'https://indianmountainrovers.com/trip-preview/4-nights-kashmir-signature-holiday/196',
      altText: '4 Nights Kashmir Signature Holiday on Dal Lake',
      title: 'Kashmir: Paradise on Earth',
      subtitle: '4 Nights Signature Holiday'
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

  return (
    <section
      className="relative w-full max-w-7xl mx-auto px-4 py-8 md:py-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl group/slider">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <a href={slide.link} className="block w-full h-full group/image relative">
              <picture>
                <source
                  media="(max-width: 768px)"
                  srcSet={slide.mobileSrc}
                />
                <source
                  media="(min-width: 769px)"
                  srcSet={slide.desktopSrc}
                />
                <img
                  src={slide.desktopSrc}
                  alt={slide.altText}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover/image:scale-105"
                />
              </picture>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/20 to-transparent opacity-80" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16">
                <div className="max-w-3xl transform transition-transform duration-700 translate-y-4 group-hover/slider:translate-y-0">
                  <p className="text-accent font-bold tracking-widest uppercase text-sm md:text-base mb-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                    {slide.subtitle}
                  </p>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                    {slide.title}
                  </h2>

                  <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                    <button
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-primary-dark rounded-full font-semibold transition-all duration-300 group/btn"
                    >
                      <span className="uppercase tracking-wider text-sm">Explore Logic</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 right-8 z-20 flex gap-3">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-primary-dark transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-primary-dark transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-8 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index
                  ? 'w-8 bg-accent'
                  : 'w-4 bg-white/40 hover:bg-white/60'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
      `}</style>
    </section>
  );
}