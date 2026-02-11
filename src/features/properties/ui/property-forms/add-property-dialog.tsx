"use client";

import { useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCreateProperty } from "../../hooks/use-properties";
import { propertySchema } from "../../schemas/property.schema";
import { PropertyFormInput } from "../../types/property.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const { mutate: createProperty, isPending } = useCreateProperty();
  const [images, setImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PropertyFormInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      operation_type: "sale",
      property_use: "apartment",
      finishing_type: "good",
      price_hidden: false,
    },
  });

  const onSubmit = (data: PropertyFormInput) => {
    createProperty(
      { ...data, images },
      {
        onSuccess: () => {
          toast.success("تم إضافة العقار بنجاح");
          reset();
          setImages([]);
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error?.message || "فشل في إضافة العقار");
        },
      },
    );
  };

  const onError = (errors: FieldErrors<PropertyFormInput>) => {
    // Collect all error messages
    const errorMessages: string[] = [];

    Object.entries(errors).forEach(([field, error]) => {
      if (error?.message) {
        errorMessages.push(`${field}: ${error.message}`);
      }
    });

    if (errorMessages.length > 0) {
      toast.error("يرجى تصحيح الأخطاء التالية:", {
        description: errorMessages.slice(0, 5).join("\n"),
        duration: 5000,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader className="">
          <DialogTitle className="">إضافة عقار جديد</DialogTitle>
          <DialogDescription className="">
            املأ جميع الحقول المطلوبة لإضافة عقار جديد
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">المعلومات الأساسية</h3>

            <div className="space-y-2">
              <Label htmlFor="title">العنوان *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="مثال: شقة للبيع في منطقة مميزة"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف *</Label>
              <Textarea
                id="description"
                className=""
                {...register("description")}
                placeholder="وصف تفصيلي للعقار..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نوع العملية *</Label>
                <Select
                  value={watch("operation_type")}
                  onValueChange={(value: any) =>
                    setValue("operation_type", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">
                      {t("operation_type.sale")}
                    </SelectItem>
                    <SelectItem value="rent">
                      {t("operation_type.rent")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>نوع العقار *</Label>
                <Select
                  value={watch("property_use")}
                  onValueChange={(value: any) =>
                    setValue("property_use", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
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
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">تصنيف العقار *</Label>
              <Input
                id="category_id"
                type="number"
                {...register("category_id", { valueAsNumber: true })}
                placeholder="1"
              />
              {errors.category_id && (
                <p className="text-sm text-red-500">
                  {errors.category_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">الموقع</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country_id">الدولة *</Label>
                <Input
                  id="country_id"
                  type="number"
                  {...register("country_id", { valueAsNumber: true })}
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city_id">المدينة *</Label>
                <Input
                  id="city_id"
                  type="number"
                  {...register("city_id", { valueAsNumber: true })}
                  placeholder="2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">الحي *</Label>
              <Input
                id="district"
                {...register("district")}
                placeholder="مثال: التجمع الخامس"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">خط العرض</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  {...register("latitude", { valueAsNumber: true })}
                  placeholder="30.0444"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">خط الطول</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  {...register("longitude", { valueAsNumber: true })}
                  placeholder="31.2357"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">التسعير</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_min">السعر الأدنى *</Label>
                <Input
                  id="price_min"
                  type="number"
                  {...register("price_min", { valueAsNumber: true })}
                  placeholder="900000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_max">السعر الأعلى *</Label>
                <Input
                  id="price_max"
                  type="number"
                  {...register("price_max", { valueAsNumber: true })}
                  placeholder="1200000"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">المواصفات</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">المساحة (م²) *</Label>
                <Input
                  id="area"
                  type="number"
                  {...register("area", { valueAsNumber: true })}
                  placeholder="180"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usable_area">المساحة الصافية (م²)</Label>
                <Input
                  id="usable_area"
                  type="number"
                  {...register("usable_area", { valueAsNumber: true })}
                  placeholder="160"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rooms">الغرف</Label>
                <Input
                  id="rooms"
                  type="number"
                  {...register("rooms", { valueAsNumber: true })}
                  placeholder="3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">الحمامات</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  {...register("bathrooms", { valueAsNumber: true })}
                  placeholder="2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balconies">الشرفات</Label>
                <Input
                  id="balconies"
                  type="number"
                  {...register("balconies", { valueAsNumber: true })}
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="garages">المواقف</Label>
                <Input
                  id="garages"
                  type="number"
                  {...register("garages", { valueAsNumber: true })}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>نوع التشطيب</Label>
              <Select
                value={watch("finishing_type")}
                onValueChange={(value: any) =>
                  setValue("finishing_type", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
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
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">الصور</h3>
            <div className="space-y-2">
              <Label htmlFor="images">صور العقار</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              {images.length > 0 && (
                <p className="text-sm text-gray-600">
                  تم اختيار {images.length} صورة
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              إضافة العقار
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
