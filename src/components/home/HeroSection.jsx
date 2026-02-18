import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader2, X, Users, Compass, ArrowRight } from 'lucide-react';

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

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
  str.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// ─── Dropdown rendered via Portal so it escapes all stacking contexts ───────
function SearchDropdown({ anchorRef, show, filteredResults, isSearching, searchQuery, onResultClick }) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!anchorRef.current) return;
    const update = () => {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [anchorRef, show]);

  const hasDests = filteredResults.destinations.length > 0;
  const hasTrips = filteredResults.trips.length > 0;
  const hasContent = hasDests || hasTrips;
  const noResults = !hasContent && searchQuery.length > 0 && !isSearching;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.16 }}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: pos.width,
            zIndex: 99999,
          }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden custom-scrollbar"
        >
          {/* ── 2-column grid when both sections have content ── */}
          {hasDests && hasTrips ? (
            <div className="grid grid-cols-2 divide-x divide-gray-100 max-h-[420px]">
              {/* LEFT: Destinations */}
              <div className="p-3 overflow-y-auto">
                <div className="flex items-center gap-1.5 px-1 mb-2">
                  <MapPin className="w-3 h-3 text-[#2C6B4F]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {filteredResults.mode === 'featured' ? 'Popular Destinations' : 'Destinations'}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {filteredResults.destinations.map((dest) => (
                    <DestRow key={dest.id} item={dest} onClick={onResultClick} />
                  ))}
                </div>
              </div>

              {/* RIGHT: Trips */}
              <div className="p-3 overflow-y-auto">
                <div className="flex items-center gap-1.5 px-1 mb-2">
                  <Compass className="w-3 h-3 text-[#D4AF37]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {filteredResults.mode === 'featured' ? '🔥 Hot Deals' : 'Trips'}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {filteredResults.trips.map((trip) => (
                    <TripRow key={trip.id} item={trip} onClick={onResultClick} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Single column when only one section */
            <div className="p-3 max-h-[420px] overflow-y-auto">
              {hasDests && (
                <>
                  <div className="flex items-center gap-1.5 px-1 mb-2">
                    <MapPin className="w-3 h-3 text-[#2C6B4F]" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {filteredResults.mode === 'featured' ? 'Popular Destinations' : 'Destinations'}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {filteredResults.destinations.map((dest) => (
                      <DestRow key={dest.id} item={dest} onClick={onResultClick} />
                    ))}
                  </div>
                </>
              )}
              {hasTrips && (
                <>
                  <div className="flex items-center gap-1.5 px-1 mb-2">
                    <Compass className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {filteredResults.mode === 'featured' ? '🔥 Hot Deals' : 'Trips'}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {filteredResults.trips.map((trip) => (
                      <TripRow key={trip.id} item={trip} onClick={onResultClick} />
                    ))}
                  </div>
                </>
              )}
              {noResults && (
                <div className="py-8 text-center">
                  <MapPin className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">No results for "{searchQuery}"</p>
                  <p className="text-xs text-gray-400 mt-1">Try "Manali", "Kerala" or "Trekking"</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function DestRow({ item, onClick }) {
  return (
    <div
      onClick={() => onClick(item)}
      className="flex items-center gap-2.5 px-2 py-2 hover:bg-[#2C6B4F]/6 rounded-xl cursor-pointer transition-colors group"
    >
      <div className="w-11 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        {item.image
          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center"><MapPin className="w-3.5 h-3.5 text-gray-300" /></div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#2C6B4F] transition-colors leading-tight">{item.name}</p>
        <p className="text-[11px] text-gray-400 leading-tight">
          {item.country}{item.tourCount != null ? ` · ${item.tourCount} trips` : ''}
        </p>
      </div>
      <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-[#2C6B4F] flex-shrink-0 transition-colors" />
    </div>
  );
}

function TripRow({ item, onClick }) {
  return (
    <div
      onClick={() => onClick(item)}
      className="flex items-center gap-2.5 px-2 py-2 hover:bg-[#D4AF37]/6 rounded-xl cursor-pointer transition-colors group"
    >
      <div className="w-11 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        {item.image
          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center"><Compass className="w-3.5 h-3.5 text-gray-300" /></div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#2C6B4F] transition-colors leading-tight line-clamp-1">{item.name}</p>
        <div className="flex items-center gap-1 text-[11px] text-gray-400 leading-tight flex-wrap">
          {item.duration && <span>{item.duration}</span>}
          {item.price && <><span>·</span><span className="text-[#2C6B4F] font-semibold">₹{item.price}</span></>}
          {item.discount > 0 && <span className="bg-[#D4AF37]/15 text-[#B89020] px-1 rounded font-bold">-₹{item.discount}</span>}
        </div>
      </div>
      <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-[#2C6B4F] flex-shrink-0 transition-colors" />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [filteredResults, setFilteredResults] = useState({ destinations: [], trips: [], mode: 'none' });
  const searchRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const fetchDestinations = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/destinations/`, { headers: { "x-api-key": API_KEY } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setDestinations((json.data || []).map((d) => ({
        id: d.id,
        name: d.title || d.name || 'Unknown',
        slug: d.slug || slugify(d.title || d.name),
        type: 'destination',
        country: d.destination_type || 'Domestic',
        image: getFullImageUrl(d.hero_banner_images?.[0] || d.image || d.hero_image || ''),
        tourCount: d.trips_count ?? d.tour_count ?? d.tourCount ?? d.tours_count ?? d.total_tours ?? null,
      })));
    } catch (e) { console.error("Destinations fetch error:", e); }
  }, []);

  const fetchTrips = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/trips/`, { headers: { "x-api-key": API_KEY } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setTrips((json.data || []).map((t) => ({
        id: t.id || t._id,
        name: t.title || t.name || 'Unknown Trip',
        slug: t.slug || slugify(t.title || t.name),
        type: 'trip',
        destination: t.destination_name || t.destination || '',
        duration: (t.days && t.nights) ? `${t.days}D/${t.nights}N` : (t.duration || ''),
        price: t.final_price_display || t.price || null,
        discount: t.discount || 0,
        image: getFullImageUrl(t.hero_image || t.image || t.images?.[0]?.path || t.images?.[0] || t.thumbnail || ''),
      })));
    } catch (e) { console.error("Trips fetch error:", e); }
  }, []);

  useEffect(() => { fetchDestinations(); fetchTrips(); }, [fetchDestinations, fetchTrips]);

  // Compute dropdown content
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length > 0) {
      setIsSearching(true);
      const filteredDests = destinations.filter(d => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)).slice(0, 5);
      const filteredTrips = trips.filter(t => t.name.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q)).slice(0, 5);
      setFilteredResults({ destinations: filteredDests, trips: filteredTrips, mode: 'search' });
      setIsSearching(false);
    } else if (isFocused) {
      const featuredDests = destinations.slice(0, 5);
      const hotTrips = [...trips].filter(t => t.discount > 0).sort((a, b) => b.discount - a.discount).slice(0, 5);
      const fallbackTrips = hotTrips.length > 0 ? hotTrips : trips.slice(0, 5);
      setFilteredResults({ destinations: featuredDests, trips: fallbackTrips, mode: 'featured' });
    } else {
      setFilteredResults({ destinations: [], trips: [], mode: 'none' });
    }
  }, [searchQuery, destinations, trips, isFocused]);

  useEffect(() => {
    const hasContent = filteredResults.destinations.length > 0 || filteredResults.trips.length > 0 || (searchQuery.length > 0 && !isSearching);
    setShowResults(isFocused && hasContent);
  }, [filteredResults, isFocused, searchQuery, isSearching]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsFocused(false);
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (item) => {
    setShowResults(false);
    setIsFocused(false);
    if (item.type === 'destination') {
      window.location.href = `/destination/${item.slug}/${item.id}`;
    } else {
      window.location.href = `/trip-preview/${item.slug}/${item.id}`;
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  const clearSearch = () => setSearchQuery('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center">
      {/* Background Image Slider */}
      <div className="absolute inset-0 overflow-hidden bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${HERO_IMAGES[currentImageIndex]})` }}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center h-full text-center"
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
          className="text-3xl md:text-5xl lg:text-6xl font-serif font-black text-white mb-4 leading-tight drop-shadow-lg"
          variants={itemVariants}
        >
          Indian Mountain <br />
          Rovers
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          variants={itemVariants}
        >
          Crafting exclusive journeys through the majestic landscapes of India.
          Experience nature in its purest form, wrapped in luxury.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          ref={searchRef}
          className="w-full max-w-3xl mx-auto relative group"
          variants={itemVariants}
        >
          <div className="relative flex items-center bg-white/15 backdrop-blur-md border border-white/20 rounded-full p-2 shadow-2xl hover:bg-white/20 transition-all duration-300 ring-1 ring-white/10 group-hover:ring-white/30">
            <div className="pl-4 pr-3 text-accent">
              <Compass className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Where is your next adventure?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => setIsFocused(true)}
              className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-gray-300 text-base py-3 font-medium"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="p-2 text-gray-300 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
            {isSearching && (
              <div className="p-2 text-accent">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            <button
              onClick={handleSearch}
              className="ml-2 bg-gradient-nature text-white rounded-full px-7 py-3 font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
            >
              <span>Explore</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Portal dropdown — renders at body level, no z-index issues */}
          <SearchDropdown
            anchorRef={searchRef}
            show={showResults}
            filteredResults={filteredResults}
            isSearching={isSearching}
            searchQuery={searchQuery}
            onResultClick={handleResultClick}
          />
        </motion.div>
      </motion.div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.03); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
      `}</style>
    </section>
  );
}