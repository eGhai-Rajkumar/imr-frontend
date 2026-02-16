import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Clock } from "lucide-react";

const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const BASE_URL = "https://api.yaadigo.com/secure/api/trips/";

export default function TripOverview({ tripId }) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) return;

    const fetchTripOverview = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}${tripId}/`, {
          headers: { "x-api-key": API_KEY },
        });

        console.log("TripOverview → API Response:", res.data);

        const tripData = res.data.data || res.data;
        setTrip(tripData);
      } catch (error) {
        console.error("❌ Error fetching trip overview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripOverview();
  }, [tripId]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 flex justify-center items-center text-gray-500">
        Loading trip details...
      </section>
    );
  }

  if (!trip) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 flex justify-center items-center text-gray-500">
        No trip details found.
      </section>
    );
  }

  const duration = `${trip.days || 0}D - ${trip.nights || 0}N`;

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {trip.title}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
          {/* Pickup & Drop */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 animate-slide-in-left hover:-translate-y-2">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Pickup & Drop
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {trip.pickup_location || "N/A"} -{" "}
                  {trip.drop_location || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-200 animate-slide-in-right hover:-translate-y-2">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Duration
                </p>
                <p className="text-lg font-bold text-gray-900">{duration}</p>
              </div>
            </div>
          </div>
        </div>

      
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out 0.2s backwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out 0.4s backwards;
        }
      `}</style>
    </section>
  );
}
