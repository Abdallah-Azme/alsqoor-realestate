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
import { CheckCircle2, MessageCircle, Clock, User, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

interface SiteOfferCardProps {
  offer: SiteOffer;
  index: number;
}

export function SiteOfferCard({ offer, index }: SiteOfferCardProps) {
  const t = useTranslations("offers_page");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        className={`group relative h-full overflow-hidden border-none shadow-sm transition-all duration-500 flex flex-col hover:shadow-2xl hover:-translate-y-2 bg-white`}
      >
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-main-green/5 rounded-full blur-3xl group-hover:bg-main-green/10 transition-colors duration-500" />
        
        {offer.is_active && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-main-green/10 hover:bg-main-green/20 text-main-green border-none px-3 py-1 gap-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-main-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-main-green"></span>
              </span>
              {t("popular_badge")}
            </Badge>
          </div>
        )}

        <CardHeader className="space-y-4 pb-0 pt-8 relative z-10">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-2xl font-black text-main-navy group-hover:text-main-green transition-colors duration-300">
              {offer.name}
            </h3>
          </div>
          <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed">
            {offer.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-6 grow relative z-10">
          {/* Price Section with glass effect */}
          <div className="relative p-6 rounded-3xl bg-gray-50/50 group-hover:bg-main-green/5 border border-gray-100 transition-colors duration-500 flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-main-navy tracking-tight">
                {offer.price}
              </span>
              <span className="text-sm font-bold text-gray-400 uppercase">
                {t("currency") || "ر.س"}
              </span>
            </div>
            
            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-main-green bg-main-green/5 px-3 py-1 rounded-full border border-main-green/10">
              <Clock className="w-3.5 h-3.5" />
              {offer.validity_days} {t("days") || "يوم"}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-main-green" />
              {t("features") || "المميزات"}
            </h4>
            <ul className="grid grid-cols-1 gap-2.5">
              {offer.features?.map((f, idx) => (
                <motion.li 
                  key={f.id || idx} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-center gap-3 bg-gray-50/30 p-2 rounded-xl border border-transparent hover:border-main-green/10 hover:bg-white transition-all duration-300"
                >
                  <div className="bg-main-green/10 p-1 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-main-green" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{f.feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-4 pb-8 relative z-10 border-t border-gray-50">
          {offer.user && (
            <div className="flex items-center gap-3 w-full bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100/50">
              <div className="h-10 w-10 rounded-xl bg-main-navy text-white flex items-center justify-center font-bold text-sm shadow-inner group-hover:bg-main-green transition-colors duration-500">
                {offer.user.name?.charAt(0).toUpperCase() || <User size={18} />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium">صاحب العرض</span>
                <span className="text-sm font-bold text-main-navy truncate max-w-[180px]">
                  {offer.user.name}
                </span>
              </div>
            </div>
          )}

          {offer.whatsapp_number ? (
            <a
              href={`https://wa.me/${offer.whatsapp_number.replace(/\+/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                className="w-full h-12 rounded-2xl bg-main-green hover:bg-main-navy text-white font-bold shadow-lg shadow-main-green/20 border-none transition-all duration-300 gap-2 overflow-hidden relative group/btn"
                size="lg"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                <MessageCircle size={18} className="relative z-10" />
                <span className="relative z-10">{t("subscribe_now")}</span>
              </Button>
            </a>
          ) : (
            <Link href={`/offers/${offer.id}`} className="w-full">
              <Button
                className="w-full h-12 rounded-2xl bg-main-navy hover:bg-main-green text-white font-bold transition-all duration-300 border-none"
                size="lg"
              >
                {t("view_details")}
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

