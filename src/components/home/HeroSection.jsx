import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, X, Users } from 'lucide-react';

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

// ✅ ADD YOUR BACKGROUND IMAGES HERE
const HERO_IMAGES = [
  './hero-section-banners/hero-bg-kerala-backwaters-holidaysplanners.webp',
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

  // ✅ Auto-slide images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
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

      // Debug log
      if (fetchedList.length > 0) {
        console.log("Sample destination:", fetchedList[0]);
      }

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

      // Debug log
      if (fetchedList.length > 0) {
        console.log("Sample trip:", fetchedList[0]);
      }

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const totalResults =
    filteredResults.destinations.length + filteredResults.trips.length;

  return (
    <section
      className="relative z-[1] h-[600px] md:h-[700px] flex items-center justify-center overflow-visible"
      style={{
        fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* ✅ Background Image Slider */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${HERO_IMAGES[currentImageIndex]})`,
            }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-[1100] container mx-auto px-4 flex flex-col items-center justify-center h-full overflow-visible"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-center leading-tight"
          variants={itemVariants}
        >
          Your Journey Begins Here
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto mb-12 text-center leading-relaxed"
          variants={itemVariants}
        >
          Handpicked destinations and expertly curated tours await. 
          <span className="block mt-2 font-semibold">Start exploring your next adventure today.</span>
        </motion.p>

        {/* ✅ Compact Search Bar */}
        <motion.div
          ref={searchRef}
          className="bg-white/95 backdrop-blur-sm rounded-full shadow-2xl px-5 py-2 max-w-2xl mx-auto relative w-full overflow-visible"
          variants={itemVariants}
          whileHover={{ 
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            backgroundColor: 'rgba(255, 255, 255, 1)'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            {/* Location Icon */}
            <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0" />

            {/* Input */}
            <motion.div
              className="relative flex-1"
              whileHover={{ y: -1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <input
                type="text"
                placeholder="Search destinations, trips, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() =>
                  searchQuery.length > 0 && setShowResults(true)
                }
                className="w-full py-2 bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-500 text-sm md:text-base"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {isSearching && (
                <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
              )}
            </motion.div>

            {/* Search Icon Button */}
            <motion.button
              onClick={handleSearch}
              className="h-10 w-10 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full flex items-center justify-center flex-shrink-0 transition-all"
              whileHover={{
                scale: 1.08,
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Search className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Results */}
          <AnimatePresence>
            {showResults && totalResults > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-2xl max-h-96 overflow-y-auto z-[9998]"
              >
                {/* Destinations */}
                {filteredResults.destinations.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Destinations
                    </h3>
                    {filteredResults.destinations.map((dest) => (
                      <div
                        key={dest.id}
                        onClick={() => handleResultClick(dest)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                      >
                        {dest.image ? (
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {dest.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {dest.country} • {dest.tourCount} tours
                          </p>
                        </div>
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Trips */}
                {filteredResults.trips.length > 0 && (
                  <div className="p-4 border-t">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Trips
                    </h3>
                    {filteredResults.trips.map((trip) => (
                      <div
                        key={trip.id}
                        onClick={() => handleResultClick(trip)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                      >
                        {trip.image ? (
                          <img
                            src={trip.image}
                            alt={trip.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {trip.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {trip.destination} • {trip.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* No Results */}
          <AnimatePresence>
            {showResults &&
              totalResults === 0 &&
              searchQuery.length > 0 &&
              !isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-2xl p-6 text-center z-[9998]"
                >
                  <p className="text-gray-500">
                    No destinations or trips found for "{searchQuery}"
                  </p>
                </motion.div>
              )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}