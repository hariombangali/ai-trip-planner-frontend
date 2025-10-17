// utils/links.js
const enc = (s = "") => encodeURIComponent(s);

export const mapsUrl = ({ origin, destination, mode = "driving" }) => {
  const base = "https://www.google.com/maps/dir/?api=1";
  const o = origin ? `&origin=${enc(origin)}` : "";
  const d = destination ? `&destination=${enc(destination)}` : "";
  const m = mode ? `&travelmode=${enc(mode)}` : "";
  return `${base}${o}${d}${m}`;
};

const toCalDate = (date, h, m) => {
  const pad = (n) => String(n).padStart(2, "0");
  const dt = new Date(date);
  dt.setHours(h, m, 0, 0);
  const y = dt.getUTCFullYear();
  const mo = pad(dt.getUTCMonth() + 1);
  const da = pad(dt.getUTCDate());
  const hh = pad(dt.getUTCHours());
  const mm = pad(dt.getUTCMinutes());
  const ss = "00";
  return `${y}${mo}${da}T${hh}${mm}${ss}Z`;
};

export const calendarUrl = ({ title, startISO, endISO, location, details, tz = "Asia/Kolkata" }) => {
  // Fallback if ISO not provided
  const start = startISO || toCalDate(new Date(), 9, 0);
  const end = endISO || toCalDate(new Date(), 11, 0);
  const base = "https://calendar.google.com/calendar/r/eventedit";
  const params = [
    `text=${enc(title)}`,
    `dates=${enc(`${start}/${end}`)}`,
    `location=${enc(location || "")}`,
    `details=${enc(details || "")}`,
    `ctz=${enc(tz)}`,
  ].join("&");
  return `${base}?${params}`;
};
