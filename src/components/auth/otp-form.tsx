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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useLocale, useTranslations } from "next-intl";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { setToken } from "@/services";
import { useRouter } from "@/i18n/navigation";
import { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";

export function OtpForm() {
  const locale = useLocale();
  const t = useTranslations("otp");
  const tv = useTranslations("otp.validation");
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile");
  const code = searchParams.get("code");
  const router = useRouter();
  const { setUser } = useContext(UserContext);
  const [resendLoading, setResendLoading] = useState(false);

  const formSchema = z.object({
    otp: z.string().length(4, {
      message: tv("code_length"),
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: code,
    },
  });

  const { isSubmitting } = form.formState;
  async function onSubmit(values: any) {
    try {
      const data = {
        mobile: mobile,
        verification_code: values.otp,
      };

      const res = await api.post<any>("/verification", data);
      const user = res?.data?.user;
      const isBroker = user?.role === "agent" || user?.role === "developer";

      if (isBroker) {
        toast.success(t("under_review"));
      } else {
        toast.success(res?.message || t("success"));
      }

      setToken(res?.data?.accessToken);
      setUser(user);
      router.push("/");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
    form.reset();
  }

  async function resendOtp() {
    setResendLoading(true);
    try {
      const data = { mobile: mobile };
      const res = await api.post<any>("/resend-verification", data);
      toast.success(res?.message);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
    setResendLoading(false);
  }

  return (
    <div className="lg:p-20 p-8 border border-main-gray rounded-lg flex max-lg:flex-col items-start gap-8 w-full">
      <Form {...form}>
        <form
          dir={locale === "ar" ? "rtl" : "ltr"}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <p className="text-xs font-bold">
            {t("code_sent_to")}{" "}
            <span className="font-bold text-main-green" dir="ltr">
              {mobile}
            </span>
          </p>
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <div>
                    <FormLabel className="text-xs font-bold mb-2">
                      {t("enter_code")}
                    </FormLabel>
                    <InputOTP
                      maxLength={4}
                      {...field}
                      className="justify-center"
                      dir="ltr"
                    >
                      <InputOTPGroup className="gap-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="h-14 w-14 text-lg border border-gray-300 rounded-s-lg first:rounded-none first:rounded-s-lg "
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage className="text-xs mt-2" />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-1 text-sm font-semibold">
            <p>{t("not_received")}</p>
            <button
              disabled={resendLoading}
              onClick={resendOtp}
              type="button"
              className="text-main-green cursor-pointer font-bold"
            >
              {resendLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                t("resend")
              )}
            </button>
          </div>

          <div className="w-full flex items-center  mt-8">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="rounded-none h-12 bg-main-green text-white lg:py-4 lg:!px-8 p-3 rounded-tr-2xl max-lg:text-xs font-semibold flex items-center gap-2 w-fit"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FaLongArrowAltRight size={20} />
              )}
              <p>{t("verify_button")}</p>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default OtpForm;
