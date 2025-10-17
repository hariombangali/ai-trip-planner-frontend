// components/TripCard.jsx
import { mapsUrl, calendarUrl } from "../utils/links";

export default function TripCard({ day, theme, morning, afternoon, evening, date }) {
  const renderSession = (label, session, defaults) => {
    if (!session) return null;
    const isArray = Array.isArray(session.activities);
    const transport = session.transport || defaults.transport;
    const startISO = defaults.startISO;
    const endISO = defaults.endISO;

    return (
      <div className={defaults.bg}>
        <h5 className="font-semibold mb-2">{label}</h5>
        {isArray ? (
          <div className="space-y-3">
            {session.activities.map((a, idx) => {
              const title = a.name || "Activity";
              const place = a.location || "";
              const maps = mapsUrl({ destination: place, mode: (transport || "driving").toLowerCase() });
              const cal = calendarUrl({
                title: `${title} — ${place}`,
                startISO,
                endISO,
                location: place,
                details: `Day ${day} · ${label} · Transport: ${transport || "N/A"}`,
              });
              return (
                <div key={idx} className="p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{title}</div>
                      <div className="text-sm text-gray-600">{place}</div>
                      {transport && <div className="text-xs text-gray-500 mt-1">🚗 {transport}</div>}
                    </div>
                    <div className="flex gap-2">
                      <a href={maps} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">Open in Maps</a>
                      <a href={cal} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg">Add to Calendar</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Backward‑compat: string/object fallback
          <div className="text-sm text-gray-700">
            {typeof session === "string" ? session : session.description || "Planned session"}
            {transport && <div className="text-xs text-gray-500 mt-1">🚗 {transport}</div>}
          </div>
        )}
      </div>
    );
  };

  // Default time windows per session (UTC conversion handled in util)
  const morningSlot = { bg: "bg-green-50 p-3 rounded-lg", startISO: null, endISO: null, transport: "Transit" };
  const afternoonSlot = { bg: "bg-yellow-50 p-3 rounded-lg", startISO: null, endISO: null, transport: "Transit" };
  const eveningSlot = { bg: "bg-purple-50 p-3 rounded-lg", startISO: null, endISO: null, transport: "Walk" };

  return (
    <div className="p-5 bg-gray-50 rounded-xl shadow-sm border-l-4 border-green-500">
      <h3 className="text-xl font-bold mb-3">Day {day}: {theme || "Plan"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderSession("🌅 Morning", morning, morningSlot)}
        {renderSession("🌞 Afternoon", afternoon, afternoonSlot)}
        {renderSession("🌙 Evening", evening, eveningSlot)}
      </div>
    </div>
  );
}
