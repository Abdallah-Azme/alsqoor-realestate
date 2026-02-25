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
import { FiSearch, FiStar, FiCheck, FiMapPin } from "react-icons/fi";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrokerSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (brokerId: string) => void;
}

// Mock brokers data
const MOCK_BROKERS = [
  {
    id: "1",
    name: "أحمد محمد الصالح",
    avatar: "/images/avatar-placeholder.svg",
    rating: 4.8,
    reviewsCount: 156,
    city: "الرياض",
    specialization: "فلل وشقق سكنية",
    phone: "+966 50 123 4567",
    propertiesCount: 45,
    verified: true,
  },
  {
    id: "2",
    name: "محمد عبدالله العتيبي",
    avatar: "/images/avatar-placeholder.svg",
    rating: 4.5,
    reviewsCount: 89,
    city: "جدة",
    specialization: "أراضي تجارية",
    phone: "+966 55 987 6543",
    propertiesCount: 32,
    verified: true,
  },
  {
    id: "3",
    name: "خالد سعود الدوسري",
    avatar: "/images/avatar-placeholder.svg",
    rating: 4.9,
    reviewsCount: 210,
    city: "الرياض",
    specialization: "مشاريع عقارية",
    phone: "+966 56 456 7890",
    propertiesCount: 78,
    verified: true,
  },
  {
    id: "4",
    name: "عبدالرحمن ناصر القحطاني",
    avatar: "/images/avatar-placeholder.svg",
    rating: 4.3,
    reviewsCount: 45,
    city: "الدمام",
    specialization: "إيجارات",
    phone: "+966 54 321 0987",
    propertiesCount: 23,
    verified: false,
  },
];

const BrokerSelectorDialog = ({
  open,
  onOpenChange,
  onSelect,
}: BrokerSelectorDialogProps) => {
  const t = useTranslations("advertisements.broker_selector");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);

  const filteredBrokers = MOCK_BROKERS.filter(
    (broker) =>
      broker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broker.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broker.specialization.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConfirm = () => {
    if (selectedBrokerId) {
      onSelect(selectedBrokerId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="text-start">
          <DialogTitle className="text-lg font-bold">{t("title")}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Input
            placeholder={t("search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-10"
          />
          <FiSearch className="absolute start-3 top-3 text-gray-400" />
        </div>

        {/* Brokers List */}
        <div className="flex-1 overflow-y-auto space-y-3 py-4">
          {filteredBrokers.map((broker) => (
            <motion.div
              key={broker.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedBrokerId(broker.id)}
              className={cn(
                "p-4 rounded-xl border-2 cursor-pointer transition-all",
                selectedBrokerId === broker.id
                  ? "border-main-green bg-main-green/5"
                  : "border-gray-200 hover:border-gray-300",
              )}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 relative">
                    <Image
                      src={broker.avatar}
                      alt={broker.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {broker.verified && (
                    <div className="absolute -bottom-1 -end-1 w-5 h-5 bg-main-green rounded-full flex items-center justify-center">
                      <FiCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-gray-900">{broker.name}</h3>
                    {selectedBrokerId === broker.id && (
                      <div className="w-6 h-6 rounded-full bg-main-green flex items-center justify-center">
                        <FiCheck className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mb-2">
                    {broker.specialization}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    {/* Rating */}
                    <div className="flex items-center gap-1 text-amber-500">
                      <FiStar className="fill-current" />
                      <span className="font-medium">{broker.rating}</span>
                      <span className="text-gray-400">
                        ({broker.reviewsCount})
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-500">
                      <FiMapPin className="w-4 h-4" />
                      <span>{broker.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                    <span>
                      {broker.propertiesCount} {t("properties")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredBrokers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {t("no_brokers")}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedBrokerId}
            className="flex-1 bg-main-green text-white"
          >
            {t("confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BrokerSelectorDialog;
