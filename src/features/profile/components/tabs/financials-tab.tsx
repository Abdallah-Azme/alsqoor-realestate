import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDirection } from "@/hooks/use-direction";
import { ArrowDown, ArrowUp, FileText } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";

import { useTransactions } from "../../hooks/use-profile";

const FinancialsTab = () => {
  const t = useTranslations("Profile");
  const locale = useLocale();
  const [date, setDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const { data: response, isLoading } = useTransactions(page);
  const transactions = response?.data || [];

  return (
    <div className="space-y-6">
      {/* Filters Section
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700 block">
              {t("transfer_type")}
            </label>
            <Select>
              <SelectTrigger className="w-full bg-white border-gray-200">
                <SelectValue placeholder={t("transfer_type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("transfer_type")}</SelectItem>
                <SelectItem value="bank">{t("bank_visa")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700 block">
              {t("date")}
            </label>
            <input
              type="date"
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      */}

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-end">
            <thead className="bg-gray-50/50 text-gray-900 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">{t("amount")}</th>
                <th className="px-6 py-4">{t("currency_label")}</th>
                <th className="px-6 py-4">{t("invoice")}</th>
                <th className="px-6 py-4">{t("transfer_type")}</th>
                <th className="px-6 py-4">{t("operation")}</th>
                <th className="px-6 py-4">{t("date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    {t("loading", { fallback: "Loading..." })}
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    {t("no_data", { fallback: "No transactions found" })}
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const amount = tx.package?.price || "0";
                  const isIncoming = false; // Based on context, subscription payments are outgoing
                  const transferTypeStr = tx.paymentMethod
                    ? locale === "ar"
                      ? tx.paymentMethod.paymentMethodAr
                      : tx.paymentMethod.paymentMethodEn
                    : "-";
                  const currencyStr = t("currency");

                  // Format dates
                  const d = new Date(tx.createdAt);
                  const txDate = d.toLocaleDateString(
                    locale === "ar" ? "ar-EG" : "en-US",
                    { day: "2-digit", month: "short", year: "numeric" },
                  );
                  const txTime = d.toLocaleTimeString(
                    locale === "ar" ? "ar-EG" : "en-US",
                    { hour: "2-digit", minute: "2-digit" },
                  );

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-bold">
                          <span
                            className={
                              isIncoming ? "text-green-500" : "text-red-500"
                            }
                          >
                            ${amount}
                          </span>
                          {isIncoming ? (
                            <ArrowUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {currencyStr}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 cursor-pointer hover:bg-red-100 transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {transferTypeStr}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {tx.description || tx.operation}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs text-center">
                          <span className="font-medium text-gray-900">
                            {txDate}
                          </span>
                          <span className="text-gray-500">{txTime}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialsTab;
