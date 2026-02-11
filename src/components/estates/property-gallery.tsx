"use client";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export default function PropertyGallery({ images }) {
  // Transform images to gallery format
  const galleryImages =
    images && images.length > 0
      ? images.map((img) => ({
          original: img,
          thumbnail: img,
        }))
      : [
          {
            original: "/images/state.png",
            thumbnail: "/images/state.png",
          },
        ];

  return (
    <div dir="ltr">
      <ImageGallery items={galleryImages} />
    </div>
  );
}
