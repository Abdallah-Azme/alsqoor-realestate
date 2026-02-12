"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PasswordStrength } from "./password-strength";
import { UseFormReturn } from "react-hook-form";

interface CommonFieldsProps {
  form: UseFormReturn<any>;
  t: (key: string) => string;
}

export function CommonFields({ form, t }: CommonFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");

  const inputStyle = "!h-14 rounded-none rounded-s-lg";

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="">
            <FormLabel className="">{t("full_name")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("placeholder")}
                {...field}
                className={inputStyle}
              />
            </FormControl>
            <FormMessage className="" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="">
            <FormLabel className="">{t("email")}</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder={t("placeholder")}
                {...field}
                className={inputStyle}
              />
            </FormControl>
            <FormMessage className="" />
          </FormItem>
        )}
      />

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
            <FormMessage className="" />
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
                onChange={(e) => {
                  field.onChange(e);
                  setPassword(e.target.value);
                }}
                className={`${inputStyle} pr-10`}
              />
              <button
                type="button"
                className="absolute end-3 top-1/2 -translate-y-1/2 text-main-green"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            <FormMessage className="" />
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
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("password_placeholder")}
                {...field}
                className={`${inputStyle} pr-10`}
              />
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
            <FormMessage className="" />
          </FormItem>
        )}
      />

      <PasswordStrength password={password} />
    </>
  );
}
