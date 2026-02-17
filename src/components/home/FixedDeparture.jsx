import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TripCard from "../../components/trips/TripCard";
import { Sparkles, Calendar, PenTool, ArrowRight } from 'lucide-react';

const API_URL = "https://api.yaadigo.com/secure/api";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const IMAGE_BASE_URL = "https://api.yaadigo.com/uploads/";

const getFullImageUrl = (path) =>
    !path || typeof path !== "string" ? '' :
        path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

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

    return {
        ...t,
        id: t._id || t.id,
        _id: t._id,
        slug: t.slug,
        title: t.title,
        hero_image: getFullImageUrl(t.hero_image || t.image),
        days: t.days || 1,
        nights: t.nights || 0,
        final_price: finalPriceRaw,
        final_price_display: finalPriceRaw.toLocaleString(),
        is_fixed_departure: isFixed,
        discount: discount,
        pricing: t.pricing
    };
};

export default function FixedDeparture() {
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

            const fixedTrips = [];
            const customizedTrips = [];

            fetchedList.forEach(t => {
                const standardizedTrip = standardizeTripData(t);
                if (standardizedTrip.is_fixed_departure) {
                    fixedTrips.push(standardizedTrip);
                } else {
                    customizedTrips.push(standardizedTrip);
                }
            });

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
        navigate('/trips'); // Updated route to match likely updated routing
        window.scrollTo(0, 0);
    };

    if (isLoading) return null;

    const TripSection = ({ title, subtitle, icon: Icon, trips }) => (
        <div className="mb-32 last:mb-0">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3">
                        <Icon className="h-4 w-4" />
                        <span>{subtitle}</span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-primary-dark leading-tight">
                        {title}
                    </h3>
                </div>
                {/* Optional decorative line or small text could go here */}
                <div className="hidden md:block h-px flex-1 bg-gray-200 mx-8 mb-4"></div>
            </div>

            {trips.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {trips.map((trip) => (
                        <div key={trip.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                            <TripCard trip={trip} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 font-light italic">No journeys available in this category yet.</p>
            )}
        </div>
    );

    return (
        <section className="py-24 px-4 bg-surface relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/5 -skew-x-12 pointer-events-none"></div>

            <div className="container mx-auto relative z-10">

                {/* Fixed Departures */}
                <TripSection
                    title="Fixed Group Departures"
                    subtitle="Join the Adventure"
                    icon={Calendar}
                    trips={fixedDepartures}
                />

                {/* Customized Packages */}
                <TripSection
                    title="Customized Itineraries"
                    subtitle="Craft Your Story"
                    icon={PenTool}
                    trips={customizedPackages}
                />

                {/* View All */}
                <div className="text-center mt-20">
                    <button
                        onClick={handleViewAllTrips}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-white border border-gray-200 rounded-full font-bold text-lg text-primary-dark transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary shadow-lg hover:shadow-xl"
                    >
                        <span>Explore All Journeys</span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
}