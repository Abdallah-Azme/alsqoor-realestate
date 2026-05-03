"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale, useTranslations } from "next-intl";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createSeekerRegistrationSchema } from "../../schemas/registration.schemas";
import { useRegistration } from "../../hooks/use-registration";
import { CommonFields } from "./common-fields";
import type { SeekerRegistrationFormData } from "../../schemas/registration.schemas";

export function SeekerRegistrationForm() {
  const locale = useLocale();
  const t = useTranslations("sign_up");
  const { mutate: register, isPending } = useRegistration();

  const form = useForm<SeekerRegistrationFormData>({
    resolver: zodResolver(createSeekerRegistrationSchema(t)),
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
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full"
      >
        <div className="space-y-6 w-full">
          <CommonFields form={form} t={t} />

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
