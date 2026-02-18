"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
import { FiCheck, FiUpload, FiLoader } from "react-icons/fi";
import {
  useCountries,
  useCities,
} from "@/features/properties/hooks/use-properties";
import { propertiesService } from "@/features/properties/services/properties.service";
import { toast } from "sonner";

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPropertyDialog = ({ open, onOpenChange }: AddPropertyDialogProps) => {
  const t = useTranslations("owner_properties");
  // Reuse some translations from agent profile if needed or use defaults
  const tAgent = useTranslations("agent_profile.show_dialog"); // Reuse translations for common fields

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Basic form state
  const [formData, setFormData] = useState({
    title: "",
    property_type: "villa",
    transaction_type: "buy",
    country_id: "",
    city_id: "",
    district: "",
    price: "",
    area: "",
    description: "",
  });

  const { data: countries, isLoading: loadingCountries } = useCountries();
  const { data: cities, isLoading: loadingCities } = useCities(
    formData.country_id,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.country_id || !formData.city_id) {
      toast.error(
        t("please_select_location") || "Please select country and city",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("country_id", formData.country_id);
      data.append("city_id", formData.city_id);
      data.append("district", formData.district);
      data.append("area", formData.area);
      data.append("price", formData.price);
      data.append("transaction_type", formData.transaction_type);
      data.append("property_type", formData.property_type);

      await propertiesService.addMarketplaceProperty(data);
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Failed to submit property:", error);
      toast.error(
        error?.response?.data?.message ||
          t("failed_to_add") ||
          "Failed to add property",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({
      title: "",
      property_type: "villa",
      transaction_type: "buy",
      country_id: "",
      city_id: "",
      district: "",
      price: "",
      area: "",
      description: "",
    });

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
              {t("add_property")}
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="">{t("add_property")}</DialogTitle>
          <DialogDescription className="">
            {t("add_property_desc") || "Enter your property details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label className="">{tAgent("property_title") || "Title"}</Label>
            <Input
              placeholder={tAgent("title_placeholder") || "e.g. Luxury Villa"}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Property Type & Transaction Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="">{tAgent("property_type")}</Label>
              <Select
                value={formData.property_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, property_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={tAgent("select_type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="villa">{tAgent("types.villa")}</SelectItem>
                  <SelectItem value="apartment">
                    {tAgent("types.apartment")}
                  </SelectItem>
                  <SelectItem value="land">{tAgent("types.land")}</SelectItem>
                  <SelectItem value="building">
                    {tAgent("types.building")}
                  </SelectItem>
                  <SelectItem value="floor">
                    {tAgent("types.floor") || "Floor"}
                  </SelectItem>
                  <SelectItem value="shop">
                    {tAgent("types.shop") || "Shop"}
                  </SelectItem>
                  <SelectItem value="resthouse">
                    {tAgent("types.rest_house") || "Rest House"}
                  </SelectItem>
                  <SelectItem value="farm">
                    {tAgent("types.farm") || "Farm"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="">{tAgent("operation_type")}</Label>
              <Select
                value={formData.transaction_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, transaction_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={tAgent("select_operation")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">
                    {tAgent("operations.sale") || "Sale"}
                  </SelectItem>
                  <SelectItem value="rent">
                    {tAgent("operations.rent") || "Rent"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location - Country & City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="">{tAgent("country") || "Country"}</Label>
              <Select
                value={formData.country_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, country_id: value, city_id: "" })
                }
              >
                <SelectTrigger disabled={loadingCountries}>
                  {loadingCountries ? (
                    <div className="flex items-center gap-2">
                      <FiLoader className="animate-spin" />
                      <span>{tAgent("loading") || "Loading..."}</span>
                    </div>
                  ) : (
                    <SelectValue
                      placeholder={tAgent("select_country") || "Select Country"}
                    />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={String(country.id)}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="">{tAgent("city")}</Label>
              <Select
                value={formData.city_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, city_id: value })
                }
                disabled={!formData.country_id || loadingCities}
              >
                <SelectTrigger>
                  {loadingCities ? (
                    <div className="flex items-center gap-2">
                      <FiLoader className="animate-spin" />
                      <span>{tAgent("loading") || "Loading..."}</span>
                    </div>
                  ) : (
                    <SelectValue
                      placeholder={tAgent("select_city") || "Select City"}
                    />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={String(city.id)}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* District/Neighborhood */}
          <div>
            <Label className="">{tAgent("neighborhood")}</Label>
            <Input
              placeholder={tAgent("neighborhood_placeholder")}
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
            />
          </div>

          {/* Price & Area */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="">{tAgent("price")}</Label>
              <Input
                type="number"
                placeholder={tAgent("price_placeholder")}
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="">{tAgent("area")}</Label>
              <Input
                type="number"
                placeholder={tAgent("area_placeholder")}
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
              />
            </div>
          </div>

          {/* Upload Images Stub */}
          <div>
            <Label className="mb-2 block">{tAgent("images")}</Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-main-green/50 hover:bg-gray-50 transition-colors">
              <FiUpload className="w-8 h-8 mb-2" />
              <span className="text-sm">{tAgent("upload_images")}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="">{tAgent("description_label")}</Label>
            <Textarea
              placeholder={tAgent("description_placeholder")}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {tAgent("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title}
              className="flex-1 bg-main-green text-white"
            >
              {isSubmitting ? tAgent("submitting") : tAgent("submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyDialog;
