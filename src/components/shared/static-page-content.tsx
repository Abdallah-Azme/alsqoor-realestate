"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { useTranslations } from "next-intl";

interface StaticPageContentProps {
  title: string;
  content: string;
  image?: string | null;
  breadcrumb?: string;
}

const StaticPageContent = ({
  title,
  content,
  image,
  breadcrumb,
}: StaticPageContentProps) => {
  const t = useTranslations("breadcrumbs");

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-main-light-gray w-full">
        <div className="container py-8">
          <CustomBreadcrumbs items={[{ label: breadcrumb || title }]} />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-main-navy mt-4"
          >
            {title}
          </motion.h1>
        </div>
      </div>

      <div className="container mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`prose prose-lg max-w-none text-gray-600 prose-headings:text-main-navy prose-a:text-main-green hover:prose-a:text-main-green/80 prose-strong:text-main-navy ${image ? "lg:col-span-8" : "lg:col-span-12"}`}
          >
            {/* Render HTML Content */}
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="[&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-3"
            />
          </motion.div>

          {/* Image Column (Sidebar) */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-4 sticky top-24"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-3/4 lg:aspect-auto lg:h-[600px] w-full group">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaticPageContent;
