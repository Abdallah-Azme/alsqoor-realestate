"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaCrown } from "react-icons/fa";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe?: () => void;
}

const SubscriptionDialog = ({
  open,
  onOpenChange,
  onSubscribe,
}: SubscriptionDialogProps) => {
  const t = useTranslations("marketplace.subscription_dialog");

  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe();
    }
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center py-6 space-y-4"
        >
          {/* Crown Icon */}
          <div className="w-20 h-20 bg-main-green/10 rounded-full flex items-center justify-center">
            <FaCrown className="text-4xl text-main-green" />
          </div>

          {/* Main Message */}
          <h3 className="text-lg font-semibold text-gray-900 text-center">
            {t("subscribers_only")}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 text-center max-w-xs">
            {t("description")}
          </p>
        </motion.div>

        {/* Subscribe Button */}
        <Button
          className="w-full bg-main-green hover:bg-main-green/90 text-white font-semibold py-6"
          onClick={handleSubscribe}
        >
          {t("subscribe_now")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
