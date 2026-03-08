"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCreateOffer } from "../hooks/use-site-offers";
import {
  createSiteOfferSchema,
  CreateSiteOfferFormData,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CreateSiteOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSiteOfferDialog({
  open,
  onOpenChange,
}: CreateSiteOfferDialogProps) {
  const t = useTranslations("offers_page");
  const { mutate: createOffer, isPending } = useCreateOffer();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createSiteOfferSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      validity_days: 30,
      whatsapp_number: "",
      is_active: true,
      features: [{ feature: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const onSubmit = (data: CreateSiteOfferFormData) => {
    // API expects is_active as 1/0 or boolean? Postman says "1".
    // api-client might handle it if we pass boolean, or we can transform.
    const payload = {
      ...data,
      is_active: data.is_active ? 1 : 0,
    };

    createOffer(payload as any, {
      onSuccess: () => {
        toast.success(t("create_success") || "تم إضافة العرض بنجاح");
        reset();
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error(t("create_error") || "حدث خطأ أثناء إضافة العرض", {
          description: error?.message,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("create_offer_title") || "إضافة عرض جديد"}
          </DialogTitle>
          <DialogDescription>
            {t("create_offer_desc") || "أدخل تفاصيل العرض الجديد أدناه"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("offer_name") || "اسم العرض"} *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder={
                  t("offer_name_placeholder") || "مثال: عرض الصيف المميز"
                }
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">
                {t("whatsapp_number") || "رقم الواتساب"}
              </Label>
              <Input
                id="whatsapp_number"
                {...register("whatsapp_number")}
                placeholder="9665XXXXXXXX"
              />
              {errors.whatsapp_number && (
                <p className="text-sm text-red-500">
                  {errors.whatsapp_number.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">{t("price") || "السعر"} *</Label>
              <Input
                id="price"
                type="number"
                {...register("price")}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="validity_days">
                {t("validity_days") || "مدة العرض (أيام)"} *
              </Label>
              <Input
                id="validity_days"
                type="number"
                {...register("validity_days")}
                placeholder="30"
              />
              {errors.validity_days && (
                <p className="text-sm text-red-500">
                  {errors.validity_days.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("description") || "الوصف"} *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder={
                t("description_placeholder") || "أدخل وصفاً تفصيلياً للعرض..."
              }
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t("features") || "المميزات"}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ feature: "" })}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {t("add_feature") || "إضافة ميزة"}
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    {...register(`features.${index}.feature` as const)}
                    placeholder={t("feature_placeholder") || "مثال: ميزة 1"}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {errors.features && (
                <p className="text-sm text-red-500">
                  {errors.features.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t("cancel") || "إلغاء"}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[120px]"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("submit") || "حفظ العرض"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
