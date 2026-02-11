"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

const FAQSection = ({ faqs }: FAQSectionProps) => {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="container py-12 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-main-navy">
          {t("title")} | <span className="text-main-green">{t("brand")}</span>
        </h2>
        <div className="w-16 h-1 bg-main-green mx-auto mt-4 rounded-full" />
      </motion.div>

      {/* FAQ Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4 max-w-3xl mx-auto"
      >
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`rounded-xl overflow-hidden transition-all duration-500 ${
                isOpen
                  ? "bg-main-green shadow-lg"
                  : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center gap-4 p-4 transition-all duration-300"
              >
                {/* Toggle Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen ? "bg-white/20" : "bg-main-green"
                  }`}
                >
                  <ChevronUp
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isOpen ? "rotate-0 text-white" : "rotate-180 text-white"
                    }`}
                  />
                </div>

                {/* Question Text */}
                <span
                  className={`flex-1 text-start font-medium transition-colors duration-300 ${
                    isOpen ? "text-white" : "text-main-navy"
                  }`}
                >
                  {faq.question}
                </span>
              </button>

              {/* Answer Content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 ps-18">
                      <p className="text-white/90 leading-7 text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default FAQSection;
