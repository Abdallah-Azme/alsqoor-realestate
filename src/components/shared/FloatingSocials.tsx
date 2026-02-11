"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  FaWhatsapp,
  FaSnapchatGhost,
  FaInstagram,
  FaTelegram,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiShare, HiX } from "react-icons/hi";
import { useTranslations } from "next-intl";

interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  snapchat?: string;
  pinterest?: string;
  whatsapp?: string;
  telegram?: string;
}

interface FloatingSocialsProps {
  settings?: {
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      youtube?: string;
      tiktok?: string;
      snapchat?: string;
      pinterest?: string;
      whatsapp?: string;
      telegram?: string;
    };
    [key: string]: any; // Allow other properties from Settings
  } | null;
}

export default function FloatingSocials({
  settings = null,
}: FloatingSocialsProps) {
  const t = useTranslations("floating_socials");
  const [isOpen, setIsOpen] = useState(false);

  const socialMedia = settings?.socialMedia || {};

  // Build socials array from settings, filtering out empty values
  const socials = [
    socialMedia.whatsapp && {
      icon: <FaWhatsapp className="text-green-500 text-xl" />,
      link: `https://wa.me/${socialMedia.whatsapp.replace(/[^0-9]/g, "")}`,
      label: t("whatsapp"),
    },
    socialMedia.twitter && {
      icon: <FaXTwitter className="text-black text-xl" />,
      link: socialMedia.twitter,
      label: t("twitter"),
    },
    socialMedia.snapchat && {
      icon: <FaSnapchatGhost className="text-yellow-400 text-xl" />,
      link: socialMedia.snapchat,
      label: t("snapchat"),
    },
    socialMedia.instagram && {
      icon: <FaInstagram className="text-pink-500 text-xl" />,
      link: socialMedia.instagram,
      label: "Instagram",
    },
    socialMedia.telegram && {
      icon: <FaTelegram className="text-blue-500 text-xl" />,
      link: `https://t.me/${socialMedia.telegram.replace("@", "")}`,
      label: "Telegram",
    },
    socialMedia.tiktok && {
      icon: <FaTiktok className="text-black text-xl" />,
      link: socialMedia.tiktok,
      label: "TikTok",
    },
  ].filter(Boolean);

  // Don't render if no social links available
  if (socials.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Desktop: Show icons directly */}
      <div className="hidden md:flex flex-col items-center gap-3">
        {socials.map((s, i) => (
          <motion.a
            key={s.label}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white shadow-lg rounded-full size-14 border border-main-green/50 flex items-center justify-center hover:scale-110 transition-transform"
            title={s.label}
          >
            {s.icon}
          </motion.a>
        ))}
      </div>

      {/* Mobile: Toggle button with expandable icons */}
      <div className="md:hidden flex flex-col items-center gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-3 mb-3"
            >
              {socials.map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white shadow-lg rounded-full size-12 border border-main-green/50 flex items-center justify-center hover:scale-110 transition-transform"
                  title={s.label}
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-main-green text-white shadow-lg rounded-full size-14 flex items-center justify-center hover:scale-110 transition-transform"
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? "Close socials" : "Open socials"}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <HiX className="text-2xl" />
            ) : (
              <HiShare className="text-2xl" />
            )}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
