"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import {
  useCreateProperty,
  useCountries,
  useCities,
} from "../../hooks/use-properties";
import { createPropertySchema } from "../../schemas/property-schema-factory";
import { FileUploader } from "@/components/shared/file-uploader";
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
import { cn } from "@/lib/utils";

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
  const locale = useLocale();
  const isRtl = locale === "ar";
  
  const { mutate: createProperty, isPending } = useCreateProperty();
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

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
      { ...data, images, videos },
      {
        onSuccess: () => {
          toast.success(t("add_success"));
          form.reset();
          setImages([]);
          setVideos([]);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-h-[90vh] max-w-3xl overflow-y-auto"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader className={cn(isRtl ? "text-right" : "text-left")}>
          <DialogTitle>
            {t("add_new_property")}
          </DialogTitle>
          <DialogDescription>
            {t("fill_required_fields")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className={cn("text-lg font-semibold", isRtl ? "text-right" : "text-left")}>
                {t("basic_info")}
              </h3>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                    <FormLabel>{t("title")} *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("title_placeholder")}
                        className={cn(isRtl ? "text-right" : "text-left")}
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
                  <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                    <FormLabel>{t("description")} *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("description_placeholder")}
                        rows={4}
                        className={cn("resize-none", isRtl ? "text-right" : "text-left")}
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
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>
                        {t("operation_type_label")} *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger dir={isRtl ? "rtl" : "ltr"}>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent dir={isRtl ? "rtl" : "ltr"}>
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
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>
                        {t("property_type")} *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger dir={isRtl ? "rtl" : "ltr"}>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent dir={isRtl ? "rtl" : "ltr"}>
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
                  <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                    <FormLabel>{t("category")} *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        className={cn(isRtl ? "text-right" : "text-left")}
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
              <h3 className={cn("text-lg font-semibold", isRtl ? "text-right" : "text-left")}>
                {t("location")}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <LocationFields form={form} isRtl={isRtl} />
              </div>

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                    <FormLabel>{t("district")} *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("district_placeholder")}
                        className={cn(isRtl ? "text-right" : "text-left")}
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
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>{t("latitude")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="30.0444"
                          className={cn(isRtl ? "text-right" : "text-left")}
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
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>{t("longitude")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="31.2357"
                          className={cn(isRtl ? "text-right" : "text-left")}
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
              <h3 className={cn("text-lg font-semibold", isRtl ? "text-right" : "text-left")}>
                {t("pricing")}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price_min"
                  render={({ field }) => (
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>
                        {t("price_min")} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="900000"
                          className={cn(isRtl ? "text-right" : "text-left")}
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
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>
                        {t("price_max")} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1200000"
                          className={cn(isRtl ? "text-right" : "text-left")}
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
              <h3 className={cn("text-lg font-semibold", isRtl ? "text-right" : "text-left")}>
                {t("features")}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>{t("area")} *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="200"
                          className={cn(isRtl ? "text-right" : "text-left")}
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
                  name="building_area"
                  render={({ field }) => (
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>{t("building_area")} *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t("building_area_placeholder")}
                          className={cn(isRtl ? "text-right" : "text-left")}
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
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>
                        {t("usable_area")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="160"
                          className={cn(isRtl ? "text-right" : "text-left")}
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
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>{t("rooms")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="3"
                          className={cn(isRtl ? "text-right" : "text-left")}
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
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>{t("bathrooms")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2"
                          className={cn(isRtl ? "text-right" : "text-left")}
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
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>{t("balconies")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          className={cn(isRtl ? "text-right" : "text-left")}
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
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>{t("garages")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          className={cn(isRtl ? "text-right" : "text-left")}
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
                  <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                    <FormLabel>
                      {t("finishing_type_label")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger dir={isRtl ? "rtl" : "ltr"}>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent dir={isRtl ? "rtl" : "ltr"}>
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

            {/* Media */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className={cn("text-lg font-semibold", isRtl ? "text-right" : "text-left")}>
                  {t("images")}
                </h3>
                <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                  <FormControl>
                    <FileUploader
                      value={images as any}
                      onChange={setImages as any}
                      accept="image/*"
                      maxFiles={20}
                      maxSize={1 * 1024 * 1024}
                      label={t("property_images")}
                      helperText={t("images_helper_updated")}
                    />
                  </FormControl>
                </FormItem>
              </div>

              <div className="space-y-4">
                <h3 className={cn("text-lg font-semibold", isRtl ? "text-right" : "text-left")}>
                  {t("videos")}
                </h3>
                <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                  <FormControl>
                    <FileUploader
                      value={videos as any}
                      onChange={setVideos as any}
                      accept="video/*"
                      maxFiles={1}
                      maxSize={50 * 1024 * 1024}
                      label={t("property_videos")}
                      helperText={t("videos_helper_updated_v2")}
                    />
                  </FormControl>
                </FormItem>
              </div>
            </div>

            {/* Submit */}
            <div className={cn("flex gap-4", )}>
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
                {t("add_property")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function LocationFields({ form, isRtl }: { form: any; isRtl: boolean }) {
  const t = useTranslations("properties");

  // HIDDEN: Country is always Saudi Arabia (country_id = 2) — set on mount and never changed
  const SAUDI_ARABIA_ID = 2;
  const countryId = SAUDI_ARABIA_ID;

  // Auto-set country_id to Saudi Arabia immediately
  useEffect(() => {
    form.setValue("country_id", SAUDI_ARABIA_ID);
  }, []);

  const { data: cities, isLoading: loadingCities } = useCities(countryId);

  return (
    <>
      {/* HIDDEN: Country select — always Saudi Arabia (country_id = 2) sent to backend */}

      <FormField
        control={form.control}
        name="city_id"
        render={({ field }) => (
          <FormItem className={cn("w-full", isRtl ? "text-right" : "text-left")}>
            <FormLabel>{t("city")} *</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(parseInt(value))}
              value={field.value ? String(field.value) : undefined}
              disabled={loadingCities}
            >
              <FormControl>
                <SelectTrigger dir={isRtl ? "rtl" : "ltr"}>
                  <SelectValue
                    placeholder={
                      loadingCities ? "..." : t("select_city")
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                {cities?.map((city: any) => (
                  <SelectItem key={city.id} value={String(city.id)}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
