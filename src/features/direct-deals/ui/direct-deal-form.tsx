"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  useCountries,
  useCities,
  useCategories,
} from "@/features/properties/hooks/use-properties";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { arSA } from "date-fns/locale";
import { DirectDeal, directDealSchema, DirectDealFormValues } from "../types";
import {
  useCreateDirectDeal,
  useUpdateDirectDeal,
} from "../hooks/use-direct-deals";
import { useEffect } from "react";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DirectDealFormProps {
  onSuccess?: () => void;
  deal?: DirectDeal | null;
  onCancel?: () => void;
}

export function DirectDealForm({
  onSuccess,
  deal,
  onCancel,
}: DirectDealFormProps) {
  const t = useTranslations("add_deal");
  const tVal = useTranslations("validations");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? arSA : undefined;
  const labelStyle = "block text-sm font-medium text-main-navy mb-2";
  const isEditMode = !!deal;

  const { mutate: createDeal, isPending: isCreating } = useCreateDirectDeal();
  const { mutate: updateDeal, isPending: isUpdating } = useUpdateDirectDeal();
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DirectDealFormValues>({
    resolver: zodResolver(directDealSchema),
    defaultValues: {
      start_date: "",
      end_date: "",
      city_id: "",
      district: "",
      country_id: "",
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

  const countryId = watch("country_id");
  const { data: countries } = useCountries();
  const { data: cities } = useCities(countryId);

  const { data: categories } = useCategories();

  const countriesList = Array.isArray(countries)
    ? countries
    : (countries as any)?.data || [];
  const citiesList = Array.isArray(cities)
    ? cities
    : (cities as any)?.data || [];
  const categoriesList = Array.isArray(categories)
    ? categories
    : (categories as any)?.data || [];

  // 1. Helper to safely get value from object by likely property names
  const getProp = (obj: any, keys: string[]) => {
    if (!obj) return "";
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    return "";
  };

  // 2. Initial Reset for all non-lookup fields (run once when deal changes)
  useEffect(() => {
    if (deal) {
      reset({
        start_date: getProp(deal, ["startDate", "start_date"]),
        end_date: getProp(deal, ["endDate", "end_date"]),
        district: getProp(deal, ["district"]),
        plan_number: getProp(deal, ["planNumber", "plan_number"]).toString(),
        plot_number: getProp(deal, ["plotNumber", "plot_number"]).toString(),
        min_area: getProp(deal, ["minArea", "min_area"]).toString(),
        max_area: getProp(deal, ["maxArea", "max_area"]).toString(),
        min_total_price: getProp(deal, [
          "minTotalPrice",
          "min_total_price",
        ]).toString(),
        max_total_price: getProp(deal, [
          "maxTotalPrice",
          "max_total_price",
        ]).toString(),
        min_price_per_meter: getProp(deal, [
          "minPricePerMeter",
          "min_price_per_meter",
        ]).toString(),
        max_price_per_meter: getProp(deal, [
          "maxPricePerMeter",
          "max_price_per_meter",
        ]).toString(),
        identity_number:
          getProp(deal, [
            "identity_number",
            "identityNumber",
            "identity",
            "identity_no",
            "identityNo",
            "plot_identity",
            "property_identity",
            "identity_id",
          ]).toString() || "",
        transaction_type:
          getProp(deal, [
            "transaction_type",
            "transactionType",
            "transaction",
            "transaction_type_id",
          ]) || "",
        // Pre-fill IDs if they exist in the incoming object
        country_id: getProp(deal, ["countryId", "country_id"]).toString(),
        city_id: getProp(deal, ["cityId", "city_id"]).toString(),
        property_type_id: getProp(deal, [
          "propertyTypeId",
          "property_type_id",
        ]).toString(),
      });
    }
  }, [deal, reset]);

  // 3. Lookup IDs for Country and Property Type when lists are ready
  const currentCountryId = watch("country_id");
  const currentPropertyTypeId = watch("property_type_id");
  const currentCityId = watch("city_id");

  useEffect(() => {
    if (!deal) return;

    // Lookup Country by name if ID is missing
    if (!currentCountryId && deal.country && countriesList.length > 0) {
      const target = deal.country.trim();
      const found = countriesList.find(
        (c: any) => c.name?.trim() === target || c.name_ar?.trim() === target,
      );
      if (found) {
        setValue("country_id", found.id.toString(), {
          shouldValidate: true,
        });
      }
    }

    // Lookup Property Type by name if ID is missing
    if (
      !currentPropertyTypeId &&
      deal.propertyType &&
      categoriesList.length > 0
    ) {
      const target = deal.propertyType.trim();
      const found = categoriesList.find(
        (c: any) =>
          c.name?.trim() === target ||
          c.name_ar?.trim() === target ||
          c.title?.trim() === target,
      );
      if (found) {
        setValue("property_type_id", found.id.toString(), {
          shouldValidate: true,
        });
      }
    }
  }, [
    deal,
    countriesList,
    categoriesList,
    setValue,
    currentCountryId,
    currentPropertyTypeId,
  ]);

  // 4. Lookup City ID - wait for currentCountryId and citiesList
  useEffect(() => {
    if (!deal || !currentCountryId || currentCityId) return;

    if (deal.city && citiesList.length > 0) {
      const target = deal.city.trim();
      const found = citiesList.find(
        (c: any) => c.name?.trim() === target || c.name_ar?.trim() === target,
      );
      if (found) {
        setValue("city_id", found.id.toString(), {
          shouldValidate: true,
        });
      }
    }
    // 5. Lookup Transaction Type by name if slug is not found
    const transVal = getProp(deal, [
      "transaction_type",
      "transactionType",
      "transaction",
    ]);
    const currentTrans = watch("transaction_type");
    const validSlugs = [
      "ownership_transfer",
      "mortgage",
      "mortgage_release",
      "division_merge",
      "update_modification",
      "all",
    ];

    if (transVal && !validSlugs.includes(transVal) && !currentTrans) {
      try {
        const transTranslations = t.raw("transactions");
        const foundSlug = Object.keys(transTranslations).find(
          (key) =>
            transTranslations[key] === transVal ||
            transTranslations[key]?.toLowerCase() === transVal?.toLowerCase(),
        );
        if (foundSlug) {
          setValue("transaction_type", foundSlug, { shouldValidate: true });
        }
      } catch (e) {
        console.error("Trans lookup error", e);
      }
    }

    // 6. Identity number fallback if still missing
    const idVal = getProp(deal, [
      "identity_number",
      "identityNumber",
      "identity",
      "identity_no",
      "identityNo",
      "plot_identity",
      "property_identity",
      "identity_id",
    ]);
    const currentId = watch("identity_number");
    if (idVal && !currentId) {
      setValue("identity_number", idVal.toString(), { shouldValidate: true });
    }
  }, [deal, currentCountryId, citiesList, setValue, currentCityId]);

  const onSubmit = (data: DirectDealFormValues) => {
    if (isEditMode && deal) {
      updateDeal(
        { id: deal.id, data },
        {
          onSuccess: (res) => {
            toast.success(res.message || t("success_update"));
            onSuccess?.();
          },
          onError: (err: any) => {
            toast.error(err.message || t("error_update"));
          },
        },
      );
    } else {
      createDeal(data, {
        onSuccess: (res) => {
          toast.success(res.message || t("success_add"));
          onSuccess?.();
        },
        onError: (err: any) => {
          toast.error(err.message || t("error_add"));
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rtl text-right"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* تاريخ البداية */}
        <div>
          <Label className={labelStyle}>
            {t("start_date")}
            <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-between text-right font-normal h-10 px-3 border-gray-200",
                  !watch("start_date") && "text-muted-foreground",
                )}
              >
                {watch("start_date") ? (
                  format(new Date(watch("start_date")), "PPP", {
                    locale: dateLocale,
                  })
                ) : (
                  <span>{t("start_date")}</span>
                )}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                locale={dateLocale}
                captionLayout="dropdown"
                startMonth={new Date(2020, 0)}
                endMonth={new Date(2040, 11)}
                selected={
                  watch("start_date")
                    ? new Date(watch("start_date"))
                    : undefined
                }
                onSelect={(date) => {
                  if (date) {
                    setValue("start_date", format(date, "yyyy-MM-dd"), {
                      shouldValidate: true,
                    });
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.start_date && (
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
          )}
        </div>

        {/* تاريخ النهاية */}
        <div>
          <Label className={labelStyle}>
            {t("end_date")}
            <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-between text-right font-normal h-10 px-3 border-gray-200",
                  !watch("end_date") && "text-muted-foreground",
                )}
              >
                {watch("end_date") ? (
                  format(new Date(watch("end_date")), "PPP", {
                    locale: dateLocale,
                  })
                ) : (
                  <span>{t("end_date")}</span>
                )}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                locale={dateLocale}
                captionLayout="dropdown"
                startMonth={new Date(2020, 0)}
                endMonth={new Date(2040, 11)}
                selected={
                  watch("end_date") ? new Date(watch("end_date")) : undefined
                }
                onSelect={(date) => {
                  if (date) {
                    setValue("end_date", format(date, "yyyy-MM-dd"), {
                      shouldValidate: true,
                    });
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.end_date && (
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
          )}
        </div>

        {/* الدولة */}
        <div>
          <Label className={labelStyle}>
            {t("country")}
            <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(v) => {
              setValue("country_id", v, { shouldValidate: true });
              setValue("city_id", "");
            }}
            value={watch("country_id")}
          >
            <SelectTrigger className="w-full" dir="rtl">
              <SelectValue placeholder={t("select_country") || "اختر الدولة"} />
            </SelectTrigger>
            <SelectContent>
              {countriesList?.map((c: any) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country_id && (
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
          )}
        </div>

        {/* المدينة */}
        <div>
          <Label className={labelStyle}>
            {t("city")}
            <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(v) =>
              setValue("city_id", v, { shouldValidate: true })
            }
            value={watch("city_id")}
            disabled={!countryId}
          >
            <SelectTrigger className="w-full" dir="rtl">
              <SelectValue placeholder={t("select_city") || "اختر المدينة"} />
            </SelectTrigger>
            <SelectContent>
              {citiesList?.map((c: any) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city_id && (
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
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
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
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
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
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
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
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
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
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
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
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
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
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
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
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
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
          )}
        </div>

        {/* نوع العقار */}
        <div>
          <Label className={labelStyle}>
            {t("property_type")}
            <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(v) =>
              setValue("property_type_id", v, { shouldValidate: true })
            }
            value={watch("property_type_id")}
          >
            <SelectTrigger className={"w-full"} dir="rtl">
              <SelectValue placeholder={t("select_property_type")} />
            </SelectTrigger>
            <SelectContent>
              {categoriesList.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.property_type_id && (
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
          )}
        </div>

        {/* نوع المعاملة */}
        <div>
          <Label className={labelStyle}>
            {t("transaction_type")}
            <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(v) =>
              setValue("transaction_type", v, { shouldValidate: true })
            }
            value={watch("transaction_type")}
          >
            <SelectTrigger className={"w-full"} dir="rtl">
              <SelectValue placeholder={t("select_transaction_type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ownership_transfer">
                {t("transactions.ownership_transfer")}
              </SelectItem>
              <SelectItem value="mortgage">
                {t("transactions.mortgage")}
              </SelectItem>
              <SelectItem value="mortgage_release">
                {t("transactions.mortgage_release")}
              </SelectItem>
              <SelectItem value="division_merge">
                {t("transactions.division_merge")}
              </SelectItem>
              <SelectItem value="update_modification">
                {t("transactions.update_modification")}
              </SelectItem>
              <SelectItem value="all">{t("transactions.all")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.transaction_type && (
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
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
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
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
            <p className="text-red-500 text-sm mt-1">{tVal("required")}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
          {isEditMode ? t("update_deal") : t("add_deal")}
        </Button>
      </div>
    </form>
  );
}
