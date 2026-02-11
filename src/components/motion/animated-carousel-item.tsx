"use client";
import { motion } from "motion/react";
import { CarouselItem } from "@/components/ui/carousel";

/**
 * Animated carousel item wrapper for stagger effects
 * Use this for carousel items that need stagger animations
 */
export const AnimatedCarouselItem = ({
  children,
  index = 0,
  className = "",
}) => {
  return (
    <CarouselItem className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px" }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
      >
        {children}
      </motion.div>
    </CarouselItem>
  );
};
