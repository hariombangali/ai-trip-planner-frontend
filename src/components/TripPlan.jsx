// src/components/TripPlan.jsx
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
    <div className="max-w-7xl mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-sky-600 to-emerald-600 p-[1px] shadow-2xl">
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="col-span-2 p-5 sm:p-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
                Trip to {destination}
              </h1>
              <p className="mt-2 text-gray-700 text-sm sm:text-base">
                Plan, navigate, and save — all in one premium view.
              </p>

              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white shadow text-gray-800 text-sm">📅 {totalDays} days</span>
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white shadow text-gray-800 text-sm">👥 {travelers} travelers</span>
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white shadow text-gray-800 text-sm">💰 ₹{totalBudget}</span>
                {!!interests?.length && (
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white shadow text-gray-700 text-sm">
                    🎯 {interests.join(", ")}
                  </span>
                )}
              </div>

              <div className="mt-5 sm:mt-6 flex flex-wrap gap-3">
                <button onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 shadow">
                  Print
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
                  className="px-4 py-2 rounded-lg bg-white text-gray-900 border hover:bg-gray-50 shadow"
                >
                  Export JSON
                </button>
              </div>
            </div>

            {/* Aside: Summary + Map */}
            <div className="col-span-1 bg-white/70 border-t lg:border-t-0 lg:border-l rounded-3xl lg:rounded-l-none lg:rounded-r-3xl p-5 sm:p-6">
              <div className="lg:sticky lg:top-6 space-y-4">
                <div className="rounded-2xl border bg-white p-4 shadow-sm">
                  <div className="text-xs sm:text-sm text-gray-500">Quick Actions</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a
                      href={mapsUrl({ destination, mode: "driving" })}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-lg bg-blue-600 text-white text-center hover:bg-blue-700 text-sm"
                    >
                      Open in Maps
                    </a>
                    <a
                      href={calendarUrl({
                        title: `Trip to ${destination}`,
                        location: destination,
                        details: "AI itinerary",
                      })}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-center hover:bg-emerald-700 text-sm"
                    >
                      Add to Calendar
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white p-3 shadow-sm overflow-hidden">
                  <div className="h-[240px] sm:h-[280px] w-full">
                    <MapContainer
                      bounds={bounds}
                      center={bounds ? undefined : [15.3, 74.08]}
                      zoom={bounds ? undefined : 10}
                      style={{ height: "100%", width: "100%" }}
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

      {/* Budget */}
      {tripData.budgetBreakdown && (
        <section className="mt-6 sm:mt-8">
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-xl border">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Budget Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
              {Object.entries(tripData.budgetBreakdown).map(([key, val]) => (
                <div key={key} className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 border">
                  <div className="font-semibold capitalize text-gray-800 text-sm sm:text-base">{key}</div>
                  <div className="text-blue-700 font-extrabold mt-1 text-sm sm:text-base">
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
        <section className="mt-6 sm:mt-8">
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-xl border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h3 className="text-xl sm:text-2xl font-bold">Daily Itinerary</h3>
              <div className="text-xs sm:text-sm text-gray-500">Tap any item for Maps or Calendar</div>
            </div>
            <div className="space-y-5 sm:space-y-6">
              {tripData.itinerary.map((day, index) => (
                <TimelineDay key={index} {...day} destination={destination} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hotels */}
      {tripData.hotels?.length > 0 && (
        <section className="mt-6 sm:mt-8">
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-xl border">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Hotels</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              {tripData.hotels.map((hotel, i) => {
                const placeQuery = `${hotel.name}, ${hotel.location || destination}`;
                const gmaps = mapsUrl({ destination: placeQuery, mode: "driving" });
                const cal = calendarUrl({
                  title: `Check-in — ${hotel.name}`,
                  location: placeQuery,
                  details: "Planned stay from your AI itinerary",
                });
                return (
                  <div key={i} className="rounded-2xl border overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row">
                      <img src={hotel.image} alt={hotel.name} className="w-full md:w-48 h-40 md:h-full object-cover" />
                      <div className="p-4 flex-1">
                        <h4 className="font-semibold text-lg">{hotel.name}</h4>
                        <p className="text-sm text-gray-500">{hotel.location}</p>
                        <p className="text-blue-700 font-bold mt-1">₹{hotel.price}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a href={gmaps} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">Open in Maps</a>
                          <a href={cal} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg">Add to Calendar</a>
                        </div>
                      </div>
                    </div>
                    {hotel.coordinates && (
                      <div className="h-[200px] sm:h-[220px]">
                        <MapContainer center={[hotel.coordinates.lat, hotel.coordinates.lon]} zoom={13} style={{ height: "100%", width: "100%" }}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={[hotel.coordinates.lat, hotel.coordinates.lon]}><Popup>{hotel.name}</Popup></Marker>
                        </MapContainer>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Transport */}
      {tripData.transport?.length > 0 && (
        <section className="mt-6 sm:mt-8">
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-xl border">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Transport Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tripData.transport.map((t, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl border flex gap-3 hover:bg-gray-100 transition">
                  <img src={t.image} alt={t.type} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{t.type}</h4>
                    <p className="text-sm text-gray-600">{t.bestFor}</p>
                    <p className="text-blue-700 font-bold mt-1">₹{t.cost}</p>
                    <a
                      href={mapsUrl({ destination: `${t.type} in ${destination}`, mode: (t.type || "driving").toLowerCase() })}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg"
                    >
                      Open in Maps
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Attractions */}
      {tripData.attractions?.length > 0 && (
        <section className="mt-6 sm:mt-8 mb-8 sm:mb-10">
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-xl border">
            <h3 className="text-xl sm:text-2xl font-bold mb-6">Attractions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {tripData.attractions.map((a, i) => {
                const maps = mapsUrl({ destination: `${a.name}, ${destination}`, mode: "driving" });
                const cal = calendarUrl({ title: a.name, location: a.name, details: a.description });
                return (
                  <div key={i} className="rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition">
                    <img src={a.image} alt={a.name} className="w-full h-44 sm:h-48 object-cover" />
                    <div className="p-4">
                      <h4 className="font-semibold">{a.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{a.description}</p>
                      <p className="text-xs text-gray-500">Best Time: {a.bestTime} • Duration: {a.duration}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a href={maps} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">Open in Maps</a>
                        <a href={cal} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg">Add to Calendar</a>
                      </div>
                    </div>
                    {a.coordinates && (
                      <div className="h-[180px] sm:h-[200px]">
                        <MapContainer center={[a.coordinates.lat, a.coordinates.lon]} zoom={13} style={{ height: "100%", width: "100%" }}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={[a.coordinates.lat, a.coordinates.lon]}><Popup>{a.name}</Popup></Marker>
                        </MapContainer>
                      </div>
                    )}
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
