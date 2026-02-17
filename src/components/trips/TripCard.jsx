import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowUpRight, Star } from "lucide-react";

const TripCard = ({ trip, onSendQuery }) => {
    const [isHovered, setIsHovered] = useState(false);

    if (!trip) return null;

    // --- Data Extraction ---
    const tripSlug = trip.slug || `trip-${trip._id || trip.id}`;
    const tripId = trip._id || trip.id;
    const tripPath = `/trip-preview/${tripSlug}/${tripId}`;
    const finalPriceDisplay = trip.final_price_display || "N/A";
    const displayDiscount = trip.discount || 0;
    const priceType = trip.pricing?.customized?.pricing_type === 'Price Per Package'
        ? "per package"
        : "per person";
    const durationText = `${trip.days}D / ${trip.nights}N`;
    const locationTag = trip.destination_type || trip.pickup_location;
    const heroImage = trip.hero_image || trip.image;

    // --- Styling Variables ---
    // Dynamic height based on content or fixed for consistency
    const cardHeight = "h-[480px]";

    return (
        <Link to={tripPath} className="block group relative w-full">
            <div
                className={`relative ${cardHeight} w-full rounded-[2rem] overflow-hidden bg-gray-900 shadow-lg cursor-pointer transform transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* --- 1. Background Image (Immersive) --- */}
                <img
                    src={heroImage}
                    alt={trip.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
                    loading="lazy"
                />

                {/* --- 2. Gradient Overlays --- */}
                {/* Base gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />

                {/* Hover gradient effect */}
                <div className={`absolute inset-0 bg-primary/20 mix-blend-overlay transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                {/* --- 3. Top Badges (Location & Discount) --- */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                    {locationTag && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                            <MapPin className="w-3 h-3 text-accent" />
                            {locationTag}
                        </span>
                    )}

                    {displayDiscount > 0 && (
                        <div className="flex flex-col items-end">
                            <span className="bg-accent text-primary-dark px-3 py-1 rounded-full text-xs font-bold shadow-glow mb-1">
                                Save ₹{displayDiscount}
                            </span>
                        </div>
                    )}
                </div>

                {/* --- 4. Content Area (Bottom) --- */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">

                    {/* Title & Metadata */}
                    <div className={`transform transition-all duration-500 ${isHovered ? '-translate-y-2' : 'translate-y-0'}`}>
                        {/* Rating Star (Fixed logic) */}
                        <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3 h-3 text-accent fill-accent" />
                            <span className="text-xs font-medium text-gray-300">
                                {trip.rating || 4.8} (25+ Reviews)
                            </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 leading-tight drop-shadow-lg group-hover:text-accent transition-colors duration-300 line-clamp-2">
                            {trip.title}
                        </h3>

                        <div className="flex items-center gap-4 text-white/80 text-sm font-medium mb-4">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-accent" />
                                {durationText}
                            </div>
                        </div>
                    </div>

                    {/* Price & CTA - Reveal on Hover / Always visible but optimized */}
                    <div className="border-t border-white/20 pt-4 flex items-end justify-between">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Starting From</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl md:text-2xl font-bold text-white tracking-tight">₹{finalPriceDisplay}</span>
                                <span className="text-xs text-gray-400 font-light">{priceType}</span>
                            </div>
                        </div>

                        <button
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-accent text-primary-dark rotate-45 scale-110' : 'bg-white/20 text-white backdrop-blur-md'}`}
                        >
                            <ArrowUpRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TripCard;