"use client";
import { motion } from "motion/react";

/**
 * Reusable animated section wrapper for scroll-triggered animations
 * Uses Y-axis translation, fade, and subtle rotation
 */
export const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Animated item wrapper for individual elements with stagger support
 */
export const AnimatedItem = ({ children, className = "", index = 0 }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  );
};
