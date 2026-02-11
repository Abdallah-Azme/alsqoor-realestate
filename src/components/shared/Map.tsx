"use client";

import dynamic from "next/dynamic";
import { ComponentProps } from "react";

// Dynamically import the map to prevent SSR issues
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
      <span className="text-gray-400">جاري تحميل الخريطة...</span>
    </div>
  ),
});

type MapProps = ComponentProps<typeof LeafletMap>;

const Map = (props: MapProps) => {
  return <LeafletMap {...props} />;
};

export default Map;
