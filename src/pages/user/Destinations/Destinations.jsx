import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import DestinationHero from "../../../components/destinations/DestinationHero";
import DestinationOverview from "../../../components/destinations/DestinationOverview";
import DestinationGuidelines from "../../../components/destinations/DestinationGuidelines";
import FAQ from "../../../components/charts/FAQ";
import Form from "../../../components/forms/LeadGeneration";
import DestCategory from "../../../components/destinations/DestCategory";
import PopularTrips from "../../../components/destinations/PopularTrips";

const API_URL = "https://api.yaadigo.com/secure/api/destinations/";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";

const Destinations = () => {
  const { slug, id } = useParams();
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
      console.log("Detected Destination ID:", detectedId);
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
        console.log("Fetched Destination Data:", actualData);
      } catch (error) {
        console.error("Error fetching destination:", error);
      }
    };

    fetchDestination();
  }, [destinationId]);

  // Loading state
  if (!destinationData)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading destination details...
        </p>
      </div>
    );

  return (
    <div>
      {/* Hero Image Slider */}
      <DestinationHero destinationData={destinationData} />

      {/* Destination Overview */}
      <DestinationOverview destinationData={destinationData} />

      {/* Popular Trips Section */}
      <PopularTrips destinationData={destinationData} />

      {/* Category Section (Custom Packages) */}
      <DestCategory currentDestinationId={destinationId} />

      {/* Travel Guidelines */}
      <DestinationGuidelines destinationData={destinationData} />

      {/* Lead Form */}
      <Form />

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
};

export default Destinations;