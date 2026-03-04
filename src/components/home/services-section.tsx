"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import {
  FiTarget,
  FiShield,
  FiStar,
  FiUsers,
  FiCheckCircle,
  FiTrendingUp,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

const ICONS = [
  <FiTarget key="1" className="size-6" />,
  <FiShield key="2" className="size-6" />,
  <FiUsers key="3" className="size-6" />,
  <FiStar key="4" className="size-6" />,
  <FiCheckCircle key="5" className="size-6" />,
  <FiTrendingUp key="6" className="size-6" />,
  <FiMapPin key="7" className="size-6" />,
  <FiPhone key="8" className="size-6" />,
];

const ServicesSection = ({ coreValues = [] }: { coreValues: any[] }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const frontValues = coreValues.slice(0, 4);
  const backValues = coreValues.slice(4, 8);
  const hasBackData = backValues.length > 0;

  useEffect(() => {
    if (!hasBackData) return;
    const timer = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 5000);
    return () => clearInterval(timer);
  }, [hasBackData]);

  if (frontValues.length === 0) return null;

  return (
    <section className="bg-main-light-gray py-8 border-y border-gray-100 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Always render 4 slots */}
          {Array.from({ length: 4 }).map((_, index) => {
            const front = frontValues[index];
            const back = backValues[index];
            const showFront = !isFlipped || !back;
            const currentItem = showFront ? front : back;

            // Empty slot — no data at all for this position
            if (!front && !back) return <div key={index} />;

            // When flipped and no back — show empty slot
            if (isFlipped && !back) return <div key={index} />;

            return (
              <motion.div
                key={index}
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`relative h-28 w-full rounded-2xl p-5 border flex items-center gap-4 transition-colors duration-500 ${
                  !showFront
                    ? "bg-main-navy border-main-navy"
                    : "bg-white border-gray-100"
                }`}
              >
                {currentItem && (
                  <>
                    <motion.div
                      key={`${index}-${isFlipped ? "back" : "front"}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.08 }}
                      className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        !showFront
                          ? "bg-white/10 text-main-green"
                          : "bg-main-green/10 text-main-green"
                      }`}
                    >
                      {currentItem.icon ? (
                        <Image
                          src={currentItem.icon}
                          alt={currentItem.title}
                          width={24}
                          height={24}
                          className={`object-contain ${!showFront ? "invert" : ""}`}
                        />
                      ) : (
                        ICONS[(!showFront ? index + 4 : index) % ICONS.length]
                      )}
                    </motion.div>

                    <motion.div
                      key={`${index}-text-${isFlipped ? "back" : "front"}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.08 + 0.05,
                      }}
                      className="min-w-0"
                    >
                      <h3
                        className={`font-bold text-sm truncate ${
                          !showFront ? "text-white" : "text-main-navy"
                        }`}
                      >
                        {currentItem.title}
                      </h3>
                      <p
                        className={`text-[10px] line-clamp-2 leading-tight mt-1 ${
                          !showFront ? "text-gray-300" : "text-gray-400"
                        }`}
                      >
                        {currentItem.description}
                      </p>
                    </motion.div>

                    <div
                      className={`absolute top-3 end-3 size-1.5 rounded-full ${
                        !showFront ? "bg-white/30" : "bg-main-green/30"
                      }`}
                    />
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
