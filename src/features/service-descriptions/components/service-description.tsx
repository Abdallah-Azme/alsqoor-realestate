"use client";

import React from "react";
import { useServiceDescription } from "../hooks/use-service-descriptions";
import { ServiceType } from "../types";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface ServiceDescriptionProps {
  type: ServiceType;
  /** When true, loading matches a small outline trigger (for headers/toolbars). */
  compact?: boolean;
}

export const ServiceDescription = ({
  type,
  compact = false,
}: ServiceDescriptionProps) => {
  const { description, isLoading, isError } = useServiceDescription(type);
  const t = useTranslations("marketplace");

  if (isLoading && compact) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        aria-busy="true"
        aria-label={t("service_description")}
        className="pointer-events-none gap-2 rounded-lg border-main-green/30 text-transparent animate-pulse"
      >
        <span className="size-4 shrink-0 rounded bg-muted" />
        <span className="h-4 w-24 shrink-0 rounded bg-muted" />
      </Button>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (isError || !description) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-main-green text-main-green hover:bg-main-green hover:text-white transition-all duration-300 rounded-lg h-9"
        >
          <Info className="h-4 w-4" />
          <span>{t("service_description")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-main-navy mb-4">
            {t("service_description")}
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="blog-content"
        >
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
