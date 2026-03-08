"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SiteOffer } from "../types/offer.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface SiteOfferCardProps {
  offer: SiteOffer;
  index: number;
}

export function SiteOfferCard({ offer, index }: SiteOfferCardProps) {
  const t = useTranslations("offers_page");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className={`relative h-full overflow-hidden border-2 transition-all duration-500 flex flex-col hover:shadow-2xl hover:-translate-y-2 group ${
          offer.is_active
            ? "border-main-green/30 bg-white"
            : "border-gray-100 bg-white"
        }`}
      >
        {offer.is_active && (
          <div className="absolute top-3 end-3 z-10">
            <div className="bg-main-green text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              {t("popular_badge")}
            </div>
          </div>
        )}

        <CardHeader className="space-y-2 pb-4 pt-8 text-center bg-gray-50/50 border-b border-gray-100/50">
          <h3 className="text-xl font-bold text-main-navy">{offer.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {offer.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-8 grow">
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-main-green tracking-tight">
                {offer.price}
              </span>
              <span className="text-lg font-semibold text-main-green/80 uppercase">
                {t("currency") || "ر.س"}
              </span>
            </div>

            <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              {offer.validity_days} {t("days") || "يوم"}
            </div>
          </div>

          <ul className="space-y-4 pt-4">
            {offer.features?.map((f, idx) => (
              <li key={f.id || idx} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-main-green" />
                <span className="text-sm text-gray-600">{f.feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="pt-6 pb-8 mt-auto">
          {offer.whatsapp_number ? (
            <a
              href={`https://wa.me/${offer.whatsapp_number.replace(/\+/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                className={`w-full ${
                  offer.is_active
                    ? "bg-main-green hover:bg-main-green/90 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                size="lg"
                variant={offer.is_active ? "default" : "secondary"}
              >
                {t("subscribe_now") || "Subscribe Now"}
              </Button>
            </a>
          ) : (
            <Link href={`/offers/${offer.id}`} className="w-full">
              <Button
                className={`w-full ${
                  offer.is_active
                    ? "bg-main-green hover:bg-main-green/90 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                size="lg"
                variant={offer.is_active ? "default" : "secondary"}
              >
                {t("view_details") || "View Details"}
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
