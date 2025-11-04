// components/TripPlan.jsx
import TimelineDay from "./TimelineDay.jsx";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { mapsUrl, calendarUrl } from "../utils/links";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const toLatLng = (c) => (c && typeof c.lat === "number" && typeof c.lon === "number" ? [c.lat, c.lon] : null);

export default function TripPlan({ tripData }) {
  const { destination, totalDays, travelers, totalBudget, interests, coordinates } = tripData || {};

  // Collect map points and bounds
  const points = [];
  const addPoint = (obj, label) => {
    const ll = toLatLng(obj?.coordinates);
    if (ll) points.push({ ll, label });
  };
  if (toLatLng(coordinates)) addPoint({ coordinates }, `📍 ${destination}`);
  (tripData.hotels || []).forEach((h) => addPoint(h, `🏨 ${h.name}`));
  (tripData.attractions || []).forEach((a) => addPoint(a, `🌍 ${a.name}`));
  const bounds = points.length ? points.map((p) => p.ll) : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-1 shadow-2xl mb-8">
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 p-6 lg:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                    Trip to {destination}
                  </h1>
                  <p className="mt-3 text-gray-600 text-sm sm:text-base">
                    Your premium AI-powered travel experience
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">AI Generated</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900">{totalDays}</div>
                  <div className="text-xs text-gray-500 mt-1">Days</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900">{travelers}</div>
                  <div className="text-xs text-gray-500 mt-1">Travelers</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900">₹{(totalBudget/1000).toFixed(0)}K</div>
                  <div className="text-xs text-gray-500 mt-1">Budget</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900">{interests?.length || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">Interests</div>
                </div>
              </div>

              {/* Interests & Actions */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {!!interests?.length && (
                  <div className="flex flex-wrap gap-2">
                    {interests.slice(0, 3).map((interest, index) => (
                      <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full shadow-lg">
                        {interest}
                      </span>
                    ))}
                    {interests.length > 3 && (
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{interests.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => window.print()} 
                    className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 shadow-lg transition-all text-sm font-medium"
                  >
                    📄 Print
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(tripData, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `trip-${destination}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 shadow-lg transition-all text-sm font-medium"
                  >
                    💾 Export
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar - Map & Actions */}
            <div className="lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-200">
              <div className="p-6 space-y-6">
                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-5 text-white shadow-2xl">
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <a
                      href={mapsUrl({ destination, mode: "driving" })}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm"
                    >
                      <span>🗺️</span>
                      <span className="font-medium">Open in Maps</span>
                    </a>
                    <a
                      href={calendarUrl({
                        title: `Trip to ${destination}`,
                        location: destination,
                        details: "AI itinerary",
                      })}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm"
                    >
                      <span>📅</span>
                      <span className="font-medium">Add to Calendar</span>
                    </a>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                  <div className="h-48 sm:h-64">
                    <MapContainer
                      bounds={bounds}
                      center={bounds ? undefined : [15.3, 74.08]}
                      zoom={bounds ? undefined : 10}
                      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {points.map((p, idx) => (
                        <Marker key={idx} position={p.ll}><Popup>{p.label}</Popup></Marker>
                      ))}
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Breakdown */}
      {tripData.budgetBreakdown && (
        <section className="mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-900">Budget Breakdown</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(tripData.budgetBreakdown).map(([key, val]) => (
                <div key={key} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all">
                  <div className="text-sm font-medium text-gray-600 capitalize mb-2">{key}</div>
                  <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {String(val).startsWith("₹") ? val : `₹${val}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Daily Itinerary */}
      {tripData.itinerary?.length > 0 && (
        <section className="mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">Daily Itinerary</h3>
              </div>
              <div className="text-sm text-gray-500 hidden sm:block">Tap items for Maps & Calendar</div>
            </div>
            <div className="space-y-6">
              {tripData.itinerary.map((day, index) => (
                <TimelineDay key={index} {...day} destination={destination} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hotels */}
      {tripData.hotels?.length > 0 && (
        <section className="mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-900">Recommended Hotels</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tripData.hotels.map((hotel, i) => {
                const placeQuery = `${hotel.name}, ${hotel.location || destination}`;
                const gmaps = mapsUrl({ destination: placeQuery, mode: "driving" });
                const cal = calendarUrl({
                  title: `Check-in — ${hotel.name}`,
                  location: placeQuery,
                  details: "Planned stay from your AI itinerary",
                });
                return (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100">
                    <div className="flex flex-col md:flex-row">
                      <img 
                        src={hotel.image} 
                        alt={hotel.name} 
                        className="w-full md:w-40 h-48 md:h-auto object-cover"
                      />
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-lg text-gray-900">{hotel.name}</h4>
                            <p className="text-gray-600 text-sm mt-1">{hotel.location}</p>
                            <p className="text-blue-600 font-bold text-lg mt-2">₹{hotel.price}</p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Featured</span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <a href={gmaps} target="_blank" rel="noreferrer" className="flex-1 min-w-[120px] text-center px-3 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                            Open in Maps
                          </a>
                          <a href={cal} target="_blank" rel="noreferrer" className="flex-1 min-w-[120px] text-center px-3 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all">
                            Add to Calendar
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Transport */}
      {tripData.transport?.length > 0 && (
        <section className="mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-900">Transport Options</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tripData.transport.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                  <div className="flex gap-4">
                    <img src={t.image} alt={t.type} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{t.type}</h4>
                      <p className="text-gray-600 text-sm mt-1">{t.bestFor}</p>
                      <p className="text-blue-600 font-bold text-lg mt-2">₹{t.cost}</p>
                      <a
                        href={mapsUrl({ destination: `${t.type} in ${destination}`, mode: (t.type || "driving").toLowerCase() })}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
                      >
                        Find Options
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Attractions */}
      {tripData.attractions?.length > 0 && (
        <section className="mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-900">Must-Visit Attractions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tripData.attractions.map((a, i) => {
                const maps = mapsUrl({ destination: `${a.name}, ${destination}`, mode: "driving" });
                const cal = calendarUrl({ title: a.name, location: a.name, details: a.description });
                return (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100">
                    <img src={a.image} alt={a.name} className="w-full h-48 object-cover" />
                    <div className="p-5">
                      <h4 className="font-bold text-lg text-gray-900">{a.name}</h4>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{a.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>🕐 {a.bestTime}</span>
                        <span>⏱️ {a.duration}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <a href={maps} target="_blank" rel="noreferrer" className="flex-1 min-w-[120px] text-center px-3 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                          Open in Maps
                        </a>
                        <a href={cal} target="_blank" rel="noreferrer" className="flex-1 min-w-[120px] text-center px-3 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all">
                          Add to Calendar
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}