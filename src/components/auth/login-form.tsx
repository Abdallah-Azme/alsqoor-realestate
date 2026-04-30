"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
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
import { useContext, useState } from "react";
import { FaLongArrowAltRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { Link, useRouter } from "@/i18n/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { api, ApiError } from "@/lib/api-client";
import { setToken, saveRefreshToken } from "@/services";
import { UserContext } from "@/context/user-context";
import { Loader2, User, Home, UserCheck, Building2 } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const locale = useLocale();
  const t = useTranslations("login");
  const tSignUp = useTranslations("sign_up");
  const tv = useTranslations("login.validation");
  const [showPassword, setShowPassword] = useState(false);
  const ROLE_TABS = [
    { id: "seeker", label: "seeker", apiRole: "seeker", icon: <User size={18} /> },
    { id: "owner", label: "owner", apiRole: "owner", icon: <Home size={18} /> },
    { id: "broker", label: "broker", apiRole: "agent", icon: <UserCheck size={18} /> },
    { id: "developer", label: "developer", apiRole: "developer", icon: <Building2 size={18} /> },
  ] as const;

  const [mainTab, setMainTab] = useState<"platform" | "nafath">("platform");
  const [activeTab, setActiveTab] = useState<(typeof ROLE_TABS)[number]["id"]>(
    "seeker",
  );
  const inputStyle = "!h-14 rounded-none rounded-s-lg";
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const formSchema = z.object({
    mobile: z.string().min(10, {
      message: tv("phone_min"),
    }),
    password: z.string().min(8, {
      message: tv("password_min"),
    }),
  });

  const nafathSchema = z.object({
    idNumber: z.string().length(10, {
      message: tv("id_number_length"),
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: "",
      password: "",
    },
  });

  const nafathForm = useForm({
    resolver: zodResolver(nafathSchema),
    defaultValues: {
      idNumber: "",
    },
  });

  const { isSubmitting } = form.formState;
  const isNafathSubmitting = nafathForm.formState.isSubmitting;

  async function onNafathSubmit(values: any) {
    try {
      toast.info(t("nafath_redirecting"));
      // Implementation for Nafath redirect or API call
    } catch (error: any) {
      toast.error(t("nafath_error"));
    }
  }

  async function onSubmit(values: any) {
    try {
      const selectedTab = ROLE_TABS.find((tab) => tab.id === activeTab);
      const role = selectedTab?.apiRole || "seeker";
      const payload = { ...values, role };

      // API client unwraps response.data, so res = { accessToken, user, ... }
      const res = await api.post<any>("/login", payload);

      // Handle business logic status (e.g. account under review)
      if (res?.status === false) {
        toast.error(res?.message || tv("error"));
        return;
      }

      // Show success message
      toast.success(t("login_success"));

      // Store the access token
      const token = res?.accessToken || res?.token;
      if (token) {
        setToken(token);
        localStorage.setItem("token", token);

        // Store the refresh token (30-day lifetime)
        const refreshToken = res?.refreshToken;
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
          saveRefreshToken(refreshToken); // httpOnly server cookie
        }

        // Store user data
        if (res?.user) {
          setUser(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
        }
        router.push(`/`);
      } else {
        console.error("Token missing in response", res);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.message || tv("error"));
    }
  }

  const activeStyle =
    "bg-white text-main-green border-none shadow-xl scale-105 z-10";

  return (
    <>
      {/* Top Level Tabs: Platform vs Nafath */}
      <div className="flex items-center gap-4 md:gap-8 mb-6 md:mb-8 border-b border-gray-100 pb-2 md:pb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setMainTab("platform")}
          className={`text-sm md:text-xl font-bold transition-all duration-300 relative pb-2 whitespace-nowrap ${
            mainTab === "platform" 
              ? "text-main-navy" 
              : "text-gray-300 hover:text-gray-400"
          }`}
        >
          {t("submit_button")} {t("nafath_platform")}
          {mainTab === "platform" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-main-green rounded-full animate-in fade-in slide-in-from-bottom-1" />
          )}
        </button>
        <button
          onClick={() => setMainTab("nafath")}
          className={`text-sm md:text-xl font-bold transition-all duration-300 relative pb-2 whitespace-nowrap ${
            mainTab === "nafath" 
              ? "text-main-navy" 
              : "text-gray-300 hover:text-gray-400"
          }`}
        >
          {t("nafath_login")}
          {mainTab === "nafath" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-main-green rounded-full animate-in fade-in slide-in-from-bottom-1" />
          )}
        </button>
      </div>

      {mainTab === "platform" ? (
        <>
          {/* Decorative User/Agent Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
            {ROLE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-3 md:px-4 md:py-4 rounded-xl text-[10px] md:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 ${
                  activeTab === tab.id
                    ? activeStyle
                    : "bg-main-light-gray text-gray-400 hover:bg-gray-200"
                }`}
              >
                <span className="scale-75 md:scale-100">{tab.icon}</span>
                {tSignUp(tab.label)}
              </button>
            ))}
          </div>

          <div className="lg:p-12 p-6 bg-white/95 backdrop-blur-md border border-white/20 rounded-[30px] md:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
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
                        <div className="relative">
                          <PhoneInput
                            {...field}
                            defaultCountry="sa"
                            inputClassName={`${inputStyle} w-full !border-gray-200 focus:!border-main-green !bg-transparent`}
                            className={`${inputStyle} w-full`}
                          />
                          <FiPhoneCall className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="">{t("password")}</FormLabel>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("password_placeholder")}
                          {...field}
                          className={`${inputStyle} pr-10 border-gray-200 focus:border-main-green bg-transparent`}
                        />
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

                <div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-gray-400 underline text-sm hover:text-main-green"
                  >
                    {t("forgot_password")}
                  </Link>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full md:w-auto h-14 bg-main-green hover:bg-main-green/90 text-white px-10 rounded-xl md:rounded-tr-3xl md:rounded-bl-3xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-main-green/20 order-1 md:order-1"
                  >
                    <p className="font-bold text-lg">{t("submit_button")}</p>
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FaLongArrowAltRight size={22} className="rotate-180" />
                    )}
                  </Button>
                  <div className="text-main-navy text-xs md:text-sm flex flex-wrap items-center justify-center gap-1.5 order-2 md:order-2">
                    <p className="opacity-70">{t("no_account")}</p>
                    <Link
                      href={"/auth/sign-up"}
                      className="text-main-green font-bold hover:underline whitespace-nowrap"
                    >
                      {t("create_account")}
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </>
      ) : (
        <div className="lg:p-12 p-6 bg-white/95 backdrop-blur-md border border-white/20 rounded-[30px] md:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-left-4 duration-500">
           <div className="flex flex-col items-center text-center gap-6 mb-8">
              {/* <div className="bg-main-green/10 p-4 rounded-full">
                 <Image src="/images/logo.svg" alt="Nafath" width={60} height={60} className="grayscale" />
              </div> */}
              <div className="space-y-2">
                 <h2 className="text-2xl font-bold text-main-navy">{t("nafath_login")}</h2>
                 <p className="text-gray-500">{t("nafath_description")}</p>
              </div>
           </div>

           <Form {...nafathForm}>
              <form onSubmit={nafathForm.handleSubmit(onNafathSubmit)} className="space-y-8">
                 <FormField
                    control={nafathForm.control}
                    name="idNumber"
                    render={({ field }) => (
                       <FormItem>
                          <FormLabel className="text-lg">{t("id_number_label")}</FormLabel>
                          <FormControl>
                             <Input 
                                {...field} 
                                placeholder="1XXXXXXXXX"
                                className="h-16 text-2xl tracking-[0.2em] text-center border-gray-200 focus:border-main-green rounded-2xl bg-transparent"
                                maxLength={10}
                             />
                          </FormControl>
                          <FormMessage />
                       </FormItem>
                    )}
                 />

                 <Button
                    disabled={isNafathSubmitting}
                    type="submit"
                    className="w-full h-16 bg-main-green hover:bg-main-green/90 text-white rounded-2xl text-xl font-bold transition-all duration-300 shadow-xl shadow-main-green/20"
                 >
                    {isNafathSubmitting ? <Loader2 className="animate-spin" /> : t("nafath_login")}
                 </Button>

                 <button 
                    onClick={() => setMainTab("platform")}
                    className="w-full text-gray-400 hover:text-main-green transition-colors text-sm underline"
                 >
                    {t("back_to_traditional")}
                 </button>
              </form>
           </Form>
        </div>
      )}
    </>
  );
}

export default LoginForm;
