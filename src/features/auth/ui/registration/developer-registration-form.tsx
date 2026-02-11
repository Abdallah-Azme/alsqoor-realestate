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
import { developerRegistrationSchema } from "../../schemas/registration.schemas";
import { useRegistration } from "../../hooks/use-registration";
import { CommonFields } from "./common-fields";
import type { DeveloperRegistrationFormData } from "../../schemas/registration.schemas";

export function DeveloperRegistrationForm() {
  const locale = useLocale();
  const t = useTranslations("sign_up");
  const { mutate: register, isPending } = useRegistration();

  const form = useForm<DeveloperRegistrationFormData>({
    resolver: zodResolver(developerRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      password_confirmation: "",
      role: "developer",
      type: "developer",
      terms_accepted: "1",
      company_name: "",
      commercial_register: "",
      whatsapp: "",
      backup_mobile: "",
    },
  });

  const inputStyle = "!h-14 rounded-none rounded-s-lg";

  function onSubmit(values: DeveloperRegistrationFormData) {
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

          {/* Developer-specific fields */}
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("company_name")}</FormLabel>
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
            name="company_logo"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>{t("company_logo")}</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                    }}
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
            name="commercial_register"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("commercial_register")}</FormLabel>
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
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("whatsapp")}</FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    defaultCountry="sa"
                    withFlagShown
                    withFullNumber
                    inputClassName={`${inputStyle} w-full`}
                    containerClassName={`${inputStyle} w-full`}
                    inputComponent={Input}
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
                    withFlagShown
                    withFullNumber
                    inputClassName={`${inputStyle} w-full`}
                    containerClassName={`${inputStyle} w-full`}
                    inputComponent={Input}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-between">
            <Button
              disabled={isPending}
              type="submit"
              className="rounded-none h-12 bg-main-green text-white lg:py-4 lg:!px-8 p-3 rounded-tr-2xl max-lg:text-xs font-semibold flex items-center gap-2 w-fit"
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
