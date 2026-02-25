"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface Currency {
  id: number;
  code: string;
  name: string;
}

const CurrencySelector = () => {
  const t = useTranslations("currencies");
  const tCommon = useTranslations("common");

  const CURRENCIES: Currency[] = [
    { id: 1, code: "SAR", name: t("sar") },
    { id: 2, code: "USD", name: t("usd") },
    { id: 3, code: "EUR", name: t("eur") },
    { id: 4, code: "GBP", name: t("gbp") },
    { id: 5, code: "AED", name: t("aed") },
    { id: 6, code: "EGP", name: t("egp") },
    { id: 7, code: "KWD", name: t("kwd") },
    { id: 8, code: "QAR", name: t("qar") },
    { id: 9, code: "BHD", name: t("bhd") },
    { id: 10, code: "OMR", name: t("omr") },
  ];

  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>(
    CURRENCIES[0].code,
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get saved currency from localStorage
    const savedCurrencyCode = localStorage.getItem("selectedCurrency");
    if (savedCurrencyCode) {
      if (CURRENCIES.some((c) => c.code === savedCurrencyCode)) {
        setSelectedCurrencyCode(savedCurrencyCode);
      } else {
        // Fallback to SAR if saved code is invalid
        setSelectedCurrencyCode("SAR");
        localStorage.setItem("selectedCurrency", "SAR");
      }
    } else {
      // Default to SAR if nothing is saved
      setSelectedCurrencyCode("SAR");
      localStorage.setItem("selectedCurrency", "SAR");
    }
  }, []);

  const handleSelect = (currency: Currency) => {
    setSelectedCurrencyCode(currency.code);
    localStorage.setItem("selectedCurrency", currency.code);
    setIsOpen(false);
  };

  const selectedCurrency =
    CURRENCIES.find((c) => c.code === selectedCurrencyCode) || CURRENCIES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white text-sm hover:text-main-green transition-colors px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20"
      >
        <span>{selectedCurrency.code}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute top-full mt-2 lg:end-0 start-0 z-50 min-w-[200px] bg-white rounded-lg shadow-xl border border-gray-100 py-2 max-h-[300px] overflow-y-auto">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b mb-1">
              {tCommon("select_currency")}
            </div>
            {CURRENCIES.map((currency) => (
              <button
                key={currency.id}
                onClick={() => handleSelect(currency)}
                className={`w-full text-start px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                  selectedCurrency.code === currency.code
                    ? "bg-main-green/10 text-main-green font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-start">
                  <span>{currency.name}</span>
                  <span className="text-xs text-gray-400">{currency.code}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencySelector;
