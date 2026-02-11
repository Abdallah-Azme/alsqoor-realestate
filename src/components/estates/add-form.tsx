"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, MapPin } from "lucide-react";
import { addProperty } from "@/lib/property-actions";
import Map from "@/components/shared/Map";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const createSchema = (t: any) =>
  z
    .object({
      title: z.string().min(1, t("required")),
      description: z.string().min(1, t("required")),
      operationType: z.string().min(1, t("required")),
      categoryId: z.string().min(1, t("required")),
      rooms: z.string().min(1, t("required")).regex(/^\d+$/, t("integer_only")),
      bathrooms: z
        .string()
        .min(1, t("required"))
        .regex(/^\d+$/, t("integer_only")),
      balconies: z
        .string()
        .optional()
        .refine((val) => !val || /^\d+$/.test(val), {
          message: t("integer_only"),
        }),
      garages: z
        .string()
        .optional()
        .refine((val) => !val || /^\d+$/.test(val), {
          message: t("integer_only"),
        }),
      area: z
        .string()
        .min(1, t("required"))
        .regex(/^\d+(\.\d+)?$/, t("number_only")),
      usableArea: z
        .string()
        .optional()
        .refine((val) => !val || /^\d+(\.\d+)?$/.test(val), {
          message: t("number_only"),
        }),
      countryId: z.string().min(1, t("required")),
      cityId: z.string().min(1, t("required")),
      district: z.string().optional(),
      finishingType: z.string().min(1, t("required")),
      priceMin: z
        .string()
        .min(1, t("required"))
        .regex(/^\d+(\.\d+)?$/, t("number_only")),
      priceMax: z
        .string()
        .optional()
        .refine((val) => !val || /^\d+(\.\d+)?$/.test(val), {
          message: t("number_only"),
        }),
      priceHidden: z.string().optional(),
      latitude: z
        .string()
        .optional()
        .refine((val) => !val || /^-?\d+(\.\d+)?$/.test(val), {
          message: t("number_only"),
        }),
      longitude: z
        .string()
        .optional()
        .refine((val) => !val || /^-?\d+(\.\d+)?$/.test(val), {
          message: t("number_only"),
        }),
    })
    .refine(
      (data) => {
        if (data.priceMax && data.priceMin) {
          const min = parseFloat(data.priceMin);
          const max = parseFloat(data.priceMax);
          return max >= min;
        }
        return true;
      },
      {
        message: t("price_range_invalid"),
        path: ["priceMax"],
      },
    );

export default function AddForm({ setOpen }) {
  const t = useTranslations("validations");
  const locale = useLocale();
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [mapCoordinates, setMapCoordinates] = useState({
    lat: 24.7136,
    lng: 46.6753,
  }); // Default: Riyadh

  const lableStyle = "block text-sm font-medium text-main-navy mb-2";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSchema(t)),
    defaultValues: {
      title: "",
      description: "",
      operationType: "",
      categoryId: "",
      rooms: "",
      bathrooms: "",
      balconies: "",
      garages: "",
      area: "",
      usableArea: "",
      countryId: "",
      cityId: "",
      district: "",
      finishingType: "",
      priceMin: "",
      priceMax: "",
      priceHidden: "0",
      latitude: "",
      longitude: "",
    },
  });

  // Toggle amenity selection
  const toggleAmenity = (amenityId: number) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId],
    );
  };

  // Fetch countries, cities, and amenities on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries
        const countriesRes = await fetch(`${API_URL}/countries`, {
          headers: {
            "Accept-Language": locale,
            Accept: "application/json",
          },
        });
        const countriesData = await countriesRes.json();
        if (countriesData.success) {
          setCountries(countriesData.data);
        }

        // Fetch cities
        const citiesRes = await fetch(`${API_URL}/cities`, {
          headers: {
            "Accept-Language": locale,
            Accept: "application/json",
          },
        });
        const citiesData = await citiesRes.json();
        if (citiesData.success) {
          setCities(citiesData.data);
        }

        // Fetch amenities
        const amenitiesRes = await fetch(`${API_URL}/amenities`, {
          headers: {
            "Accept-Language": locale,
            Accept: "application/json",
          },
        });
        const amenitiesData = await amenitiesRes.json();
        if (amenitiesData.success) {
          setAmenities(amenitiesData.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [locale]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData();

      // Add text fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("operation_type", data.operationType);
      formData.append("category_id", data.categoryId);

      // Add numeric fields (convert to numbers then to strings)
      formData.append("rooms", parseInt(data.rooms, 10).toString());
      formData.append("bathrooms", parseInt(data.bathrooms, 10).toString());
      if (data.balconies)
        formData.append("balconies", parseInt(data.balconies, 10).toString());
      if (data.garages)
        formData.append("garages", parseInt(data.garages, 10).toString());

      // Add area fields (convert to numbers then to strings)
      formData.append("area", parseFloat(data.area).toString());
      if (data.usableArea)
        formData.append("usable_area", parseFloat(data.usableArea).toString());

      // Add location fields
      formData.append("country_id", data.countryId);
      formData.append("city_id", data.cityId);
      if (data.district) formData.append("district", data.district);

      // Add finishing type
      formData.append("finishing_type", data.finishingType);

      // Add price fields (convert to numbers then to strings)
      const priceMin = parseFloat(data.priceMin);
      formData.append("price_min", priceMin.toString());

      // Only add price_max if it's provided and greater than price_min
      if (data.priceMax) {
        const priceMax = parseFloat(data.priceMax);
        if (priceMax >= priceMin) {
          formData.append("price_max", priceMax.toString());
        }
      }

      formData.append("price_hidden", data.priceHidden || "0");

      // Add coordinates (convert to numbers then to strings if provided)
      if (data.latitude && data.latitude.trim() !== "") {
        formData.append("latitude", parseFloat(data.latitude).toString());
      }
      if (data.longitude && data.longitude.trim() !== "") {
        formData.append("longitude", parseFloat(data.longitude).toString());
      }

      // Add images
      photos.forEach((photo) => {
        formData.append("images[]", photo);
      });

      // Add videos
      videos.forEach((video) => {
        formData.append("videos[]", video);
      });

      // Add amenities
      selectedAmenities.forEach((amenityId) => {
        formData.append("amenity_ids[]", amenityId.toString());
      });

      // Use server action to add property
      const result = await addProperty(formData);

      if (result.success && (result.code === 200 || result.code === 201)) {
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          // Refresh the page to show the new property
          window.location.reload();
        }, 1500);
      } else {
        // Handle validation errors
        if (result.code === 422 && result.data?.data) {
          const errors = result.data.data;
          const errorMessages = Object.values(errors).flat();
          setError(errorMessages.join("\n"));
        } else {
          setError(result.message || "فشل في إضافة العقار");
        }
      }
    } catch (err) {
      console.error("Error adding property:", err);
      setError("حدث خطأ أثناء إضافة العقار");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rtl text-right"
    >
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          تم إضافة العقار بنجاح!
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded whitespace-pre-line">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* العنوان */}
        <div>
          <Label className={lableStyle}>
            عنوان العقار<span className="text-red-500">*</span>
          </Label>
          <Input placeholder="مثلاً: شقة فاخرة للبيع" {...register("title")} />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* نوع العملية */}
        <div>
          <Label className={lableStyle}>
            نوع العملية<span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={(v) => setValue("operationType", v)} dir="rtl">
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder="بيع أو إيجار" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem className="" value="sale">
                بيع
              </SelectItem>
              <SelectItem className="" value="rent">
                إيجار
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.operationType && (
            <p className="text-red-500 text-sm">
              {errors.operationType.message}
            </p>
          )}
        </div>

        {/* نوع العقار */}
        <div>
          <Label className={lableStyle}>
            نوع العقار<span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={(v) => setValue("categoryId", v)} dir="rtl">
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder="اختر نوع العقار" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem className="" value="1">
                شقة
              </SelectItem>
              <SelectItem className="" value="2">
                فيلا
              </SelectItem>
              <SelectItem className="" value="3">
                برج
              </SelectItem>
              <SelectItem className="" value="4">
                منزل
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="md:col-span-3">
          <Label className={lableStyle}>
            الوصف<span className="text-red-500">*</span>
          </Label>
          <Textarea
            className=""
            placeholder="وصف تفصيلي للعقار"
            {...register("description")}
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        <div>
          <Label className={lableStyle}>
            عدد الغرف<span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="مثلاً 3"
            {...register("rooms")}
          />
          {errors.rooms && (
            <p className="text-red-500 text-sm">{errors.rooms.message}</p>
          )}
        </div>

        <div>
          <Label className={lableStyle}>
            عدد الحمامات<span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="مثلاً 2"
            {...register("bathrooms")}
          />
          {errors.bathrooms && (
            <p className="text-red-500 text-sm">{errors.bathrooms.message}</p>
          )}
        </div>

        <div>
          <Label className={lableStyle}>
            المساحة<span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="مثلاً 150"
            {...register("area")}
          />
          {errors.area && (
            <p className="text-red-500 text-sm">{errors.area.message}</p>
          )}
        </div>

        <div>
          <Label className={lableStyle}>عدد الشرفات</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="مثلاً 1"
            {...register("balconies")}
          />
        </div>

        <div>
          <Label className={lableStyle}>عدد المواقف</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="مثلاً 1"
            {...register("garages")}
          />
        </div>

        <div>
          <Label className={lableStyle}>المساحة القابلة للاستخدام</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="مثلاً 140"
            {...register("usableArea")}
          />
        </div>

        <div>
          <Label className={lableStyle}>
            الدولة<span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={(v) => setValue("countryId", v)} dir="rtl">
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder="اختر الدولة" />
            </SelectTrigger>
            <SelectContent className="">
              {countries.map((country) => (
                <SelectItem
                  className=""
                  key={country.id}
                  value={country.id.toString()}
                >
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.countryId && (
            <p className="text-red-500 text-sm">{errors.countryId.message}</p>
          )}
        </div>

        <div>
          <Label className={lableStyle}>
            المدينة<span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={(v) => setValue("cityId", v)} dir="rtl">
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder="اختر المدينة" />
            </SelectTrigger>
            <SelectContent className="">
              {cities.map((city) => (
                <SelectItem
                  className=""
                  key={city.id}
                  value={city.id.toString()}
                >
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cityId && (
            <p className="text-red-500 text-sm">{errors.cityId.message}</p>
          )}
        </div>

        <div>
          <Label className={lableStyle}>الحي</Label>
          <Input placeholder="مثلاً التجمع الخامس" {...register("district")} />
        </div>

        <div>
          <Label className={lableStyle}>
            نوع التشطيب<span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={(v) => setValue("finishingType", v)} dir="rtl">
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder="اختر نوع التشطيب" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem className="" value="none">
                بدون تشطيب
              </SelectItem>
              <SelectItem className="" value="basic">
                بسيط
              </SelectItem>
              <SelectItem className="" value="good">
                جيد
              </SelectItem>
              <SelectItem className="" value="luxury">
                فاخر
              </SelectItem>
              <SelectItem className="" value="super_luxury">
                سوبر لوكس
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.finishingType && (
            <p className="text-red-500 text-sm">
              {errors.finishingType.message}
            </p>
          )}
        </div>

        <div>
          <Label className={lableStyle}>
            السعر (حد أدنى)<span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              placeholder="0"
              {...register("priceMin")}
            />
            <Select defaultValue="sar">
              <SelectTrigger className="w-24 bg-main-navy  text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem className="" value="sar">
                  (ر.س)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.priceMin && (
            <p className="text-red-500 text-sm">{errors.priceMin.message}</p>
          )}
        </div>

        <div>
          <Label className={lableStyle}>
            السعر (حد أعلى)<span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              placeholder="0"
              {...register("priceMax")}
            />
            <Select defaultValue="sar">
              <SelectTrigger className="w-24 bg-main-navy  text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem className="" value="sar">
                  (ر.س)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.priceMax && (
            <p className="text-red-500 text-sm">{errors.priceMax.message}</p>
          )}
        </div>

        {/* Location Map Section */}
        <div className="md:col-span-3">
          <Label className={lableStyle}>
            <MapPin className="inline-block w-4 h-4 ml-1" />
            تحديد موقع العقار على الخريطة
          </Label>
          <p className="text-sm text-gray-500 mb-3">
            اسحب العلامة أو انقر على الخريطة لتحديد موقع العقار
          </p>
          <Map
            latitude={mapCoordinates.lat}
            longitude={mapCoordinates.lng}
            zoom={13}
            className="h-[300px] w-full rounded-xl border border-gray-200"
            markerPopup="موقع العقار"
            draggableMarker={true}
            onMarkerDrag={(lat, lng) => {
              setMapCoordinates({ lat, lng });
              setValue("latitude", lat.toFixed(6));
              setValue("longitude", lng.toFixed(6));
            }}
          />
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <Label className={lableStyle}>خط العرض</Label>
              <Input
                type="number"
                step="any"
                placeholder="24.7136"
                {...register("latitude")}
                onChange={(e) => {
                  const lat = parseFloat(e.target.value);
                  if (!isNaN(lat)) {
                    setMapCoordinates((prev) => ({ ...prev, lat }));
                  }
                }}
              />
            </div>
            <div>
              <Label className={lableStyle}>خط الطول</Label>
              <Input
                type="number"
                step="any"
                placeholder="46.6753"
                {...register("longitude")}
                onChange={(e) => {
                  const lng = parseFloat(e.target.value);
                  if (!isNaN(lng)) {
                    setMapCoordinates((prev) => ({ ...prev, lng }));
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <Label className={lableStyle}>إخفاء السعر</Label>
          <Select
            onValueChange={(v) => setValue("priceHidden", v)}
            dir="rtl"
            defaultValue="0"
          >
            <SelectTrigger className={"w-full"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem className="" value="0">
                لا
              </SelectItem>
              <SelectItem className="" value="1">
                نعم
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="py-6">
          <Label className={lableStyle}>رفع صور أو فيديو الإعلان</Label>

          {/* Side by side upload buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Photos upload */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const newFiles = Array.from(e.target.files);
                    setPhotos((prev) => [...prev, ...newFiles]);
                  }
                }}
                className="hidden"
                id="images"
              />
              <label
                htmlFor="images"
                className="cursor-pointer inline-flex items-center gap-2 text-sm text-gray-600 hover:text-main-green transition-colors"
              >
                <Upload size={18} /> رفع صور
              </label>
            </div>

            {/* Videos upload */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const newFiles = Array.from(e.target.files);
                    setVideos((prev) => [...prev, ...newFiles]);
                  }
                }}
                className="hidden"
                id="videos"
              />
              <label
                htmlFor="videos"
                className="cursor-pointer inline-flex items-center gap-2 text-sm text-gray-600 hover:text-main-green transition-colors"
              >
                <Upload size={18} /> رفع فيديوهات
              </label>
            </div>
          </div>

          {/* عرض الصور */}
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              <p className="w-full text-sm font-medium">الصور:</p>
              {photos.map((file, i) => (
                <div
                  key={i}
                  className="relative border rounded-lg p-2 w-[80px] h-[80px] flex items-center justify-center bg-gray-50"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="object-cover w-full h-full rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    onClick={() =>
                      setPhotos(photos.filter((_, idx) => idx !== i))
                    }
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* عرض الفيديوهات */}
          {videos.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              <p className="w-full text-sm font-medium">الفيديوهات:</p>
              {videos.map((file, i) => (
                <div
                  key={i}
                  className="relative border rounded-lg p-2 w-[80px] h-[80px] flex items-center justify-center bg-gray-50"
                >
                  <video
                    src={URL.createObjectURL(file)}
                    className="object-cover w-full h-full rounded-md"
                    controls
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    onClick={() =>
                      setVideos(videos.filter((_, idx) => idx !== i))
                    }
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Amenities Section */}
      {amenities.length > 0 && (
        <Card className="mt-6">
          <CardContent className="py-6">
            <Label className={lableStyle}>المميزات والمرافق</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
              {amenities.map((amenity: { id: number; name: string }) => (
                <label
                  key={amenity.id}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedAmenities.includes(amenity.id)
                      ? "border-main-green bg-main-green/10 text-main-green"
                      : "border-gray-200 hover:border-main-green/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                    className="w-4 h-4 accent-main-green"
                  />
                  <span className="text-sm">{amenity.name}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setOpen(false);
          }}
          disabled={loading}
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري النشر..." : "نشر"}
        </Button>
      </div>
    </form>
  );
}
