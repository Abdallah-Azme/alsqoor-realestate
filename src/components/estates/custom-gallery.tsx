"use client";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const images = [
  { original: "/images/state.png", thumbnail: "/images/state.png" },
  { original: "/images/state.png", thumbnail: "/images/state.png" },
  { original: "/images/state.png", thumbnail: "/images/state.png" },
  { original: "/images/state.png", thumbnail: "/images/state.png" },
  { original: "/images/state.png", thumbnail: "/images/state.png" },
  { original: "/images/state.png", thumbnail: "/images/state.png" },
  { original: "/images/state.png", thumbnail: "/images/state.png" },
  { original: "/images/state.png", thumbnail: "/images/state.png" },
  { original: "/images/state.png", thumbnail: "/images/state.png" },
  { original: "/images/state.png", thumbnail: "/images/state.png" },
];

export default function CustomGallery() {
  const maxThumbs = 5;

  const renderThumbInner = (item, index) => {
    // لو ده آخر thumbnail عايز أظهر عليه overlay
    if (index === maxThumbs - 1 && images.length > maxThumbs) {
      return (
        <div className="relative">
          <img src={item.thumbnail} alt="" />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              +{images.length - maxThumbs}
            </span>
          </div>
        </div>
      );
    }
    return <img src={item.thumbnail} alt="" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ImageGallery
        items={images}
        showFullscreenButton={true}
        showPlayButton={false}
        // showIndex={true}
        thumbnailPosition="bottom"
        slideDuration={450}
        renderThumbInner={renderThumbInner}
      />
    </div>
  );
}
