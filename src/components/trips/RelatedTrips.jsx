import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar, ArrowRight, Star } from 'lucide-react';

const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const TRIPS_API_URL = 'https://api.yaadigo.com/secure/api/trips/';
const CATEGORIES_API_URL = 'https://api.yaadigo.com/secure/api/categories/';

const formatDate = (isoDate) => {
  if (!isoDate) return null;
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch { return null; }
};

const getTripDetails = (trip) => {
  let price = null;
  let dates = null;
  let batches = 0;
  const fixedDepartures = trip.pricing?.fixed_departure;

  if (trip.pricing_model === 'custom' && trip.pricing?.customized?.base_price) {
    price = trip.pricing.customized.final_price || trip.pricing.customized.base_price;
  }
  if (fixedDepartures?.length > 0) {
    const firstDep = fixedDepartures[0];
    const d1 = formatDate(firstDep.from_date);
    const d2 = fixedDepartures[1] ? formatDate(fixedDepartures[1].from_date) : null;
    dates = d2 ? `${d1} · ${d2}` : d1;
    batches = Math.max(0, fixedDepartures.length - 2);
    const pkg = firstDep.costingPackages?.[0];
    if (pkg?.final_price) price = pkg.final_price;
    else if (pkg?.base_price) price = pkg.base_price;
  }
  if (price) price = String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return { price, dates, batches };
};

// ─── Trip Card ───────────────────────────────────────────────────────────────
const TripCard = React.memo(({ trip, cardsToShow }) => {
  const { price, dates, batches } = getTripDetails(trip);
  const tripUrl = trip.slug
    ? `/trip-preview/${trip.slug}/${trip.id}`
    : `/trips/${trip.id}`;

  return (
    <div className="flex-shrink-0 px-2" style={{ width: `${100 / cardsToShow}%` }}>
      <a
        href={tripUrl}
        className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#D4AF37]/30 transition-all duration-400 hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-gray-100">
          <img
            src={trip.hero_image || 'https://images.unsplash.com/photo-1506744038136-42e5d47926e8?fit=crop&w=800&h=600'}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Price badge */}
          {price && (
            <div className="absolute top-3 right-3 bg-[#D4AF37] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              ₹{price}
            </div>
          )}
          {/* Duration pill */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#D4AF37]" />
            {trip.days}D/{trip.nights}N
          </div>
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-[#2C6B4F]/0 group-hover:bg-[#2C6B4F]/10 transition-colors duration-300 flex items-center justify-center">
            <div className="bg-white text-[#2C6B4F] text-xs font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 shadow-lg">
              View Details <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4">
          <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 leading-snug mb-2 group-hover:text-[#2C6B4F] transition-colors">
            {trip.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <MapPin className="w-3 h-3 text-[#2C6B4F] flex-shrink-0" />
            <span className="truncate">{trip.pickup_location || 'N/A'} → {trip.drop_location || 'N/A'}</span>
          </div>
          {dates && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
              <span>{dates}</span>
              {batches > 0 && <span className="text-[#2C6B4F] font-semibold">+{batches} more</span>}
            </div>
          )}
        </div>
      </a>
    </div>
  );
});

// ─── Carousel Section ─────────────────────────────────────────────────────────
const CarouselSection = ({ title, emoji, trips, cardsToShow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => setCurrentIndex(0), [trips]);

  if (trips.length === 0) return null;
  const maxIndex = Math.max(0, trips.length - cardsToShow);

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xl">{emoji}</span>
        <h3
          className="text-base md:text-lg font-bold text-gray-800"
          dangerouslySetInnerHTML={{ __html: title.replace(/\*\*(.*?)\*\*/g, '<span class="text-[#2C6B4F]">$1</span>') }}
        />
        <div className="flex-1 h-px bg-gray-100" />
        {/* Arrow controls inline with header */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#2C6B4F] hover:text-[#2C6B4F] disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentIndex(p => Math.min(maxIndex, p + 1))}
            disabled={currentIndex >= maxIndex}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#2C6B4F] hover:text-[#2C6B4F] disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-400 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}
        >
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} cardsToShow={cardsToShow} />
          ))}
        </div>
      </div>

      {/* Dot indicators — only if many slides */}
      {maxIndex > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === currentIndex ? '20px' : '6px',
                background: i === currentIndex ? '#2C6B4F' : '#D1D5DB',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Metadata Hook ────────────────────────────────────────────────────────────
const useTripMetadata = (currentTripId) => {
  const [metadata, setMetadata] = useState({ categoryName: 'Similar', isFetching: false });

  useEffect(() => {
    if (!currentTripId) return;
    const fetch = async () => {
      setMetadata(p => ({ ...p, isFetching: true }));
      try {
        const [catRes, tripRes] = await Promise.all([
          axios.get(CATEGORIES_API_URL, { headers: { "x-api-key": API_KEY } }),
          axios.get(`${TRIPS_API_URL}${currentTripId}/`, { headers: { "x-api-key": API_KEY } }),
        ]);
        const categoryMap = new Map((catRes.data.data || []).map(c => [String(c.id), c.title]));
        const currentTrip = tripRes.data.data || tripRes.data;
        const catIds = Array.isArray(currentTrip.category_id) ? currentTrip.category_id.map(String) : [];
        const name = catIds.length > 0 ? (categoryMap.get(catIds[0]) || 'Similar') : 'Similar';
        setMetadata({ categoryName: name, isFetching: false });
      } catch {
        setMetadata({ categoryName: 'Similar', isFetching: false });
      }
    };
    fetch();
  }, [currentTripId]);

  return metadata;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RelatedTrips({ currentTripId }) {
  const [categoryTrips, setCategoryTrips] = useState([]);
  const [destinationTrips, setDestinationTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardsToShow, setCardsToShow] = useState(3);
  const { categoryName, isFetching } = useTripMetadata(currentTripId);

  useEffect(() => {
    const get = () => {
      if (window.innerWidth >= 1280) return 4;
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    };
    const update = () => setCardsToShow(get());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (!currentTripId) { setLoading(false); return; }
    const run = async () => {
      try {
        setLoading(true);
        const [currentRes, allRes] = await Promise.all([
          axios.get(`${TRIPS_API_URL}${currentTripId}/`, { headers: { "x-api-key": API_KEY } }),
          axios.get(`${TRIPS_API_URL}?skip=0&limit=1000`, { headers: { "x-api-key": API_KEY } }),
        ]);
        const current = currentRes.data.data || currentRes.data;
        const currentCatIds = Array.isArray(current.category_id) ? current.category_id.map(String) : [];
        const currentDestId = current.destination_id;
        const all = allRes.data.data || [];

        const catMatches = [], destMatches = [];
        all.forEach(t => {
          if (String(t.id) === String(currentTripId)) return;
          if (currentDestId && t.destination_id === currentDestId) destMatches.push(t);
          const tCats = Array.isArray(t.category_id) ? t.category_id.map(String) : [];
          if (tCats.some(c => currentCatIds.includes(c)) && String(t.destination_id) !== String(currentDestId)) {
            catMatches.push(t);
          }
        });
        setCategoryTrips(catMatches);
        setDestinationTrips(destMatches);
      } catch (e) {
        console.error("RelatedTrips fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [currentTripId]);

  const hasAny = categoryTrips.length > 0 || destinationTrips.length > 0;

  if (loading || isFetching) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-[#2C6B4F] border-t-transparent rounded-full animate-spin" />
          Loading recommendations...
        </div>
      </div>
    );
  }

  if (!hasAny) return null;

  const destTitle = `More trips in this destination`;
  const catTitle = categoryName.toLowerCase().includes('honeymoon')
    ? `Romantic **${categoryName}** Packages`
    : `More **${categoryName}** Packages`;

  return (
    <div className="py-6 px-0">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-6 h-px bg-[#D4AF37]" />
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">You May Also Like</span>
        </div>
        <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900">
          More Similar <span className="text-[#2C6B4F]">Packages</span>
        </h2>
      </div>

      <div className="space-y-8">
        {destinationTrips.length > 0 && (
          <CarouselSection
            title={destTitle}
            emoji="🗺️"
            trips={destinationTrips}
            cardsToShow={cardsToShow}
          />
        )}
        {destinationTrips.length > 0 && categoryTrips.length > 0 && (
          <div className="border-t border-gray-100" />
        )}
        {categoryTrips.length > 0 && (
          <CarouselSection
            title={catTitle}
            emoji="🏞️"
            trips={categoryTrips}
            cardsToShow={cardsToShow}
          />
        )}
      </div>
    </div>
  );
}