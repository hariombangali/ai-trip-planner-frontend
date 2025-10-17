// components/TimelineDay.jsx
import { mapsUrl, calendarUrl } from "../utils/links";

const SessionCard = ({ label, session, day, defaultMode }) => {
  if (!session) return null;
  const isArray = Array.isArray(session.activities);
  const transport = session.transport || defaultMode;

  return (
    <div className="relative pl-8">
      <div className="absolute left-2 top-2 w-1 h-1 bg-emerald-500 rounded-full"></div>
      <h5 className="font-semibold mb-2 text-gray-900">{label}</h5>

      {isArray ? (
        <div className="grid gap-3">
          {session.activities.map((a, idx) => {
            const title = a.name || "Activity";
            const place = a.location || "";
            const maps = mapsUrl({ destination: place, mode: (transport || "driving").toLowerCase() });
            const cal = calendarUrl({
              title: `${title} — ${place}`,
              location: place,
              details: `Day ${day} · ${label} · Transport: ${transport || "N/A"}`,
            });
            return (
              <div key={idx} className="p-3 rounded-xl bg-white border shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-gray-900">{title}</div>
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
        <div className="p-3 rounded-xl bg-white border shadow-sm text-sm text-gray-700">
          {typeof session === "string" ? session : session.description || "Planned session"}
          {transport && <div className="text-xs text-gray-500 mt-1">🚗 {transport}</div>}
        </div>
      )}
    </div>
  );
};

export default function TimelineDay({ day, theme, morning, afternoon, evening, destination }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-gray-50 to-white p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
          {day}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900">{theme || `Day ${day}`}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
        <div className="md:col-span-1 rounded-xl p-3 bg-green-50 border">
          <SessionCard label="🌅 Morning" session={morning} day={day} defaultMode="Transit" />
        </div>
        <div className="md:col-span-1 rounded-xl p-3 bg-yellow-50 border">
          <SessionCard label="🌞 Afternoon" session={afternoon} day={day} defaultMode="Transit" />
        </div>
        <div className="md:col-span-1 rounded-xl p-3 bg-purple-50 border">
          <SessionCard label="🌙 Evening" session={evening} day={day} defaultMode="Walk" />
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Indicative details—verify open hours, prices, and availability before visiting.
      </div>
    </div>
  );
}
