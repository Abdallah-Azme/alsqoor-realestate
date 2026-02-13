"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocale, useTranslations } from "next-intl";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOwnerRegistrationSchema } from "../../schemas/registration.schemas";
import { useRegistration } from "../../hooks/use-registration";
import { CommonFields } from "./common-fields";
import type { OwnerRegistrationFormData } from "../../schemas/registration.schemas";

export function OwnerRegistrationForm() {
  const locale = useLocale();
  const t = useTranslations("sign_up");
  const { mutate: register, isPending } = useRegistration();

  const form = useForm<OwnerRegistrationFormData>({
    resolver: zodResolver(createOwnerRegistrationSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      password_confirmation: "",
      role: "owner",
      terms_accepted: "1",
      whatsapp: "",
      backup_mobile: "",
      fal_number: "",
      fal_expiry_date: "",
      has_fal_license: undefined,
      has_ad_license: undefined,
    },
  });

  const inputStyle = "!h-14 rounded-none rounded-s-lg";

  function onSubmit(values: OwnerRegistrationFormData) {
    register(values);
  }

  return (
    <Form {...form}>
      <form
        dir={locale === "ar" ? "rtl" : "ltr"}
        onSubmit={form.handleSubmit(onSubmit)}
        className="lg:p-10 p-8 border border-main-gray rounded-lg w-full"
      >
        <div className="space-y-6 w-full">
          <CommonFields form={form} t={t} />

          {/* Owner-specific fields */}
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("whatsapp")}</FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    defaultCountry="sa"
                    inputClassName={`${inputStyle} w-full`}
                    className={`${inputStyle} w-full`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="backup_mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("backup_mobile")}</FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    defaultCountry="sa"
                    inputClassName={`${inputStyle} w-full`}
                    className={`${inputStyle} w-full`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_fal_license"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("has_fal_license")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className={inputStyle}>
                      <SelectValue placeholder={t("select_option")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">{t("yes")}</SelectItem>
                    <SelectItem value="0">{t("no")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("has_fal_license") === "1" && (
            <>
              <FormField
                control={form.control}
                name="fal_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fal_number")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("placeholder")}
                        {...field}
                        className={inputStyle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fal_expiry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fal_expiry_date")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className={inputStyle} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="has_ad_license"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("has_ad_license")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className={inputStyle}>
                      <SelectValue placeholder={t("select_option")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">{t("yes")}</SelectItem>
                    <SelectItem value="0">{t("no")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-between">
            <Button
              disabled={isPending}
              type="submit"
              className="rounded-none h-12 bg-main-green text-white lg:py-4 lg:px-8! p-3 rounded-tr-2xl max-lg:text-xs font-semibold flex items-center gap-2 w-fit"
            >
              {isPending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <FaLongArrowAltRight size={20} />
              )}
              <p>{t("submit_button")}</p>
            </Button>
            <div className="text-main-navy text-sm flex items-center gap-1">
              <p>{t("already_have_account")}</p>
              <Link
                href={"/auth/login"}
                className="text-main-green font-semibold hover:underline"
              >
                <p>{t("login")}</p>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
