import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Sliders, Star, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import PageHeader from '../../../components/layout/PageHeader';

// --- External Component Import ---
import TripCard from "../../../components/trips/TripCard";

// --- API Configuration ---
const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

// Helper to get full image URL
const getFullImageUrl = (path) =>
    !path || typeof path !== "string" ? '' :
        path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

// --- STANDARDIZE TRIP DATA ---
const standardizeTripData = (t) => {
    const isFixed =
        t.pricing_model === 'fixed_departure' ||
        t.pricing_model === 'fixed' ||
        (t.fixed_departure && t.fixed_departure.length > 0) ||
        (t.pricing?.fixed_departure && t.pricing.fixed_departure.length > 0);

    const fixedPricePackage = t.pricing?.fixed_departure?.[0]?.costingPackages?.[0];

    const finalPriceRaw = isFixed
        ? (fixedPricePackage?.final_price || 0)
        : (t.pricing?.customized?.final_price || 0);

    const discount = isFixed
        ? (fixedPricePackage?.discount || 0)
        : (t.pricing?.customized?.discount || 0);

    const toursAvailableCount = t.trip_count || t.fixed_departure?.length || (Math.floor(Math.random() * 20) + 5);

    return {
        ...t,
        id: t._id || t.id || `temp-${Math.random().toString(36).substring(7)}`,
        price: finalPriceRaw,
        rating: t.rating || 4.5,
        category_ids: Array.isArray(t.category_id) ? t.category_id.map(String) : [],
        destination_id: String(t.destination_id) || null,
        pricing_model: isFixed ? 'fixed_departure' : 'customized',
        is_fixed_departure: isFixed,
        days: t.days || 0,
        nights: t.nights || 0,
        location: t.pickup_location || 'Unknown',
        hero_image: t.hero_image,
        toursAvailable: `${toursAvailableCount} Tours Available`,
        discount: discount,
        final_price_display: finalPriceRaw > 0 ? finalPriceRaw.toLocaleString('en-IN') : "N/A",
        pricing: t.pricing
    };
};

const TripInquiryModal = ({ isOpen, onClose, tripName }) => {
    return isOpen ? (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full animate-fade-in-up">
                <h2 className="text-xl font-serif font-bold text-primary mb-4">Inquiry for: {tripName}</h2>
                <p className="text-gray-600 mb-6">Our team will contact you shortly regarding this trip.</p>
                <button onClick={onClose} className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors">Close</button>
            </div>
        </div>
    ) : null;
};

export default function ToursListingPage() {
    const [searchParams] = useSearchParams();
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState([0, 500000]);
    const [selectedDurations, setSelectedDurations] = useState([]);
    const [selectedDestinations, setSelectedDestinations] = useState([]);
    const [selectedTripTypes, setSelectedTripTypes] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTripName, setSelectedTripName] = useState('');

    const [apiTours, setApiTours] = useState([]);
    const [categories, setCategories] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const [showAllDestinations, setShowAllDestinations] = useState(false);
    const scrollRef = useRef(null);
    const scrollStep = 300;

    // --- Navigation Handlers ---
    const scrollCategories = (direction) => {
        if (scrollRef.current) {
            const currentScroll = scrollRef.current.scrollLeft;
            const newScroll = direction === 'left' ? currentScroll - scrollStep : currentScroll + scrollStep;
            scrollRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }
    };

    // --- Filter Handlers ---
    const handleClearFilters = () => {
        setSelectedDurations([]);
        setSelectedDestinations([]);
        setSelectedTripTypes([]);
        setSelectedCategories([]);
        setPriceRange([0, 500000]);
        setShowFilters(false);
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId) ? [] : [categoryId]
        );
    };

    const handleDurationChange = (duration) => {
        setSelectedDurations(prev =>
            prev.includes(duration)
                ? prev.filter(d => d !== duration)
                : [...prev, duration]
        );
    };

    const handleDestinationChange = (destinationId) => {
        setSelectedDestinations(prev =>
            prev.includes(destinationId)
                ? prev.filter(id => id !== destinationId)
                : [...prev, destinationId]
        );
    };

    const handleTripTypeChange = (type) => {
        setSelectedTripTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    // --- FETCH CATEGORIES ---
    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/categories/`, { headers: { "x-api-key": API_KEY } });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const json = await response.json();

            const dynamicCategories = (json.data || []).map(cat => ({
                id: String(cat._id || cat.id),
                name: cat.name,
                slug: cat.slug,
                image: Array.isArray(cat.image) && cat.image.length > 0 ? getFullImageUrl(cat.image[0]) : null,
            }));

            setCategories(dynamicCategories);
        } catch (error) {
            console.error("🚨 Failed to fetch categories:", error);
        }
    }, []);

    // --- FETCH DESTINATIONS ---
    const fetchDestinations = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/destinations/`, { headers: { "x-api-key": API_KEY } });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const json = await response.json();

            const fetchedDestinations = (json.data || []).map(dest => ({
                id: String(dest._id || dest.id),
                name: dest.title || dest.name,
            }));

            setDestinations(fetchedDestinations);
        } catch (error) {
            console.error("🚨 Failed to fetch destinations:", error);
        }
    }, []);

    // --- FETCH TOURS ---
    const fetchTours = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const response = await fetch(`${API_URL}/trips/`, { headers: { "x-api-key": API_KEY } });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const json = await response.json();
            const tours = json.data || [];

            const standardizedTours = tours.map(tour => standardizeTripData(tour));
            setApiTours(standardizedTours);

        } catch (error) {
            console.error("🚨 Failed to fetch tours:", error);
            setFetchError("Failed to load tours.");
            setApiTours([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTours();
        fetchCategories();
        fetchDestinations();
    }, [fetchTours, fetchCategories, fetchDestinations]);

    // --- FILTERING LOGIC ---
    const applyFilters = (item) => {
        const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

        const matchesCategoryFilter = selectedCategories.length === 0 ||
            selectedCategories.some(catId => item.category_ids.includes(catId));

        const matchesDuration = selectedDurations.length === 0 || selectedDurations.some(d => {
            if (d === '1-3') return item.days >= 1 && item.days <= 3;
            if (d === '4-7') return item.days >= 4 && item.days <= 7;
            if (d === '8-14') return item.days >= 8 && item.days <= 14;
            if (d === '15+') return item.days >= 15;
            return false;
        });

        const matchesDestination = selectedDestinations.length === 0 ||
            selectedDestinations.includes(item.destination_id);

        const matchesTripType = selectedTripTypes.length === 0 || selectedTripTypes.some(type => {
            if (type === 'fixed_departure') {
                return item.is_fixed_departure === true;
            } else if (type === 'customized') {
                return item.is_fixed_departure === false;
            }
            return false;
        });

        return matchesPrice && matchesDuration && matchesCategoryFilter && matchesDestination && matchesTripType;
    };

    const filteredTours = useMemo(() => {
        return apiTours.filter(applyFilters);
    }, [apiTours, priceRange, selectedDurations, selectedCategories, selectedDestinations, selectedTripTypes]);

    const sortedTours = useMemo(() => {
        return [...filteredTours].sort((a, b) => {
            if (sortBy === 'popular') return (b.rating || 0) - (a.rating || 0);
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            return 0;
        });
    }, [filteredTours, sortBy]);

    const handleQueryClick = (trip) => {
        setModalOpen(true);
        setSelectedTripName(trip.title);
    };

    const getTotalFilteredCount = () => sortedTours.length;

    // --- RENDER ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface flex flex-col">
                <PageHeader title="Explore Tours" subtitle="Find your next adventure" bgImage="https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg?auto=compress&cs=tinysrgb&w=1920" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium tracking-wide">Curating best trips for you...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="min-h-screen bg-surface flex flex-col">
                <PageHeader title="Explore Tours" subtitle="Find your next adventure" bgImage="https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg?auto=compress&cs=tinysrgb&w=1920" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 text-lg mb-4">{fetchError}</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Retry</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface">
            <PageHeader
                title="Explore Tours"
                subtitle="Discover our handcrafted itineraries for an unforgettable journey"
                breadcrumb="Trips"
                bgImage="https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg?auto=compress&cs=tinysrgb&w=1920"
            />

            <div className="max-w-7xl mx-auto px-4 py-12">

                {/* --- CATEGORY SLIDER --- */}
                {categories.length > 0 && (
                    <div className="mb-12 relative group/slider">
                        <div ref={scrollRef} className="flex overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                            <div className="flex gap-6 px-1">
                                {categories.map((category) => {
                                    const isSelected = selectedCategories.includes(category.id);
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategoryClick(category.id)}
                                            className={`group flex flex-col items-center gap-3 flex-shrink-0 transition-all duration-300 snap-center`}
                                        >
                                            <div className={`w-24 h-24 rounded-full p-1 border-2 transition-all duration-300 ${isSelected ? 'border-accent scale-110' : 'border-transparent group-hover:border-primary/30'}`}>
                                                <div className="w-full h-full rounded-full overflow-hidden shadow-lg relative">
                                                    {category.image ? (
                                                        <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    ) : (
                                                        <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-2xl">
                                                            {category.name[0]}
                                                        </div>
                                                    )}
                                                    {isSelected && <div className="absolute inset-0 bg-accent/20"></div>}
                                                </div>
                                            </div>
                                            <span className={`text-sm font-bold tracking-wide transition-colors ${isSelected ? 'text-accent' : 'text-gray-600 group-hover:text-primary'}`}>
                                                {category.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Scroll Buttons */}
                        <button onClick={() => scrollCategories('left')} className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg text-primary opacity-0 group-hover/slider:opacity-100 transition-opacity hover:scale-110 z-10 hidden md:block">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={() => scrollCategories('right')} className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg text-primary opacity-0 group-hover/slider:opacity-100 transition-opacity hover:scale-110 z-10 hidden md:block">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8 relative">

                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden w-full">
                        <button onClick={() => setShowFilters(true)} className="w-full py-3 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center gap-2 font-bold">
                            <Filter className="w-5 h-5" /> Filters & Sort
                        </button>
                    </div>

                    {/* Sidebar Container */}
                    <aside className={`fixed lg:sticky lg:top-24 inset-y-0 left-0 z-50 lg:z-10 w-80 bg-white lg:h-fit lg:rounded-2xl shadow-2xl lg:shadow-soft transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
                        <div className="p-6 border-b border-gray-100 lg:hidden flex justify-between items-center bg-primary text-white">
                            <h3 className="text-xl font-bold">Filters</h3>
                            <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-white/20 rounded-lg">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)] lg:max-h-[calc(100vh-120px)] custom-scrollbar">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                    <Sliders className="w-5 h-5" /> Filters
                                </h3>
                                <button onClick={handleClearFilters} className="text-xs text-gray-500 hover:text-accent underline">Clear All</button>
                            </div>

                            {/* Price Range */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-4">Price Range</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="500000"
                                    step="10000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                                />
                                <div className="flex justify-between mt-2 text-sm text-gray-600 font-medium">
                                    <span>₹0</span>
                                    <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-4">Duration</label>
                                <div className="space-y-3">
                                    {['1-3', '4-7', '8-14', '15+'].map(duration => (
                                        <label key={duration} className="flex items-center cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedDurations.includes(duration) ? 'bg-primary border-primary' : 'border-gray-300 bg-white group-hover:border-primary'}`}>
                                                {selectedDurations.includes(duration) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={selectedDurations.includes(duration)}
                                                onChange={() => handleDurationChange(duration)}
                                                className="hidden"
                                            />
                                            <span className="ml-3 text-gray-600 group-hover:text-primary transition-colors">
                                                {duration === '15+' ? '15+ days' : `${duration} days`}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Destination */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-4">Destination</label>
                                {destinations.length > 0 ? (
                                    <>
                                        <div className={`space-y-2 overflow-hidden transition-all duration-500 ${showAllDestinations ? 'max-h-96 overflow-y-auto custom-scrollbar' : 'max-h-48'}`}>
                                            {destinations.map(dest => (
                                                <label key={dest.id} className="flex items-center cursor-pointer group">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${selectedDestinations.includes(dest.id) ? 'bg-primary border-primary' : 'border-gray-300 bg-white group-hover:border-primary'}`}>
                                                        {selectedDestinations.includes(dest.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedDestinations.includes(dest.id)}
                                                        onChange={() => handleDestinationChange(dest.id)}
                                                        className="hidden"
                                                    />
                                                    <span className="ml-3 text-gray-600 group-hover:text-primary transition-colors text-sm">
                                                        {dest.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        {destinations.length > 5 && (
                                            <button
                                                onClick={() => setShowAllDestinations(prev => !prev)}
                                                className="mt-3 text-xs text-accent font-bold uppercase tracking-wide hover:underline"
                                            >
                                                {showAllDestinations ? '- View Less' : '+ View More'}
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-xs text-gray-400">Loading...</p>
                                )}
                            </div>

                            {/* Trip Type */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-4">Trip Type</label>
                                <div className="space-y-3">
                                    {['fixed_departure', 'customized'].map(type => (
                                        <label key={type} className="flex items-center cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTripTypes.includes(type) ? 'bg-primary border-primary' : 'border-gray-300 bg-white group-hover:border-primary'}`}>
                                                {selectedTripTypes.includes(type) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={selectedTripTypes.includes(type)}
                                                onChange={() => handleTripTypeChange(type)}
                                                className="hidden"
                                            />
                                            <span className="ml-3 text-gray-600 group-hover:text-primary transition-colors">
                                                {type === 'fixed_departure' ? 'Fixed Departure' : 'Customized'}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Overlay */}
                        {showFilters && <div className="fixed inset-0 bg-black/50 z-[-1] lg:hidden" onClick={() => setShowFilters(false)} />}
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-gray-600">Showing <strong className="text-primary">{getTotalFilteredCount()}</strong> tours</p>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-primary text-sm cursor-pointer hover:bg-white transition-colors"
                                >
                                    <option value="popular">Most Popular</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                            {sortedTours.map((tour) => (
                                <TripCard
                                    key={tour.id}
                                    trip={tour}
                                    onSendQuery={handleQueryClick}
                                />
                            ))}
                        </div>

                        {sortedTours.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No tours found</h3>
                                <p className="text-gray-500">Try adjusting your filters or price range.</p>
                                <button onClick={handleClearFilters} className="mt-6 px-6 py-2 bg-gray-100 text-primary font-bold rounded-lg hover:bg-gray-200 transition-colors">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <TripInquiryModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                tripName={selectedTripName}
            />

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 4px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: #9ca3af;
                }
            `}</style>
        </div>
    );
}