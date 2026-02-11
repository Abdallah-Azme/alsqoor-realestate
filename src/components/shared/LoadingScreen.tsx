"use client";

import Lottie from "lottie-react";
import flyingFalconAnimation from "@/../public/images/flying-falcon.json";
import flyingFalconAnimation1 from "@/../public/images/loading.json";

interface LoadingScreenProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export default function LoadingScreen({
  message = "جاري التحميل...",
  size = "md",
  fullScreen = true,
}: LoadingScreenProps) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-main-light-gray via-white to-main-light-green/20"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      {/* Lottie Animation */}
      <div className={`${sizeClasses[size]} relative`}>
        <Lottie
          animationData={flyingFalconAnimation1}
          loop={true}
          autoplay={true}
          className="w-full h-full"
        />
      </div>

      {/* Loading Text */}
      {message && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-main-navy animate-pulse">
            {message}
          </p>
          {/* Animated dots */}
          <div className="flex justify-center gap-1 mt-2">
            <span
              className="w-2 h-2 bg-main-green rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 bg-main-green rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2 h-2 bg-main-green rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
