// src/components/TripCard.jsx
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
        <h5 className="font-semibold mb-2 text-gray-800">{label}</h5>
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
                <div key={idx} className="p-3 bg-white rounded-xl shadow-sm border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-gray-900">{title}</div>
                      <div className="text-sm text-gray-600">{place}</div>
                      {transport && <div className="text-xs text-gray-500 mt-1">🚗 {transport}</div>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a href={maps} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">Open in Maps</a>
                      <a href={cal} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg">Add to Calendar</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-gray-700">
            {typeof session === "string" ? session : session.description || "Planned session"}
            {transport && <div className="text-xs text-gray-500 mt-1">🚗 {transport}</div>}
          </div>
        )}
      </div>
    );
  };

  const morningSlot = { bg: "bg-green-50 p-3 rounded-xl", startISO: null, endISO: null, transport: "Transit" };
  const afternoonSlot = { bg: "bg-yellow-50 p-3 rounded-xl", startISO: null, endISO: null, transport: "Transit" };
  const eveningSlot = { bg: "bg-purple-50 p-3 rounded-xl", startISO: null, endISO: null, transport: "Walk" };

  return (
    <div className="p-4 sm:p-5 bg-white rounded-2xl shadow-sm border relative">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b from-emerald-500 to-purple-500" />
      <h3 className="text-lg sm:text-xl font-bold mb-3 pl-2">Day {day}: {theme || "Plan"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderSession("🌅 Morning", morning, morningSlot)}
        {renderSession("🌞 Afternoon", afternoon, afternoonSlot)}
        {renderSession("🌙 Evening", evening, eveningSlot)}
      </div>
    </div>
  );
}
