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
import { useRouter } from "@/i18n/navigation";
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
    <div className="lg:p-12 p-6 bg-white/95 backdrop-blur-md border border-white/20 rounded-[30px] md:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full">
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
                    inputClassName={`${inputStyle} w-full !border-gray-200 focus:!border-main-green !bg-transparent`}
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
              className="h-14 bg-main-green hover:bg-main-green/90 text-white px-10 rounded-xl md:rounded-tr-3xl md:rounded-bl-3xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-main-green/20 font-bold text-lg"
            >
              <p>{t("submit_button")}</p>
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FaLongArrowAltRight size={22} className="rotate-180" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ForgetForm;
