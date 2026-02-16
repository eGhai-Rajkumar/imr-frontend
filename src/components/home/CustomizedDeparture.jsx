import { useState, useEffect, useCallback } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

const getFullImageUrl = (path) => 
    !path || typeof path !== "string" ? '' : 
    path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

export default function CustomizedDestinationsSection() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const fetchDestinations = useCallback(async () => {
    setIsLoading(true);
    try {
        const response = await fetch(`${API_URL}/destinations/`, {
            headers: { "x-api-key": API_KEY }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const json = await response.json();
        const fetchedList = json.data || [];
        
        const standardizedList = fetchedList.map(d => {
            // Calculate trip count from API data (same logic as DestinationList)
            let totalTrips = 0;
            if (Array.isArray(d.custom_packages)) {
                d.custom_packages.forEach(pkg => {
                    if (Array.isArray(pkg.trips)) {
                        totalTrips += pkg.trips.length;
                    } else if (Array.isArray(pkg.trip_ids)) {
                        totalTrips += pkg.trip_ids.length;
                    }
                });
            } else if (Array.isArray(d.popular_trips)) {
                totalTrips += d.popular_trips.length;
            }
            
            // Extract first hero banner image from array
            const heroImage = d.hero_banner_images?.[0] || d.image || d.hero_image || d.images?.[0]?.path || '';
            
            return {
                id: d._id || d.id,
                destinationId: d._id || d.id,
                title: d.name || d.title || 'Unknown Destination',
                country: d.destination_type || 'Global',
                tours: totalTrips,
                image: getFullImageUrl(heroImage),
            };
        });

        setDestinations(standardizedList.slice(0, 8)); // Limit to 8 for the grid
    } catch (error) {
        console.error("Error fetching destinations for customized section:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleDestinationDetails = (destinationId) => {
    window.location.href = `/destinfo?destinationId=${destinationId}`;
  };

  if (isLoading) {
    return (
        <section className="py-16 text-center bg-gradient-to-b from-gray-50 to-white">
            <div className="flex justify-center items-center space-x-2">
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                <p className="text-lg text-gray-500 font-medium">Loading customized destinations...</p>
            </div>
        </section>
    );
  }

  if (destinations.length === 0 && !isLoading) {
    return (
        <section className="py-16 text-center bg-gradient-to-b from-gray-50 to-white">
            <p className="text-gray-500">No destinations found. Please check API status.</p>
        </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 opacity-0 animate-fade-in-down">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Design Your Own Adventure
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Pick the path, set the pace, and craft a travel story that's uniquely yours.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className="opacity-0 animate-slide-up cursor-pointer rounded-3xl overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards',
              }}
              onMouseEnter={() => setHoveredCard(destination.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleDestinationDetails(destination.destinationId)}
            >
              <div className="relative shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-80">
                {/* Background Image */}
                <img
                  src={destination.image}
                  alt={destination.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredCard === destination.id ? 'scale-110' : 'scale-100'
                  }`}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  {/* Country Tag */}
                  <div className="flex justify-end">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800">
                      <MapPin className="w-4 h-4" />
                      {destination.country}
                    </span>
                  </div>
                  
                  {/* Bottom Content */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {destination.title}
                    </h3>
                    <p className="text-white/90 text-base font-medium">
                      {destination.tours} Tours Available
                    </p>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className={`absolute inset-0 border-4 border-blue-500 rounded-3xl transition-opacity duration-300 ${
                  hoveredCard === destination.id ? 'opacity-100' : 'opacity-0'
                }`} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="text-center mt-12 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <a href="/destinations">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
              View All Destinations
            </button>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}