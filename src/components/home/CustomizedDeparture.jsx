import { useState, useEffect, useCallback } from 'react';
import { MapPin, Loader2, PenTool, ArrowRight } from 'lucide-react';

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
      <section className="py-24 text-center bg-surface">
        <div className="flex justify-center items-center space-x-2">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <p className="text-lg text-gray-500 font-serif italic">Curating custom experiences...</p>
        </div>
      </section>
    );
  }

  if (destinations.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="py-24 px-4 bg-surface relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 opacity-0 animate-fade-in-down">
          <div className="flex items-center justify-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3">
            <PenTool className="h-4 w-4" />
            <span>Bespoke Journeys</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary-dark">
            Design Your Own Adventure
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
            Pick the path, set the pace, and craft a travel story that's uniquely yours.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className="opacity-0 animate-slide-up cursor-pointer group"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards',
              }}
              onMouseEnter={() => setHoveredCard(destination.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleDestinationDetails(destination.destinationId)}
            >
              <div className="relative h-[360px] rounded-[2rem] overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gray-900">
                {/* Background Image */}
                <img
                  src={destination.image}
                  alt={destination.title}
                  className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${hoveredCard === destination.id ? 'scale-110' : 'scale-100'
                    }`}
                  loading="lazy"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  {/* Top Badge */}
                  <div className="flex justify-end">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white tracking-wide uppercase">
                      <MapPin className="w-3 h-3 text-accent" />
                      {destination.country}
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2 leading-tight group-hover:text-accent transition-colors">
                      {destination.title}
                    </h3>

                    <div className="flex items-center justify-between border-t border-white/20 pt-3 mt-3">
                      <p className="text-white/80 text-sm font-medium">
                        {destination.tours} Packages
                      </p>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-accent group-hover:text-primary-dark transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="text-center mt-16 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <a href="/destinations">
            <button className="px-10 py-4 border-2 border-primary text-primary rounded-full font-bold tracking-widest uppercase hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg">
              Explore All Destinations
            </button>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
      `}</style>
    </section>
  );
}