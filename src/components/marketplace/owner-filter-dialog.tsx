"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type OwnerFilterOption =
  | "all"
  | "unread"
  | "read"
  | "active"
  | "waiting_owner"
  | "pending";

interface OwnerFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilter: OwnerFilterOption;
  onFilterChange: (filter: OwnerFilterOption) => void;
}

const OwnerFilterDialog = ({
  open,
  onOpenChange,
  currentFilter,
  onFilterChange,
}: OwnerFilterDialogProps) => {
  const t = useTranslations("marketplace.owner_filter_dialog");
  const [selectedFilter, setSelectedFilter] =
    useState<OwnerFilterOption>(currentFilter);

  const filterOptions: { value: OwnerFilterOption; label: string }[] = [
    { value: "all", label: t("all_requests") },
    { value: "unread", label: t("unread") },
    { value: "read", label: t("read") },
    { value: "active", label: t("active_requests") },
    { value: "waiting_owner", label: t("waiting_owner") },
    { value: "pending", label: t("pending") },
  ];

  const handleApply = () => {
    onFilterChange(selectedFilter);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4"
        >
          <RadioGroup
            value={selectedFilter}
            onValueChange={(value) =>
              setSelectedFilter(value as OwnerFilterOption)
            }
            className="space-y-3"
          >
            {filterOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedFilter(option.value)}
              >
                <RadioGroupItem
                  value={option.value}
                  id={`filter-${option.value}`}
                  className="text-main-green data-[state=checked]:border-main-green data-[state=checked]:text-main-green shrink-0"
                />
                <Label
                  htmlFor={`filter-${option.value}`}
                  className="cursor-pointer flex-1 text-gray-700"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </motion.div>

        <Button
          className="w-full bg-main-green hover:bg-main-green/90"
          onClick={handleApply}
        >
          {t("apply")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OwnerFilterDialog;
