import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';

// NOTE: Since the full API structure for image paths is unknown, 
// we assume a BASE_IMAGE_URL might be needed for relative paths like "adventure-trip.jpg".
// If your API returns full URLs, remove BASE_IMAGE_URL.
const BASE_IMAGE_URL = "https://api.yaadigo.com/uploads/"; 

// Placeholder array for the initial loading state (before API call is complete)
const PLACEHOLDER_IMAGES = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
];

/**
 * Ensures the image URL is absolute.
 */
const getImageUrl = (path) => {
    if (!path) return PLACEHOLDER_IMAGES[0];
    return path.startsWith('http') ? path : `${BASE_IMAGE_URL}${path}`;
};


// The component now accepts destinationData directly.
function DestinationHero({ destinationData }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Use a single variable for images, handling API structure and fallback
    const rawImages = destinationData?.data?.hero_banner_images || destinationData?.hero_banner_images || PLACEHOLDER_IMAGES;
    const images = rawImages.map(getImageUrl);
    
    const title = destinationData?.data?.title || destinationData?.title || 'Explore The World';
    const subtitle = destinationData?.data?.subtitle || destinationData?.subtitle || destinationData?.overview || "Find your next adventure.";

    // --- Carousel Logic ---
    
    // Auto-scroll logic
    useEffect(() => {
        if (images.length <= 1) return;
        
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
                setIsTransitioning(false);
            }, 600); // Transition duration
        }, 4000); // Delay before next scroll

        return () => clearInterval(interval);
    }, [images.length]);

    // Reset index when destination data changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [title]); 

    const goToImage = (index) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentImageIndex(index);
            setIsTransitioning(false);
        }, 300);
    };

    const goToPrevious = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
            setIsTransitioning(false);
        }, 300);
    };

    const goToNext = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
            setIsTransitioning(false);
        }, 300);
    };

    if (!destinationData) {
        return (
             <div className="relative w-full h-[600px] bg-gray-800 flex items-center justify-center">
                 <Loader className="w-8 h-8 animate-spin text-white" />
             </div>
        );
    }
    
    return (
        <div className="relative w-full">
            {/* Hero Section */}
            <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-black flex items-center justify-center">
                
                {/* Image Display */}
                <div className="absolute inset-0">
                    <img
                        src={images[currentImageIndex]}
                        alt={title}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                            isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                        }`}
                    />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Title Content */}
                <div className="relative z-30 text-center text-white p-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold shadow-text animate-fade-in-down">
                        {title}
                    </h1>
                    <p className="text-xl md:text-2xl font-medium mt-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                        {subtitle}
                    </p>
                </div>

                {/* Left Arrow */}
                {images.length > 1 && (
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-16 md:h-16 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                        aria-label="Previous image"
                    >
                        <svg className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {/* Right Arrow */}
                {images.length > 1 && (
                    <button
                        onClick={goToNext}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-16 md:h-16 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                        aria-label="Next image"
                    >
                        <svg className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}

                {/* Carousel Indicators */}
                {images.length > 1 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2 md:gap-3">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToImage(index)}
                                className={`transition-all duration-300 rounded-full ${
                                    currentImageIndex === index
                                        ? 'w-8 md:w-12 h-2 md:h-3 bg-white shadow-lg'
                                        : 'w-2 md:w-3 h-2 md:h-3 bg-white/50 hover:bg-white/80 hover:scale-125'
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
            
            {/* Custom CSS for visual effects */}
            <style jsx>{`
                .shadow-text {
                    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
                }
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.8s ease-out both; }
                .animate-fade-in-up { animation: fade-in-up 0.8s ease-out both; }
            `}</style>
        </div>
    );
}

export default DestinationHero;