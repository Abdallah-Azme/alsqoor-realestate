"use client";

import { useContext, useLayoutEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { UserContext } from "@/context/user-context";
import { useSubmitOffer } from "../hooks/use-property-offers";
import {
  getSubmitOfferSchema,
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
import { cn } from "@/lib/utils";

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
  const locale = useLocale();
  const router = useRouter();
  const userCtx = useContext(UserContext);
  const user = userCtx?.user ?? null;
  const authLoading = userCtx?.loading ?? true;
  const isRtl = locale === "ar";
  const { mutate: submitOffer, isPending } = useSubmitOffer();

  useLayoutEffect(() => {
    if (!open || authLoading) return;
    if (user) return;
    onOpenChange(false);
    toast.info(t("login_to_submit_offer"));
    router.push("/auth/login");
  }, [open, authLoading, user, onOpenChange, router, t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubmitOfferFormData>({
    resolver: zodResolver(getSubmitOfferSchema(t)),
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
      <DialogContent 
        className="max-w-2xl"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader className={cn(isRtl ? "text-right" : "text-left")}>
          <DialogTitle className="">{t("submit_offer")}</DialogTitle>
          <DialogDescription className="">
            {propertyTitle
              ? `${t("submit_offer_for")}: ${propertyTitle}`
              : t("submit_offer_description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <div className="space-y-2">
            <Label 
              htmlFor="offer_details"
              className={cn("block", isRtl ? "text-right" : "text-left")}
            >
              {t("offer_details")} *
            </Label>
            <Textarea
              id="offer_details"
              className={cn(isRtl ? "text-right" : "text-left")}
              {...register("offer_details")}
              placeholder={t("offer_details_placeholder")}
              rows={6}
            />
            {errors.offer_details && (
              <p className={cn("text-sm text-red-500", isRtl ? "text-right" : "text-left")}>
                {errors.offer_details.message}
              </p>
            )}
            <p className={cn("text-sm text-gray-500", isRtl ? "text-right" : "text-left")}>
              {t("offer_details_hint")}
            </p>
          </div>

          <div className={cn("flex gap-4",  )}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className={cn("h-4 w-4 animate-spin", isRtl ? "ml-2" : "mr-2")} />}
              {t("submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
