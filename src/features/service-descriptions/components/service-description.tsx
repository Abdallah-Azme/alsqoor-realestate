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
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface ServiceDescriptionProps {
  type: ServiceType;
}

export const ServiceDescription = ({ type }: ServiceDescriptionProps) => {
  const { description, isLoading, isError } = useServiceDescription(type);

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
          <span>شرح الخدمة</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-main-navy mb-4">
            شرح الخدمة
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
