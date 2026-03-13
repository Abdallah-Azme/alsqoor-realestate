"use client";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Play } from "lucide-react";

interface PropertyGalleryProps {
  images?: string[];
  videos?: string[];
}

export default function PropertyGallery({ images = [], videos = [] }: PropertyGalleryProps) {
  // Transform images and videos to gallery format
  const galleryItems = [
    ...(images || []).map((img) => ({
      original: img,
      thumbnail: img,
      type: "image",
    })),
    ...(videos || []).map((video) => ({
      original: video,
      thumbnail: "/images/state.png", // Using existing placeholder
      type: "video",
    })),
  ];

  // If no media, show placeholder
  const items = galleryItems.length > 0 ? galleryItems : [
    {
      original: "/images/state.png",
      thumbnail: "/images/state.png",
      type: "image",
    }
  ];

  const renderItem = (item: any) => {
    if (item.type === "video") {
      return (
        <div className="relative aspect-video w-full bg-black flex items-center justify-center h-full">
          <video
            controls
            className="h-full w-full object-contain"
            poster={item.thumbnail === "/images/video-placeholder.png" ? "" : item.thumbnail}
          >
            <source src={item.original} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    return (
      <div className="relative aspect-video w-full">
        <img
          src={item.original}
          alt=""
          className="h-full w-full object-cover rounded-2xl"
        />
      </div>
    );
  };

  const renderThumbInner = (item: any) => {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-md border border-gray-100 aspect-square">
        <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />
        {item.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Play className="h-4 w-4 text-white fill-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div dir="ltr" className="property-gallery shadow-sm rounded-2xl overflow-hidden border border-gray-100 bg-white p-2">
      <ImageGallery
        items={items as any}
        renderItem={renderItem}
        renderThumbInner={renderThumbInner}
        showPlayButton={true}
        showFullscreenButton={true}
        thumbnailPosition="bottom"
        slideDuration={450}
        showNav={true}
        autoPlay={false}
      />
    </div>
  );
}
