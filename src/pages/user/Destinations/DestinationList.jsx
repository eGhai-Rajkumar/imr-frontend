import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, TrendingUp, Search, X } from 'lucide-react';

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

// Helper to construct the full image URL
const getFullImageUrl = (path) => {
  if (!path || typeof path !== "string") return '';
  return path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;
};

// Helper to create URL slug from name
const createSlug = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// --- Destination Card Component ---
const DestinationCard = ({ dest, onClick, index }) => {
  // eslint-disable-next-line no-unused-vars
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(dest.destinationId, dest.name)}
      // Removed style={{ opacity: 0 }}. The animation handles the initial state.
      className={`group relative h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer animate-scale-in delay-${index * 100}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={dest.image}
        alt={dest.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      
      {/* Location Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
        <MapPin className="h-4 w-4 text-white" />
        <span className="text-white text-sm font-medium">{dest.country}</span>
      </div>

      {/* Text Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
          {dest.name}
        </h3>
        <p className="text-white/90 font-medium">{dest.tourCount} Tours Available</p>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 transition-colors duration-300 rounded-2xl pointer-events-none" />
    </div>
  );
};

const DestinationList = () => {
  const [allDestinations, setAllDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Data Fetching ---
  const fetchAllDestinations = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/destinations/`, {
        headers: { "x-api-key": API_KEY }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const json = await response.json();
      const fetchedList = json.data || [];
      
      const standardizedList = fetchedList.map(d => {
        
        let totalTrips = 0;
        // Calculate trip count defensively
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
        
        // Get image defensively
        let imageUrl = '';
        if (Array.isArray(d.hero_banner_images) && d.hero_banner_images.length > 0) {
          imageUrl = getFullImageUrl(d.hero_banner_images[0]);
        } else if (d.hero_image) {
          imageUrl = getFullImageUrl(d.hero_image);
        } else if (Array.isArray(d.images) && d.images.length > 0) {
          imageUrl = getFullImageUrl(d.images[0]);
        }
        
        return {
          id: d._id || d.id,
          name: d.title || d.name,
          country: d.destination_type || 'Domestic',
          destinationId: d._id || d.id,
          image: imageUrl,
          tourCount: totalTrips,
          rating: d.rating || 4.7,
          continent: d.continent || d.destination_type,
        };
      });
      
      setAllDestinations(standardizedList);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching all destinations:", err);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchAllDestinations();
  }, [fetchAllDestinations]);

  const handleDestinationClick = (destinationId, destinationName) => {
    const slug = createSlug(destinationName);
    // Note: In a real app, use a router like React Router DOM for navigation
    window.location.href = `/destination/${slug}/${destinationId}`; 
  };
  
  // --- Filtering ---
  const filteredDestinations = useMemo(() => {
    if (!searchTerm) return allDestinations;

    return allDestinations.filter(dest => 
        (dest.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dest.country || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allDestinations, searchTerm]);

  // --- RENDER LOGIC ---

  // Error State
  if (error && allDestinations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-red-600 text-xl font-semibold mb-2">Error</div>
          <div className="text-gray-700">Error loading destinations: {error}</div>
        </div>
      </div>
    );
  }

  // Initial Loading State
  if (isLoading && allDestinations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading destinations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ⚠️ Injecting necessary CSS for animations ⚠️ */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .delay-0 { animation-delay: 0s; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
      `}</style>

      <div className="container mx-auto px-4 py-12">
        {/* 1. Header (Popular Destinations) - APPEARS FIRST */}
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h2 className="text-4xl font-extrabold text-gray-900">Popular Destinations</h2>
          </div>
          <p className="text-gray-600 text-xl">Discover amazing places around the world</p>
        </div>

        {/* 2. Search Bar - APPEARS SECOND */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations by name or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 pl-14 pr-14 rounded-2xl text-gray-900 text-lg font-medium shadow-xl border-2 border-blue-100 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* 3. Destination Grid - APPEARS THIRD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((dest, index) => (
              <DestinationCard
                key={dest.id}
                dest={dest}
                onClick={handleDestinationClick}
                index={index}
              />
            ))
          ) : (
            <div className="col-span-4 text-center py-20">
              <div className="max-w-md mx-auto">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No destinations found</h3>
                <p className="text-gray-600 text-lg">Try searching with different keywords</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationList;