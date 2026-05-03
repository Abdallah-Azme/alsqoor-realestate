"use client";

import { PropertyOffer } from "../types/offer.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import { useAcceptOffer, useRejectOffer } from "../hooks/use-property-offers";
import { Check, X, ExternalLink, User, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PropertyOfferCardProps {
  offer: PropertyOffer;
  type: "sent" | "received";
}

export function PropertyOfferCard({ offer, type }: PropertyOfferCardProps) {
  const t = useTranslations("offers");
  const locale = useLocale();
  const isRtl = locale === "ar";
  
  const { mutate: acceptOffer, isPending: isAccepting } = useAcceptOffer();
  const { mutate: rejectOffer, isPending: isRejecting } = useRejectOffer();

  const handleAccept = () => {
    acceptOffer(offer.id);
  };

  const handleReject = () => {
    rejectOffer(offer.id);
  };

  const getStatusBadge = () => {
    const statusColors = {
      pending: "bg-main-green/10 text-main-green",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={statusColors[offer.status]}>
        {t(`status.${offer.status}`)}
      </Badge>
    );
  };

  const propertyImage =
    offer.property?.images?.[0] || "/placeholder-property.jpg";
  const otherParty = type === "sent" ? offer.receiver : offer.sender;

  return (
    <Card className="overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader className="p-0">
        {offer.property && (
          <div className="relative h-48 w-full">
            <Image
              src={propertyImage}
              alt={offer.property.title}
              fill
              className="object-cover"
            />
            <div className={cn("absolute top-2", isRtl ? "right-2" : "left-2")}>
              {getStatusBadge()}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className={cn("p-4 space-y-3", isRtl ? "text-right" : "text-left")}>
        {/* Property Info */}
        {offer.property && (
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">
              {offer.property.title}
            </h3>
            <p className="text-sm text-gray-600">
              {Number(offer.property.price).toLocaleString(locale)} {t("sar")}
            </p>
          </div>
        )}

        {/* Offer Details */}
        <div className="space-y-2">
          <p className="text-sm text-gray-700 line-clamp-3">
            {offer.offerDetails}
          </p>

          {/* Other Party Info */}
          {offer.agent && (
            <div className={cn("flex items-center gap-2 text-sm text-gray-600",)}>
              <User className="h-4 w-4" />
              <span>
                {type === "sent" ? t("to") : t("from")}: {offer.agent.name}
              </span>
            </div>
          )}

          {/* Date */}
          <div className={cn("flex items-center gap-2 text-sm text-gray-500",)}>
            <Calendar className="h-4 w-4" />
            <span>
              {offer.humanTime || (offer.createdAt ? new Date(offer.createdAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }) : "-")}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className={cn("p-4 pt-0 flex gap-2",)}>
        {/* View Property Button */}
        {offer.property && (
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/${locale}/ads/${offer.property.slug}`}>
              <ExternalLink className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
              {t("actions.view_property")}
            </Link>
          </Button>
        )}

        {/* Accept/Reject Buttons */}
        {type === "received" && offer.status === "pending" && (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                if (window.confirm(t("actions.confirm_accept"))) handleAccept();
              }}
              disabled={isAccepting || isRejecting}
              className="flex-1"
            >
              {isAccepting ? (
                <Loader2 className={cn("h-4 w-4 animate-spin", isRtl ? "ml-2" : "mr-2")} />
              ) : (
                <Check className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
              )}
              {isAccepting ? t("actions.accepting") : t("actions.accept")}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (window.confirm(t("actions.confirm_reject"))) handleReject();
              }}
              disabled={isAccepting || isRejecting}
              className="flex-1"
            >
              {isRejecting ? (
                <Loader2 className={cn("h-4 w-4 animate-spin", isRtl ? "ml-2" : "mr-2")} />
              ) : (
                <X className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
              )}
              {isRejecting ? t("actions.rejecting") : t("actions.reject")}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
