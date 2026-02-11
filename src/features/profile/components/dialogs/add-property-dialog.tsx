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
import { FiCheck, FiUpload } from "react-icons/fi";

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
    propertyType: "",
    operationType: "sale",
    city: "",
    neighborhood: "",
    price: "",
    area: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Submit to Owner Property API
      console.log("Submitting owner property:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to submit property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({
      title: "",
      propertyType: "",
      operationType: "sale",
      city: "",
      neighborhood: "",
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

          {/* Property Type & Operation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="">{tAgent("property_type")}</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) =>
                  setFormData({ ...formData, propertyType: value })
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
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="">{tAgent("operation_type")}</Label>
              <Select
                value={formData.operationType}
                onValueChange={(value) =>
                  setFormData({ ...formData, operationType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={tAgent("select_operation")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">
                    {tAgent("operations.sale")}
                  </SelectItem>
                  <SelectItem value="rent">
                    {tAgent("operations.rent")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="">{tAgent("city")}</Label>
              <Input
                placeholder={tAgent("city_placeholder")}
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="">{tAgent("neighborhood")}</Label>
              <Input
                placeholder={tAgent("neighborhood_placeholder")}
                value={formData.neighborhood}
                onChange={(e) =>
                  setFormData({ ...formData, neighborhood: e.target.value })
                }
              />
            </div>
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
