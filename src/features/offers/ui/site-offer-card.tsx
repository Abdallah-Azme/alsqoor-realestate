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
  const t = useTranslations("packages_page");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className={`relative h-full overflow-hidden border-2 transition-all duration-300 flex flex-col hover:shadow-xl ${
          offer.is_active
            ? "border-main-green/20 hover:border-main-green"
            : "border-gray-100 hover:border-gray-200"
        }`}
      >
        {offer.is_active && (
          <div className="absolute -end-12 top-6 rotate-45 bg-main-green px-12 py-1 text-xs font-bold text-white shadow-sm">
            {t("popular_badge") || "Active Plan"}
          </div>
        )}

        <CardHeader className="space-y-2 pb-4 pt-8 text-center bg-gray-50">
          <h3 className="text-xl font-bold text-main-navy">{offer.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {offer.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-6 grow">
          <div className="text-center">
            <span className="text-4xl font-bold text-main-green">
              {offer.price}
            </span>
            <span className="text-sm text-gray-400 ms-1 space-x-1">
              <span>{t("currency") || "SAR"} /</span>
              <span>
                {offer.validity_days} {t("days") || "Days"}
              </span>
            </span>
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
