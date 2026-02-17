import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Search, X, Loader2 } from 'lucide-react';
import PageHeader from '../../../components/layout/PageHeader';

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

const DestinationCard = ({ dest, onClick }) => {
  return (
    <div
      onClick={() => onClick(dest.destinationId, dest.name)}
      className="group relative h-96 rounded-2xl overflow-hidden shadow-soft cursor-pointer transform hover:-translate-y-2 transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gray-200 animate-pulse" /> {/* Placeholder */}
      <img
        src={dest.image}
        alt={dest.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-[-5px]">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-accent" />
          <span className="text-white/80 text-sm font-medium tracking-wide uppercase">{dest.country}</span>
        </div>
        <h3 className="text-3xl font-serif font-bold text-white mb-2 group-hover:text-accent transition-colors">
          {dest.name}
        </h3>
        <p className="text-white/70 font-medium text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent"></span>
          {dest.tourCount} Tours Available
        </p>
      </div>
    </div>
  );
};

const DestinationList = () => {
  const [allDestinations, setAllDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        if (Array.isArray(d.custom_packages)) {
          d.custom_packages.forEach(pkg => {
            if (Array.isArray(pkg.trips)) totalTrips += pkg.trips.length;
            else if (Array.isArray(pkg.trip_ids)) totalTrips += pkg.trip_ids.length;
          });
        } else if (Array.isArray(d.popular_trips)) {
          totalTrips += d.popular_trips.length;
        }

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
        };
      });

      setAllDestinations(standardizedList);
    } catch (err) {
      console.error("Error fetching all destinations:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllDestinations();
  }, [fetchAllDestinations]);

  const handleDestinationClick = (destinationId, destinationName) => {
    const slug = createSlug(destinationName);
    window.location.href = `/destination/${slug}/${destinationId}`;
  };

  const filteredDestinations = useMemo(() => {
    if (!searchTerm) return allDestinations;
    return allDestinations.filter(dest =>
      (dest.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dest.country || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allDestinations, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <PageHeader title="Popular Destinations" subtitle="Explore the world with us" bgImage="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1920" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <PageHeader title="Destinations" bgImage="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1920" />
        <div className="flex-1 flex items-center justify-center text-red-500">
          Error loading destinations: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <PageHeader
        title="Popular Destinations"
        subtitle="Discover amazing places waiting for your arrival"
        breadcrumb="Destinations"
        bgImage="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      <div className="container mx-auto px-4 py-16">

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-full shadow-lg flex items-center p-2 border border-gray-100">
              <Search className="ml-4 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-gray-700 font-medium placeholder-gray-400"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDestinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              dest={dest}
              onClick={handleDestinationClick}
            />
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No destinations found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationList;