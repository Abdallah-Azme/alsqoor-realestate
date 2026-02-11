"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDirectDeal, updateDirectDeal } from "@/actions/deals";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function AddDealForm({ setOpen, onSuccess, deal = null }) {
  const t = useTranslations("add_deal");
  const tVal = useTranslations("validations");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const labelStyle = "block text-sm font-medium text-main-navy mb-2";
  const isEditMode = !!deal;

  const schema = z.object({
    start_date: z.string().min(1, tVal("required")),
    end_date: z.string().min(1, tVal("required")),
    city: z.string().min(1, tVal("required")),
    district: z.string().min(1, tVal("required")),
    country: z.string().min(1, tVal("required")),
    plan_number: z.string().min(1, tVal("required")),
    plot_number: z.string().min(1, tVal("required")),
    min_area: z.string().min(1, tVal("required")),
    max_area: z.string().min(1, tVal("required")),
    min_total_price: z.string().min(1, tVal("required")),
    max_total_price: z.string().min(1, tVal("required")),
    min_price_per_meter: z.string().min(1, tVal("required")),
    max_price_per_meter: z.string().min(1, tVal("required")),
    property_type_id: z.string().min(1, tVal("required")),
    transaction_type: z.string().min(1, tVal("required")),
    identity_number: z.string().min(1, tVal("required")),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: "",
      end_date: "",
      city: "",
      district: "",
      country: "",
      plan_number: "",
      plot_number: "",
      min_area: "",
      max_area: "",
      min_total_price: "",
      max_total_price: "",
      min_price_per_meter: "",
      max_price_per_meter: "",
      property_type_id: "",
      transaction_type: "",
      identity_number: "",
    },
  });

  // Pre-populate form when editing
  useEffect(() => {
    if (deal) {
      reset({
        start_date: deal.startDate || "",
        end_date: deal.endDate || "",
        city: deal.city || "",
        district: deal.district || "",
        country: deal.country || "",
        plan_number: deal.planNumber?.toString() || "",
        plot_number: deal.plotNumber?.toString() || "",
        min_area: deal.minArea?.toString() || "",
        max_area: deal.maxArea?.toString() || "",
        min_total_price: deal.minTotalPrice?.toString() || "",
        max_total_price: deal.maxTotalPrice?.toString() || "",
        min_price_per_meter: deal.minPricePerMeter?.toString() || "",
        max_price_per_meter: deal.maxPricePerMeter?.toString() || "",
        property_type_id: deal.propertyTypeId?.toString() || "",
        transaction_type: deal.transactionType || "",
        identity_number: deal.identityNumber || "",
      });
    }
  }, [deal, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      let result;

      if (isEditMode) {
        // Update existing deal
        result = await updateDirectDeal(deal.id, data);
      } else {
        // Create new deal
        result = await createDirectDeal(data);
      }

      if (result.success) {
        toast.success(
          result.message ||
            (isEditMode ? t("success_update") : t("success_add"))
        );
        setOpen(false);
        // Refetch deals list
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // Show detailed error message
        toast.error(
          result.message || (isEditMode ? t("error_update") : t("error_add"))
        );
        console.error("API Error:", result);
      }
    } catch (error) {
      toast.error(isEditMode ? t("error_update") : t("error_add"));
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rtl text-right"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* تاريخ البداية */}
        <div>
          <Label className={labelStyle}>
            {t("start_date")}
            <span className="text-red-500">*</span>
          </Label>
          <Input type="date" {...register("start_date")} />
          {errors.start_date && (
            <p className="text-red-500 text-sm">{errors.start_date.message}</p>
          )}
        </div>

        {/* تاريخ النهاية */}
        <div>
          <Label className={labelStyle}>
            {t("end_date")}
            <span className="text-red-500">*</span>
          </Label>
          <Input type="date" {...register("end_date")} />
          {errors.end_date && (
            <p className="text-red-500 text-sm">{errors.end_date.message}</p>
          )}
        </div>

        {/* المدينة */}
        <div>
          <Label className={labelStyle}>
            {t("city")}
            <span className="text-red-500">*</span>
          </Label>
          <Input placeholder={t("city")} {...register("city")} />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        {/* الحي */}
        <div>
          <Label className={labelStyle}>
            {t("district")}
            <span className="text-red-500">*</span>
          </Label>
          <Input placeholder={t("district")} {...register("district")} />
          {errors.district && (
            <p className="text-red-500 text-sm">{errors.district.message}</p>
          )}
        </div>

        {/* الدولة */}
        <div>
          <Label className={labelStyle}>
            {t("country")}
            <span className="text-red-500">*</span>
          </Label>
          <Input placeholder={t("country")} {...register("country")} />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>

        {/* رقم المخطط */}
        <div>
          <Label className={labelStyle}>
            {t("plan_number")}
            <span className="text-red-500">*</span>
          </Label>
          <Input placeholder={t("plan_number")} {...register("plan_number")} />
          {errors.plan_number && (
            <p className="text-red-500 text-sm">{errors.plan_number.message}</p>
          )}
        </div>

        {/* رقم القطعة */}
        <div>
          <Label className={labelStyle}>
            {t("plot_number")}
            <span className="text-red-500">*</span>
          </Label>
          <Input placeholder={t("plot_number")} {...register("plot_number")} />
          {errors.plot_number && (
            <p className="text-red-500 text-sm">{errors.plot_number.message}</p>
          )}
        </div>

        {/* الحد الأدنى للمساحة */}
        <div>
          <Label className={labelStyle}>
            {t("min_area")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            placeholder={t("min_area")}
            {...register("min_area")}
          />
          {errors.min_area && (
            <p className="text-red-500 text-sm">{errors.min_area.message}</p>
          )}
        </div>

        {/* الحد الأعلى للمساحة */}
        <div>
          <Label className={labelStyle}>
            {t("max_area")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            placeholder={t("max_area")}
            {...register("max_area")}
          />
          {errors.max_area && (
            <p className="text-red-500 text-sm">{errors.max_area.message}</p>
          )}
        </div>

        {/* الحد الأدنى للسعر الإجمالي */}
        <div>
          <Label className={labelStyle}>
            {t("min_total_price")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            placeholder={t("min_total_price")}
            {...register("min_total_price")}
          />
          {errors.min_total_price && (
            <p className="text-red-500 text-sm">
              {errors.min_total_price.message}
            </p>
          )}
        </div>

        {/* الحد الأعلى للسعر الإجمالي */}
        <div>
          <Label className={labelStyle}>
            {t("max_total_price")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            placeholder={t("max_total_price")}
            {...register("max_total_price")}
          />
          {errors.max_total_price && (
            <p className="text-red-500 text-sm">
              {errors.max_total_price.message}
            </p>
          )}
        </div>

        {/* الحد الأدنى لسعر المتر */}
        <div>
          <Label className={labelStyle}>
            {t("min_price_per_meter")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            placeholder={t("min_price_per_meter")}
            {...register("min_price_per_meter")}
          />
          {errors.min_price_per_meter && (
            <p className="text-red-500 text-sm">
              {errors.min_price_per_meter.message}
            </p>
          )}
        </div>

        {/* الحد الأعلى لسعر المتر */}
        <div>
          <Label className={labelStyle}>
            {t("max_price_per_meter")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            placeholder={t("max_price_per_meter")}
            {...register("max_price_per_meter")}
          />
          {errors.max_price_per_meter && (
            <p className="text-red-500 text-sm">
              {errors.max_price_per_meter.message}
            </p>
          )}
        </div>

        {/* نوع العقار */}
        <div>
          <Label className={labelStyle}>
            {t("property_type")}
            <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(v) => setValue("property_type_id", v)}
            dir="rtl"
          >
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder={t("select_property_type")} />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem className="" value="1">{t("types.residential")}</SelectItem>
              <SelectItem className="" value="2">{t("types.commercial")}</SelectItem>
              <SelectItem className="" value="3">{t("types.industrial")}</SelectItem>
              <SelectItem className="" value="4">{t("types.agricultural")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.property_type_id && (
            <p className="text-red-500 text-sm">
              {errors.property_type_id.message}
            </p>
          )}
        </div>

        {/* نوع المعاملة */}
        <div>
          <Label className={labelStyle}>
            {t("transaction_type")}
            <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(v) => setValue("transaction_type", v)}
            dir="rtl"
          >
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder={t("select_transaction_type")} />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem className="" value="ownership_transfer">
                {t("transactions.ownership_transfer")}
              </SelectItem>
              <SelectItem className="" value="mortgage">
                {t("transactions.mortgage")}
              </SelectItem>
              <SelectItem className="" value="mortgage_release">
                {t("transactions.mortgage_release")}
              </SelectItem>
              <SelectItem className="" value="division_merge">
                {t("transactions.division_merge")}
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.transaction_type && (
            <p className="text-red-500 text-sm">
              {errors.transaction_type.message}
            </p>
          )}
        </div>

        {/* رقم الهوية */}
        <div>
          <Label className={labelStyle}>
            {t("identity_number")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder={t("identity_number")}
            {...register("identity_number")}
          />
          {errors.identity_number && (
            <p className="text-red-500 text-sm">
              {errors.identity_number.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={isSubmitting}
        >
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? t("updating")
              : t("adding")
            : isEditMode
            ? t("update_deal")
            : t("add_deal")}
        </Button>
      </div>
    </form>
  );
}


