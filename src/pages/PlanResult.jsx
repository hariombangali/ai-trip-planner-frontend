// src/pages/PlanResult.jsx
import { useEffect, useState } from "react";
import TripPlan from "../components/TripPlan.jsx";

export default function PlanResult() {
  const [tripData, setTripData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("tripPlan");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setTripData(parsed);
    } catch (err) {
      console.error("Failed to parse trip data:", err);
    }
  }, []);

  if (!tripData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50 px-4">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3 rounded-full" />
          <p className="text-gray-600 text-base sm:text-lg">Loading your AI trip plan...</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 p-4 sm:p-6">
      <TripPlan tripData={tripData} />
    </div>
  );
}
