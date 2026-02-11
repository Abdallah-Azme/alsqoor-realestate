"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Country {
  id: number;
  name: string;
}

const CountrySelector = () => {
  const locale = useLocale();
  const t = useTranslations("common");
  const [countries, setCountries] = useState<Country[]>([]);
  // Store ID instead of name to handle localization updates
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${API_URL}/countries`, {
          headers: {
            "Accept-Language": locale,
            Accept: "application/json",
          },
        });
        const data = await res.json();
        if (data.success) {
          setCountries(data.data);

          const savedCountryId = localStorage.getItem("selectedCountryId");

          if (savedCountryId) {
            // Verify if the saved ID still exists in the list
            const exists = data.data.find(
              (c: Country) => c.id === Number(savedCountryId),
            );
            if (exists) {
              setSelectedCountryId(Number(savedCountryId));
              return;
            }
          }

          if (data.data.length > 0) {
            // Default to KSA if no valid saved selection
            const ksa = data.data.find(
              (c: Country) =>
                c.name.includes("Saudi") ||
                c.name.includes("السعودية") ||
                c.name === "Saudi Arabia" ||
                c.name === "المملكة العربية السعودية",
            );

            const defaultCountry = ksa ? ksa : data.data[0];
            setSelectedCountryId(defaultCountry.id);
            localStorage.setItem(
              "selectedCountryId",
              String(defaultCountry.id),
            );
          }
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };

    fetchCountries();
  }, [locale]);

  const handleSelect = (country: Country) => {
    setSelectedCountryId(country.id);
    localStorage.setItem("selectedCountryId", String(country.id));
    setIsOpen(false);
  };

  const selectedCountry = countries.find((c) => c.id === selectedCountryId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white text-sm hover:text-main-green transition-colors px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20"
      >
        <Globe className="w-4 h-4" />
        <span className="max-w-[100px] truncate">
          {selectedCountry?.name || t("select_country")}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute top-full mt-2 lg:end-0 start-0 z-50 min-w-[180px] bg-white rounded-lg shadow-xl border border-gray-100 py-2 max-h-[300px] overflow-y-auto">
            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => handleSelect(country)}
                className={`w-full text-start px-4 py-2 text-sm transition-colors ${
                  selectedCountryId === country.id
                    ? "bg-main-green/10 text-main-green font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {country.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CountrySelector;
