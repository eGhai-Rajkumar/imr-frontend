import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import DestinationHero from "../../../components/destinations/DestinationHero";
import DestinationOverview from "../../../components/destinations/DestinationOverview";
import DestinationGuidelines from "../../../components/destinations/DestinationGuidelines";
import Form from "../../../components/forms/LeadGeneration";
import PopularTrips from "../../../components/destinations/PopularTrips";
import { Loader2 } from "lucide-react";

/**
 * Destinations Page - Single Page Scroll Layout
 * Removed Tabs as per user request.
 */

const API_URL = "https://api.yaadigo.com/secure/api/destinations/";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";

const Destinations = () => {
  const { id } = useParams();
  const location = useLocation();
  const [destinationId, setDestinationId] = useState(null);
  const [destinationData, setDestinationData] = useState(null);

  // Detect destinationId from URL (slug or query param)
  useEffect(() => {
    let detectedId = id;
    if (!detectedId) {
      const params = new URLSearchParams(location.search);
      detectedId = params.get("destinationId");
    }

    if (detectedId) {
      setDestinationId(detectedId);
    }
  }, [id, location.search]);

  // Fetch destination details
  useEffect(() => {
    if (!destinationId) return;

    const fetchDestination = async () => {
      try {
        const response = await fetch(`${API_URL}${destinationId}/`, {
          headers: { "x-api-key": API_KEY },
        });
        if (!response.ok) throw new Error("Failed to fetch destination");
        const data = await response.json();

        // Extract the actual destination data from the response
        const actualData = data.data || data;
        setDestinationData(actualData);
      } catch (error) {
        console.error("Error fetching destination:", error);
      }
    };

    fetchDestination();
  }, [destinationId]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [destinationId]);

  // Loading state
  if (!destinationData)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#FDFBF7]">
        <Loader2 className="w-10 h-10 animate-spin text-[#2C6B4F] mb-4" />
        <p className="text-gray-500 text-lg font-medium">Fetching destination details...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* 1. Hero Image Slider */}
      <DestinationHero destinationData={destinationData} />

      {/* 2. Main Content Area */}
      <div className="animate-fade-in">

        {/* Overview Section */}
        <DestinationOverview destinationData={destinationData} />

        {/* Popular Trips Section */}
        <div className="border-t border-gray-100 bg-white">
          <PopularTrips destinationData={destinationData} />
        </div>

        {/* Travel Guidelines */}
        <DestinationGuidelines destinationData={destinationData} />

        {/* Final CTA / Lead Form */}

      </div>

      <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
    </div>
  );
};

export default Destinations;