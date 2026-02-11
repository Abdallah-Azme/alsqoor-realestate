"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface PointsCardProps {
  points?: number;
}

const PointsCard = ({ points = 0 }: PointsCardProps) => {
  const t = useTranslations("Profile");

  // Calculate progress percentage (max 2000 points for full circle)
  const maxPoints = 2000;
  const progress = Math.min((points / maxPoints) * 100, 100);
  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="shadow-sm border-gray-100 rounded-xl bg-white overflow-hidden">
      <CardContent className="p-6 flex items-center gap-4">
        {/* Circular Progress with Points */}
        <div className="relative size-16 shrink-0">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="6"
            />
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10B981"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-main-green">
            {points.toLocaleString()}
          </span>
        </div>

        {/* Labels */}
        <div className="flex-1 text-end">
          <h3 className="font-bold text-lg text-main-navy">
            {t("points_count")}
          </h3>
          <p className="text-sm text-gray-500">{t("total_points")}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsCard;
