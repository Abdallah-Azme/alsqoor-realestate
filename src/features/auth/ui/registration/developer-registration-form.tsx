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
import { createDeveloperRegistrationSchema } from "../../schemas/registration.schemas";
import { useRegistration } from "../../hooks/use-registration";
import { CommonFields } from "./common-fields";
import type { DeveloperRegistrationFormData } from "../../schemas/registration.schemas";
import { FileUploader } from "@/components/shared/file-uploader";

export function DeveloperRegistrationForm() {
  const locale = useLocale();
  const t = useTranslations("sign_up");
  const { mutate: register, isPending } = useRegistration();

  const form = useForm<DeveloperRegistrationFormData>({
    resolver: zodResolver(createDeveloperRegistrationSchema(t)),
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
      fal_number: "",
      fal_expiry_date: "",
      has_fal_license: undefined,
      has_ad_license: undefined,
    },
  });

  const inputStyle =
    "w-full !h-14 rounded-none rounded-s-lg border-gray-200 focus:border-main-green bg-transparent";

  function onSubmit(values: DeveloperRegistrationFormData) {
    register(values);
  }

  return (
    <Form {...form}>
      <form
        dir={locale === "ar" ? "rtl" : "ltr"}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full"
      >
        <div className="space-y-6 w-full">
          <CommonFields form={form} t={t} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Company Name */}
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

            {/* Commercial Register */}
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

            {/* WhatsApp */}
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
                      inputClassName={`${inputStyle} w-full !border-gray-200 focus:!border-main-green !bg-transparent`}
                      className={`${inputStyle} w-full`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Backup Mobile */}
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
                      inputClassName={`${inputStyle} w-full !border-gray-200 focus:!border-main-green !bg-transparent`}
                      className={`${inputStyle} w-full`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Has FAL License */}
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

            {/* Has AD License */}
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

            {/* FAL License Details — shown when has_fal_license === "1" */}
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

                <FormField
                  control={form.control}
                  name="fal_license_document"
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>{t("fal_license_image")}</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={value ? [value] : []}
                          onChange={(files) => {
                            onChange(files.length > 0 ? files[0] : undefined);
                          }}
                          accept="image/*"
                          maxFiles={1}
                          label=""
                          helperText="Click or drag file here"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Company Logo — full width */}
            <FormField
              control={form.control}
              name="company_logo"
              render={({ field: { value, onChange } }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t("company_logo")}</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={value ? [value] : []}
                      onChange={(files) => {
                        onChange(files.length > 0 ? files[0] : undefined);
                      }}
                      accept="image/*"
                      maxFiles={1}
                      label=""
                      helperText="Click or drag file here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full flex items-center justify-between">
            <Button
              disabled={isPending}
              type="submit"
              className="h-14 bg-main-green hover:bg-main-green/90 text-white px-10 rounded-xl md:rounded-tr-3xl md:rounded-bl-3xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-main-green/20 font-bold text-lg"
            >
              <p>{t("submit_button")}</p>
              {isPending ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <FaLongArrowAltRight size={22} className="rotate-180" />
              )}
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
