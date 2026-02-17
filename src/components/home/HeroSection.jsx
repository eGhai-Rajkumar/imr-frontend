import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, X, Users, Compass, ArrowRight } from 'lucide-react';

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

// ✅ ADD YOUR BACKGROUND IMAGES HERE
const HERO_IMAGES = [
  './hero-section-banners/hero-bg-kerala-backwaters-indianmountainrovers.webp',
  './hero-section-banners/hero-image-kullu-manali-holidays-planners.jpg',
  './hero-section-banners/hero-image-spiti-valley-holidays-planners.jpg',
];

const getFullImageUrl = (path) => {
  if (!path || typeof path !== "string") return null;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path}`;
};

const slugify = (str = "") =>
  str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [filteredResults, setFilteredResults] = useState({ destinations: [], trips: [] });
  const searchRef = useRef(null);

  // ✅ Image slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ✅ Auto-slide images every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Fetch destinations
  const fetchDestinations = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/destinations/`, {
        headers: { "x-api-key": API_KEY },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      const fetchedList = json.data || [];

      const standardizedList = fetchedList.map((d) => ({
        id: d.id,
        name: d.title || d.name || 'Unknown',
        slug: d.slug || slugify(d.title || d.name),
        type: 'destination',
        country: d.destination_type || 'Global',
        image: getFullImageUrl(
          d.hero_banner_images?.[0] || d.image || d.hero_image || ''
        ),
        tourCount: d.tour_count || d.tourCount || d.tours_count || d.total_tours || 0,
      }));

      setDestinations(standardizedList);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  }, []);

  // Fetch trips
  const fetchTrips = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/trips/`, {
        headers: { "x-api-key": API_KEY },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      const fetchedList = json.data || [];

      const standardizedList = fetchedList.map((t) => ({
        id: t.id,
        name: t.title || t.name || 'Unknown Trip',
        slug: slugify(t.title || t.name),
        type: 'trip',
        destination: t.destination_name || t.destination || 'Unknown',
        duration: t.duration || 'N/A',
        price: t.price || 'Contact for pricing',
        image: getFullImageUrl(
          t.image ||
          t.images?.[0]?.path ||
          t.images?.[0] ||
          t.thumbnail ||
          t.hero_image ||
          ''
        ),
      }));

      setTrips(standardizedList);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
    fetchTrips();
  }, [fetchDestinations, fetchTrips]);

  // Filter results
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      const query = searchQuery.toLowerCase();

      const filteredDests = destinations
        .filter(
          (d) =>
            d.name.toLowerCase().includes(query) ||
            d.country.toLowerCase().includes(query)
        )
        .slice(0, 5);

      const filteredTrips = trips
        .filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            t.destination.toLowerCase().includes(query)
        )
        .slice(0, 5);

      setFilteredResults({ destinations: filteredDests, trips: filteredTrips });
      setShowResults(true);
      setIsSearching(false);
    } else {
      setShowResults(false);
      setFilteredResults({ destinations: [], trips: [] });
    }
  }, [searchQuery, destinations, trips]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (item) => {
    if (item.type === 'destination') {
      window.location.href = `/destination/${item.slug}/${item.id}`;
    } else {
      window.location.href = `/trip-preview/${item.slug}/${item.id}`;
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const totalResults =
    filteredResults.destinations.length + filteredResults.trips.length;

  return (
    <section
      className="relative z-[1] min-h-[85vh] flex items-center justify-center overflow-hidden"
    >
      {/* ✅ Background Image Slider with Ken Burns Effect */}
      <div className="absolute inset-0 overflow-hidden bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${HERO_IMAGES[currentImageIndex]})`,
            }}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            {/* Gradient Overlays for Readability and Mood */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-[10] container mx-auto px-4 flex flex-col items-center justify-center h-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-4">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent text-xs md:text-sm font-bold tracking-widest uppercase">
            Discover the Unseen
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white mb-6 leading-tight drop-shadow-lg"
          variants={itemVariants}
        >
          Indian Mountain <br />
          Rovers
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          variants={itemVariants}
        >
          Crafting exclusive journeys through the majestic landscapes of India.
          Experience nature in its purest form, wrapped in luxury.
        </motion.p>

        {/* ✅ Glassmorphism Search Bar */}
        <motion.div
          ref={searchRef}
          className="w-full max-w-3xl mx-auto relative group"
          variants={itemVariants}
        >
          <div className="relative flex items-center bg-white/15 backdrop-blur-md border border-white/20 rounded-full p-2 shadow-2xl hover:bg-white/20 transition-all duration-300 ring-1 ring-white/10 group-hover:ring-white/30">

            {/* Location Icon */}
            <div className="pl-4 pr-3 text-accent">
              <Compass className="h-6 w-6" />
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Where is your next adventure?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => searchQuery.length > 0 && setShowResults(true)}
              className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-gray-300 text-lg py-3 font-medium"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            {/* Loader */}
            {isSearching && (
              <div className="p-2 text-accent">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="ml-2 bg-gradient-nature text-white rounded-full px-8 py-3.5 font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
            >
              <span>Explore</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Results Dropdown */}
          <AnimatePresence>
            {showResults && totalResults > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 top-full mt-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-glass border border-white/20 max-h-[400px] overflow-y-auto overflow-x-hidden z-[9998] custom-scrollbar"
              >
                {/* Destinations */}
                {filteredResults.destinations.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
                      Destinations
                    </h3>
                    <div className="space-y-2">
                      {filteredResults.destinations.map((dest) => (
                        <div
                          key={dest.id}
                          onClick={() => handleResultClick(dest)}
                          className="flex items-center gap-4 p-2 hover:bg-gray-100/50 rounded-xl cursor-pointer transition-colors group"
                        >
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            {dest.image ? (
                              <img
                                src={dest.image}
                                alt={dest.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-serif font-bold text-gray-800 text-lg">
                              {dest.name}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {dest.country}
                              <span className="mx-1">•</span>
                              {dest.tourCount} tours
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trips */}
                {filteredResults.trips.length > 0 && (
                  <div className="p-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
                      Trips
                    </h3>
                    <div className="space-y-2">
                      {filteredResults.trips.map((trip) => (
                        <div
                          key={trip.id}
                          onClick={() => handleResultClick(trip)}
                          className="flex items-center gap-4 p-2 hover:bg-gray-100/50 rounded-xl cursor-pointer transition-colors group"
                        >
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            {trip.image ? (
                              <img
                                src={trip.image}
                                alt={trip.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Users className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-serif font-bold text-gray-800 text-lg line-clamp-1">
                              {trip.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {trip.destination} • {trip.duration}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* No Results */}
            {showResults &&
              totalResults === 0 &&
              searchQuery.length > 0 &&
              !isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 top-full mt-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-glass p-8 text-center z-[9998] border border-white/20"
                >
                  <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    No adventures found for "{searchQuery}"
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Try searching for "Manali", "Kerala", or "Trekking"</p>
                </motion.div>
              )}
          </AnimatePresence>
        </motion.div>

      </motion.div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-[5]"></div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}