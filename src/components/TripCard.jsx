import { mapsUrl, calendarUrl } from "../utils/links";

export default function TripCard({ day, theme, morning, afternoon, evening, date }) {
  const renderSession = (label, session, defaults) => {
    if (!session) return null;
    const isArray = Array.isArray(session.activities);
    const transport = session.transport || defaults.transport;

    return (
      <div className={`${defaults.bg} rounded-2xl p-4 shadow-sm border border-gray-100`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{defaults.emoji}</span>
          <h5 className="font-bold text-gray-900">{label}</h5>
        </div>
        
        {isArray ? (
          <div className="space-y-3">
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
                <div key={idx} className="bg-white rounded-xl p-3 shadow-xs border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{title}</div>
                      <div className="text-gray-600 text-xs mt-1">{place}</div>
                      {transport && (
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs">🚗</span>
                          <span className="text-gray-500 text-xs">{transport}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <a 
                        href={maps} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-all min-w-[100px] text-center"
                      >
                        Maps
                      </a>
                      <a 
                        href={cal} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-all min-w-[100px] text-center"
                      >
                        Calendar
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-gray-700">
            {typeof session === "string" ? session : session.description || "Planned session"}
            {transport && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs">🚗</span>
                <span className="text-gray-500 text-xs">{transport}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Session configurations
  const morningSlot = { 
    bg: "bg-gradient-to-br from-green-50 to-emerald-50", 
    emoji: "🌅",
    transport: "Transit" 
  };
  const afternoonSlot = { 
    bg: "bg-gradient-to-br from-yellow-50 to-amber-50", 
    emoji: "🌞",
    transport: "Transit" 
  };
  const eveningSlot = { 
    bg: "bg-gradient-to-br from-purple-50 to-pink-50", 
    emoji: "🌙",
    transport: "Walk" 
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
      {/* Day Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Day {day}</h3>
            <p className="text-gray-600 text-sm">{theme || "Adventure Day"}</p>
          </div>
        </div>
        {date && (
          <div className="hidden sm:block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {date}
          </div>
        )}
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {renderSession("Morning", morning, morningSlot)}
        {renderSession("Afternoon", afternoon, afternoonSlot)}
        {renderSession("Evening", evening, eveningSlot)}
      </div>

      {/* Mobile Date */}
      {date && (
        <div className="sm:hidden mt-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium w-fit">
          {date}
        </div>
      )}
    </div>
  );
}