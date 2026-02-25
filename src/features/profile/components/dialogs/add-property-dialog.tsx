"use client";

import { useState } from "react";
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
import { FiCheck, FiUpload } from "react-icons/fi";
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
} from "@/features/properties/hooks/use-properties";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

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
});

interface FormValues {
  title: string;
  description?: string;
  country_id: number;
  city_id: number;
  district: string;
  category_id: number;
  operation_type: "sale" | "rent";
  price_min: number;
  price_max: number;
  price_hidden?: boolean;
  area: number;
  usable_area?: number;
  rooms: number;
  bathrooms: number;
  balconies?: number;
  garages?: number;
  finishing_type: "none" | "basic" | "good" | "luxury" | "super_luxury";
  latitude?: number;
  longitude?: number;
  amenity_ids?: number[];
  property_use:
    | "apartment"
    | "villa"
    | "land_residential"
    | "land_commercial"
    | "commercial_shop"
    | "office"
    | "warehouse"
    | "building"
    | "farm"
    | "factory"
    | "other";
  facade?:
    | "north"
    | "south"
    | "east"
    | "west"
    | "north_east"
    | "north_west"
    | "south_east"
    | "south_west"
    | "multiple"
    | "unknown";
  property_age?: number;
  services?: string;
  obligations?: "yes" | "no";
  license_number?: string;
  license_expiry_date?: string;
  plan_number?: string;
  plot_number?: string;
  area_name?: string;
  has_mortgage?: boolean;
  has_restriction?: boolean;
  guarantees?: string;
  price_per_meter?: number;
  is_featured?: boolean;
  marketing_option?: "none" | "advertising" | "agent";
}

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPropertyDialog = ({ open, onOpenChange }: AddPropertyDialogProps) => {
  const t = useTranslations("owner_properties");
  const tAgent = useTranslations("agent_profile.show_dialog");

  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<FormValues>({
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
    } as FormValues,
  });

  const watchCountryId = form.watch("country_id");

  const { data: countries, isLoading: loadingCountries } = useCountries();
  const { data: cities, isLoading: loadingCities } = useCities(watchCountryId);
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: amenities, isLoading: loadingAmenities } = useAmenities();

  const createPropertyMutation = useCreateProperty();

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      // Transform services from string to array
      const submitData = {
        ...values,
        services: values.services
          ? values.services
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      await createPropertyMutation.mutateAsync(submitData);
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Failed to submit property:", error);
      toast.error(
        error?.response?.data?.message ||
          t("failed_to_add") ||
          "Failed to add property",
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
              {t("add_property") || "Add Property"}
            </h3>
            <p className="text-gray-500 mb-6">
              {t("success_add") || "Property added successfully!"}
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
          <DialogTitle>{t("add_property") || "Add Property"}</DialogTitle>
          <DialogDescription>
            {t("add_property_desc") ||
              "Please fill all required details carefully."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 md:grid-cols-5 bg-gray-50 mb-4 rounded-lg h-auto overflow-hidden text-sm">
                <TabsTrigger value="basic" className="py-2.5">
                  {t("add_dialog.tabs.basic")}
                </TabsTrigger>
                <TabsTrigger value="location" className="py-2.5">
                  {t("add_dialog.tabs.location")}
                </TabsTrigger>
                <TabsTrigger value="pricing" className="py-2.5">
                  {t("add_dialog.tabs.pricing")}
                </TabsTrigger>
                <TabsTrigger value="features" className="py-2.5">
                  {t("add_dialog.tabs.features")}
                </TabsTrigger>
                <TabsTrigger value="legal" className="py-2.5">
                  {t("add_dialog.tabs.legal")}
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
                          defaultValue={
                            field.value ? String(field.value) : undefined
                          }
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
                          defaultValue={field.value}
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
                        defaultValue={field.value}
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

                <div>
                  <Label>{t("add_dialog.media")}</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500">
                    <FiUpload className="w-8 h-8 mb-2" />
                    <span className="text-sm">
                      {t("add_dialog.upload_stub")}
                    </span>
                  </div>
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
                          onValueChange={(val) => {
                            field.onChange(Number(val));
                            form.setValue("city_id", 0);
                          }}
                          defaultValue={
                            field.value ? String(field.value) : undefined
                          }
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
                          onValueChange={(val) => field.onChange(Number(val))}
                          defaultValue={
                            field.value ? String(field.value) : undefined
                          }
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("add_dialog.latitude")}</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" {...field} />
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
                          <Input type="number" step="any" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                          defaultValue={field.value}
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
                          defaultValue={field.value}
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
                          defaultValue={field.value}
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
                          defaultValue={field.value}
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

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createPropertyMutation.isPending}
              >
                {t("add_dialog.cancel")}
              </Button>
              <Button
                type="submit"
                className="bg-main-green text-white px-8"
                disabled={
                  createPropertyMutation.isPending || !form.formState.isDirty
                }
              >
                {createPropertyMutation.isPending
                  ? t("add_dialog.submitting")
                  : t("add_dialog.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyDialog;
