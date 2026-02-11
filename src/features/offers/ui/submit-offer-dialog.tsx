"use client";

import { useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSubmitOffer } from "../hooks/use-property-offers";
import {
  submitOfferSchema,
  SubmitOfferFormData,
} from "../schemas/offer.schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SubmitOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: number;
  propertyTitle?: string;
}

export function SubmitOfferDialog({
  open,
  onOpenChange,
  propertyId,
  propertyTitle,
}: SubmitOfferDialogProps) {
  const t = useTranslations("offers");
  const { mutate: submitOffer, isPending } = useSubmitOffer();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubmitOfferFormData>({
    resolver: zodResolver(submitOfferSchema),
    defaultValues: {
      property_new_id: propertyId,
      offer_details: "",
    },
  });

  const onSubmit = (data: SubmitOfferFormData) => {
    submitOffer(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  const onError = (errors: FieldErrors<SubmitOfferFormData>) => {
    const errorMessages: string[] = [];

    Object.entries(errors).forEach(([field, error]) => {
      if (error?.message) {
        errorMessages.push(`${field}: ${error.message}`);
      }
    });

    if (errorMessages.length > 0) {
      toast.error(t("validation_error"), {
        description: errorMessages.join("\n"),
        duration: 5000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="">
          <DialogTitle className="">{t("submit_offer")}</DialogTitle>
          <DialogDescription className="">
            {propertyTitle
              ? `${t("submit_offer_for")}: ${propertyTitle}`
              : t("submit_offer_description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offer_details">{t("offer_details")} *</Label>
            <Textarea
              id="offer_details"
              className=""
              {...register("offer_details")}
              placeholder={t("offer_details_placeholder")}
              rows={6}
            />
            {errors.offer_details && (
              <p className="text-sm text-red-500">
                {errors.offer_details.message}
              </p>
            )}
            <p className="text-sm text-gray-500">{t("offer_details_hint")}</p>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
