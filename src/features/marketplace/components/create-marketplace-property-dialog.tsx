"use client";

import { useState, useContext, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslations, useLocale } from "next-intl";
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
import { toast } from "sonner";
import { isBlockedImageFile } from "@/lib/image-upload";

// Riyadh, Saudi Arabia defaults
const DEFAULT_LAT = 24.7136;
const DEFAULT_LNG = 46.6753;

const SAUDI_CITY_FALLBACK_COORDS: Record<string, { lat: number; lng: number }> = {
  riyadh: { lat: 24.7136, lng: 46.6753 },
  "الرياض": { lat: 24.7136, lng: 46.6753 },
  jeddah: { lat: 21.5433, lng: 39.1728 },
  "جدة": { lat: 21.5433, lng: 39.1728 },
  mecca: { lat: 21.3891, lng: 39.8579 },
  makkah: { lat: 21.3891, lng: 39.8579 },
  "مكة": { lat: 21.3891, lng: 39.8579 },
  medina: { lat: 24.5247, lng: 39.5692 },
  madinah: { lat: 24.5247, lng: 39.5692 },
  "المدينة": { lat: 24.5247, lng: 39.5692 },
  dammam: { lat: 26.4207, lng: 50.0888 },
  "الدمام": { lat: 26.4207, lng: 50.0888 },
  khobar: { lat: 26.2794, lng: 50.2083 },
  "الخبر": { lat: 26.2794, lng: 50.2083 },
  taif: { lat: 21.2854, lng: 40.4267 },
  "الطائف": { lat: 21.2854, lng: 40.4267 },
  abha: { lat: 18.2164, lng: 42.5053 },
  "أبها": { lat: 18.2164, lng: 42.5053 },
  tabuk: { lat: 28.3835, lng: 36.5662 },
  "تبوك": { lat: 28.3835, lng: 36.5662 },
  buraidah: { lat: 26.326, lng: 43.975 },
  "بريدة": { lat: 26.326, lng: 43.975 },
  hail: { lat: 27.5114, lng: 41.7208 },
  "حائل": { lat: 27.5114, lng: 41.7208 },
  jazan: { lat: 16.8892, lng: 42.5511 },
  "جازان": { lat: 16.8892, lng: 42.5511 },
  najran: { lat: 17.565, lng: 44.2289 },
  "نجران": { lat: 17.565, lng: 44.2289 },
};

const toNumber = (value: unknown): number | null => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const geocodeCache = new Map<string, { lat: number; lng: number } | null>();

const extractCityCoordinates = (city: any): { lat: number; lng: number } | null => {
  if (!city) return null;

  const latCandidates = [
    city?.latitude,
    city?.lat,
    city?.location?.lat,
    city?.location?.latitude,
    city?.coordinates?.lat,
    city?.coordinates?.latitude,
    city?.center?.lat,
    city?.center?.latitude,
  ];
  const lngCandidates = [
    city?.longitude,
    city?.lng,
    city?.lon,
    city?.location?.lng,
    city?.location?.longitude,
    city?.coordinates?.lng,
    city?.coordinates?.longitude,
    city?.center?.lng,
    city?.center?.longitude,
  ];

  const lat = latCandidates.map(toNumber).find((v): v is number => v !== null);
  const lng = lngCandidates.map(toNumber).find((v): v is number => v !== null);

  if (lat !== undefined && lng !== undefined) {
    return { lat, lng };
  }

  const cityName = String(city?.name_ar || city?.name_en || city?.name || "")
    .trim()
    .toLowerCase();
  return SAUDI_CITY_FALLBACK_COORDS[cityName] || null;
};

const geocodeCityInSaudiArabia = async (
  cityName: string,
): Promise<{ lat: number; lng: number } | null> => {
  const normalized = cityName.trim().toLowerCase();
  if (!normalized) return null;

  if (geocodeCache.has(normalized)) {
    return geocodeCache.get(normalized) ?? null;
  }

  try {
    const query = encodeURIComponent(`${cityName}, Saudi Arabia`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=sa&q=${query}`,
      {
        headers: {
          "Accept-Language": "ar,en",
        },
      },
    );
    if (!res.ok) {
      geocodeCache.set(normalized, null);
      return null;
    }

    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : null;
    const lat = toNumber(first?.lat);
    const lng = toNumber(first?.lon);
    const coords = lat !== null && lng !== null ? { lat, lng } : null;
    geocodeCache.set(normalized, coords);
    return coords;
  } catch {
    geocodeCache.set(normalized, null);
    return null;
  }
};

const normalizeImageFile = async (file: File): Promise<File> => {
  if (isBlockedImageFile(file)) {
    throw new Error("WEBP/AVIF images are not allowed");
  }
  return file;
};

const VALID_PROPERTY_TYPES = [
  "villa",
  "land",
  "apartment",
  "floor",
  "building",
  "shop",
  "resthouse",
  "farm",
] as const;

const PROPERTY_TYPE_SYNONYMS: Record<string, (typeof VALID_PROPERTY_TYPES)[number]> = {
  villa: "villa",
  "فيلا": "villa",
  land: "land",
  "أرض": "land",
  apartment: "apartment",
  "شقة": "apartment",
  floor: "floor",
  "دور": "floor",
  building: "building",
  "عمارة": "building",
  shop: "shop",
  "محل": "shop",
  resthouse: "resthouse",
  "استراحة": "resthouse",
  farm: "farm",
  "مزرعة": "farm",
};

const normalizePropertyType = (
  value?: string | null,
): (typeof VALID_PROPERTY_TYPES)[number] | undefined => {
  if (!value) return undefined;
  const normalized = String(value).trim().toLowerCase();
  return PROPERTY_TYPE_SYNONYMS[normalized];
};

const NUMERIC_FIELD_KEYS = new Set([
  "area",
  "building_area",
  "country_id",
  "city_id",
  "latitude",
  "longitude",
  "price",
  "rooms",
  "starting_price",
  "total_units",
  "commission_percentage",
]);

const normalizeComparableValue = (
  key: string,
  value: string | number | null | undefined,
): string => {
  if (value === null || value === undefined) return "";
  const strValue = String(value).trim();
  if (!strValue) return "";

  if (NUMERIC_FIELD_KEYS.has(key)) {
    const numeric = Number(strValue);
    return Number.isFinite(numeric) ? String(numeric) : strValue;
  }

  return strValue;
};

const areStringArraysEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
};


// Dynamically import Leaflet map to avoid SSR issues
const MapLocationPicker = dynamic(
  () => import("@/components/shared/map-location-picker"),
  {
    ssr: false,
    loading: () => {
        return (
          <div className="w-full h-[300px] rounded-xl bg-gray-100 animate-pulse border-2 border-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">...</span>
          </div>
        );
    },
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
  onBeforeOpen?: () => boolean | Promise<boolean>;
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
  const tMarket = useTranslations("marketplace.create_property");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const safeT = (key: string, fallback: string) => {
    return t.has(key) ? t(key) : fallback;
  };

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
  const initialPropertyType = normalizePropertyType(property?.propertyType) || "villa";
  const initialImagesRef = useRef<string[]>([]);
  const initialVideosRef = useRef<string[]>([]);

  // Initialize data if editing or user role changes
  useEffect(() => {
    if (isEdit && property && open) {
 
      // Resolve country ID
      const resolvedCountryId =
        (property as any).country?.id ||
        property.country_id ||
        2;
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
        const initialImages = property.images.filter(
          (img): img is string => typeof img === "string" && img.length > 0,
        );
        setImages(initialImages);
        initialImagesRef.current = initialImages;
      } else {
        setImages([]);
        initialImagesRef.current = [];
      }
      if (Array.isArray(property.videos) && property.videos.length > 0) {
        const initialVideos = property.videos.filter(
          (vid): vid is string => typeof vid === "string" && vid.length > 0,
        );
        setVideos(initialVideos);
        initialVideosRef.current = initialVideos;
      } else {
        setVideos([]);
        initialVideosRef.current = [];
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
      initialImagesRef.current = [];
      initialVideosRef.current = [];
    }
  }, [isEdit, property, open, user?.role]);

  // Handle city reset when country changes (only if initiated by user, not during initial load)
  // We use a ref or check if cities load to determine if we should re-apply initial city
  const isFirstLoad = useRef(true);
  const citySelectionRequestRef = useRef(0);
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

  const handleCityChange = async (val: string) => {
    setCityId(val);
    const requestId = ++citySelectionRequestRef.current;

    const selectedCity = cities.find((city: any) => String(city?.id) === val);
    const coords = extractCityCoordinates(selectedCity);
    if (coords) {
      setLatitude(coords.lat);
      setLongitude(coords.lng);
      return;
    }

    // Fallback to geocoding when city payload has no coordinates.
    const cityName = String(
      selectedCity?.name_ar || selectedCity?.name_en || selectedCity?.name || "",
    ).trim();
    if (!cityName) return;

    const geocoded = await geocodeCityInSaudiArabia(cityName);
    if (!geocoded) return;

    // Prevent stale async updates if user changed city quickly.
    if (requestId === citySelectionRequestRef.current) {
      setLatitude(geocoded.lat);
      setLongitude(geocoded.lng);
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

    const getFileNameFromUrl = (rawUrl: string) => {
      try {
        const parsed = new URL(rawUrl);
        const name = parsed.pathname.split("/").pop();
        return name || (type === "image" ? "image.jpg" : "video.mp4");
      } catch {
        const sanitized = rawUrl.split("?")[0];
        const name = sanitized.split("/").pop();
        return name || (type === "image" ? "image.jpg" : "video.mp4");
      }
    };

    const inferImageMimeType = (fileName: string): string => {
      const lower = fileName.toLowerCase();
      if (lower.endsWith(".png")) return "image/png";
      if (lower.endsWith(".gif")) return "image/gif";
      if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
        return "image/jpeg";
      }
      return "image/jpeg";
    };

    const normalizedBlobType = blob.type.trim().toLowerCase();
    const filename = getFileNameFromUrl(url);
    const mimeType =
      type === "image"
        ? normalizedBlobType.startsWith("image/") &&
          normalizedBlobType !== "application/octet-stream"
          ? normalizedBlobType
          : inferImageMimeType(filename)
        : normalizedBlobType || "video/mp4";

    return new File([blob], filename, { type: mimeType });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    const submittedFormData = new FormData(e.currentTarget);
    const payload = new FormData();

    const initialRole =
      property?.totalUnits || property?.startingPrice
        ? "developer"
        : property?.commissionPercentage && !property?.startingPrice
          ? "agent"
          : "owner";

    const initialFieldValues: Record<string, string> = {
      role: normalizeComparableValue("role", initialRole),
      title: normalizeComparableValue("title", property?.title),
      area: normalizeComparableValue("area", property?.area),
      building_area: normalizeComparableValue(
        "building_area",
        (property as any)?.buildingArea ?? (property as any)?.building_area,
      ),
      country_id: normalizeComparableValue(
        "country_id",
        (property as any)?.country?.id || property?.country_id || 2,
      ),
      city_id: normalizeComparableValue(
        "city_id",
        (property as any)?.city?.id || property?.city_id,
      ),
      district: normalizeComparableValue(
        "district",
        typeof property?.district === "string"
          ? property.district
          : (property?.district as any)?.name ||
              (property as any)?.areaName ||
              (property as any)?.area_name ||
              property?.location ||
              "",
      ),
      description: normalizeComparableValue("description", property?.description),
      latitude: normalizeComparableValue("latitude", property?.latitude),
      longitude: normalizeComparableValue("longitude", property?.longitude),
      price: normalizeComparableValue(
        "price",
        property?.price ?? (property as any)?.price_value,
      ),
      transaction_type: normalizeComparableValue(
        "transaction_type",
        property?.transactionType || (property as any)?.transaction_type,
      ),
      rooms: normalizeComparableValue(
        "rooms",
        property?.rooms ?? (property as any)?.bedrooms,
      ),
      property_type: normalizeComparableValue(
        "property_type",
        normalizePropertyType(
          property?.propertyType || (property as any)?.property_type,
        ),
      ),
      starting_price: normalizeComparableValue(
        "starting_price",
        property?.startingPrice ?? (property as any)?.starting_price,
      ),
      total_units: normalizeComparableValue(
        "total_units",
        property?.totalUnits ?? (property as any)?.total_units,
      ),
      commission_percentage: normalizeComparableValue(
        "commission_percentage",
        property?.commissionPercentage ??
          (property as any)?.commission_percentage,
      ),
      commission_from: normalizeComparableValue(
        "commission_from",
        property?.commissionFrom || (property as any)?.commission_from,
      ),
    };

    const currentFieldValues: Record<string, string> = {
      role: normalizeComparableValue("role", role),
      title: normalizeComparableValue("title", submittedFormData.get("title") as string),
      area: normalizeComparableValue("area", submittedFormData.get("area") as string),
      building_area: normalizeComparableValue(
        "building_area",
        submittedFormData.get("building_area") as string,
      ),
      country_id: normalizeComparableValue("country_id", 2),
      city_id: normalizeComparableValue("city_id", cityId),
      district: normalizeComparableValue("district", district),
      description: normalizeComparableValue(
        "description",
        submittedFormData.get("description") as string,
      ),
      latitude: normalizeComparableValue("latitude", latitude),
      longitude: normalizeComparableValue("longitude", longitude),
      price: normalizeComparableValue("price", submittedFormData.get("price") as string),
      transaction_type: normalizeComparableValue(
        "transaction_type",
        submittedFormData.get("transaction_type") as string,
      ),
      rooms: normalizeComparableValue("rooms", submittedFormData.get("rooms") as string),
      property_type: normalizeComparableValue(
        "property_type",
        submittedFormData.get("property_type") as string,
      ),
      starting_price: normalizeComparableValue(
        "starting_price",
        submittedFormData.get("starting_price") as string,
      ),
      total_units: normalizeComparableValue(
        "total_units",
        submittedFormData.get("total_units") as string,
      ),
      commission_percentage: normalizeComparableValue(
        "commission_percentage",
        submittedFormData.get("commission_percentage") as string,
      ),
      commission_from: normalizeComparableValue(
        "commission_from",
        submittedFormData.get("commission_from") as string,
      ),
    };

    if (isEdit) {
      Object.entries(currentFieldValues).forEach(([key, value]) => {
        if (value !== initialFieldValues[key]) {
          payload.set(key, value);
        }
      });
    } else {
      // HIDDEN: country is always Saudi Arabia (country_id = 2)
      if (!cityId) {
        toast.error(tCommon("error.title"), {
          description: tMarket("select_city_error"),
        });
        return;
      }

      Object.entries(currentFieldValues).forEach(([key, value]) => {
        if (value !== "") {
          payload.set(key, value);
        }
      });
    }

    const currentImageUrls = images.filter(
      (img): img is string => typeof img === "string",
    );
    const currentVideoUrls = videos.filter(
      (vid): vid is string => typeof vid === "string",
    );
    const hasNewImageFiles = images.some((img) => img instanceof File);
    const hasNewVideoFiles = videos.some((vid) => vid instanceof File);
    const imagesChanged =
      !isEdit ||
      hasNewImageFiles ||
      !areStringArraysEqual(currentImageUrls, initialImagesRef.current);
    const videosChanged =
      !isEdit ||
      hasNewVideoFiles ||
      !areStringArraysEqual(currentVideoUrls, initialVideosRef.current);

    if (isEdit && !imagesChanged && !videosChanged && Array.from(payload.keys()).length === 0) {
      toast.info(tMarket("no_changes"));
      return;
    }

    setIsSubmitting(true);
    try {
      // Media contract in edit mode:
      // - Only send images[] when images are changed (full replacement list).
      // - Only send videos[] when videos are changed (full replacement list).
      let hasImageFormatError = false;
      let hasImageFetchError = false;
      let hasVideoFetchError = false;

      if (imagesChanged) {
        const imageCandidates = await Promise.all(
          images.map(async (img) => {
            try {
              if (img instanceof File) {
                return await normalizeImageFile(img);
              }

              const fetchedFile = await urlToFile(img as string, "image");
              return await normalizeImageFile(fetchedFile);
            } catch (error) {
              if (img instanceof File) {
                hasImageFormatError = true;
              } else {
                hasImageFetchError = true;
              }
              console.warn("Skipping invalid image during update:", error);
              return null;
            }
          }),
        );
        const imageFiles = imageCandidates.filter(
          (file): file is File => file instanceof File,
        );
        if (imageFiles.length === 0) {
          // Backend clear contract: send remove_images=1 when images are removed.
          payload.set("remove_images", "1");
        } else {
          imageFiles.forEach((file) => payload.append("images[]", file));
        }
      }

      if (videosChanged) {
        const videoCandidates = await Promise.all(
          videos.map(async (vid) => {
            try {
              return vid instanceof File
                ? await Promise.resolve(vid)
                : await urlToFile(vid as string, "video");
            } catch (error) {
              hasVideoFetchError = true;
              console.warn("Skipping invalid video during update:", error);
              return null;
            }
          }),
        );
        const videoFiles = videoCandidates.filter(
          (file): file is File => file instanceof File,
        );
        if (videoFiles.length === 0) {
          // Backend clear contract: send remove_videos=1 when videos are removed.
          payload.set("remove_videos", "1");
        } else {
          videoFiles.forEach((file) => payload.append("videos[]", file));
        }
      }

      if (hasImageFormatError) {
        toast.error(tCommon("error.title"), {
          description: tMarket("image_format_error"),
        });
      }
      if (hasImageFetchError || hasVideoFetchError) {
        // Non-blocking: some old media URLs may fail to re-fetch, but update can still succeed.
        console.warn("Some existing media URLs could not be fetched during update.");
      }
    } catch (err) {
      console.warn("Failed to fetch existing media, submitting without re-fetched files:", err);
      toast.error(tCommon("error.title"), {
        description: tMarket("media_fetch_error"),
      });
      return;
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
        { id: property.id, data: payload },
        { onSuccess: handleSuccess },
      );
    } else if (role === "developer") {
      addDeveloper(payload, { onSuccess: handleSuccess });
    } else {
      addMarketplace(payload, { onSuccess: handleSuccess });
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

  const handleTriggerClick = async () => {
    // Only check limits for new properties, not when editing
    if (!isEdit && !bypassLimitCheck) {
      if (!checkCanAddAd()) return;
      if (!checkCanAddFeatured()) return;
    }

    if (onBeforeOpen) {
      const canOpen = await onBeforeOpen();
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
      <DialogContent
        dir={isRtl ? "rtl" : "ltr"}
        className="max-w-2xl max-h-[90vh] overflow-y-auto text-start"
      >
        <DialogHeader>
          <DialogTitle  >
            {isEdit
              ? tMarket("update_property")
              : tMarket("add_property_title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* ── Step 1: Basic Information ───────────────────────── */}
          <div className={step === 1 ? "block space-y-4" : "hidden"}>
            {/* Account type hidden as requested, role is determined by profile */}
            <input type="hidden" name="role" value={role} />

            <div className="grid grid-cols-2 gap-4">
              <div className={`space-y-2  `}>
                <Label htmlFor="title">{tMarket("title_label")} *</Label>
                <Input
                  id="title"
                  name="title"
                  required={step === 1}
                  defaultValue={property?.title || ""}
                  placeholder={tMarket("title_placeholder")}
                 />
              </div>

              <div className={`space-y-2  `}>
                <Label htmlFor="area">{tMarket("area_label")} *</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  required={step === 1}
                  defaultValue={property?.area || ""}
                  placeholder={tMarket("area_placeholder")}
                 />
              </div>

              <div className={`space-y-2  `}>
                <Label htmlFor="building_area">{tMarket("building_area_label")} *</Label>
                <Input
                  id="building_area"
                  name="building_area"
                  type="number"
                  required={step === 1}
                  defaultValue={(property as any)?.buildingArea || ""}
                  placeholder={tMarket("building_area_placeholder")}
                 />
              </div>

              {/* HIDDEN: Country select — always Saudi Arabia (country_id = 2) sent to backend */}

              <div className={`space-y-2  `}>
                <Label htmlFor="city_id">{t("city")} *</Label>
                <Select
                  name="city_id"
                  value={cityId}
                  onValueChange={handleCityChange}
                  disabled={!countryId || loadingCities}
                >
                  <SelectTrigger  >
                    <SelectValue
                      placeholder={t("select_city")}
                    />
                  </SelectTrigger>
                  <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                    {cities?.map((city: any) => (
                      <SelectItem key={city.id} value={String(city.id)}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={`space-y-2 col-span-2  `}>
                <Label htmlFor="district">{tMarket("district_label")}</Label>
                <Input
                  id="district"
                  name="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder={tMarket("district_placeholder")}
                 />
              </div>

              <div className={`space-y-4 col-span-2  `}>
                <Label>{tMarket("images_label")}</Label>
                <FileUploader
                  value={images}
                  onChange={setImages as any}
                  accept="image/*"
                  maxFiles={20}
                  maxSize={1 * 1024 * 1024}
                  label=""
                  helperText={tMarket("images_helper")}
                />
              </div>

              <div className={`space-y-4 col-span-2  `}>
                <Label>{tMarket("videos_label")}</Label>
                <FileUploader
                  value={videos}
                  onChange={setVideos as any}
                  accept="video/*"
                  maxFiles={1}
                  maxSize={50 * 1024 * 1024}
                  label=""
                  helperText={tMarket("videos_helper")}
                />
              </div>
            </div>

            <div className={`space-y-2  `}>
              <Label htmlFor="description">
                {tMarket("description_label")} *
              </Label>
              <Textarea
                id="description"
                name="description"
                required={step === 1}
                defaultValue={property?.description || ""}
                placeholder={tMarket("description_placeholder")}
               />
            </div>

            {/* ── Map location picker ─────────────────────────────── */}
            <div className={`space-y-2 `}>
              <Label className="flex items-center gap-1">
                {tMarket("location_label")}
                <span className="text-xs text-gray-400 font-normal ms-1">
                  ({tMarket("optional")})
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
              <Button type="submit">{tCommon("next")}</Button>
            </div>
          </div>

          {/* ── Step 2: Specific Information ────────────────────── */}
          <div className={step === 2 ? "block space-y-4" : "hidden"}>
            {/* Owner & Agent Fields */}
            {(role === "owner" || role === "agent") && (
              <div className="grid grid-cols-2 gap-4">
                <div className={`space-y-2  `}>
                  <Label htmlFor="price">{tMarket("price_label")} *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    required={step === 2}
                    defaultValue={property?.price || ""}
                   />
                </div>

                <div className={`space-y-2 `}>
                  <Label htmlFor="transaction_type">
                    {tMarket("transaction_type_label")} *
                  </Label>
                  <Select
                    name="transaction_type"
                    defaultValue={property?.transactionType || "buy"}
                  >
                    <SelectTrigger  >
                      <SelectValue
                        placeholder={t("select_transaction_type")}
                      />
                    </SelectTrigger>
                    <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                      <SelectItem value="buy">{tMarket("buy")}</SelectItem>
                      <SelectItem value="rent">
                        {tMarket("rent")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Agent Specific Fields */}
            {role === "agent" && (
              <div className="grid grid-cols-2 gap-4">
                <div className={`space-y-2  `}>
                  <Label htmlFor="rooms">{tMarket("rooms_label")}</Label>
                  <Input
                    id="rooms"
                    name="rooms"
                    type="number"
                    defaultValue={property?.rooms || ""}
                   />
                </div>
                <div className={`space-y-2  `}>
                  <Label htmlFor="commission_percentage">
                    {tMarket("commission_percentage_label")} *
                  </Label>
                  <Input
                    id="commission_percentage"
                    name="commission_percentage"
                    type="text"
                    inputMode="decimal"
                    defaultValue={property?.commissionPercentage || ""}
                    onChange={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(",", ".");
                    }}
                    required={step === 2 && role === "agent"}
                   />
                </div>
              </div>
            )}

            {/* Owner Extra Fields (matching body) */}
            {role === "owner" && (
              <div className="grid grid-cols-2 gap-4">
                <div className={`space-y-2  `}>
                  <Label htmlFor="rooms">{tMarket("rooms_label")}</Label>
                  <Input
                    id="rooms"
                    name="rooms"
                    type="number"
                    defaultValue={property?.rooms || ""}
                   />
                </div>
                <div className={`space-y-2  `}>
                  <Label htmlFor="property_type">
                    {tMarket("property_type_label")}
                  </Label>
                  <Select
                    name="property_type"
                    defaultValue={initialPropertyType}
                  >
                    <SelectTrigger id="property_type"  >
                      <SelectValue
                        placeholder={t("select_property_type")}
                      />
                    </SelectTrigger>
                    <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                      <SelectItem value="villa">
                        {t("villa")}
                      </SelectItem>
                      <SelectItem value="land">
                        {t("land")}
                      </SelectItem>
                      <SelectItem value="apartment">
                        {t("apartment")}
                      </SelectItem>
                      <SelectItem value="floor">
                        {t("floor")}
                      </SelectItem>
                      <SelectItem value="building">
                        {t("building")}
                      </SelectItem>
                      <SelectItem value="shop">
                        {t("shop")}
                      </SelectItem>
                      <SelectItem value="resthouse">
                        {safeT("resthouse", "استراحة")}
                      </SelectItem>
                      <SelectItem value="farm">
                        {safeT("farm", "مزرعة")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Developer Specific Fields */}
            {role === "developer" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`space-y-2 `}>
                    <Label htmlFor="property_type">
                      {tMarket("property_type_label")} *
                    </Label>
                    <Select
                      name="property_type"
                      defaultValue={initialPropertyType}
                    >
                      <SelectTrigger  >
                        <SelectValue
                          placeholder={t("select_property_type")}
                        />
                      </SelectTrigger>
                      <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                        <SelectItem value="villa">
                          {t("villa")}
                        </SelectItem>
                        <SelectItem value="land">
                          {t("land")}
                        </SelectItem>
                        <SelectItem value="apartment">
                          {t("apartment")}
                        </SelectItem>
                        <SelectItem value="floor">
                          {t("floor")}
                        </SelectItem>
                        <SelectItem value="building">
                          {t("building")}
                        </SelectItem>
                        <SelectItem value="shop">
                          {t("shop")}
                        </SelectItem>
                        <SelectItem value="resthouse">
                          {safeT("resthouse", "استراحة")}
                        </SelectItem>
                        <SelectItem value="farm">
                          {safeT("farm", "مزرعة")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={`space-y-2  `}>
                    <Label htmlFor="starting_price">
                      {tMarket("starting_price_label")} *
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
                  <div className={`space-y-2 `}>
                    <Label htmlFor="total_units">{tMarket("total_units_label")} *</Label>
                    <Input
                      id="total_units"
                      name="total_units"
                      type="number"
                      defaultValue={property?.totalUnits || ""}
                      required={step === 2 && role === "developer"}
                     />
                  </div>
                  <div className={`space-y-2 `}>
                    <Label htmlFor="dev_commission_percentage">
                      {tMarket("commission_percentage_label")} *
                    </Label>
                    <Input
                      id="dev_commission_percentage"
                      name="commission_percentage"
                      type="text"
                      inputMode="decimal"
                      defaultValue={property?.commissionPercentage || ""}
                      onChange={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(",", ".");
                      }}
                      required={step === 2 && role === "developer"}
                     />
                  </div>
                  <div className={`space-y-2  `}>
                    <Label htmlFor="commission_from">
                      {tMarket("commission_from_label")} *
                    </Label>
                    <Select
                      name="commission_from"
                      defaultValue={property?.commissionFrom || "owner"}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("select_source")}
                        />
                      </SelectTrigger>
                      <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                        <SelectItem value="owner">
                          {tMarket("owner")}
                        </SelectItem>
                        <SelectItem value="developer">
                          {tMarket("developer")}
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
                {tCommon("previous")}
              </Button>
              <Button type="submit" disabled={isPending || isSubmitting}>
                {(isPending || isSubmitting) && (
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                )}
                {isEdit
                  ? t("update_real_estate")
                  : t("submit_property")}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
