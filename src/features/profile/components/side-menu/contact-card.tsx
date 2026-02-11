"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSave,
  FaUser,
} from "react-icons/fa";
import { User } from "@/types";
import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface ContactCardProps {
  user: User;
  isSubmitting?: boolean;
  isEditing?: boolean;
  onEditToggle?: () => void;
}

const ContactCard = ({
  user,
  isSubmitting = false,
  isEditing = false,
  onEditToggle,
}: ContactCardProps) => {
  const t = useTranslations("Profile");
  const { control } = useFormContext();

  // Helper to render display contact row - icon on END (right in LTR, left in RTL)
  const ContactRow = ({
    icon: Icon,
    value,
    prefix,
  }: {
    icon: any;
    value?: string;
    prefix?: React.ReactNode;
  }) => {
    const displayValue = value || "---";

    return (
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:border-main-green/50 transition-all group">
        <div className="flex items-center gap-2 flex-1">
          {prefix}
          <span
            className="text-sm font-medium text-main-navy truncate"
            dir="ltr"
          >
            {displayValue}
          </span>
        </div>
        <div className="text-gray-400 group-hover:text-main-green transition-colors">
          <Icon size={16} />
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-sm border-gray-100 rounded-xl overflow-hidden">
      <CardContent className="p-6 space-y-4 bg-white">
        <h3 className="font-bold text-lg text-main-navy text-start">
          {t("personal_data")}
        </h3>

        {isEditing ? (
          <div className="space-y-4">
            {/* Name */}
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="w-full">
                    <div className="relative">
                      <Input
                        placeholder={t("name_placeholder")}
                        className="h-12 bg-gray-50 border-gray-200 focus:border-main-green rounded-lg text-end pe-10"
                        {...field}
                      />
                      <FaUser
                        className="absolute end-3 top-3.5 text-gray-400"
                        size={16}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-end" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="w-full">
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder={t("email_placeholder")}
                        className="h-12 bg-gray-50 border-gray-200 focus:border-main-green rounded-lg text-end pe-10"
                        {...field}
                      />
                      <FaEnvelope
                        className="absolute end-3 top-3.5 text-gray-400"
                        size={16}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-end" />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="w-full">
                    <div dir="ltr">
                      <PhoneInput
                        defaultCountry="sa"
                        value={field.value}
                        onChange={(phone) => field.onChange(phone)}
                        inputClassName="!h-12 !w-full !bg-gray-50 !border-gray-200 !focus:border-main-green !rounded-lg !text-sm"
                        countrySelectorStyleProps={{
                          buttonClassName:
                            "!h-12 !bg-gray-50 !border-gray-200 !rounded-s-lg",
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-end" />
                </FormItem>
              )}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <ContactRow icon={FaEnvelope} value={user.email} />
            <ContactRow
              icon={FaPhone}
              value={user.phone || user.mobile}
              prefix={
                <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                  <span className="text-[10px]">🇸🇦</span>
                  <span dir="ltr">+966</span>
                </span>
              }
            />
            <ContactRow
              icon={FaMapMarkerAlt}
              value={user.address || t("saudi_arabia")}
            />
          </div>
        )}

        <div className="pt-2">
          {isEditing ? (
            <div className="flex gap-3">
              <Button
                type="submit"
                form="profile-form"
                className="flex-1 bg-main-green hover:bg-main-green/90 text-white font-bold h-12 gap-2 rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <FaSave size={16} />
                )}
                {t("save_data")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="px-6 h-12 border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50 font-bold rounded-lg"
                onClick={onEditToggle}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              className="w-full bg-main-green hover:bg-main-green/90 text-white font-bold h-12 gap-2 rounded-lg"
              onClick={onEditToggle}
            >
              <FaSave size={16} />
              {t("save_data")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
