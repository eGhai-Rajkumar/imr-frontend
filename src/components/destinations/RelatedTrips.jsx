import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar } from 'lucide-react';

// Trip data
const similarTripsData = {
  'jibhi': [
    {
      id: 'bhutan-road-trip',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop',
      title: 'Bhutan Road Trip Package',
      price: '34,999',
      duration: '6N/7D',
      route: 'Bagdogra (Siliguri) - Bagdogra',
      dates: '7 Sep, 21 Sep',
      batches: '+18 batches'
    },
    {
      id: 'bhutan-phobjikha',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop',
      title: 'Bhutan Road Trip with Phobjikha Valley',
      price: '44,999',
      duration: '7N/8D',
      route: 'Bagdogra (Siliguri) - Bagdogra',
      dates: '14 Sep, 28 Sep',
      batches: '+34 batches'
    },
    {
      id: 'spiti-backpacking',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop',
      title: 'Spiti Backpacking - Exclusive Escape',
      price: '24,999',
      duration: '6N/7D',
      route: 'Delhi - Delhi',
      dates: '22 Feb, 1 Mar',
      batches: '+19 batches'
    },
    {
      id: 'frozen-spiti',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop',
      title: 'Frozen Spiti Expeditions',
      price: '25,999',
      duration: '6N/7D',
      route: 'Delhi - Delhi',
      dates: '10 Jan, 17 Jan',
      batches: '+8 batches'
    }
  ],
  'kasol': [
    {
      id: 'bhutan-road-trip',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop',
      title: 'Bhutan Road Trip Package',
      price: '34,999',
      duration: '6N/7D',
      route: 'Bagdogra (Siliguri) - Bagdogra',
      dates: '7 Sep, 21 Sep',
      batches: '+18 batches'
    },
    {
      id: 'spiti-backpacking',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop',
      title: 'Spiti Backpacking - Exclusive Escape',
      price: '24,999',
      duration: '6N/7D',
      route: 'Delhi - Delhi',
      dates: '22 Feb, 1 Mar',
      batches: '+19 batches'
    },
    {
      id: 'manali-trip',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&h=600&fit=crop',
      title: 'Manali Adventure Package',
      price: '18,999',
      duration: '5N/6D',
      route: 'Delhi - Delhi',
      dates: '15 Mar, 22 Mar',
      batches: '+25 batches'
    },
    {
      id: 'frozen-spiti',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&h=600&fit=crop',
      title: 'Frozen Spiti Expeditions',
      price: '25,999',
      duration: '6N/7D',
      route: 'Delhi - Delhi',
      dates: '10 Jan, 17 Jan',
      batches: '+8 batches'
    }
  ]
};

export default function SimilarTrips({ tripId = 'jibhi' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trips = similarTripsData[tripId] || similarTripsData['jibhi'];
  
  // Navigate to trip details page - same as your FixedDepartureSection
  const handleTripClick = (clickedTripId) => {
    window.location.href = `/trips?tripId=${clickedTripId}`;
  };
  
  // Calculate how many cards to show based on screen size
  const getCardsToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return 4; // xl
      if (window.innerWidth >= 1024) return 3; // lg
      if (window.innerWidth >= 768) return 2; // md
      return 1; // mobile
    }
    return 4;
  };

  const [cardsToShow, setCardsToShow] = useState(getCardsToShow());

  // Update cards to show on window resize
  React.useEffect(() => {
    const handleResize = () => setCardsToShow(getCardsToShow());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, trips.length - cardsToShow);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-in-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 inline-block pb-3">
            Similar Trips
            <div className="w-16 h-1 bg-blue-600 mx-auto mt-2"></div>
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-300 hover:scale-110 animate-fade-in"
              aria-label="Previous trips"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {currentIndex < maxIndex && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-300 hover:scale-110 animate-fade-in"
              aria-label="Next trips"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`
              }}
            >
              {trips.map((trip, index) => (
                <div
                  key={trip.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / cardsToShow}%` }}
                >
                  <div 
                    onClick={() => handleTripClick(trip.id)}
                    className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in bg-white cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Image */}
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce-soft">
                        ₹{trip.price}/- Onwards
                      </div>

                      {/* Click Indicator */}
                      <div className="absolute inset-0 bg-cyan-600/0 group-hover:bg-cyan-600/10 transition-all duration-300 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300">
                          <span className="text-cyan-600 font-bold text-sm">View Details</span>
                        </div>
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                      {/* Title */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-white text-xl font-bold mb-4 line-clamp-2">
                          {trip.title}
                        </h3>

                        {/* Trip Info */}
                        <div className="space-y-2">
                          {/* Duration and Route */}
                          <div className="flex items-start gap-4 text-white/90 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-cyan-400" />
                              <span className="font-semibold">{trip.duration}</span>
                            </div>
                            <div className="flex items-start gap-2 flex-1">
                              <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <span className="font-medium line-clamp-1">{trip.route}</span>
                            </div>
                          </div>

                          {/* Dates */}
                          <div className="flex items-center gap-2 text-white/90 text-sm">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span className="font-medium">{trip.dates}</span>
                            <span className="text-cyan-400 font-semibold">{trip.batches}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 border-4 border-transparent group-hover:border-cyan-400 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {maxIndex > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-cyan-600 w-8'
                      : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce-soft {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out backwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-bounce-soft {
          animation: bounce-soft 2s ease-in-out infinite;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}