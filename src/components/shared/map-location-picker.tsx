"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";

// Riyadh, Saudi Arabia — default center
const DEFAULT_LAT = 24.7136;
const DEFAULT_LNG = 46.6753;
const DEFAULT_ZOOM = 12;

interface MapLocationPickerProps {
  /** Current latitude value */
  lat: number;
  /** Current longitude value */
  lng: number;
  /** Called every time the pin is moved */
  onChange: (lat: number, lng: number) => void;
}

/**
 * A Leaflet-powered map picker.
 * The user drags the red pin to choose a location.
 * Defaults to Riyadh city centre.
 *
 * Leaflet is loaded client-side only to avoid SSR issues.
 */
export default function MapLocationPicker({
  lat,
  lng,
  onChange,
}: MapLocationPickerProps) {
  const t = useTranslations("properties");
  const mapRef = useRef<any>(null); // Leaflet Map instance
  const markerRef = useRef<any>(null); // Leaflet Marker instance
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return;
    initializedRef.current = true;

    // Dynamically import leaflet to keep it client-side only
    import("leaflet").then((L) => {
      // Fix the default marker icon path that webpack/next breaks
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Create map
      const map = L.map(containerRef.current!, {
        center: [lat || DEFAULT_LAT, lng || DEFAULT_LNG],
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
      });

      mapRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom red draggable marker
      const redIcon = L.divIcon({
        className: "",
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: #16a34a;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: grab;
          "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      // Create draggable marker
      const marker = L.marker([lat || DEFAULT_LAT, lng || DEFAULT_LNG], {
        draggable: true,
        icon: redIcon,
      }).addTo(map);

      markerRef.current = marker;

      // Fire onChange on drag end
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChange(
          parseFloat(pos.lat.toFixed(6)),
          parseFloat(pos.lng.toFixed(6)),
        );
      });

      // Also allow clicking anywhere on the map to move the pin
      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        onChange(
          parseFloat(e.latlng.lat.toFixed(6)),
          parseFloat(e.latlng.lng.toFixed(6)),
        );
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        initializedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep marker in sync when parent updates lat/lng externally
  useEffect(() => {
    if (markerRef.current && lat && lng) {
      markerRef.current.setLatLng([lat, lng]);
      mapRef.current?.panTo([lat, lng]);
    }
  }, [lat, lng]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <MapPin className="w-4 h-4 text-main-green" />
        <span>
          {t("map_hint") || "انقر على الخريطة أو اسحب الدبوس لتحديد الموقع"}
        </span>
      </div>

      {/* Coordinates display */}
      <div className="flex gap-3 text-xs bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 font-mono">
        <span className="text-gray-500">{t("latitude") || "خط العرض"}:</span>
        <span className="font-bold text-main-navy">{lat.toFixed(6)}</span>
        <span className="text-gray-300">|</span>
        <span className="text-gray-500">{t("longitude") || "خط الطول"}:</span>
        <span className="font-bold text-main-navy">{lng.toFixed(6)}</span>
      </div>

      {/* Map container */}
      <div
        ref={containerRef}
        className="w-full rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm"
        style={{ height: 300 }}
      />
    </div>
  );
}
