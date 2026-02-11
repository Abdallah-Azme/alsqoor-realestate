"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  className?: string;
  markerPopup?: string;
  draggableMarker?: boolean;
  onMarkerDrag?: (lat: number, lng: number) => void;
}

const LeafletMap = ({
  latitude = 24.7136,
  longitude = 46.6753, // Default: Riyadh, Saudi Arabia
  zoom = 13,
  className = "h-[400px] w-full rounded-xl",
  markerPopup = "",
  draggableMarker = false,
  onMarkerDrag,
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current).setView([latitude, longitude], zoom);
    mapInstanceRef.current = map;

    // Add tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add marker
    const marker = L.marker([latitude, longitude], {
      draggable: draggableMarker,
    }).addTo(map);
    markerRef.current = marker;

    if (markerPopup) {
      marker.bindPopup(markerPopup).openPopup();
    }

    // Handle marker drag
    if (draggableMarker && onMarkerDrag) {
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        onMarkerDrag(position.lat, position.lng);
      });
    }

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapInstanceRef.current.setView([latitude, longitude], zoom);
    }
  }, [latitude, longitude, zoom]);

  return (
    <>
      {/* CSS overrides for Leaflet z-index to prevent overlapping navbar */}
      <style jsx global>{`
        .leaflet-pane,
        .leaflet-top,
        .leaflet-bottom,
        .leaflet-control {
          z-index: 1 !important;
        }
        .leaflet-popup-pane {
          z-index: 2 !important;
        }
      `}</style>
      <div className="relative z-0">
        <div ref={mapRef} className={className} />
      </div>
    </>
  );
};

export default LeafletMap;
