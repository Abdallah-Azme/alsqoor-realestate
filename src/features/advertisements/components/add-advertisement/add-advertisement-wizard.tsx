"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

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

// Types
import {
  AdvertisementStep,
  CreateAdvertisementData,
} from "../../types/advertisement.types";

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

  // Form state
  const [formData, setFormData] = useState<Partial<CreateAdvertisementData>>({
    hasLicense: undefined,
    propertyType: undefined,
    adType: undefined,
    rentPeriod: undefined,
    housingType: undefined,
    city: "",
    neighborhood: "",
    area: "",
    totalPrice: "",
    pricePerMeter: "",
    usage: [],
    amenities: [],
    streetWidth: "",
    streetFacing: undefined,
    obligations: "",
    description: "",
    images: [],
    videos: [],
    contactMethods: [],
    licenseNumber: "",
    advertiserId: "",
    advertiserIdType: "",
    wantsBrokerContract: false,
  });

  // Update form field
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Navigation
  const goToStep = (step: AdvertisementStep) => {
    setCurrentStep(step);
  };

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

  // Submit form
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call
      console.log("Submitting advertisement:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to success or my ads page
      router.push("/profile");
    } catch (error) {
      console.error("Failed to submit advertisement:", error);
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
              propertyType: formData.propertyType,
              adType: formData.adType,
              rentPeriod: formData.rentPeriod,
              housingType: formData.housingType,
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
              city: formData.city,
              neighborhood: formData.neighborhood,
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
              area: formData.area,
              totalPrice: formData.totalPrice,
              pricePerMeter: formData.pricePerMeter,
              usage: formData.usage,
              amenities: formData.amenities,
              streetWidth: formData.streetWidth,
              streetFacing: formData.streetFacing,
              obligations: formData.obligations,
              description: formData.description,
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
              licenseNumber: formData.licenseNumber,
              advertiserId: formData.advertiserId,
              advertiserIdType: formData.advertiserIdType,
              wantsBrokerContract: formData.wantsBrokerContract,
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
