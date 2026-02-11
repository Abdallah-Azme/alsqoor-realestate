"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { FiUpload, FiX, FiImage, FiVideo, FiPlus } from "react-icons/fi";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StepMediaProps {
  values: {
    images?: File[];
    videos?: File[];
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const MAX_IMAGES = 10;
const MAX_VIDEOS = 3;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const StepMedia = ({ values, onChange, onNext, onBack }: StepMediaProps) => {
  const t = useTranslations("advertisements.wizard.media");
  const tCommon = useTranslations("common");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const images = values.images || [];
  const videos = values.videos || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setError(null);
    const newImages: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size
      if (file.size > MAX_IMAGE_SIZE) {
        setError(t("image_size_error"));
        continue;
      }

      // Check total count
      if (images.length + newImages.length >= MAX_IMAGES) {
        setError(t("max_images_error", { max: MAX_IMAGES }));
        break;
      }

      newImages.push(file);
    }

    if (newImages.length > 0) {
      onChange("images", [...images, ...newImages]);
    }

    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setError(null);
    const newVideos: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size
      if (file.size > MAX_VIDEO_SIZE) {
        setError(t("video_size_error"));
        continue;
      }

      // Check total count
      if (videos.length + newVideos.length >= MAX_VIDEOS) {
        setError(t("max_videos_error", { max: MAX_VIDEOS }));
        break;
      }

      newVideos.push(file);
    }

    if (newVideos.length > 0) {
      onChange("videos", [...videos, ...newVideos]);
    }

    // Reset input
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange("images", newImages);
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    onChange("videos", newVideos);
  };

  const isValid = images.length >= 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="py-6 px-4 space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-main-navy mb-2">{t("title")}</h2>
        <p className="text-gray-500 text-sm">{t("description")}</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Images Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FiImage className="text-main-green" />
            {t("images_title")}
          </h3>
          <span className="text-sm text-gray-500">
            {images.length}/{MAX_IMAGES}
          </span>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={URL.createObjectURL(image)}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 end-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 start-1 bg-main-green text-white text-xs px-2 py-0.5 rounded">
                  {t("main_image")}
                </span>
              )}
            </div>
          ))}

          {/* Add Image Button */}
          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-main-green hover:text-main-green transition-colors"
            >
              <FiPlus className="w-6 h-6" />
              <span className="text-xs">{t("add_image")}</span>
            </button>
          )}
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />

        <p className="text-xs text-gray-500 mt-2">
          {t("images_hint", { max: MAX_IMAGES, size: "5MB" })}
        </p>
      </div>

      {/* Videos Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FiVideo className="text-main-green" />
            {t("videos_title")}
          </h3>
          <span className="text-sm text-gray-500">
            {videos.length}/{MAX_VIDEOS}
          </span>
        </div>

        {/* Video List */}
        <div className="space-y-2">
          {videos.map((video, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FiVideo className="text-gray-400" />
                <span className="text-sm text-gray-700 truncate max-w-[200px]">
                  {video.name}
                </span>
                <span className="text-xs text-gray-400">
                  ({(video.size / (1024 * 1024)).toFixed(1)}
                  {tCommon("mb")})
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="text-red-500 hover:text-red-600"
              >
                <FiX />
              </button>
            </div>
          ))}

          {/* Add Video Button */}
          {videos.length < MAX_VIDEOS && (
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-400 hover:border-main-green hover:text-main-green transition-colors"
            >
              <FiUpload />
              <span>{t("add_video")}</span>
            </button>
          )}
        </div>

        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="hidden"
        />

        <p className="text-xs text-gray-500 mt-2">
          {t("videos_hint", { max: MAX_VIDEOS, size: "50MB" })}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 py-6">
          {t("back")}
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-6 disabled:opacity-50"
        >
          {t("next")}
        </Button>
      </div>
    </motion.div>
  );
};

export default StepMedia;
