"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { FiCheckCircle, FiMapPin, FiMessageCircle } from "react-icons/fi";
import Image from "next/image";

interface StepIntroProps {
  onNext: () => void;
}

const StepIntro = ({ onNext }: StepIntroProps) => {
  const t = useTranslations("advertisements.wizard");

  const features = [
    {
      icon: FiCheckCircle,
      title: t("intro.feature1_title"),
      description: t("intro.feature1_desc"),
    },
    {
      icon: FiMapPin,
      title: t("intro.feature2_title"),
      description: t("intro.feature2_desc"),
    },
    {
      icon: FiMessageCircle,
      title: t("intro.feature3_title"),
      description: t("intro.feature3_desc"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-8 px-4"
    >
      {/* Illustration */}
      <div className="mb-8">
        <div className="w-32 h-32 bg-main-green/10 rounded-full flex items-center justify-center">
          <Image
            src="/images/ad-illustration.svg"
            alt="Add advertisement"
            width={80}
            height={80}
            className="opacity-80"
            onError={(e) => {
              // Fallback if image doesn't exist
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="absolute">
            <FiCheckCircle className="w-16 h-16 text-main-green" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-main-navy mb-2 text-center">
        {t("intro.title")}
      </h2>
      <p className="text-gray-500 text-center mb-8 max-w-md">
        {t("intro.description")}
      </p>

      {/* Features */}
      <div className="space-y-4 w-full max-w-md mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100"
          >
            <div className="w-10 h-10 bg-main-green/10 rounded-full flex items-center justify-center flex-shrink-0">
              <feature.icon className="w-5 h-5 text-main-green" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <Button
        onClick={onNext}
        className="w-full max-w-md bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-6 text-lg"
      >
        {t("intro.cta_button")}
      </Button>
    </motion.div>
  );
};

export default StepIntro;
