"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

// Step components
import StepIntro from "./step-intro";
import StepLicense from "./step-license";
import StepPropertyType from "./step-property-type";
import StepLocation from "./step-location";
import StepDetails from "./step-details";
import StepMedia from "./step-media";
import StepContact from "./step-contact";
import StepAuthority from "./step-authority";
import StepPreview from "./step-preview";

// Types & Service
import {
  AdvertisementStep,
  CreateAdvertisementData,
} from "../../types/advertisement.types";
import { propertiesService } from "@/features/properties/services/properties.service";

// Steps order based on UX review
const STEPS: AdvertisementStep[] = [
  "intro",
  "license",
  "property_type",
  "location",
  "details",
  "media",
  "contact",
  "authority",
  "preview",
];

const AddAdvertisementWizard = () => {
  const t = useTranslations("advertisements.wizard");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<AdvertisementStep>("intro");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state — aligned with POST /properties/add API fields
  const [formData, setFormData] = useState<Partial<CreateAdvertisementData>>({
    // License (UI only)
    hasLicense: undefined,

    // Property type & category
    category_id: "",
    operation_type: undefined,
    property_use: undefined,

    // Location
    country_id: "",
    city_id: "",
    district: "",
    latitude: "",
    longitude: "",

    // Details
    title: "",
    description: "",
    area: "",
    usable_area: "",
    rooms: "",
    bathrooms: "",
    balconies: "",
    garages: "",
    finishing_type: undefined,
    property_age: "",
    facade: undefined,
    price_min: "",
    price_max: "",
    price_per_meter: "",
    price_hidden: false,
    amenity_ids: [],
    services: [],
    obligations: "",

    // Media
    images: [],
    videos: [],

    // Contact (UI only)
    contactMethods: [],

    // Authority / Legal
    license_number: "",
    license_expiry_date: "",
    qr_code: undefined,
    plan_number: "",
    plot_number: "",
    area_name: "",
    has_mortgage: false,
    has_restriction: false,
    guarantees: "",
    marketing_option: "none",
    is_featured: false,
  });

  // Update form field
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Navigation
  const goNext = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]);
    }
  };

  const goBack = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    }
  };

  // Submit form — pass data to propertiesService.addProperty which
  // internally uses propertyToFormData to build the FormData correctly
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Build the payload — exclude UI-only fields
      const { hasLicense, contactMethods, ...apiData } = formData;

      await propertiesService.addProperty(apiData as any);

      toast.success(t("submit_success"));
      router.push("/profile");
    } catch (error: any) {
      console.error("Failed to submit advertisement:", error);
      const message =
        error?.response?.data?.message || error?.message || t("submit_error");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current step index for progress (excluding intro)
  const currentStepIndex = STEPS.indexOf(currentStep);
  const progressPercent = (currentStepIndex / (STEPS.length - 1)) * 100;

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case "intro":
        return <StepIntro onNext={goNext} />;

      case "license":
        return (
          <StepLicense
            value={formData.hasLicense ?? null}
            onChange={(hasLicense) => updateField("hasLicense", hasLicense)}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case "property_type":
        return (
          <StepPropertyType
            values={{
              category_id: formData.category_id,
              operation_type: formData.operation_type,
              property_use: formData.property_use,
            }}
            onChange={updateField}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case "location":
        return (
          <StepLocation
            values={{
              country_id: formData.country_id,
              city_id: formData.city_id,
              district: formData.district,
            }}
            onChange={updateField}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case "details":
        return (
          <StepDetails
            values={{
              title: formData.title,
              description: formData.description,
              area: formData.area,
              usable_area: formData.usable_area,
              rooms: formData.rooms,
              bathrooms: formData.bathrooms,
              balconies: formData.balconies,
              garages: formData.garages,
              finishing_type: formData.finishing_type,
              property_age: formData.property_age,
              facade: formData.facade,
              price_min: formData.price_min,
              price_max: formData.price_max,
              price_per_meter: formData.price_per_meter,
              price_hidden: formData.price_hidden,
              amenity_ids: formData.amenity_ids,
              services: formData.services,
              obligations: formData.obligations,
            }}
            onChange={updateField}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case "media":
        return (
          <StepMedia
            values={{
              images: formData.images,
              videos: formData.videos,
            }}
            onChange={updateField}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case "contact":
        return (
          <StepContact
            values={{
              contactMethods: formData.contactMethods,
            }}
            onChange={updateField}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case "authority":
        return (
          <StepAuthority
            values={{
              hasLicense: formData.hasLicense,
              license_number: formData.license_number,
              license_expiry_date: formData.license_expiry_date,
              qr_code: formData.qr_code,
              plan_number: formData.plan_number,
              plot_number: formData.plot_number,
              area_name: formData.area_name,
              has_mortgage: formData.has_mortgage,
              has_restriction: formData.has_restriction,
              guarantees: formData.guarantees,
              marketing_option: formData.marketing_option,
              is_featured: formData.is_featured,
            }}
            onChange={updateField}
            onNext={goNext}
            onBack={goBack}
          />
        );

      case "preview":
        return (
          <StepPreview
            values={formData}
            onSubmit={handleSubmit}
            onBack={goBack}
            isSubmitting={isSubmitting}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with progress */}
      {currentStep !== "intro" && (
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="container py-4">
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-semibold text-main-navy">
                {t("header.title")}
              </h1>
              <span className="text-sm text-gray-500">
                {t("header.step", {
                  current: currentStepIndex,
                  total: STEPS.length - 1,
                })}
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-main-green"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container max-w-2xl mx-auto">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
    </div>
  );
};

export default AddAdvertisementWizard;
