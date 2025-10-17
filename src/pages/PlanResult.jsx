import { useEffect, useState } from "react";
import TripPlan from "../components/TripPlan.jsx";

export default function PlanResult() {
  const [tripData, setTripData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("tripPlan");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      console.log("✅ Parsed trip data:", parsed);

      // ✅ Directly use backend structure
      setTripData(parsed);
    } catch (err) {
      console.error("❌ Failed to parse trip data:", err);
    }
  }, []);

  if (!tripData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600 text-lg">Loading your AI trip plan...</p>
          <button
            onClick={() => window.location.href = "/"}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <TripPlan tripData={tripData} />
    </div>
  );
}
