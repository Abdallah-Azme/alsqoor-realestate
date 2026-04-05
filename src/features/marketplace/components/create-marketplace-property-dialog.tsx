"use client";

import { useState, useContext, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useAdLimit } from "@/hooks/use-ad-limit";
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
import { UserContext } from "@/context/user-context";

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
  property?: Partial<MarketplaceProperty>;
  isEdit?: boolean;
  /** Initial role to show when adding a new property */
  defaultRole?: string;
  /** Called when trigger is clicked. Return false to block opening the dialog. */
  onBeforeOpen?: () => boolean;
  /** Whether to skip ad limit and featured property checks. Useful for bypassing redirects to packages. */
  bypassLimitCheck?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

export const CreateMarketplacePropertyDialog = ({
  buttonText,
  triggerClassName,
  property,
  isEdit = false,
  defaultRole = "owner",
  onBeforeOpen,
  bypassLimitCheck = false,
  open: externalOpen,
  onOpenChange: setExternalOpen,
  hideTrigger = false,
}: CreateMarketplacePropertyDialogProps) => {
  const t = useTranslations("properties");
  const tProfile = useTranslations("Profile");
  const tPage = useTranslations("home.estates_page");
  const tCommon = useTranslations("common");

  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (setExternalOpen) setExternalOpen(val);
    else setInternalOpen(val);
  };

  const [step, setStep] = useState(1);
  const { user } = useContext(UserContext) || {};
  const [role, setRole] = useState<string>(user?.role || defaultRole);
  const { checkCanAddAd, checkCanAddFeatured } = useAdLimit();

  // HIDDEN: country_id is always 2 (Saudi Arabia)
  const [countryId, setCountryId] = useState<number>(2);
  const [cityId, setCityId] = useState<string>("");
  // Images State
  const [images, setImages] = useState<(File | string)[]>([]);
  // Videos State
  const [videos, setVideos] = useState<(File | string)[]>([]);
  // District State
  const [district, setDistrict] = useState<string>("");
  // Submission loading state (for URL→Blob conversion)
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Initialize data if editing or user role changes
  useEffect(() => {
    if (isEdit && property && open) {
      console.log("Updating property with initial data:", property);

      // Resolve country ID
      const resolvedCountryId =
        (property as any).country?.id ||
        property.country_id ||
        1;
      setCountryId(Number(resolvedCountryId));

      // Resolve city ID
      const resolvedCityId =
        (property as any).city?.id ||
        property.city_id ||
        "";
      if (resolvedCityId) {
        setCityId(String(resolvedCityId));
      }

      if (property.latitude) setLatitude(Number(property.latitude));
      if (property.longitude) setLongitude(Number(property.longitude));

      // Resolve District/Neighborhood ("الحي")
      const resolvedDistrict =
        typeof property.district === "string"
          ? property.district
          : (property.district as any)?.name ||
            (property as any).areaName ||
            (property as any).area_name ||
            property.location ||
            "";
      setDistrict(resolvedDistrict);

      // Pre-populate images and videos
      if (Array.isArray(property.images) && property.images.length > 0) {
        setImages(property.images as string[]);
      } else {
        setImages([]);
      }
      if (Array.isArray(property.videos) && property.videos.length > 0) {
        setVideos(property.videos as string[]);
      } else {
        setVideos([]);
      }

      // Role check
      if (property.totalUnits || property.startingPrice) {
        setRole("developer");
      } else if (property.commissionPercentage && !property.startingPrice) {
        setRole("agent");
      } else {
        setRole("owner");
      }
    } else if (!isEdit && user?.role) {
      setRole(user.role);
    }
  }, [isEdit, property, open, user?.role]);

  // Handle city reset when country changes (only if initiated by user, not during initial load)
  // We use a ref or check if cities load to determine if we should re-apply initial city
  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (open) {
      isFirstLoad.current = true;
    }
  }, [open]);

  useEffect(() => {
    if (!loadingCities && cities.length > 0 && isEdit && property && open && isFirstLoad.current) {
      const resolvedCityId = (property as any).city?.id || property.city_id;
      if (resolvedCityId) {
        setCityId(String(resolvedCityId));
        isFirstLoad.current = false;
      }
    }
  }, [loadingCities, cities]);

  const handleCountryChange = (val: string) => {
    const newId = Number(val);
    if (newId !== countryId) {
      setCountryId(newId);
      setCityId(""); // Reset city when country changes
      isFirstLoad.current = false; // Stop auto-applying property city
    }
  };

  /**
   * Convert a URL string to a File/Blob object via our server-side proxy.
   * This avoids CORS issues — the browser calls /api/proxy-media (same origin),
   * and the Next.js server fetches the actual media file server-to-server.
   */
  const urlToFile = async (url: string, type: "image" | "video"): Promise<File> => {
    const proxyUrl = `/api/proxy-media?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`Proxy fetch failed: ${response.status}`);
    const blob = await response.blob();
    const filename = url.split("/").pop() || (type === "image" ? "image.jpg" : "video.mp4");
    return new File([blob], filename, { type: blob.type });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    const formData = new FormData(e.currentTarget);

    // Sync state values to FormData
    // HIDDEN: country is always Saudi Arabia (country_id = 2)
    formData.set("country_id", "2");
    formData.set("city_id", String(cityId));
    formData.set("latitude", String(latitude));
    formData.set("longitude", String(longitude));

    setIsSubmitting(true);
    try {
      // Convert all kept existing image URLs to File blobs, then combine with new uploads.
      // The backend receives the full desired set and replaces images entirely.
      formData.delete("images[]");
      const imageFiles = await Promise.all(
        images.map((img) =>
          img instanceof File ? Promise.resolve(img) : urlToFile(img as string, "image")
        )
      );
      imageFiles.forEach((file) => formData.append("images[]", file));

      // Same for videos
      formData.delete("videos[]");
      const videoFiles = await Promise.all(
        videos.map((vid) =>
          vid instanceof File ? Promise.resolve(vid) : urlToFile(vid as string, "video")
        )
      );
      videoFiles.forEach((file) => formData.append("videos[]", file));
    } catch (err) {
      console.warn("Failed to fetch existing media, submitting without re-fetched files:", err);
    } finally {
      setIsSubmitting(false);
    }

    const handleSuccess = () => {
      setOpen(false);
      setTimeout(() => {
        setStep(1);
        setLatitude(DEFAULT_LAT);
        setLongitude(DEFAULT_LNG);
        setImages([]);
        setVideos([]);
        setCityId("");
        setDistrict("");
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
        setRole(user?.role || defaultRole); // Reset to user role on close
        setImages([]);
        setVideos([]);
        setCityId("");
        setDistrict("");
      }, 300);
    }
  };

  const handleTriggerClick = () => {
    // Only check limits for new properties, not when editing
    if (!isEdit && !bypassLimitCheck) {
      if (!checkCanAddAd()) return;
      if (!checkCanAddFeatured()) return;
    }

    if (onBeforeOpen) {
      const canOpen = onBeforeOpen();
      if (!canOpen) return;
    }
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Trigger rendered outside DialogTrigger so we can intercept and guard the click */}
      {!hideTrigger && (
        isEdit ? (
          <button className={triggerClassName} onClick={handleTriggerClick}>
            <FiEdit2 size={16} />
            {buttonText || tProfile("edit_data")}
          </button>
        ) : (
          <Button
            onClick={handleTriggerClick}
            className={
              triggerClassName ||
              "bg-main-green hover:bg-main-green/90 text-white gap-2"
            }
          >
            <FiPlus className="text-lg" />
            <span>{buttonText || tPage("add_ad")}</span>
          </Button>
        )
      )}
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
            {/* Account type hidden as requested, role is determined by profile */}
            <input type="hidden" name="role" value={role} />

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
                <Label htmlFor="area">{t("area") || "مساحة الأرض (م²)"} *</Label>
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
                <Label htmlFor="building_area">{t("building_area") || "مساحة البناء (م²)"} *</Label>
                <Input
                  id="building_area"
                  name="building_area"
                  type="number"
                  required={step === 1}
                  defaultValue={(property as any)?.buildingArea || ""}
                  placeholder={t("building_area_placeholder") || "مثال: 180"}
                />
              </div>

              {/* HIDDEN: Country select — always Saudi Arabia (country_id = 2) sent to backend */}

              <div className="space-y-2">
                <Label htmlFor="city_id">{t("city") || "المدينة"} *</Label>
                <Select
                  name="city_id"
                  value={cityId}
                  onValueChange={(val) => setCityId(val)}
                  disabled={!countryId || loadingCities}
                >
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
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder={t("district_placeholder") || "أدخل اسم الحي"}
                />
              </div>

              <div className="space-y-4 col-span-2">
                <Label>{t("images") || "صور العقار"}</Label>
                <FileUploader
                  value={images}
                  onChange={setImages as any}
                  accept="image/*"
                  maxFiles={20}
                  maxSize={1 * 1024 * 1024}
                  label=""
                  helperText={
                    t("images_helper_updated") ||
                    "اسحب الصور هنا أو انقر للتصفح. (حد أقصى 20 صورة، 1 ميجابايت لكل صورة)"
                  }
                />
              </div>

              <div className="space-y-4 col-span-2">
                <Label>{t("videos") || "فيديوهات العقار"}</Label>
                <FileUploader
                  value={videos}
                  onChange={setVideos as any}
                  accept="video/*"
                  maxFiles={1}
                  maxSize={25 * 1024 * 1024}
                  label=""
                  helperText={
                    t("videos_helper_updated_v2") ||
                    "اسحب فيديو واحد هنا أو انقر للتصفح. (حد أقصى 1 فيديو، 25 ميجابايت)"
                  }
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
                    step="0.5"
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
                      step="0.5"
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
                disabled={isPending || isSubmitting}
              >
                {tCommon("previous") || "السابق"}
              </Button>
              <Button type="submit" disabled={isPending || isSubmitting}>
                {(isPending || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
