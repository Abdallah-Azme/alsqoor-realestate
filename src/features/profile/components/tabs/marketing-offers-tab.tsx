"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useUserPropertyOffers, useAcceptOffer, useRejectOffer } from "@/features/offers/hooks/use-property-offers";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { 
  Loader2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  User, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyOffer } from "@/features/offers/types/offer.types";

export default function MarketingOffersTab() {
  const t = useTranslations("offers");
  const tp = useTranslations("Profile");
  const { data: offers, isLoading, error } = useUserPropertyOffers();
  const { data: profile } = useProfile();
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-main-green" />
          <div className="absolute inset-0 blur-xl bg-main-green/20 rounded-full animate-pulse" />
        </div>
        <p className="text-gray-500 font-medium animate-pulse">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center max-w-lg mx-auto my-12">
        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
          <XCircle className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-red-900 mb-2">{t("error_loading")}</h3>
        <p className="text-red-700">{t("messages.error_general") || "Failed to load marketing offers."}</p>
      </div>
    );
  }

  const offersResult: any = offers;
  const offersList: PropertyOffer[] = Array.isArray(offersResult?.data) 
    ? offersResult.data 
    : Array.isArray(offersResult) 
      ? offersResult 
      : [];

  const sentOffers = offersList.filter((o) => o.isMyOffer);
  const receivedOffers = offersList.filter((o) => !o.isMyOffer);

  const currentOffers = activeTab === "sent" ? sentOffers : receivedOffers;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Tab Selector - Premium Design */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-main-navy tracking-tight">{tp("marketing_offers")}</h2>
          <p className="text-gray-500 mt-1">{t("subtitle", { count: currentOffers.length }) || `لديك ${currentOffers.length} عرض`}</p>
        </div>
        
        <div className="bg-gray-100/80 p-1 rounded-xl flex w-full sm:w-auto backdrop-blur-sm border border-gray-200">
          <button
            onClick={() => setActiveTab("sent")}
            className={cn(
              "flex-1 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2",
              activeTab === "sent" 
                ? "bg-white text-main-green shadow-md ring-1 ring-black/5" 
                : "text-gray-600 hover:text-main-green hover:bg-white/50"
            )}
          >
            <ArrowUpRight className="h-4 w-4" />
            {t("sent_offers")}
            <span className={cn(
              "ml-1 px-2 py-0.5 rounded-full text-[10px]",
              activeTab === "sent" ? "bg-main-green/10 text-main-green" : "bg-gray-200 text-gray-500"
            )}>
              {sentOffers.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={cn(
              "flex-1 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2",
              activeTab === "received" 
                ? "bg-white text-main-green shadow-md ring-1 ring-black/5" 
                : "text-gray-600 hover:text-main-green hover:bg-white/50"
            )}
          >
            <ArrowDownLeft className="h-4 w-4" />
            {t("received_offers")}
            <span className={cn(
              "ml-1 px-2 py-0.5 rounded-full text-[10px]",
              activeTab === "received" ? "bg-main-green/10 text-main-green" : "bg-gray-200 text-gray-500"
            )}>
              {receivedOffers.length}
            </span>
          </button>
        </div>
      </div>

      {/* Offers Grid */}
      {currentOffers.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-16 text-center shadow-sm"
        >
          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-gray-50/50">
            <Clock className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {activeTab === "sent" ? t("no_sent_offers") : t("no_received_offers")}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {activeTab === "sent" 
              ? "ابدأ بتسويق العقارات لرؤية عروضك المرسلة هنا." 
              : "انتظر الوسطاء أو المشترين لإرسال عروض على عقاراتك."}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {currentOffers.map((offer: PropertyOffer, index: number) => (
              <OfferCard 
                key={offer.id} 
                offer={offer} 
                type={activeTab} 
                index={index}
                t={t}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function OfferCard({ offer, type, index, t }: { offer: PropertyOffer, type: "sent" | "received", index: number, t: any }) {
  const { mutate: acceptOffer, isPending: isAccepting } = useAcceptOffer();
  const { mutate: rejectOffer, isPending: isRejecting } = useRejectOffer();

  const statusConfig = {
    pending: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", icon: Clock },
    accepted: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: CheckCircle2 },
    rejected: { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", icon: XCircle }
  };

  const config = statusConfig[offer.status] || statusConfig.pending;
  const StatusIcon = config.icon;
  const propertyImage = offer.property?.images?.[0] || "/placeholder-property.jpg";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Card className="group relative overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl h-full flex flex-col bg-white">
        {/* Status Badge Over Image */}
        <div className="absolute top-4 z-20 ltr:right-4 rtl:left-4">
          <Badge className={cn("px-3 py-1.5 rounded-full font-bold shadow-sm flex items-center gap-1.5 border backdrop-blur-md", config.bg, config.color, config.border)}>
            <StatusIcon className="h-3.5 w-3.5" />
            {offer.statusLabel || t(`status.${offer.status}`)}
          </Badge>
        </div>

        {/* Property Preview */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={propertyImage}
            alt={offer.property?.title || "Property"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h4 className="font-bold text-lg line-clamp-1 group-hover:text-main-green transition-colors duration-300">
              {offer.property?.title || "Untitled Property"}
            </h4>
            <div className="flex items-center gap-1 text-white/80 text-xs font-medium">
              <Building2 className="h-3 w-3" />
              <span>{offer.property?.price} {offer.property?.currency || "ر.س"}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-5 flex-1 flex flex-col">
          {/* Details */}
          <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 flex-1">
            <p className="text-gray-700 text-sm leading-relaxed italic line-clamp-4">
              "{offer.offerDetails}"
            </p>
          </div>

          {/* Metadata */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-gray-500">
                <div className="h-8 w-8 rounded-full bg-main-green/10 flex items-center justify-center text-main-green ring-1 ring-main-green/20">
                  {offer.agent?.avatarUrl ? (
                    <Image src={offer.agent.avatarUrl} alt={offer.agent.name} width={32} height={32} className="rounded-full object-cover" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{type === "sent" ? t("to") : t("from")}</p>
                  <p className="font-bold text-main-navy">{offer.agent?.name || "مستخدم"}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider flex items-center justify-end gap-1">
                  <Calendar className="h-2.5 w-2.5" />
                  {t("date") || "التاريخ"}
                </p>
                <p className="text-gray-500 font-semibold tabular-nums">
                  {offer.humanTime || (offer.createdAt ? new Date(offer.createdAt).toLocaleDateString("ar-SA", { day: '2-digit', month: 'short' }) : "-")}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl h-11 bg-white hover:bg-main-green hover:text-white border-main-green/20 text-main-green transition-all duration-300 group/btn"
              asChild
            >
              <Link href={`/ar/marketplace/${offer.property?.slug}`}>
                {t("actions.view_property")}
                <ExternalLink className="mx-2 h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Link>
            </Button>

            {type === "received" && offer.status === "pending" && (
              <div className="flex flex-1 gap-2">
                <Button
                  onClick={() => acceptOffer(offer.id)}
                  disabled={isAccepting || isRejecting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 w-11 p-0 shadow-lg shadow-emerald-600/20"
                >
                  {isAccepting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                </Button>
                <Button
                  onClick={() => rejectOffer(offer.id)}
                  disabled={isAccepting || isRejecting}
                  variant="destructive"
                  className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-11 w-11 p-0 shadow-lg shadow-rose-600/20"
                >
                  {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-5 w-5" />}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        
        {/* Decorative corner accent */}
        <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-main-green/5 rounded-full group-hover:scale-[8] transition-transform duration-1000 z-0" />
      </Card>
    </motion.div>
  );
}
