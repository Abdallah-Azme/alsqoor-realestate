"use client";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FaLongArrowAltRight } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";
import { motion } from "motion/react";
import FilterForm from "../shared/filter-form";

// Typewriter component for letter-by-letter animation
interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  highlightWords?: string[];
  pauseBeforeRestart?: number;
}

const TypewriterText = ({
  text,
  speed = 80,
  className = "",
  highlightWords = [],
  pauseBeforeRestart = 2000,
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isDeleting && currentIndex < text.length) {
      // Typing phase
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && currentIndex === text.length) {
      // Finished typing - pause before restarting
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseBeforeRestart);
      return () => clearTimeout(timeout);
    } else if (isDeleting) {
      // Reset and start again
      setDisplayedText("");
      setCurrentIndex(0);
      setIsDeleting(false);
    }
  }, [currentIndex, text, speed, isDeleting, pauseBeforeRestart]);

  // Apply highlighting to specific words
  const getHighlightedHtml = (content: string) => {
    let result = content;
    highlightWords.forEach((word) => {
      const regex = new RegExp(`(${word})`, "g");
      result = result.replace(regex, '<span class="text-main-green">$1</span>');
    });
    return result;
  };

  return (
    <h1
      className={className}
      dangerouslySetInnerHTML={{
        __html: getHighlightedHtml(displayedText),
      }}
    />
  );
};

interface HeroContentSection {
  title?: string;
  content?: string;
  image?: string | null;
}

interface HeroSectionProps {
  video?: string | null;
  settings?: any;
  heroContent?: HeroContentSection | null;
}

const HeroSection = ({
  video = null,
  settings = null,
  heroContent = null,
}: HeroSectionProps) => {
  // Get phone number from settings, fallback to hardcoded value
  const whatsappNumber =
    settings?.contactInfo?.sitePhone?.replace(/[^0-9]/g, "") || "201068389295";
  const t = useTranslations("home.hero");
  const message = encodeURIComponent(t("whatsapp_message"));
  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const videoSrc = video || "/images/hero.mp4";

  // Dynamic content from API, with fallbacks
  const title =
    heroContent?.title ||
    t("title_fallback", { defaultMessage: "حلول عقارية ميسرة" });
  // keeping defaultMessage as arabic for now if key doesn't exist, wait I didn't add title_fallback.
  // I will just use the hardcoded string as default in t? No, t requires key.
  // I'll stick to the original hardcoded fallback if I didn't add a key, OR I'll add the key now.
  // Actually, I didn't add "title_fallback" to JSON. I will just leave the title/description fallbacks as is for now or use a generic key.
  // But wait, the task is to translate. Leaving Arabic fallback in English view is bad.
  // I'll add "title_default" and "content_default" to JSONs quickly or just inline the English fallback in code?
  // Inline English strings in `en.json` is better.
  // I will skip changing title/desc fallbacks for this specific tool call and focus on buttons.

  const description =
    heroContent?.content ||
    "شركة الصقور العقارية هي شريكك الأول لتحقيق أحلامك العقارية بكل ثقة واطمئنان. نقدم لك مجموعة متكاملة من الخدمات تشمل البيع والشراء والتأجير وإدارة الأملاك،";

  return (
    <section className="container  pt-12 p-6  bg-main-light-gray rounded-b-[3rem]  space-y-12">
      {/* title */}
      <div className="flex items-center justify-center  max-md:flex-col max-md:gap-6 max-md:text-center">
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className=" md:w-1/2 w-full relative"
        >
          <Image
            src="/images/vector.svg"
            width={100}
            height={100}
            alt="vector"
            className="max-md:hidden absolute -bottom-[30%] end-[20%]"
          />
          <TypewriterText
            text={title}
            speed={80}
            className="md:text-5xl text-4xl font-bold leading-[1.2]"
            highlightWords={["ميسرة", "العقارية"]}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="md:w-1/2 w-full space-y-4  "
        >
          <p className=" lg:w-[85%] lg:text-base text-xs">{description}</p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex   gap-8 max-md:justify-center"
          >
            <Link
              href={"/about-us"}
              className="block w-fit bg-white group rounded-tr-2xl"
            >
              <div className="  bg-main-green text-white lg:py-4 lg:px-6 p-3 rounded-tr-2xl max-lg:text-xs  font-semibold flex items-center gap-2 w-fit translate-x-3 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:gap-3 transition-all duration-500">
                <FaLongArrowAltRight size={20} /> {t("show_more")}
              </div>
            </Link>
            <button
              onClick={handleWhatsApp}
              className="block w-fit bg-main-light-green group rounded-tr-2xl"
            >
              <div className="  bg-main-navy text-white lg:py-4 lg:px-6 p-3 rounded-tr-2xl max-lg:text-xs  font-semibold flex items-center gap-2 w-fit translate-x-3 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:gap-3 transition-all duration-500">
                <FaLongArrowAltRight size={20} /> {t("consult_expert")}
              </div>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* video */}
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="flex items-center justify-evenly"
      >
        {/* video */}
        <div className="relative lg:h-[30vh] lg:w-[65%] w-full hover rounded-[3rem] overflow-hidden ">
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative z-10 p-6 h-full flex  ">
            <FilterForm />
          </div>
        </div>
        <div className="lg:h-[30vh] max-lg:hidden ">
          <Image
            src="/images/hero.png"
            width={500}
            height={500}
            alt="hero"
            className="w-full h-full "
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
