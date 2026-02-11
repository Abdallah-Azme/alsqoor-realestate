"use client";

import Map from "@/components/shared/Map";
import { MapPin } from "lucide-react";

interface PropertyLocationMapProps {
  latitude: string | number;
  longitude: string | number;
  title?: string;
  address?: string;
}

export default function PropertyLocationMap({
  latitude,
  longitude,
  title = "موقع العقار",
  address,
}: PropertyLocationMapProps) {
  const lat = typeof latitude === "string" ? parseFloat(latitude) : latitude;
  const lng = typeof longitude === "string" ? parseFloat(longitude) : longitude;

  // Don't render if coordinates are invalid
  if (isNaN(lat) || isNaN(lng)) {
    return null;
  }

  const popupContent = address
    ? `<strong>${title}</strong><br/>${address}`
    : title;

  return (
    <div className="space-y-3">
      <Map
        latitude={lat}
        longitude={lng}
        zoom={15}
        className="h-80 w-full rounded-xl"
        markerPopup={popupContent}
        draggableMarker={false}
      />
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="w-4 h-4 text-main-green" />
        <span>
          {lat.toFixed(6)}, {lng.toFixed(6)}
        </span>
      </div>
    </div>
  );
}
