"use client";

import { FaCheck } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const t = useTranslations("sign_up.password_requirements");

  const requirements = [
    {
      text: t("min_length"),
      test: (pwd: string) => pwd.length >= 8,
    },
    {
      text: t("has_number"),
      test: (pwd: string) => /\d/.test(pwd),
    },
    {
      text: t("has_special"),
      test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
    {
      text: t("has_uppercase"),
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
  ];

  return (
    <div className="w-full mt-2 space-y-2">
      <div className="space-y-1">
        {requirements.map((req, index) => {
          const isMet = password ? req.test(password) : false;
          return (
            <div key={index} className="flex items-center gap-1">
              <FaCheck
                size={10}
                className={isMet ? "text-main-green" : "text-gray-500"}
              />
              <span
                className={`text-xs ${
                  isMet ? "text-main-green" : "text-gray-500"
                }`}
              >
                {req.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
