"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  BsSearch,
  BsHouse,
  BsDoorOpen,
  BsLayers,
  BsArrowsFullscreen,
  BsGeoAlt,
} from "react-icons/bs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "@/features/properties/hooks/use-properties";
import { cn } from "@/lib/utils";

// Keywords in Arabic & English that indicate land/area-type properties
const LAND_KEYWORDS_AR = [
  "أرض",
  "ارض",
  "مزرعة",
  "مصنع",
  "مستودع",
  "أراضي",
  "اراضي",
];
const LAND_KEYWORDS_EN = ["land", "farm", "factory", "warehouse"];

function isLandCategory(cat: any): boolean {
  // Collect all possible name fields into one string to search through
  const allNames = [
    cat.name_ar || "",
    cat.name_en || "",
    cat.name || "", // API may return Arabic in the default `name` field
  ]
    .join(" ")
    .trim();

  const allNamesLower = allNames.toLowerCase();

  return (
    LAND_KEYWORDS_AR.some((kw) => allNames.includes(kw)) ||
    LAND_KEYWORDS_EN.some((kw) => allNamesLower.includes(kw))
  );
}

const FormSchema = z.object({
  type: z.string().optional(),
  rooms: z.string().optional(),
  min_area: z.string().optional(),
  finish: z.string().optional(),
  district: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function FilterForm() {
  const t = useTranslations("estates_filter");
  const locale = useLocale();
  const [operationType, setOperationType] = useState("sale");
  const router = useRouter();

  // Fetch real categories from API
  const { data: categories } = useCategories();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "",
      rooms: "",
      min_area: "",
      finish: "",
      district: "",
    },
  });

  // Derive land mode directly from selected category
  const selectedTypeId = form.watch("type");
  const selectedCategory = categories?.find(
    (c: any) => String(c.id) === selectedTypeId,
  );
  // DEBUG: remove after confirming field names
  if (selectedCategory)
    console.log("🏷️ category object:", JSON.stringify(selectedCategory));
  const isLandMode = selectedCategory
    ? isLandCategory(selectedCategory)
    : false;

  const onSubmit = (values: FormValues) => {
    const params = new URLSearchParams();
    params.set("operation_type", operationType);
    params.set("country_id", "1");
    params.set("per_page", "12");

    if (values.type) params.set("category_id", values.type);

    if (isLandMode) {
      if (values.min_area) params.set("min_area", values.min_area);
      if (values.district) params.set("district", values.district);
    } else {
      if (values.rooms) params.set("rooms", values.rooms);
      if (values.finish) params.set("finishing_type", values.finish);
    }

    router.push(`/ads?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Sale / Rent Tab */}
      <div className="flex -mb-px relative z-10">
        <div className="flex bg-gray-100/80 backdrop-blur-sm p-1 rounded-t-xl gap-1 border border-b-0 border-gray-200 shadow-sm">
          {(["sale", "rent"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOperationType(type)}
              className={cn(
                "relative px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300",
                operationType === type
                  ? "text-main-green"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {operationType === type && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{t(`operations.${type}`)}</span>
            </button>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-0 rounded-xl rounded-tl-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 relative z-20"
        >
          {/* 1. Property Type — always visible */}
          <FilterField
            label={t("property_type")}
            icon={<BsHouse className="text-main-green w-5 h-5" />}
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    // reset dependent fields when type changes
                    form.setValue("rooms", "");
                    form.setValue("min_area", "");
                    form.setValue("finish", "");
                    form.setValue("district", "");
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-main-navy font-semibold hover:text-main-green transition-colors">
                      <SelectValue placeholder={t("property_type")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                    {categories && categories.length > 0 ? (
                      categories.map((cat: any) => (
                        <SelectItem
                          key={cat.id}
                          value={String(cat.id)}
                          className="focus:bg-main-green/10"
                        >
                          {locale === "ar"
                            ? cat.name_ar || cat.name
                            : cat.name_en || cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="1">
                          {t("types.apartment")}
                        </SelectItem>
                        <SelectItem value="2">{t("types.villa")}</SelectItem>
                        <SelectItem value="3">{t("types.land")}</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </FilterField>

          {/* 2 & 3. Dynamic fields — animate between Land mode and Standard mode */}
          <AnimatePresence mode="wait" initial={false}>
            {isLandMode ? (
              <motion.div
                key="land-fields"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex flex-1 flex-col md:flex-row items-stretch w-full gap-4 md:gap-0"
              >
                {/* Separator */}
                <div className="hidden md:block w-px h-10 self-center bg-gray-100 mx-2" />

                {/* Min Area */}
                <FilterField
                  label={t("min_area")}
                  icon={
                    <BsArrowsFullscreen className="text-main-green w-5 h-5" />
                  }
                >
                  <FormField
                    control={form.control}
                    name="min_area"
                    render={({ field }) => (
                      <FormControl>
                        <div className="flex items-center gap-1">
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            placeholder="0"
                            className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-main-navy font-semibold w-full placeholder:text-gray-300"
                          />
                          <span className="text-xs text-gray-400 font-medium shrink-0">
                            {t("area_unit")}
                          </span>
                        </div>
                      </FormControl>
                    )}
                  />
                </FilterField>

                {/* Separator */}
                <div className="hidden md:block w-px h-10 self-center bg-gray-100 mx-2" />

                {/* District */}
                <FilterField
                  label={t("district")}
                  icon={<BsGeoAlt className="text-main-green w-5 h-5" />}
                >
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("district")}
                          className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-main-navy font-semibold w-full placeholder:text-gray-300"
                        />
                      </FormControl>
                    )}
                  />
                </FilterField>
              </motion.div>
            ) : (
              <motion.div
                key="standard-fields"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex flex-1 flex-col md:flex-row items-stretch w-full gap-4 md:gap-0"
              >
                {/* Separator */}
                <div className="hidden md:block w-px h-10 self-center bg-gray-100 mx-2" />

                {/* Rooms */}
                <FilterField
                  label={t("rooms")}
                  icon={<BsDoorOpen className="text-main-green w-5 h-5" />}
                >
                  <FormField
                    control={form.control}
                    name="rooms"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-main-navy font-semibold hover:text-main-green transition-colors">
                            <SelectValue placeholder={t("rooms")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(
                            (n) => (
                              <SelectItem
                                key={n}
                                value={String(n)}
                                className="focus:bg-main-green/10"
                              >
                                {n}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FilterField>

                {/* Separator */}
                <div className="hidden md:block w-px h-10 self-center bg-gray-100 mx-2" />

                {/* Finishing Type */}
                <FilterField
                  label={t("finishing_type")}
                  icon={<BsLayers className="text-main-green w-5 h-5" />}
                >
                  <FormField
                    control={form.control}
                    name="finish"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-main-navy font-semibold hover:text-main-green transition-colors">
                            <SelectValue placeholder={t("finishing_type")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                          <SelectItem value="luxury">
                            {t("finishes.luxury")}
                          </SelectItem>
                          <SelectItem value="good">
                            {t("finishes.average")}
                          </SelectItem>
                          <SelectItem value="basic">
                            {t("finishes.simple")}
                          </SelectItem>
                          <SelectItem value="none">
                            {locale === "ar" ? "بدون تشطيب" : "No Finishing"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FilterField>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Button */}
          <div className="hidden md:block w-px h-10 self-center bg-gray-100 mx-2" />
          <Button
            type="submit"
            className="bg-main-green text-white font-bold rounded-xl h-14 px-8 flex items-center gap-3 hover:gap-4 transition-all duration-300 hover:bg-main-green/90 shadow-lg shadow-main-green/20 group shrink-0 max-md:w-full"
          >
            <BsSearch className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-base">{t("search")}</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}

// ── Reusable field wrapper ───────────────────────────────────────────────────
function FilterField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 w-full flex items-start gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
      <div className="mt-1 shrink-0 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <div className="flex-1 flex flex-col">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </span>
        {children}
      </div>
    </div>
  );
}
