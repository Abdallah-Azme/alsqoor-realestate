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
import { FiCheck } from "react-icons/fi";

interface RequestPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  agentName: string;
}

const RequestPropertyDialog = ({
  open,
  onOpenChange,
  agentId,
  agentName,
}: RequestPropertyDialogProps) => {
  const t = useTranslations("agent_profile.request_dialog");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    propertyType: "",
    operationType: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Submit to API
      console.log("Submitting request:", { agentId, ...formData });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to submit request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({
      propertyType: "",
      operationType: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
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
              {t("success_title")}
            </h3>
            <p className="text-gray-500 mb-6">{t("success_description")}</p>
            <Button onClick={handleClose} className="bg-main-green text-white">
              {t("close")}
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
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description", { agentName })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Type */}
          <div>
            <Label>{t("property_type")}</Label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) =>
                setFormData({ ...formData, propertyType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("select_type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="villa">{t("types.villa")}</SelectItem>
                <SelectItem value="apartment">
                  {t("types.apartment")}
                </SelectItem>
                <SelectItem value="land">{t("types.land")}</SelectItem>
                <SelectItem value="building">{t("types.building")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Operation Type */}
          <div>
            <Label>{t("operation_type")}</Label>
            <Select
              value={formData.operationType}
              onValueChange={(value) =>
                setFormData({ ...formData, operationType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("select_operation")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">{t("operations.sale")}</SelectItem>
                <SelectItem value="rent">{t("operations.rent")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div>
            <Label>{t("city")}</Label>
            <Input
              placeholder={t("city_placeholder")}
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("min_price")}</Label>
              <Input
                type="number"
                placeholder={t("price_placeholder")}
                value={formData.minPrice}
                onChange={(e) =>
                  setFormData({ ...formData, minPrice: e.target.value })
                }
              />
            </div>
            <div>
              <Label>{t("max_price")}</Label>
              <Input
                type="number"
                placeholder={t("price_placeholder")}
                value={formData.maxPrice}
                onChange={(e) =>
                  setFormData({ ...formData, maxPrice: e.target.value })
                }
              />
            </div>
          </div>

          {/* Area Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("min_area")}</Label>
              <Input
                type="number"
                placeholder={t("area_placeholder")}
                value={formData.minArea}
                onChange={(e) =>
                  setFormData({ ...formData, minArea: e.target.value })
                }
              />
            </div>
            <div>
              <Label>{t("max_area")}</Label>
              <Input
                type="number"
                placeholder={t("area_placeholder")}
                value={formData.maxArea}
                onChange={(e) =>
                  setFormData({ ...formData, maxArea: e.target.value })
                }
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>{t("description_label")}</Label>
            <Textarea
              placeholder={t("description_placeholder")}
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
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.propertyType}
              className="flex-1 bg-main-green text-white"
            >
              {isSubmitting ? t("submitting") : t("submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestPropertyDialog;
