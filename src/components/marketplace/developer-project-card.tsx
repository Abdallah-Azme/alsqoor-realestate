"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "motion/react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiClock } from "react-icons/fi";

interface DeveloperProjectCardProps {
  project: {
    id: string;
    slug: string;
    title: string;
    developerName: string;
    developerLogo?: string;
    startingPrice: number;
    formattedStartingPrice: string;
    location: string;
    city: string;
    image: string;
    brokerCommission: number;
    timePosted: string;
    isBrokerOpportunity: boolean;
  };
  index?: number;
}

const DeveloperProjectCard = ({
  project,
  index = 0,
}: DeveloperProjectCardProps) => {
  const t = useTranslations("marketplace.developer");

  return (
    <Link href={`/marketplace/developers/${project.slug || project.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      >
        {/* Image Section */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={project.image || "/images/state.png"}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Developer Logo */}
          {/* {project.developerLogo && (
            <div className="absolute bottom-3 end-3 bg-white rounded-lg p-2 shadow-md">
              <Image
                src={project.developerLogo}
                alt={project.developerName}
                width={60}
                height={40}
                className="object-contain"
              />
            </div>
          )} */}

          {/* Broker Opportunity Badge */}
          {project.isBrokerOpportunity && (
            <div className="absolute top-3 start-3 bg-main-green text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1">
              <span>🏆</span>
              <span>{t("broker_opportunity")}</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Time Posted */}
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
            <FiClock size={12} />
            <span>{project.timePosted}</span>
          </div>

          {/* Title & Developer */}
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1">
            {project.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{project.developerName}</p>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <HiOutlineLocationMarker className="text-main-green" size={14} />
            <span>{project.location}</span>
          </div>

          {/* Starting Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-500">{t("starting_from")}</span>
            <span className="text-xl font-bold text-main-green">
              {project.formattedStartingPrice}
            </span>
            <Image
              src="/images/ryal.svg"
              alt="SAR"
              width={16}
              height={16}
              className="size-4"
            />
          </div>

          {/* Broker Commission Info */}
          {project.brokerCommission > 0 && (
            <div className="bg-main-green/5 border border-main-green/20 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 text-xs text-main-green">
                <span>💰</span>
                <span>
                  {t("broker_commission", {
                    percentage: project.brokerCommission,
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default DeveloperProjectCard;
