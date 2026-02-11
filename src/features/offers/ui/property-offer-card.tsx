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
import { useTranslations } from "next-intl";
import { useAcceptOffer, useRejectOffer } from "../hooks/use-property-offers";
import { Check, X, ExternalLink, User, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PropertyOfferCardProps {
  offer: PropertyOffer;
  type: "sent" | "received";
}

export function PropertyOfferCard({ offer, type }: PropertyOfferCardProps) {
  const t = useTranslations("offers");
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
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        {offer.property && (
          <div className="relative h-48 w-full">
            <Image
              src={propertyImage}
              alt={offer.property.title}
              fill
              className="object-cover"
            />
            <div className="absolute left-2 top-2">{getStatusBadge()}</div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Property Info */}
        {offer.property && (
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">
              {offer.property.title}
            </h3>
            <p className="text-sm text-gray-600">
              {offer.property.price_min?.toLocaleString()} -{" "}
              {offer.property.price_max?.toLocaleString()} ريال
            </p>
          </div>
        )}

        {/* Offer Details */}
        <div className="space-y-2">
          <p className="text-sm text-gray-700 line-clamp-3">
            {offer.offer_details}
          </p>

          {/* Other Party Info */}
          {otherParty && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>
                {type === "sent" ? t("to") : t("from")}: {otherParty.name}
              </span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(offer.created_at).toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {/* View Property Button */}
        {offer.property && (
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/ar/ads/${offer.property.slug}`}>
              <ExternalLink className="h-4 w-4 ml-2" />
              {t("actions.view_property")}
            </Link>
          </Button>
        )}

        {/* Accept/Reject Buttons (only for received offers with pending status) */}
        {type === "received" && offer.status === "pending" && (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={handleAccept}
              disabled={isAccepting || isRejecting}
              className="flex-1"
            >
              <Check className="h-4 w-4 ml-2" />
              {t("actions.accept")}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleReject}
              disabled={isAccepting || isRejecting}
              className="flex-1"
            >
              <X className="h-4 w-4 ml-2" />
              {t("actions.reject")}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
