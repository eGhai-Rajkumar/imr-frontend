import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

// --- Configuration Constants ---
const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";
const CARD_WIDTH = 344;

// --- Utility Function ---
const getFullImageUrl = (path) => 
    !path || typeof path !== "string" 
        ? '' 
        : path.startsWith("http") 
            ? path 
            : `${IMAGE_BASE_URL}${path}`;

// --- Main Component ---
export default function HolidaySection() {
    // --- State Management ---
    const [destinations, setDestinations] = useState([]);
    const [infiniteDestinations, setInfiniteDestinations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    
    // --- Carousel State and Refs ---
    const [isDragging, setIsDragging] = useState(false);
    const scrollRef = useRef(null);
    const animationRef = useRef(null);
    const dragStartX = useRef(0);
    const dragStartScrollLeft = useRef(0);
    const hasMoved = useRef(false);
    const scrollSpeed = useRef(1);

    // --- Data Fetching Logic ---
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
                    name: d.name || d.title || 'Unknown',
                    country: d.destination_type || 'Global',
                    destinationId: d._id || d.id,
                    image: getFullImageUrl(heroImage), 
                    tourCount: totalTrips,
                };
            });

            setDestinations(standardizedList);
            setInfiniteDestinations([...standardizedList, ...standardizedList, ...standardizedList]);

        } catch (error) {
            console.error("Error fetching destinations:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDestinations();
    }, [fetchDestinations]);

    // --- Interaction Handlers ---
    const handleDestinationClick = (destinationId) => {
        if (!hasMoved.current) {
            const url = `/destinfo?destinationId=${destinationId}`;
            window.location.href = url;
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setIsPaused(true);
        hasMoved.current = false;
        dragStartX.current = e.pageX - scrollRef.current.offsetLeft;
        dragStartScrollLeft.current = scrollRef.current.scrollLeft;
        scrollRef.current.style.scrollBehavior = 'auto';
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - dragStartX.current) * 1.5;
        
        if (Math.abs(walk) > 5) {
            hasMoved.current = true;
        }
        
        scrollRef.current.scrollLeft = dragStartScrollLeft.current - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsPaused(false);
        setTimeout(() => {
            hasMoved.current = false;
        }, 100);
    };

    const handleContainerLeave = () => {
        if (isDragging) setIsDragging(false);
        setIsPaused(false);
        setHoveredCard(null);
        if (scrollRef.current) {
             scrollRef.current.style.scrollBehavior = 'auto';
        }
    };
    
    const handleCardMouseEnter = (cardId) => {
        setHoveredCard(cardId);
        setIsPaused(true);
    };

    const handleCardMouseLeave = () => {
        setHoveredCard(null);
        if (!isDragging) setIsPaused(false); 
    };

    // --- Infinite Scroll Animation Effect ---
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || destinations.length === 0) return;

        const totalItems = destinations.length;
        const setWidth = totalItems * CARD_WIDTH; 

        scrollContainer.scrollLeft = setWidth;

        let lastTime = performance.now();

        const animate = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            if (!isPaused && !isDragging && scrollContainer) {
                const scrollAmount = (scrollSpeed.current * deltaTime) / 16;
                scrollContainer.scrollLeft += scrollAmount;

                const currentScroll = scrollContainer.scrollLeft;

                if (currentScroll >= setWidth * 2) {
                    scrollContainer.scrollLeft = currentScroll - setWidth;
                } 
                else if (currentScroll <= 0) {
                    scrollContainer.scrollLeft = currentScroll + setWidth;
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPaused, isDragging, destinations.length]);

    // --- Rendering ---
    if (isLoading) {
        return (
            <section className="py-24 text-center bg-gradient-to-b from-white to-gray-50">
                <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                    <p className="text-lg text-gray-500 font-medium">Loading dream destinations...</p>
                </div>
            </section>
        );
    }

    if (destinations.length === 0 && !isLoading) {
         return (
            <section className="py-24 text-center bg-gradient-to-b from-white to-gray-50">
                <p className="text-gray-500">No destinations found. Please check API status.</p>
            </section>
        );
    }

    return (
        <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center opacity-0 animate-fade-in-down">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                        🗺️ Dream Destinations
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Whether you crave adventure or relaxation, we've got the perfect escape for every traveler
                    </p>
                </div>

                <div 
                    className="relative overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={handleContainerLeave}
                >
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        style={{ scrollBehavior: 'auto' }}
                    >
                        {infiniteDestinations.map((destination, index) => {
                            const originalIndex = index % destinations.length; 
                            const cardId = `${destination.id}-${index}`;
                            
                            return (
                                <div
                                    key={cardId}
                                    className="flex-shrink-0 w-80 opacity-0 animate-scale-in"
                                    style={{ 
                                        animationDelay: `${originalIndex * 100 + 200}ms`, 
                                        animationFillMode: 'forwards' 
                                    }}
                                    onMouseEnter={() => handleCardMouseEnter(cardId)}
                                    onMouseLeave={handleCardMouseLeave}
                                >
                                    <div
                                        onClick={() => handleDestinationClick(destination.destinationId)}
                                        className="group relative h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform-gpu"
                                    >
                                        <img
                                            src={destination.image}
                                            alt={destination.name}
                                            className={`w-full h-full object-cover transition-transform duration-700 ${
                                                hoveredCard === cardId ? 'scale-110' : 'scale-100'
                                            }`}
                                            draggable="false"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                                        
                                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                            <MapPin className="h-4 w-4 text-white" />
                                            <span className="text-white text-sm font-medium">{destination.country}</span>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h3 className={`text-2xl font-extrabold text-white mb-1 transition-colors duration-300 ${
                                                hoveredCard === cardId ? 'text-blue-300' : ''
                                            }`}>
                                                {destination.name}
                                            </h3>
                                            <p className="text-white/90 font-medium text-sm">{destination.tourCount} Tours Available</p>
                                        </div>

                                        <div className={`absolute inset-0 border-4 transition-colors duration-300 rounded-2xl pointer-events-none ${
                                            hoveredCard === cardId ? 'border-blue-400' : 'border-transparent'
                                        }`} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }

                .animate-fade-in-down { animation: fade-in-down 0.8s ease-out; animation-fill-mode: forwards; }
                .animate-scale-in { animation: scale-in 0.6s ease-out; }

                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            `}</style>
        </section>
    );
}