import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, Compass, ArrowRight } from 'lucide-react';

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

const getFullImageUrl = (path) =>
    !path || typeof path !== "string" ? '' :
        path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

export default function TrendingDestination() {
    const [destinations, setDestinations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef(null);

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
                let totalTrips = 0;
                if (Array.isArray(d.custom_packages)) {
                    d.custom_packages.forEach(pkg => {
                        if (Array.isArray(pkg.trips)) totalTrips += pkg.trips.length;
                        else if (Array.isArray(pkg.trip_ids)) totalTrips += pkg.trip_ids.length;
                    });
                } else if (Array.isArray(d.popular_trips)) {
                    totalTrips += d.popular_trips.length;
                }

                const heroImage = d.hero_banner_images?.[0] || d.image || d.hero_image || d.images?.[0]?.path || '';

                return {
                    id: d._id || d.id,
                    name: d.name || d.title || 'Unknown',
                    country: d.destination_type || 'Global',
                    destinationId: d._id || d.id,
                    image: getFullImageUrl(heroImage),
                    tourCount: totalTrips,
                };
            });

            setDestinations(standardizedList);
        } catch (error) {
            console.error("Error fetching destinations:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDestinations();
    }, [fetchDestinations]);

    const handleDestinationClick = (destinationId) => {
        window.location.href = `/destinfo?destinationId=${destinationId}`;
    };

    if (isLoading) return null;
    if (destinations.length === 0) return null;

    return (
        <section className="py-24 bg-surface relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3">
                            <Compass className="h-4 w-4" />
                            <span>Bucket List</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-dark leading-tight">
                            Trending Destinations
                        </h2>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <button
                            onClick={() => scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all active:scale-95"
                        >
                            <ArrowRight className="w-5 h-5 rotate-180" />
                        </button>
                        <button
                            onClick={() => scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all active:scale-95"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* --- Horizontal Scroll Container --- */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {destinations.map((destination) => (
                        <div
                            key={destination.id}
                            className="flex-shrink-0 w-80 md:w-96 snap-center"
                        >
                            <div
                                onClick={() => handleDestinationClick(destination.destinationId)}
                                className="group relative h-[500px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2"
                            >
                                {/* Image with Parallax-like Zoom */}
                                <img
                                    src={destination.image}
                                    alt={destination.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                {/* Top Badge */}
                                <div className="absolute top-6 left-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                        <MapPin className="w-3 h-3 text-accent" />
                                        <span className="text-xs font-bold text-white uppercase tracking-wide">{destination.country}</span>
                                    </div>
                                </div>

                                {/* Bottom Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-4xl font-serif font-bold text-white mb-2 leading-none group-hover:text-accent transition-colors">
                                        {destination.name}
                                    </h3>

                                    <div className="w-16 h-1 bg-accent rounded-full mb-4 origin-left transform scale-x-50 group-hover:scale-x-100 transition-transform duration-500" />

                                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        <p className="text-white/80 font-medium text-sm">
                                            {destination.tourCount} Curated Tours
                                        </p>
                                        <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}