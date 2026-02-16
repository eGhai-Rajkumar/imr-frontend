import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar } from 'lucide-react';

// --- API Constants ---
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const TRIPS_API_URL = 'https://api.yaadigo.com/secure/api/trips/';
const CATEGORIES_API_URL = 'https://api.yaadigo.com/secure/api/categories/';

// --- Helper Functions ---

/**
 * Formats ISO date string to "Day Month" (e.g., "15 Dec").
 */
const formatDate = (isoDate) => {
  if (!isoDate) return 'N/A';
  try {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month}`;
  } catch {
    return 'N/A';
  }
};

/**
 * Extracts price, dates, and batches from the trip's pricing object. (Logic unchanged)
 */
const getTripDetails = (trip) => {
  let price = 'Price TBD';
  let dates = 'Dates TBD';
  let batches = '+0 batches';
  
  const fixedDepartures = trip.pricing?.fixed_departure;

  if (trip.pricing_model === 'custom' && trip.pricing?.customized?.base_price) {
    price = trip.pricing.customized.final_price || trip.pricing.customized.base_price;
  }
  
  if (fixedDepartures && fixedDepartures.length > 0) {
    const firstDeparture = fixedDepartures[0];
    const secondDeparture = fixedDepartures.length > 1 ? fixedDepartures[1] : null;

    let startDate1 = formatDate(firstDeparture.from_date);
    let datesString = startDate1;

    if (secondDeparture) {
      let startDate2 = formatDate(secondDeparture.from_date);
      datesString += `, ${startDate2}`;
    }
    dates = datesString;
    
    batches = `+${Math.max(0, fixedDepartures.length - 2)} batches`;
    
    const firstCostingPackage = firstDeparture.costingPackages?.[0];
    if (firstCostingPackage?.final_price) {
      price = firstCostingPackage.final_price;
    } else if (firstCostingPackage?.base_price) {
      price = firstCostingPackage.base_price;
    }
  }

  price = String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return { price, dates, batches };
};


// --- Sub-Components ---

/**
 * Renders a single trip card. FIX: Now uses the trip's slug and ID for the URL.
 */
const TripCard = React.memo(({ trip, index, cardsToShow }) => {
    const { price, dates, batches } = getTripDetails(trip);

    const cardStyle = { width: `${100 / cardsToShow}%` };

    const formattedTrip = {
        id: trip.id,
        slug: trip.slug, // Include slug
        image: trip.hero_image || 'https://images.unsplash.com/photo-1506744038136-42e5d47926e8?fit=crop&w=800&h=600',
        title: trip.title,
        price: price,
        duration: `${trip.days}N/${trip.nights}D`,
        route: `${trip.pickup_location || 'N/A'} - ${trip.drop_location || 'N/A'}`,
        dates: dates,
        batches: batches,
    };

    // *** FIX: Constructed URL using the slug and ID, matching the example: /trip-preview/{slug}/{id} ***
    const tripUrl = formattedTrip.slug 
        ? `/trip-preview/${formattedTrip.slug}/${formattedTrip.id}`
        : `/trips/${formattedTrip.id}`; // Fallback 

    return (
        <div key={formattedTrip.id} className="flex-shrink-0 px-3" style={cardStyle}>
            <a 
                href={tripUrl} 
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in bg-white block cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                {/* Image */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                    <img
                        src={formattedTrip.image}
                        alt={formattedTrip.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce-soft">
                        ₹{formattedTrip.price}/- Onwards
                    </div>

                    {/* Click Indicator (Visual cue for linking) */}
                    <div className="absolute inset-0 bg-cyan-600/0 group-hover:bg-cyan-600/10 transition-all duration-300 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300">
                            <span className="text-cyan-600 font-bold text-sm">View Details</span>
                        </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    {/* Title and Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-white text-xl font-bold mb-4 line-clamp-2">{formattedTrip.title}</h3>
                        <div className="space-y-2">
                            <div className="flex items-start gap-4 text-white/90 text-sm">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-cyan-400" />
                                    <span className="font-semibold">{formattedTrip.duration}</span>
                                </div>
                                <div className="flex items-start gap-2 flex-1">
                                    <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                                    <span className="font-medium line-clamp-1">{formattedTrip.route}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-white/90 text-sm">
                                <Calendar className="w-4 h-4 text-cyan-400" />
                                <span className="font-medium">{formattedTrip.dates}</span>
                                <span className="text-cyan-400 font-semibold">{formattedTrip.batches}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-cyan-400 rounded-2xl transition-all duration-300 pointer-events-none"></div>
            </a>
        </div>
    );
});

/**
 * Renders the carousel structure for a set of trips. 
 */
const CarouselSection = ({ title, trips, cardsToShow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0); 
  }, [trips]);
  
  if (trips.length === 0) {
    return null;
  }

  const maxIndex = Math.max(0, trips.length - cardsToShow);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  return (
    <div className="mb-16">
        {/* Dynamic Title with Bolding */}
        <h3 
            className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4" 
            dangerouslySetInnerHTML={{ __html: title.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} 
        />
        
        <div className="relative">
             {/* Navigation Buttons */}
             {currentIndex > 0 && (
                <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-300 hover:scale-110 animate-fade-in" aria-label={`Previous ${title}`}>
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
            )}

            {currentIndex < maxIndex && (
                <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-300 hover:scale-110 animate-fade-in" aria-label={`Next ${title}`}>
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
                        <TripCard 
                            key={trip.id}
                            trip={trip}
                            index={index}
                            cardsToShow={cardsToShow}
                            // handleTripClick is no longer needed here as linking is native in the card
                        />
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
                                index === currentIndex ? 'bg-cyan-600 w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}


// --- Custom Hook to fetch Metadata (Unchanged) ---

const useTripMetadata = (currentTripId) => {
    const [metadata, setMetadata] = useState({ 
        categoryName: 'Similar', 
        destinationName: 'This Region', 
        isFetching: false,
    });

    useEffect(() => {
        if (!currentTripId) return;

        const fetchMetadata = async () => {
            setMetadata(prev => ({ ...prev, isFetching: true }));
            try {
                // 1. Fetch Categories Map
                const categoryRes = await axios.get(CATEGORIES_API_URL, {
                    headers: { "x-api-key": API_KEY }
                });
                const categoryData = categoryRes.data.data || [];
                const categoryMap = new Map(categoryData.map(c => [String(c.id), c.title]));
                
                // 2. Fetch current trip details (to get category_id)
                const currentTripRes = await axios.get(`${TRIPS_API_URL}${currentTripId}/`, {
                     headers: { "x-api-key": API_KEY }
                });
                const currentTrip = currentTripRes.data.data || currentTripRes.data;
                
                let primaryCategoryName = 'Similar';
                const currentTripCategoryIds = Array.isArray(currentTrip.category_id) 
                    ? currentTrip.category_id.map(String) 
                    : [];

                if (currentTripCategoryIds.length > 0) {
                    const firstCategory = categoryMap.get(currentTripCategoryIds[0]);
                    if (firstCategory) {
                        primaryCategoryName = firstCategory;
                    }
                }
                
                setMetadata({
                    categoryName: primaryCategoryName,
                    destinationName: 'This Region', 
                    isFetching: false,
                });

            } catch (error) {
                console.error("❌ Error fetching metadata:", error);
                setMetadata({ categoryName: 'Similar', destinationName: 'This Region', isFetching: false });
            }
        };

        fetchMetadata();
    }, [currentTripId]);

    return metadata;
};


// --- Main Component ---

export default function RelatedTrips({ currentTripId }) {
  const [categoryTrips, setCategoryTrips] = useState([]);
  const [destinationTrips, setDestinationTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardsToShow, setCardsToShow] = useState(4); 
  
  const { categoryName, destinationName, isFetching } = useTripMetadata(currentTripId);

  // --- Utility for Responsive Design ---
  const getCardsToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return 4; 
      if (window.innerWidth >= 1024) return 3; 
      if (window.innerWidth >= 768) return 2; 
      return 1; 
    }
    return 4;
  };

  useEffect(() => {
    const handleResize = () => setCardsToShow(getCardsToShow());
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // --- Fetch and Filter Logic ---
  useEffect(() => {
    if (!currentTripId) {
        setLoading(false);
        return;
    }

    const fetchAndFilterTrips = async () => {
      try {
        setLoading(true);

        // 1. Fetch current trip's criteria
        const currentTripRes = await axios.get(`${TRIPS_API_URL}${currentTripId}/`, {
             headers: { "x-api-key": API_KEY }
        });
        const currentTrip = currentTripRes.data.data || currentTripRes.data;
        
        const currentTripCategoryIds = Array.isArray(currentTrip.category_id) 
            ? currentTrip.category_id.map(String) 
            : [];
        const currentTripDestinationId = currentTrip.destination_id;
        
        // 2. Fetch ALL trips for comparison
        const allTripsRes = await axios.get(`${TRIPS_API_URL}?skip=0&limit=1000`, {
          headers: { "x-api-key": API_KEY },
        });
        const allRawTrips = allTripsRes.data.data || [];
        
        // 3. Filter into two lists
        const categoryMatches = [];
        const destinationMatches = [];

        allRawTrips.forEach(trip => {
            if (String(trip.id) === String(currentTripId)) {
                return;
            }
            
            // Destination Filter
            if (currentTripDestinationId && trip.destination_id && trip.destination_id === currentTripDestinationId) {
                destinationMatches.push(trip);
            }

            // Category Filter
            const tripCategories = Array.isArray(trip.category_id) 
                ? trip.category_id.map(String) 
                : [];

            const hasOverlappingCategory = tripCategories.some(catId => 
                currentTripCategoryIds.includes(catId)
            );
            
            if (hasOverlappingCategory) {
                if (String(trip.destination_id) !== String(currentTripDestinationId)) {
                    categoryMatches.push(trip);
                }
            }
        });
        
        setCategoryTrips(categoryMatches);
        setDestinationTrips(destinationMatches);

      } catch (error) {
        console.error("❌ Error fetching or filtering related trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterTrips();
  }, [currentTripId]); 
  
  // Placeholder click handler (not used by the card itself anymore)
  const handleTripClick = (clickedTripId) => {
    console.log(`Manual navigation attempted for ID: ${clickedTripId}`);
  };
  
  // --- Dynamic Title Generation ---
  const dynamicDestinationTitle = `🗺️ More Trips in the **${destinationName}**`; 
    
  const dynamicCategoryTitle = categoryName.toLowerCase().includes('honeymoon') 
    ? `💍 Romantic **${categoryName}** Packages`
    : `🏞️ More **${categoryName}** Packages You'll Love`;


  const hasAnyTrips = categoryTrips.length > 0 || destinationTrips.length > 0;

  if (loading || isFetching) {
    return (
      <section className="py-16 px-4 bg-gray-50 text-center text-gray-500">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">More Trips</h2>
        <p>Loading trip recommendations...</p>
      </section>
    );
  }

  if (!hasAnyTrips) {
    return null; 
  }

  // --- Main Render ---
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Main Header */}
        <div className="text-center mb-12 animate-slide-in-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 inline-block pb-3">
            More Trips You'll Love
            <div className="w-16 h-1 bg-blue-600 mx-auto mt-2"></div>
          </h2>
        </div>

        {/* --- Section 1: Similar Trips in the Same Destination --- */}
        <CarouselSection
            title={dynamicDestinationTitle}
            trips={destinationTrips}
            cardsToShow={cardsToShow}
            handleTripClick={handleTripClick} 
        />
        
        <hr className="my-10 border-gray-200" />
        
        {/* --- Section 2: Similar Trip Categories --- */}
        <CarouselSection
            title={dynamicCategoryTitle}
            trips={categoryTrips}
            cardsToShow={cardsToShow}
            handleTripClick={handleTripClick}
        />
      </div>

      <style>{`
        /* CSS ANIMATIONS */
        @keyframes slide-in-left { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounce-soft { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.6s ease-out backwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-bounce-soft { animation: bounce-soft 2s ease-in-out infinite; }

        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </section>
  );
}