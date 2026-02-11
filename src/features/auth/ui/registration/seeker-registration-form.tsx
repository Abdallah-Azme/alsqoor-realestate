"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale, useTranslations } from "next-intl";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { seekerRegistrationSchema } from "../../schemas/registration.schemas";
import { useRegistration } from "../../hooks/use-registration";
import { CommonFields } from "./common-fields";
import type { SeekerRegistrationFormData } from "../../schemas/registration.schemas";

export function SeekerRegistrationForm() {
  const locale = useLocale();
  const t = useTranslations("sign_up");
  const { mutate: register, isPending } = useRegistration();

  const form = useForm<SeekerRegistrationFormData>({
    resolver: zodResolver(seekerRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      password_confirmation: "",
      role: "seeker",
      terms_accepted: "1",
    },
  });

  function onSubmit(values: SeekerRegistrationFormData) {
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
