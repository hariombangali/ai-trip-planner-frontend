import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Custom marker icon fix (Leaflet default icons are broken in Vite)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapView({ lat, lng, zoom = 12, label }) {
  if (!lat || !lng) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
        Map not available
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>{label || "Trip Location"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
