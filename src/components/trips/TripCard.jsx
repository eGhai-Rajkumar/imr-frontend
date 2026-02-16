import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";

const TripCard = ({ trip, onSendQuery }) => {
    // State for hover effect
    const [isHovered, setIsHovered] = React.useState(false); 

    if (!trip) return null;

    // --- Data Extraction from Standardized Trip Object ---
    const tripSlug = trip.slug || `trip-${trip._id || trip.id}`;
    const tripId = trip._id || trip.id;
    const tripPath = `/trip-preview/${tripSlug}/${tripId}`;

    // ✅ FIX 1: Use the standardized price field from parent component (ToursListingPage)
    // This field is now correctly formatted by the parent component.
    const finalPriceDisplay = trip.final_price_display || "N/A"; 
    
    // ✅ FIX 2: Use the standardized discount field
    const displayDiscount = trip.discount || 0;
    
    // ✅ FIX 3: Determine Price Type (e.g., "per person" vs "per package") dynamically
    const priceType = trip.pricing?.customized?.pricing_type === 'Price Per Package' 
        ? "per package" 
        : "per person"; // Default to 'per person' if fixed or if type is unknown

    // Duration Display
    const durationText = `${trip.days} Days ${trip.nights} Nights`;

    // Location Display
    const locationTag = trip.destination_type || trip.pickup_location;
    
    // --- Event Handler ---
    const handleSendQuery = (e) => {
        e.preventDefault(); 
        if (onSendQuery) {
            onSendQuery(trip);
        } else {
            console.log("Send Query clicked for trip:", trip.title);
        }
    };

    // --- Component Structure ---
    return (
        <div
            key={tripId}
            className="cursor-pointer rounded-3xl overflow-hidden shadow-xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={tripPath}>
                <div className="relative h-96 transition-all duration-500 transform hover:shadow-2xl hover:-translate-y-2">
                    {/* Background Image with Hover Effect */}
                    <img
                        src={trip.hero_image}
                        alt={trip.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                            isHovered ? 'scale-110' : 'scale-100'
                        }`}
                        loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Top Content / Badges */}
                    <div className="absolute top-0 inset-x-0 flex justify-between p-4">
                        {/* Location Tag */}
                        {locationTag && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800">
                                <MapPin className="w-4 h-4" />
                                {locationTag}
                            </span>
                        )}
                        
                        {/* Discount Badge - Now uses the displayDiscount variable */}
                        {displayDiscount > 0 && (
                            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                ₹{displayDiscount} Off
                            </div>
                        )}
                    </div>


                    {/* Bottom Content (Title, Duration, Price) */}
                    <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
                        {/* Trip Title */}
                        <h3 className="text-2xl font-bold text-white mb-1 leading-tight line-clamp-2">
                            {trip.title}
                        </h3>
                        {/* Duration */}
                        <p className="text-white/90 text-sm font-medium mb-2">
                            {durationText}
                        </p>
                        {/* Price - Now uses the standardized price and dynamic priceType */}
                        <p className="text-xl font-bold text-white">
                            ₹{finalPriceDisplay}{" "}
                            <span className="text-sm font-normal">
                                {priceType}
                            </span>
                        </p>
                    </div>

                    {/* Hover Border Effect */}
                    <div className={`absolute inset-0 border-4 border-blue-500 rounded-3xl transition-opacity duration-300 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                    }`} />
                </div>
            </Link>
        </div>
    );
};
export default TripCard;