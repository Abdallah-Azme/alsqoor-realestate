"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { FaLongArrowAltRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useRouter } from "@/i18n/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { api, ApiError } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ForgetForm() {
  const locale = useLocale();
  const t = useTranslations("forget-password");
  const tv = useTranslations("forget-password.validation");

  const router = useRouter();
  const inputStyle = "!h-14 rounded-none rounded-s-lg";

  const formSchema = z.object({
    mobile: z.string().min(10, {
      message: tv("phone_min"),
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: any) {
    try {
      const res = await api.post<any>("/forgot-password", values);
      // Note: api-client unwraps the 'data' property if it exists.
      // So 'res' is effectively the 'data' object { reset_code: "..." }.
      // 'message' might be lost due to unwrapping, so we fallback or use a static success message if undefined.
      toast.success(res?.message || t("otp_sent_success"));

      const resetCode = res?.reset_code;

      if (resetCode) {
        const encodedCode = encodeURIComponent(resetCode);
        const encodedMobile = encodeURIComponent(values.mobile);
        router.push(
          `/auth/reset-code?code=${encodedCode}&mobile=${encodedMobile}`,
        );
      } else {
        // Fallback if structure is unexpected (e.g. if api-client didn't unwrap as expected)
        // But based on user input, it's inside 'data', so api-client unwraps it.
        console.error("Reset code not found in response", res);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message || t("validation.error"));
      } else {
        toast.error(t("validation.error"));
      }
    }
  }

  return (
    <div className="lg:p-10 p-8 border border-main-gray rounded-lg flex max-lg:flex-col items-start gap-8 w-full">
      <Form {...form}>
        <form
          dir={locale === "ar" ? "rtl" : "ltr"}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full "
        >
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">{t("phone_number")}</FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    defaultCountry="sa"
                    inputClassName={`${inputStyle} w-full`}
                    className={`${inputStyle} w-full`}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <div className="w-full flex items-center justify-between">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="rounded-none h-12 bg-main-green text-white lg:py-4 lg:px-8! p-3 rounded-tr-2xl max-lg:text-xs font-semibold flex items-center gap-2 w-fit"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FaLongArrowAltRight size={20} />
              )}
              <p>{t("submit_button")}</p>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ForgetForm;
