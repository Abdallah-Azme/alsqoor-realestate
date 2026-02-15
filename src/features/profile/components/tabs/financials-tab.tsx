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
import { useTranslations } from "next-intl";
import { useState } from "react";

// Static data based on the screenshot
const transactions = [
  {
    id: 1,
    date: "10 Jun 2024",
    time: "08:45",
    operation: "add_property",
    transferType: "bank_visa",
    invoice: true,
    currency: "sar", // Assuming 'ريال' translates to SAR based on context or just use translated label
    amount: "898",
    isIncoming: false, // Red arrow down
  },
  {
    id: 2,
    date: "10 Jun 2024",
    time: "08:45",
    operation: "ad_funding",
    transferType: "bank_visa",
    invoice: true,
    currency: "sar",
    amount: "898",
    isIncoming: false,
  },
  {
    id: 3,
    date: "10 Jun 2024",
    time: "08:45",
    operation: "add_property",
    transferType: "bank_visa",
    invoice: true,
    currency: "sar",
    amount: "898",
    isIncoming: true, // Green arrow up
  },
  {
    id: 4,
    date: "10 Jun 2024",
    time: "08:45",
    operation: "ad_funding",
    transferType: "bank_visa",
    invoice: true,
    currency: "sar",
    amount: "898",
    isIncoming: false,
  },
  {
    id: 5,
    date: "10 Jun 2024",
    time: "08:45",
    operation: "ad_funding",
    transferType: "bank_visa",
    invoice: true,
    currency: "sar",
    amount: "898",
    isIncoming: true,
  },
  {
    id: 6,
    date: "10 Jun 2024",
    time: "08:45",
    operation: "add_property",
    transferType: "bank_visa",
    invoice: true,
    currency: "sar",
    amount: "898",
    isIncoming: false,
  },
];

const FinancialsTab = () => {
  const t = useTranslations("Profile");
  const [date, setDate] = useState<string>("");

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        {/* explicit dir attribute ensures RTL behavior for flex interactions */}
        <div className="flex flex-wrap gap-4">
          {/* Transfer Type Select */}
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

          {/* Date Picker */}
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
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-bold">
                      <span
                        className={
                          tx.isIncoming ? "text-green-500" : "text-red-500"
                        }
                      >
                        ${tx.amount}
                      </span>
                      {tx.isIncoming ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {tx.currency === "sar" ? t("currency") : tx.currency}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 cursor-pointer hover:bg-red-100 transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {t(tx.transferType)}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {t(tx.operation)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs text-center">
                      <span className="font-medium text-gray-900">
                        {tx.date}
                      </span>
                      <span className="text-gray-500">{tx.time}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialsTab;
