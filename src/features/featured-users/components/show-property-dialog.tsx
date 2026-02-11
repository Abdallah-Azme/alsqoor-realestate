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
import { FiCheck, FiUpload, FiX } from "react-icons/fi";
import Image from "next/image";

interface ShowPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  agentName: string;
}

const ShowPropertyDialog = ({
  open,
  onOpenChange,
  agentId,
  agentName,
}: ShowPropertyDialogProps) => {
  const t = useTranslations("agent_profile.show_dialog");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    operationType: "",
    city: "",
    neighborhood: "",
    area: "",
    price: "",
    description: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages([...images, ...Array.from(files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Submit to API
      console.log("Showing property to agent:", {
        agentId,
        ...formData,
        images,
      });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setImages([]);
    setFormData({
      title: "",
      propertyType: "",
      operationType: "",
      city: "",
      neighborhood: "",
      area: "",
      price: "",
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
          {/* Title */}
          <div>
            <Label>{t("property_title")}</Label>
            <Input
              placeholder={t("title_placeholder")}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Property Type & Operation */}
          <div className="grid grid-cols-2 gap-4">
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
                  <SelectItem value="building">
                    {t("types.building")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label>{t("neighborhood")}</Label>
              <Input
                placeholder={t("neighborhood_placeholder")}
                value={formData.neighborhood}
                onChange={(e) =>
                  setFormData({ ...formData, neighborhood: e.target.value })
                }
              />
            </div>
          </div>

          {/* Area & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("area")}</Label>
              <Input
                type="number"
                placeholder={t("area_placeholder")}
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
              />
            </div>
            <div>
              <Label>{t("price")}</Label>
              <Input
                type="number"
                placeholder={t("price_placeholder")}
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <Label>{t("images")}</Label>
            <div className="mt-2">
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-main-green transition-colors">
                <FiUpload className="text-gray-400" />
                <span className="text-gray-500">{t("upload_images")}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            {images.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {images.map((image, index) => (
                  <div key={index} className="relative w-16 h-16">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -end-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              disabled={
                isSubmitting || !formData.title || !formData.propertyType
              }
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

export default ShowPropertyDialog;
