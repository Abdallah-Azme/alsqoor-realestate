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
        className="bg-white rounded-lg p-4 space-y-5 border-2 border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col group"
      >
        {/* Image Section */}
        <div className="h-52 rounded-xl relative overflow-hidden group shrink-0">
          <Image
            src={project.image || "/images/state.png"}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Broker Opportunity Badge */}
          {project.isBrokerOpportunity && (
            <div className="absolute top-3 start-3 bg-main-green text-white text-[0.65rem] font-medium px-2 py-1 rounded-full shadow-md flex items-center gap-1 z-10 w-fit">
              <span>🏆</span>
              {t("broker_opportunity")}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1">
              {project.title}
            </h3>

            <p className="text-xs text-gray-500 flex items-center gap-1 line-clamp-1">
              <HiOutlineLocationMarker className="text-main-green size-3" />
              {project.location}
            </p>

            {/* Starting Price */}
            <div className="flex flex-col gap-0.5 mt-2">
              <span className="text-xs text-gray-400">
                {t("starting_from")}
              </span>
              <div className="flex items-center gap-1">
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
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-main-green/10 text-main-green font-bold flex items-center justify-center text-xs shrink-0">
                {project.developerName.charAt(0)}
              </div>
              <p className="text-xs font-medium text-gray-600 line-clamp-1">
                {project.developerName}
              </p>
            </div>

            {/* Broker Commission Info */}
            {project.brokerCommission > 0 && (
              <div className="bg-main-green/5 border border-main-green/20 rounded-md px-2 py-1.5 flex items-center justify-center">
                <div className="flex items-center gap-2 text-xs text-main-green font-medium">
                  <span>💰</span>
                  <span>
                    {t("broker_commission", {
                      percentage: project.brokerCommission,
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Specs Grid (Time) */}
            <div className="flex items-center justify-between text-[0.65rem] text-gray-400 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <FiClock size={10} />
                <span>{project.timePosted}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full text-sm font-medium text-center rounded-md py-2 px-3 border border-main-green text-main-green group-hover:bg-main-green group-hover:text-white transition-all duration-300 mt-2">
              {t("show_details")}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default DeveloperProjectCard;
