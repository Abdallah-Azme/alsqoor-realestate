"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import SectionHeader from "../shared/section-header";
import { FaStar } from "react-icons/fa";
import { FaSquareCheck } from "react-icons/fa6";
import Image from "next/image";
import { motion } from "motion/react";

// Component for counting animation
const CountingNumber = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  // Extract numeric value from string like "500+" or "1000+"
  const numericValue = parseInt(value?.replace(/[^0-9]/g, "") || "0", 10);
  const suffix = value?.replace(/[0-9]/g, "") || "";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth ending
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * numericValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, numericValue, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

// Single stat item component
const StatItem = ({ stat }) => (
  <div className="flex items-center gap-2 px-6 whitespace-nowrap shrink-0">
    <p className="lg:text-sm text-xs text-gray-400">{stat.label}</p>
    <p className="lg:text-4xl text-2xl font-bold">
      <CountingNumber value={stat.number} />
    </p>
  </div>
);

const AboutSection = ({
  sections = [],
  platformRating = "4.8",
  statistics = [],
  bannerImage = null,
}) => {
  const [marqueeReady, setMarqueeReady] = useState(false);

  // Get the second section for display (index 1)
  const displaySection = sections[1] || sections[0] || {};
  const { title = "", content = "" } = displaySection;

  // Use bannerImage if provided, otherwise fallback to section image or default
  const imageUrl = bannerImage || displaySection?.image || "/images/about.jpg";

  const t = useTranslations("home.about");
  // Default statistics if none provided
  const defaultStats = [
    { number: "500+", label: t("stats.listed_property") },
    { number: "50+", label: t("stats.daily_sales") },
    { number: "1000+", label: t("stats.active_user") },
    { number: "200+", label: t("stats.positive_rating") },
  ];

  const statsToShow = statistics.length > 0 ? statistics : defaultStats;

  // Duplicate stats for seamless marquee
  const duplicatedStats = [...statsToShow, ...statsToShow];

  // Start marquee after counting animation completes (2 seconds + buffer)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMarqueeReady(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="container space-y-6 py-12 flex items-center max-lg:flex-col max-lg:gap-6 ">
      {/* content */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -1 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/2 space-y-8  self-start"
      >
        <SectionHeader>{t("who_we_are")}</SectionHeader>
        <h3 className="lg:text-[32px]  text-3xl font-semibold lg:w-[80%] lg:leading-16 leading-12">
          {title || "نضمن تعامل موثوق وحماية عالية لبياناتك"}
        </h3>
        <p className="text-xs leading-6 lg:w-[90%] ">
          {content ||
            "شركة الحلول العقارية هي شريكك الأول لتحقيق أحلامك العقارية..."}
        </p>
      </motion.div>
      {/* image */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 1 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="lg:w-1/2 w-full rounded-3xl relative h-[50vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      >
        {/* rate */}
        <div className="w-[30%] text-center bg-white rounded-b-3xl  absolute top-0 end-[10%] ">
          <FaSquareCheck
            size={34}
            className="lg:size-[34px] size-[24px] text-main-green absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <div className="space-y-4 lg:p-8 p-4 ">
            <p className="lg:text-6xl text-4xl font-bold ">{platformRating}</p>
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar key={index} size={20} className="text-main-green" />
              ))}
            </div>
            <div className="space-y-1">
              <p className="whitespace-nowrap text-xs font-semibold text-gray-400">
                {t("trusted_by")}
              </p>
              <p className=" text-xs ">500+ {t("reviews")}</p>
            </div>
          </div>
        </div>

        {/* Statistics Marquee */}
        <div className="absolute bottom-0 start-0 end-0 bg-white rounded-tl-4xl lg:p-4 p-3 overflow-hidden">
          <div className={`flex ${marqueeReady ? "animate-marquee" : ""}`}>
            {duplicatedStats.map((stat, index) => (
              <StatItem key={index} stat={stat} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Marquee Animation Styles */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
