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
import { api, ApiError } from "@/lib/api-client";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function NewPasswordForm() {
  const locale = useLocale();
  const t = useTranslations("new-password");
  const tv = useTranslations("new-password.validation");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputStyle = "!h-14 rounded-none rounded-s-lg";
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const formSchema = z
    .object({
      password: z.string().min(8, {
        message: tv("password_min"),
      }),
      password_confirmation: z.string().min(8, {
        message: tv("confirm_password"),
      }),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: tv("passwords_not_match"),
      path: ["password_confirmation"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const { isSubmitting } = form.formState;
  async function onSubmit(values: any) {
    try {
      const data = {
        ...values,
        token,
      };
      const res = await api.post<any>("/reset-password", data);

      // The API returns { status: true, message: "...", data: [] }
      // api-client unwraps 'data', so res becomes [] (empty array).
      // The 'message' property is lost.
      // We will show a success message from translations.
      toast.success(t("success_message"));
      router.push("/auth/login");
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
          className="space-y-6 w-full"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">{t("password")}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder={t("password")}
                      type={showPassword ? "text" : "password"}
                      className={`${inputStyle} pr-10 border-gray-200 focus:border-main-green bg-transparent`}
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-main-green"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">{t("confirm_password")}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder={t("confirm_password")}
                      type={showConfirmPassword ? "text" : "password"}
                      className={`${inputStyle} pr-10 border-gray-200 focus:border-main-green bg-transparent`}
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-main-green"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>
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

export default NewPasswordForm;
