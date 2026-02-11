"use client";
import React, { useState, useEffect } from "react";
import ServicesCard from "../shared/services-card";
import { motion } from "motion/react";

const ServicesSection = ({ coreValues = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);

  // Determine the number of cards
  const cardCount = coreValues.length > 0 ? coreValues.length : 4;

  // Auto-cycle through cards when in view
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cardCount);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isInView, cardCount]);

  return (
    <section className="container py-12 overflow-hidden">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        variants={{
          animate: { transition: { staggerChildren: 0.15 } },
        }}
        onViewportEnter={() => setIsInView(true)}
        className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 min-h-[260px]"
      >
        {coreValues.length > 0
          ? coreValues.map((value, index) => (
              <motion.div
                key={index}
                variants={{
                  initial: { opacity: 0, y: 30, rotate: -1 },
                  animate: { opacity: 1, y: 0, rotate: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <ServicesCard value={value} isActive={activeIndex === index} />
              </motion.div>
            ))
          : // Fallback to 4 placeholder cards if no data
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                variants={{
                  initial: { opacity: 0, y: 30, rotate: -1 },
                  animate: { opacity: 1, y: 0, rotate: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <ServicesCard isActive={activeIndex === index} />
              </motion.div>
            ))}
      </motion.div>
    </section>
  );
};

export default ServicesSection;
