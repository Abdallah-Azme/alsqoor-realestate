import { Variant } from "motion/react";

// Animation variants for consistent use across components
// Y-axis translation only, fade in/out, subtle rotation

interface AnimationVariant {
  initial: Variant;
  animate: Variant;
}

export const fadeInUp: AnimationVariant = {
  initial: {
    opacity: 0,
    y: 40,
    rotate: -2,
  },
  animate: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeInUpDelayed = (delay = 0): AnimationVariant => ({
  initial: { opacity: 0, y: 40, rotate: -2 },
  animate: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  },
});

export const staggerContainer: AnimationVariant = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: AnimationVariant = {
  initial: { opacity: 0, y: 30, rotate: -1 },
  animate: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Viewport options for scroll-triggered animations
export const viewportOptions = {
  once: true,
  margin: "-100px",
};

export const viewportOptionsSmall = {
  once: true,
  margin: "-50px",
};
