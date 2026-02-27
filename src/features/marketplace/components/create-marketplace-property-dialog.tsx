"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Loader2 } from "lucide-react";
import {
  useAddMarketplacePropertyMutation,
  useAddDeveloperPropertyMutation,
  useUpdateRealEstateProperty,
} from "../hooks/use-marketplace-properties";
import { FiPlus, FiEdit2 } from "react-icons/fi";
import {
  useCountries,
  useCities,
} from "@/features/properties/hooks/use-properties";
import { FileUploader } from "@/components/shared/file-uploader";
import { MarketplaceProperty } from "@/features/properties/types/property.types";
import { useEffect } from "react";

// Riyadh, Saudi Arabia defaults
const DEFAULT_LAT = 24.7136;
const DEFAULT_LNG = 46.6753;

// Dynamically import Leaflet map to avoid SSR issues
const MapLocationPicker = dynamic(
  () => import("@/components/shared/map-location-picker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] rounded-xl bg-gray-100 animate-pulse border-2 border-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-sm">جاري تحميل الخريطة...</span>
      </div>
    ),
  },
);

interface CreateMarketplacePropertyDialogProps {
  buttonText?: string;
  triggerClassName?: string;
}

interface CreateMarketplacePropertyDialogProps {
  buttonText?: string;
  triggerClassName?: string;
  property?: Partial<MarketplaceProperty>;
  isEdit?: boolean;
}

export const CreateMarketplacePropertyDialog = ({
  buttonText,
  triggerClassName,
  property,
  isEdit = false,
}: CreateMarketplacePropertyDialogProps) => {
  const t = useTranslations("properties");
  const tProfile = useTranslations("Profile");
  const tPage = useTranslations("home.estates_page");
  const tCommon = useTranslations("common");

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<string>("owner");

  // Address State
  const [countryId, setCountryId] = useState<number>(1);
  // Images State
  const [images, setImages] = useState<File[]>([]);

  // Location State — defaults to Riyadh
  const [latitude, setLatitude] = useState(DEFAULT_LAT);
  const [longitude, setLongitude] = useState(DEFAULT_LNG);

  const { data: countriesData, isLoading: loadingCountries } = useCountries();
  const { data: citiesData, isLoading: loadingCities } = useCities(countryId);

  const countries = Array.isArray(countriesData)
    ? countriesData
    : (countriesData as any)?.data || [];
  const cities = Array.isArray(citiesData)
    ? citiesData
    : (citiesData as any)?.data || [];

  const { mutate: addMarketplace, isPending: isAddingMarketplace } =
    useAddMarketplacePropertyMutation();
  const { mutate: addDeveloper, isPending: isAddingDeveloper } =
    useAddDeveloperPropertyMutation();
  const { mutate: updateProperty, isPending: isUpdating } =
    useUpdateRealEstateProperty();

  const isPending = isAddingMarketplace || isAddingDeveloper || isUpdating;

  // Initialize data if editing
  useEffect(() => {
    if (isEdit && property && open) {
      if (property.country_id) setCountryId(Number(property.country_id));
      if (property.latitude) setLatitude(Number(property.latitude));
      if (property.longitude) setLongitude(Number(property.longitude));

      // Determine role logically
      if (property.totalUnits || property.startingPrice) {
        setRole("developer");
      } else if (property.commissionPercentage && !property.startingPrice) {
        setRole("agent");
      } else {
        setRole("owner");
      }
    }
  }, [isEdit, property, open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    const formData = new FormData(e.currentTarget);

    // Inject the coordinates chosen on the map
    formData.set("latitude", String(latitude));
    formData.set("longitude", String(longitude));

    // Replace image with file uploaded via FileUploader
    if (images.length > 0) {
      formData.delete("image");
      formData.append("image", images[0]);
    }

    const handleSuccess = () => {
      setOpen(false);
      setTimeout(() => {
        setStep(1);
        setLatitude(DEFAULT_LAT);
        setLongitude(DEFAULT_LNG);
        setImages([]);
      }, 300);
    };

    if (isEdit && property?.id) {
      updateProperty(
        { id: property.id, data: formData },
        { onSuccess: handleSuccess },
      );
    } else if (role === "developer") {
      addDeveloper(formData, { onSuccess: handleSuccess });
    } else {
      addMarketplace(formData, { onSuccess: handleSuccess });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        setStep(1);
        setLatitude(DEFAULT_LAT);
        setLongitude(DEFAULT_LNG);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <button className={triggerClassName}>
            <FiEdit2 size={16} />
            {buttonText || tProfile("edit_data")}
          </button>
        ) : (
          <Button className={triggerClassName || "gap-2"}>
            <FiPlus className="h-5 w-5" />
            {buttonText || tPage("add_property") || "إضافة عقار"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? tProfile("edit_data") || "تعديل العقار"
              : t("add_property") || "إضافة عقار جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* ── Step 1: Basic Information ───────────────────────── */}
          <div className={step === 1 ? "block space-y-4" : "hidden"}>
            <div className="space-y-2">
              <Label>{t("account_type") || "نوع الحساب"}</Label>
              <Tabs value={role} onValueChange={setRole} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="owner">
                    {t("owner") || "مالك"}
                  </TabsTrigger>
                  <TabsTrigger value="agent">
                    {t("agent") || "وسيط"}
                  </TabsTrigger>
                  <TabsTrigger value="developer">
                    {t("developer") || "مطور عقاري"}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("title") || "العنوان"} *</Label>
                <Input
                  id="title"
                  name="title"
                  required={step === 1}
                  defaultValue={property?.title || ""}
                  placeholder={t("title_placeholder") || "أدخل عنوان العقار"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">{t("area") || "المساحة"} *</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  required={step === 1}
                  defaultValue={property?.area || ""}
                  placeholder={t("area_placeholder") || "مثال: 200"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country_id">{t("country") || "الدولة"} *</Label>
                <Select
                  name="country_id"
                  value={String(countryId)}
                  onValueChange={(val) => setCountryId(Number(val))}
                  disabled={loadingCountries}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("select_country") || "اختر الدولة"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {countries?.map((country: any) => (
                      <SelectItem key={country.id} value={String(country.id)}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city_id">{t("city") || "المدينة"} *</Label>
                <Select name="city_id" disabled={!countryId || loadingCities}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("select_city") || "اختر المدينة"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {cities?.map((city: any) => (
                      <SelectItem key={city.id} value={String(city.id)}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="district">{t("district") || "الحي"}</Label>
                <Input
                  id="district"
                  name="district"
                  defaultValue={property?.district || property?.location || ""}
                  placeholder={t("district_placeholder") || "أدخل اسم الحي"}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>{t("image") || "صورة العقار"}</Label>
                <FileUploader
                  value={images}
                  onChange={setImages}
                  accept="image/*"
                  maxFiles={1}
                  label={`${t("image") || "صورة العقار"}`}
                  helperText="اسحب الصور هنا أو انقر للتصفح. (حد أقصى صورة واحدة)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                {t("description") || "الوصف"} *
              </Label>
              <Textarea
                id="description"
                name="description"
                required={step === 1}
                defaultValue={property?.description || ""}
                placeholder={
                  t("description_placeholder") || "أدخل وصفاً دقيقاً للعقار"
                }
              />
            </div>

            {/* ── Map location picker ─────────────────────────────── */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                {t("location") || "الموقع على الخريطة"}
                <span className="text-xs text-gray-400 font-normal ms-1">
                  ({t("optional") || "اختياري"})
                </span>
              </Label>
              <MapLocationPicker
                lat={latitude}
                lng={longitude}
                onChange={(newLat, newLng) => {
                  setLatitude(newLat);
                  setLongitude(newLng);
                }}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">{tCommon("next") || "التالي"}</Button>
            </div>
          </div>

          {/* ── Step 2: Specific Information ────────────────────── */}
          <div className={step === 2 ? "block space-y-4" : "hidden"}>
            {/* Owner & Agent Fields */}
            {(role === "owner" || role === "agent") && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">{t("price") || "السعر"} *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    required={step === 2}
                    defaultValue={property?.price || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction_type">
                    {t("transaction_type") || "نوع العملية"} *
                  </Label>
                  <Select
                    name="transaction_type"
                    defaultValue={property?.transactionType || "buy"}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          t("select_transaction_type") || "اختر نوع العملية"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">{t("buy") || "بيع"}</SelectItem>
                      <SelectItem value="rent">
                        {t("rent") || "إيجار"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Agent Specific Fields */}
            {role === "agent" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rooms">{t("rooms") || "عدد الغرف"}</Label>
                  <Input
                    id="rooms"
                    name="rooms"
                    type="number"
                    defaultValue={property?.rooms || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission_percentage">
                    {t("commission_percentage") || "نسبة العمولة (%)"} *
                  </Label>
                  <Input
                    id="commission_percentage"
                    name="commission_percentage"
                    type="number"
                    defaultValue={property?.commissionPercentage || ""}
                    required={step === 2 && role === "agent"}
                  />
                </div>
              </div>
            )}

            {/* Owner Extra Fields (matching body) */}
            {role === "owner" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rooms">{t("rooms") || "عدد الغرف"}</Label>
                  <Input
                    id="rooms"
                    name="rooms"
                    type="number"
                    defaultValue={property?.rooms || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property_type">
                    {t("property_type") || "نوع العقار"}
                  </Label>
                  <Input
                    id="property_type"
                    name="property_type"
                    defaultValue={property?.propertyType || ""}
                    placeholder={t("select_property_type")}
                  />
                </div>
              </div>
            )}

            {/* Developer Specific Fields */}
            {role === "developer" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="property_type">
                      {t("property_type") || "نوع العقار"} *
                    </Label>
                    <Select
                      name="property_type"
                      defaultValue={property?.propertyType || "villa"}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            t("select_property_type") || "اختر نوع العقار"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="villa">
                          {t("villa") || "فيلا"}
                        </SelectItem>
                        <SelectItem value="land">
                          {t("land") || "أرض"}
                        </SelectItem>
                        <SelectItem value="apartment">
                          {t("apartment") || "شقة"}
                        </SelectItem>
                        <SelectItem value="floor">
                          {t("floor") || "دور"}
                        </SelectItem>
                        <SelectItem value="building">
                          {t("building") || "عمارة"}
                        </SelectItem>
                        <SelectItem value="shop">
                          {t("shop") || "محل"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="starting_price">
                      {t("starting_price") || "يبدأ من السعر"} *
                    </Label>
                    <Input
                      id="starting_price"
                      name="starting_price"
                      type="number"
                      defaultValue={property?.startingPrice || ""}
                      required={step === 2 && role === "developer"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total_units">
                      {t("total_units") || "إجمالي الوحدات"} *
                    </Label>
                    <Input
                      id="total_units"
                      name="total_units"
                      type="number"
                      defaultValue={property?.totalUnits || ""}
                      required={step === 2 && role === "developer"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dev_commission_percentage">
                      {t("commission_percentage") || "العمولة (%)"} *
                    </Label>
                    <Input
                      id="dev_commission_percentage"
                      name="commission_percentage"
                      type="number"
                      defaultValue={property?.commissionPercentage || ""}
                      required={step === 2 && role === "developer"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commission_from">
                      {t("commission_from") || "العمولة من"} *
                    </Label>
                    <Select
                      name="commission_from"
                      defaultValue={property?.commissionFrom || "owner"}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("select_source") || "اختر المصدر"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">
                          {t("owner") || "المالك"}
                        </SelectItem>
                        <SelectItem value="developer">
                          {t("developer") || "المطور"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isPending}
              >
                {tCommon("previous") || "السابق"}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit
                  ? t("update_real_estate") || "تحديث العقار"
                  : t("submit_property") || "إضافة العقار"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
