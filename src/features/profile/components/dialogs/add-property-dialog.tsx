"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { FiCheck } from "react-icons/fi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  useCountries,
  useCities,
  useCategories,
  useAmenities,
  useCreateProperty,
  useUpdateProperty,
} from "@/features/properties/hooks/use-properties";
import { Property } from "@/features/properties/types/property.types";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUploader } from "@/components/shared/file-uploader";
import Map from "@/components/shared/Map";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  country_id: z.coerce.number().min(1, { message: "Country is required" }),
  city_id: z.coerce.number().min(1, { message: "City is required" }),
  district: z.string().min(1, { message: "District is required" }),
  category_id: z.coerce.number().min(1, { message: "Category is required" }),
  operation_type: z.enum(["sale", "rent"]),
  price_min: z.coerce.number().min(0, { message: "Price min is required" }),
  price_max: z.coerce.number().min(0, { message: "Price max is required" }),
  price_hidden: z.boolean().optional(),
  area: z.coerce.number().min(0, { message: "Area is required" }),
  usable_area: z.coerce.number().min(0).optional(),
  rooms: z.coerce.number().min(0, { message: "Rooms is required" }),
  bathrooms: z.coerce.number().min(0, { message: "Bathrooms is required" }),
  balconies: z.coerce.number().min(0).optional(),
  garages: z.coerce.number().min(0).optional(),
  finishing_type: z.enum(["none", "basic", "good", "luxury", "super_luxury"]),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  amenity_ids: z.array(z.number()).optional(),
  property_use: z.enum([
    "apartment",
    "villa",
    "land_residential",
    "land_commercial",
    "commercial_shop",
    "office",
    "warehouse",
    "building",
    "farm",
    "factory",
    "other",
  ]),
  facade: z
    .enum([
      "north",
      "south",
      "east",
      "west",
      "north_east",
      "north_west",
      "south_east",
      "south_west",
      "multiple",
      "unknown",
    ])
    .optional(),
  property_age: z.coerce.number().min(0).optional(),
  services: z.string().optional(),
  obligations: z.enum(["yes", "no"]).optional(),
  license_number: z.string().optional(),
  license_expiry_date: z.string().optional(),
  plan_number: z.string().optional(),
  plot_number: z.string().optional(),
  area_name: z.string().optional(),
  has_mortgage: z.boolean().optional(),
  has_restriction: z.boolean().optional(),
  guarantees: z.string().optional(),
  price_per_meter: z.coerce.number().min(0).optional(),
  is_featured: z.boolean().optional(),
  marketing_option: z.enum(["none", "advertising", "agent"]).optional(),
  images: z.array(z.any()).optional(),
  videos: z.array(z.any()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
}

const TABS = ["basic", "location", "pricing", "features", "legal"];

const TAB_FIELDS: Record<string, string[]> = {
  basic: [
    "title",
    "description",
    "category_id",
    "operation_type",
    "property_use",
    "images",
    "videos",
  ],
  location: [
    "country_id",
    "city_id",
    "district",
    "area_name",
    "latitude",
    "longitude",
  ],
  pricing: [
    "price_min",
    "price_max",
    "price_hidden",
    "area",
    "usable_area",
    "rooms",
    "bathrooms",
    "balconies",
    "garages",
    "finishing_type",
    "facade",
    "price_per_meter",
    "property_age",
  ],
  features: ["amenity_ids", "services", "is_featured", "marketing_option"],
  legal: [
    "obligations",
    "license_number",
    "license_expiry_date",
    "plan_number",
    "plot_number",
    "has_mortgage",
    "has_restriction",
    "guarantees",
  ],
};

const AddPropertyDialog = ({
  open,
  onOpenChange,
  property,
}: AddPropertyDialogProps) => {
  const t = useTranslations("owner_properties");
  const tAgent = useTranslations("agent_profile.show_dialog");

  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const isEditing = !!property;

  const currentTabIndex = TABS.indexOf(activeTab);
  const isLastTab = currentTabIndex === TABS.length - 1;

  const form = useForm<any>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      country_id: 0,
      city_id: 0,
      district: "",
      category_id: 1,
      operation_type: "sale",
      price_min: 0,
      price_max: 0,
      price_hidden: false,
      area: 0,
      usable_area: 0,
      rooms: 0,
      bathrooms: 0,
      balconies: 0,
      garages: 0,
      finishing_type: "luxury",
      latitude: 0,
      longitude: 0,
      amenity_ids: [],
      property_use: "apartment",
      facade: "north",
      property_age: 0,
      services: "",
      obligations: "no",
      license_number: "",
      license_expiry_date: "",
      plan_number: "",
      plot_number: "",
      area_name: "",
      has_mortgage: false,
      has_restriction: false,
      guarantees: "",
      price_per_meter: 0,
      is_featured: false,
      marketing_option: "agent",
      images: [],
      videos: [],
    },
  });

  const handleNext = async () => {
    const fieldsToValidate = TAB_FIELDS[activeTab];
    const valid = await form.trigger(fieldsToValidate as any);
    if (valid && currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS[currentTabIndex - 1]);
    }
  };

  useEffect(() => {
    if (property && open) {
      form.reset({
        title: property.title || "",
        description: property.description || "",
        // country_id & city_id & category_id will be resolved by name
        // in separate useEffects below once lists load
        country_id: 0,
        city_id: 0,
        district: property.district || "",
        category_id: 0,
        operation_type: (property.operation_type ||
          property.operationType ||
          "sale") as any,
        price_min: Number(
          property.price_min || property.priceMin || property.price || 0,
        ),
        price_max: Number(
          property.price_max || property.priceMax || property.price || 0,
        ),
        price_hidden: !!(property.price_hidden || property.priceHidden),
        area: Number(property.area || 0),
        usable_area: Number(property.usable_area || property.usableArea || 0),
        rooms: Number(property.rooms || 0),
        bathrooms: Number(property.bathrooms || 0),
        balconies: Number(property.balconies || 0),
        garages: Number(property.garages || 0),
        finishing_type: (property.finishing_type ||
          property.finishingType ||
          "luxury") as any,
        latitude: Number(property.latitude || 0),
        longitude: Number(property.longitude || 0),
        amenity_ids:
          property.amenities?.map((a: any) =>
            typeof a === "object" ? a.id : a,
          ) || [],
        property_use: (property.property_use ||
          property.propertyUse ||
          "apartment") as any,
        facade: (property.facade || "north") as any,
        property_age: Number(
          property.property_age || property.propertyAge || 0,
        ),
        services: Array.isArray(property.services)
          ? property.services.join(",")
          : "",
        obligations: (property.obligations || "no") as any,
        license_number: property.license_number || property.licenseNumber || "",
        license_expiry_date: (() => {
          const raw =
            property.license_expiry_date || property.licenseExpiryDate || "";
          // HTML date input needs "YYYY-MM-DD"; API may return full ISO string
          return raw ? raw.substring(0, 10) : "";
        })(),
        plan_number: property.plan_number || property.planNumber || "",
        plot_number: property.plot_number || property.plotNumber || "",
        area_name: property.area_name || property.areaName || "",
        has_mortgage: !!(property.has_mortgage || property.hasMortgage),
        has_restriction: !!(
          property.has_restriction || property.hasRestriction
        ),
        guarantees: property.guarantees || "",
        price_per_meter: Number(
          property.price_per_meter || property.pricePerMeter || 0,
        ),
        is_featured: !!(property.is_featured || property.isFeatured),
        marketing_option: (property.marketing_option ||
          property.marketingOption ||
          "agent") as any,
        images: property.images || [],
        videos: property.videos || [],
      });
    } else if (!open) {
      form.reset();
      setActiveTab("basic");
    }
  }, [property, open, form]);

  const watchCountryId = form.watch("country_id");

  const { data: countriesData, isLoading: loadingCountries } = useCountries();
  const { data: citiesData, isLoading: loadingCities } =
    useCities(watchCountryId);
  const { data: categoriesData, isLoading: loadingCategories } =
    useCategories();
  const { data: amenitiesData, isLoading: loadingAmenities } = useAmenities();

  const countries = Array.isArray(countriesData)
    ? countriesData
    : (countriesData as any)?.data || [];
  const cities = Array.isArray(citiesData)
    ? citiesData
    : (citiesData as any)?.data || [];
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : (categoriesData as any)?.data || [];
  const amenities = Array.isArray(amenitiesData)
    ? amenitiesData
    : (amenitiesData as any)?.data || [];

  // The API returns country/city/category as NAME STRINGS, not IDs.
  // These useEffects resolve the correct numeric IDs by matching names
  // against the loaded lists, then set them on the form.

  // Step 1: After countries load, find country_id by name
  useEffect(() => {
    if (
      !loadingCountries &&
      countries.length > 0 &&
      isEditing &&
      property &&
      open
    ) {
      const countryName =
        typeof property.country === "string" ? property.country : null;
      if (countryName) {
        const found = countries.find(
          (c: any) =>
            c.name === countryName ||
            c.name_ar === countryName ||
            c.name_en === countryName,
        );
        if (found) {
          form.setValue("country_id", found.id, { shouldDirty: false });
          // Reset city so it re-fetches for the new country
          form.setValue("city_id", 0, { shouldDirty: false });
        }
      }
    }
  }, [loadingCountries, countries, isEditing, open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Step 2: After cities load (triggered by country_id change above), find city_id by name
  useEffect(() => {
    if (!loadingCities && cities.length > 0 && isEditing && property && open) {
      const cityName = typeof property.city === "string" ? property.city : null;
      if (cityName) {
        const found = cities.find(
          (c: any) =>
            c.name === cityName ||
            c.name_ar === cityName ||
            c.name_en === cityName,
        );
        if (found) {
          form.setValue("city_id", found.id, { shouldDirty: false });
        }
      }
    }
  }, [loadingCities, cities, isEditing, open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Step 3: After categories load, find category_id by name
  useEffect(() => {
    if (
      !loadingCategories &&
      categories.length > 0 &&
      isEditing &&
      property &&
      open
    ) {
      const catName =
        typeof property.category === "string" ? property.category : null;
      if (catName) {
        const found = categories.find(
          (c: any) =>
            c.name === catName ||
            c.name_ar === catName ||
            c.name_en === catName,
        );
        if (found) {
          form.setValue("category_id", found.id, { shouldDirty: false });
        }
      }
    }
  }, [loadingCategories, categories, isEditing, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();

  const isPending =
    createPropertyMutation.isPending || updatePropertyMutation.isPending;

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const submitData = {
        ...values,
        services: values.services
          ? values.services
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
        images: values.images?.filter((img: any) => img instanceof File) || [],
        videos: values.videos?.filter((vid: any) => vid instanceof File) || [],
      };

      if (isEditing && property) {
        await updatePropertyMutation.mutateAsync({
          id: property.id,
          data: submitData,
        });
      } else {
        await createPropertyMutation.mutateAsync(submitData);
      }

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Failed to submit property:", error);
      toast.error(
        error?.response?.data?.message ||
          (isEditing ? t("failed_to_update") : t("failed_to_add")) ||
          (isEditing ? "Failed to update property" : "Failed to add property"),
      );
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    form.reset();
    onOpenChange(false);
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-main-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-8 h-8 text-main-green" />
            </div>
            <h3 className="text-xl font-bold text-main-navy mb-2">
              {isEditing ? t("edit_property") : t("add_property")}
            </h3>
            <p className="text-gray-500 mb-6">
              {isEditing
                ? t("success_update") || "Property updated successfully!"
                : t("success_add") || "Property added successfully!"}
            </p>
            <Button onClick={handleClose} className="bg-main-green text-white">
              {t("close") || "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("edit_property") : t("add_property")}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("edit_dialog.description")
              : t("add_dialog.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-5 w-full bg-gray-50/50 p-1 rounded-xl">
                <TabsTrigger
                  value="basic"
                  className="rounded-lg text-xs md:text-sm"
                >
                  {t("add_dialog.basic")}
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className="rounded-lg text-xs md:text-sm"
                >
                  {t("add_dialog.location")}
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="rounded-lg text-xs md:text-sm"
                >
                  {t("add_dialog.pricing_specs")}
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="rounded-lg text-xs md:text-sm"
                >
                  {t("add_dialog.features")}
                </TabsTrigger>
                <TabsTrigger
                  value="legal"
                  className="rounded-lg text-xs md:text-sm"
                >
                  {t("add_dialog.legal")}
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tAgent("property_title") || "Title"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            tAgent("title_placeholder") || "e.g. Luxury Villa"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.category")}</FormLabel>
                        <Select
                          onValueChange={(val) => field.onChange(Number(val))}
                          value={field.value ? String(field.value) : undefined}
                          disabled={loadingCategories}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "add_dialog.category_placeholder",
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="operation_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.operation_type")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("add_dialog.operation_type")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sale">
                              {t("add_dialog.op_sale")}
                            </SelectItem>
                            <SelectItem value="rent">
                              {t("add_dialog.op_rent")}
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
                  name="property_use"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("add_dialog.property_use")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("add_dialog.property_use")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apartment">
                            {t("add_dialog.use_apartment")}
                          </SelectItem>
                          <SelectItem value="villa">
                            {t("add_dialog.use_villa")}
                          </SelectItem>
                          <SelectItem value="land_residential">
                            {t("add_dialog.use_land_res")}
                          </SelectItem>
                          <SelectItem value="land_commercial">
                            {t("add_dialog.use_land_com")}
                          </SelectItem>
                          <SelectItem value="commercial_shop">
                            {t("add_dialog.use_shop")}
                          </SelectItem>
                          <SelectItem value="office">
                            {t("add_dialog.use_office")}
                          </SelectItem>
                          <SelectItem value="warehouse">
                            {t("add_dialog.use_warehouse")}
                          </SelectItem>
                          <SelectItem value="building">
                            {t("add_dialog.use_building")}
                          </SelectItem>
                          <SelectItem value="farm">
                            {t("add_dialog.use_farm")}
                          </SelectItem>
                          <SelectItem value="factory">
                            {t("add_dialog.use_factory")}
                          </SelectItem>
                          <SelectItem value="other">
                            {t("add_dialog.use_other")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tAgent("description_label") || "Description"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            tAgent("description_placeholder") ||
                            "Describe the property..."
                          }
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUploader
                            value={field.value || []}
                            onChange={field.onChange}
                            accept="image/*"
                            maxFiles={10}
                            label={`${t("add_dialog.media")} (Images)`}
                            helperText="Drag & drop images here or click to browse. Up to 10 images."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videos"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUploader
                            value={field.value || []}
                            onChange={field.onChange}
                            accept="video/*"
                            maxFiles={2}
                            label={`${t("add_dialog.media")} (Videos)`}
                            helperText="Drag & drop videos here or click to browse. Up to 2 videos."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Location Tab */}
              <TabsContent value="location" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tAgent("country") || "Country"}</FormLabel>
                        <Select
                          key={`country-select-${countries.length}`}
                          onValueChange={(val) => {
                            field.onChange(Number(val));
                            form.setValue("city_id", 0);
                          }}
                          value={field.value ? String(field.value) : undefined}
                          disabled={loadingCountries}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries?.map((country) => (
                              <SelectItem
                                key={country.id}
                                value={String(country.id)}
                              >
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tAgent("city") || "City"}</FormLabel>
                        <Select
                          key={`city-select-${cities.length}-${watchCountryId}`}
                          onValueChange={(val) => field.onChange(Number(val))}
                          value={field.value ? String(field.value) : undefined}
                          disabled={!watchCountryId || loadingCities}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities?.map((city) => (
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.district")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="area_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.area_name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormLabel>
                    {t("add_dialog.location_on_map") || "Location on Map"}
                  </FormLabel>
                  <div
                    className="h-[300px] w-full border rounded-lg overflow-hidden relative"
                    style={{ zIndex: 0 }}
                  >
                    <Map
                      latitude={form.watch("latitude") || 24.7136}
                      longitude={form.watch("longitude") || 46.6753}
                      draggableMarker={true}
                      onMarkerDrag={(lat, lng) => {
                        form.setValue("latitude", lat);
                        form.setValue("longitude", lng);
                      }}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("add_dialog.latitude")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              {...field}
                              readOnly
                              className="bg-gray-50"
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
                          <FormLabel>{t("add_dialog.longitude")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              {...field}
                              readOnly
                              className="bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Pricing & Specs */}
              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.price_min")}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                        <FormLabel>{t("add_dialog.price_max")}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price_per_meter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.price_per_meter")}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="price_hidden"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 rtl:space-x-reverse space-y-0 pb-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {t("add_dialog.price_hidden")}
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.area")}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                        <FormLabel>{t("add_dialog.usable_area")}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="rooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.rooms")}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                        <FormLabel>{t("add_dialog.bathrooms")}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                        <FormLabel>{t("add_dialog.balconies")}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                        <FormLabel>{t("add_dialog.garages")}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Features */}
              <TabsContent value="features" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="finishing_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.finishing_type")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              {t("add_dialog.fin.none")}
                            </SelectItem>
                            <SelectItem value="basic">
                              {t("add_dialog.fin.basic")}
                            </SelectItem>
                            <SelectItem value="good">
                              {t("add_dialog.fin.good")}
                            </SelectItem>
                            <SelectItem value="luxury">
                              {t("add_dialog.fin.luxury")}
                            </SelectItem>
                            <SelectItem value="super_luxury">
                              {t("add_dialog.fin.super")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="facade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.facade")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="north">
                              {t("add_dialog.fac.north")}
                            </SelectItem>
                            <SelectItem value="south">
                              {t("add_dialog.fac.south")}
                            </SelectItem>
                            <SelectItem value="east">
                              {t("add_dialog.fac.east")}
                            </SelectItem>
                            <SelectItem value="west">
                              {t("add_dialog.fac.west")}
                            </SelectItem>
                            <SelectItem value="north_east">
                              {t("add_dialog.fac.ne")}
                            </SelectItem>
                            <SelectItem value="north_west">
                              {t("add_dialog.fac.nw")}
                            </SelectItem>
                            <SelectItem value="south_east">
                              {t("add_dialog.fac.se")}
                            </SelectItem>
                            <SelectItem value="south_west">
                              {t("add_dialog.fac.sw")}
                            </SelectItem>
                            <SelectItem value="multiple">
                              {t("add_dialog.fac.multiple")}
                            </SelectItem>
                            <SelectItem value="unknown">
                              {t("add_dialog.fac.unknown")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="property_age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.property_age")}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="amenity_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-2 block">
                        {t("add_dialog.amenities")}
                      </FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {amenities?.map((am) => (
                          <FormItem
                            key={am.id}
                            className="flex flex-row items-start space-x-2 rtl:space-x-reverse space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(am.id)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  return checked
                                    ? field.onChange([...current, am.id])
                                    : field.onChange(
                                        current.filter(
                                          (value) => value !== am.id,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <Label className="text-sm font-normal cursor-pointer select-none">
                              {am.name}
                            </Label>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="services"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("add_dialog.services")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("add_dialog.services_placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Legal */}
              <TabsContent value="legal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="license_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.license_number")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="license_expiry_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.license_expiry")}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="plan_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.plan_number")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="plot_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.plot_number")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="obligations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.obligations")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">
                              {t("add_dialog.obs.yes")}
                            </SelectItem>
                            <SelectItem value="no">
                              {t("add_dialog.obs.no")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marketing_option"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("add_dialog.marketing_option")}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              {t("add_dialog.mkt.none")}
                            </SelectItem>
                            <SelectItem value="advertising">
                              {t("add_dialog.mkt.advertising")}
                            </SelectItem>
                            <SelectItem value="agent">
                              {t("add_dialog.mkt.agent")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <FormField
                    control={form.control}
                    name="has_mortgage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 rtl:space-x-reverse space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t("add_dialog.has_mortgage")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="has_restriction"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 rtl:space-x-reverse space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t("add_dialog.has_restriction")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 rtl:space-x-reverse space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t("add_dialog.is_featured")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="guarantees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("add_dialog.guarantees")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-between gap-3 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (currentTabIndex === 0) {
                    onOpenChange(false);
                  } else {
                    handlePrevious();
                  }
                }}
                disabled={isPending}
              >
                {currentTabIndex === 0
                  ? t("add_dialog.cancel")
                  : t("add_dialog.previous")}
              </Button>

              {isLastTab ? (
                <Button
                  type="submit"
                  className="bg-main-green text-white px-8"
                  disabled={isPending || !form.formState.isDirty}
                >
                  {isPending
                    ? t("add_dialog.submitting")
                    : isEditing
                      ? t("update")
                      : t("add_dialog.submit")}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="bg-main-green text-white px-8"
                  onClick={handleNext}
                >
                  {t("add_dialog.next")}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyDialog;
