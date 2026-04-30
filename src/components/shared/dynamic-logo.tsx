"use client";

import React from "react";
import Lottie from "lottie-react";
import { motion } from "motion/react";
import flyingFalconAnimation from "@/../public/images/flying-falcon.json";
import Image from "next/image";

interface DynamicLogoProps {
  className?: string;
  size?: number;
  useLottie?: boolean;
  color?: "white" | "original";
  src?: string;
}

/**
 * A dynamic logo component that can show a Lottie animation of a falcon
 * or an animated version of the static logo.
 */
export const DynamicLogo = ({ 
  className = "", 
  size = 48, 
  useLottie = true,
  color = "white",
  src = "/images/logo.svg"
}: DynamicLogoProps) => {
  if (useLottie) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative flex items-center justify-center overflow-hidden rounded-xl ${className}`} 
        style={{ width: size, height: size }}
      >
        <Lottie
          animationData={flyingFalconAnimation}
          loop={true}
          autoplay={true}
          className="w-[180%] h-[180%] max-w-none" // Zoom in a bit on the falcon
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20 
      }}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt="Logo"
        fill
        className={`object-contain transition-all duration-300 ${
          color === "white" && src === "/images/logo.svg" ? "brightness-0 invert opacity-90" : ""
        }`}
      />
    </motion.div>
  );
};

export default DynamicLogo;
