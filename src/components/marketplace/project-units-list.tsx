"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "motion/react";
import { TbDimensions } from "react-icons/tb";
import { IoBedOutline } from "react-icons/io5";
import { LuBath } from "react-icons/lu";

interface Unit {
  id: string;
  code: string;
  image: string;
  availability: number;
  area: number;
  rooms: number;
  bathrooms: number;
  price: number;
  formattedPrice: string;
}

interface ProjectUnitsListProps {
  units: Unit[];
}

const ProjectUnitsList = ({ units }: ProjectUnitsListProps) => {
  const t = useTranslations("marketplace.developer");
  const tCommon = useTranslations("marketplace");

  return (
    <div className="space-y-3">
      {units.map((unit, index) => (
        <motion.div
          key={unit.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {/* Unit Image */}
            <div className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={unit.image}
                alt={unit.code}
                fill
                className="object-cover"
              />
            </div>

            {/* Unit Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  {/* Code */}
                  <h3 className="font-bold text-gray-900">{unit.code}</h3>

                  {/* Availability */}
                  <p className="text-xs text-gray-500">
                    {unit.availability} {t("unit_available")}
                  </p>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <TbDimensions className="text-main-green" size={14} />
                    <span>
                      {unit.area} {tCommon("area_unit")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IoBedOutline className="text-main-green" size={14} />
                    <span>
                      {unit.rooms} {t("rooms")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LuBath className="text-main-green" size={14} />
                    <span>
                      {unit.bathrooms} {t("bathrooms")}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-end shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-main-green">
                      {unit.formattedPrice}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {tCommon("currency")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectUnitsList;
