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

export type SortOption =
  | "default"
  | "newest"
  | "highest_commission"
  | "lowest_commission"
  | "highest_price"
  | "lowest_price"
  | "largest_area"
  | "smallest_area";

interface SortDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortDialog = ({
  open,
  onOpenChange,
  currentSort,
  onSortChange,
}: SortDialogProps) => {
  const t = useTranslations("marketplace.sort_dialog");
  const [selectedSort, setSelectedSort] = useState<SortOption>(currentSort);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "default", label: t("default") },
    { value: "newest", label: t("newest") },
    { value: "highest_commission", label: t("highest_commission") },
    { value: "lowest_commission", label: t("lowest_commission") },
    { value: "highest_price", label: t("highest_price") },
    { value: "lowest_price", label: t("lowest_price") },
    { value: "largest_area", label: t("largest_area") },
    { value: "smallest_area", label: t("smallest_area") },
  ];

  const handleApply = () => {
    onSortChange(selectedSort);
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
            value={selectedSort}
            onValueChange={(value) => setSelectedSort(value as SortOption)}
            className="space-y-3"
          >
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className="flex   items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedSort(option.value)}
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="text-main-green data-[state=checked]:border-main-green data-[state=checked]:text-main-green shrink-0"
                />
                <Label
                  htmlFor={option.value}
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

export default SortDialog;
