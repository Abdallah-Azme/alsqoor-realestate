"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCreateProperty } from "../../hooks/use-properties";
import { createPropertySchema } from "../../schemas/property-schema-factory";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPropertyDialog({
  open,
  onOpenChange,
}: AddPropertyDialogProps) {
  const t = useTranslations("properties");
  const tValidation = useTranslations("validation");
  const { mutate: createProperty, isPending } = useCreateProperty();
  const [images, setImages] = useState<File[]>([]);

  const { propertySchema } = createPropertySchema(tValidation);

  const form = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      operation_type: "sale" as const,
      property_use: "apartment" as const,
      finishing_type: "good" as const,
      price_hidden: false,
    },
  });

  const onSubmit = (data: any) => {
    createProperty(
      { ...data, images },
      {
        onSuccess: () => {
          toast.success(t("add_success") || "تم إضافة العقار بنجاح");
          form.reset();
          setImages([]);
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(
            error?.message || t("add_error") || "فشل في إضافة العقار",
          );
        },
      },
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("add_new_property") || "إضافة عقار جديد"}
          </DialogTitle>
          <DialogDescription>
            {t("fill_required_fields") ||
              "املأ جميع الحقول المطلوبة لإضافة عقار جديد"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("basic_info") || "المعلومات الأساسية"}
              </h3>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("title") || "العنوان"} *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          t("title_placeholder") ||
                          "مثال: شقة للبيع في منطقة مميزة"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("description") || "الوصف"} *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          t("description_placeholder") || "وصف تفصيلي للعقار..."
                        }
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="operation_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("operation_type_label") || "نوع العملية"} *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sale">
                            {t("operation_type.sale")}
                          </SelectItem>
                          <SelectItem value="rent">
                            {t("operation_type.rent")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="property_use"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("property_type") || "نوع العقار"} *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apartment">
                            {t("property_use.apartment")}
                          </SelectItem>
                          <SelectItem value="villa">
                            {t("property_use.villa")}
                          </SelectItem>
                          <SelectItem value="land_residential">
                            {t("property_use.land_residential")}
                          </SelectItem>
                          <SelectItem value="land_commercial">
                            {t("property_use.land_commercial")}
                          </SelectItem>
                          <SelectItem value="commercial_shop">
                            {t("property_use.commercial_shop")}
                          </SelectItem>
                          <SelectItem value="office">
                            {t("property_use.office")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("category") || "تصنيف العقار"} *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("location") || "الموقع"}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("country") || "الدولة"} *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("city") || "المدينة"} *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("district") || "الحي"} *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          t("district_placeholder") || "مثال: التجمع الخامس"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("latitude") || "خط العرض"}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="30.0444"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("longitude") || "خط الطول"}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="31.2357"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("pricing") || "التسعير"}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("price_min") || "السعر الأدنى"} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="900000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("price_max") || "السعر الأعلى"} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1200000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("features") || "المواصفات"}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("area") || "المساحة (م²)"} *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="180"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="usable_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("usable_area") || "المساحة الصافية (م²)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="160"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("rooms") || "الغرف"}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="3"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("bathrooms") || "الحمامات"}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="balconies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("balconies") || "الشرفات"}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="garages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("garages") || "المواقف"}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="finishing_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("finishing_type_label") || "نوع التشطيب"}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">
                          {t("finishing_type.none")}
                        </SelectItem>
                        <SelectItem value="basic">
                          {t("finishing_type.basic")}
                        </SelectItem>
                        <SelectItem value="good">
                          {t("finishing_type.good")}
                        </SelectItem>
                        <SelectItem value="luxury">
                          {t("finishing_type.luxury")}
                        </SelectItem>
                        <SelectItem value="super_luxury">
                          {t("finishing_type.super_luxury")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("images") || "الصور"}
              </h3>
              <FormItem>
                <FormLabel>{t("property_images") || "صور العقار"}</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </FormControl>
                {images.length > 0 && (
                  <p className="text-sm text-gray-600">
                    {t("images_selected", { count: images.length }) ||
                      `تم اختيار ${images.length} صورة`}
                  </p>
                )}
              </FormItem>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {t("cancel") || "إلغاء"}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("add_property") || "إضافة العقار"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
