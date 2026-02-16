import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TripCard from "../../components/trips/TripCard"; 

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

const getFullImageUrl = (path) =>
    !path || typeof path !== "string" ? '' :
    path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

// --- Standardize Data Function ---
const standardizeTripData = (t) => {
    // Determine if it is a Fixed Departure (F.D.) using all possible indicators
    const isFixed = 
        t.pricing_model === 'fixed_departure' || 
        t.pricing_model === 'fixed' || 
        (t.fixed_departure && t.fixed_departure.length > 0) || 
        (t.pricing?.fixed_departure && t.pricing.fixed_departure.length > 0);
    
    // Determine the relevant price and discount
    const fixedPricePackage = t.pricing?.fixed_departure?.[0]?.costingPackages?.[0];
    
    // Price logic: F.D. price first, otherwise customized price
    const finalPriceRaw = isFixed 
        ? (fixedPricePackage?.final_price || 0)
        : (t.pricing?.customized?.final_price || 0);
        
    const discount = isFixed
        ? (fixedPricePackage?.discount || 0)
        : (t.pricing?.customized?.discount || 0);

    return {
        ...t, // Spread all properties
        id: t._id || t.id,
        _id: t._id, 
        slug: t.slug,
        title: t.title,
        hero_image: getFullImageUrl(t.hero_image || t.image),
        days: t.days || 1,
        nights: t.nights || 0,
        // Keep the raw price as number for filtering
        final_price: finalPriceRaw,
        // Formatted version for display
        final_price_display: finalPriceRaw.toLocaleString(),
        is_fixed_departure: isFixed,
        discount: discount,
        
        pricing: t.pricing // Keep original pricing structure
    };
};

export default function DestinationCards() {
    const navigate = useNavigate();

    const [fixedDepartures, setFixedDepartures] = useState([]);
    const [customizedPackages, setCustomizedPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTrips = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/trips/`, {
                headers: { "x-api-key": API_KEY }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const json = await response.json();
            const fetchedList = json.data || [];

            console.log('Total trips fetched:', fetchedList.length);

            const fixedTrips = [];
            const customizedTrips = [];

            fetchedList.forEach(t => { 
                const standardizedTrip = standardizeTripData(t);

                // Debug logging
                console.log('Trip:', t.title, {
                    pricing_model: t.pricing_model,
                    has_fixed_departure: t.pricing?.fixed_departure?.length > 0,
                    is_classified_as_fixed: standardizedTrip.is_fixed_departure
                });
                
                if (standardizedTrip.is_fixed_departure) {
                    fixedTrips.push(standardizedTrip);
                } else {
                    customizedTrips.push(standardizedTrip);
                }
            });

            console.log('Fixed Departures found:', fixedTrips.length);
            console.log('Customized Packages found:', customizedTrips.length);

            // Set the two states, capping at 8 items for each section
            setFixedDepartures(fixedTrips.slice(0, 8));
            setCustomizedPackages(customizedTrips.slice(0, 8));

        } catch (error) {
            console.error("Error fetching trips:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    const handleViewAllTrips = () => {
        navigate('/triplist');
        window.scrollTo(0, 0);
    };

    if (isLoading) {
        return (
            <section className="py-16 text-center bg-gray-50">
                <p className="text-gray-500">Loading inspiring trips...</p>
            </section>
        );
    }

    const onSendQuery = (trip) => {
        console.log(`Query requested for: ${trip.title}`);
        // Implement your actual query/form logic here
    };

    // Helper component for rendering a trip section
    const TripSection = ({ title, description, trips, onSendQuery }) => (
        <>
            <div className="text-center mb-10 mt-16 first:mt-0">
                <h3 className="text-3xl md:text-4xl font-semibold mb-2 text-gray-800">
                    {title}
                </h3>
                <p className="text-gray-500 max-w-2xl mx-auto text-md">
                    {description}
                </p>
            </div>
            {trips.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trips.map((trip) => (
                        <TripCard 
                            key={trip.id} 
                            trip={trip} 
                            // onSendQuery={onSendQuery} 
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No {title.toLowerCase()} currently available.</p>
            )}
            <hr className="my-16 border-gray-200" />
        </>
    );

    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Main Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                        Trips That Inspire ✨
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Explore our curated fixed departures and flexible customized packages.
                    </p>
                </div>

                {/* --- Fixed Departure Section --- */}
                <TripSection
                    title="Expert-Curated Trips 📆"
                    description="Professionally designed itineraries with guaranteed group departure dates."
                    trips={fixedDepartures}
                    onSendQuery={onSendQuery}
                />
                
                {/* --- Customized Packages Section --- */}
                <TripSection
                    title="Build Your Own Trip ✏️"
                    description="Create a personalized itinerary with full flexibility and private dates."
                    trips={customizedPackages}
                    onSendQuery={onSendQuery}
                />
                
                {/* View All Button */}
                <div className="text-center mt-6">
                    <button 
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
                        onClick={handleViewAllTrips}
                    >
                        View All Trips
                    </button>
                </div>
            </div>
        </section>
    );
}