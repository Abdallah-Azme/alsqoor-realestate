"use client";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import React, { useContext, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useLocale, useTranslations } from "next-intl";
import { FaLocationArrow, FaPlus } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddDealForm from "@/components/deals/add-deal-form";
import DealsTable from "@/components/shared/deals-table";
import { getDirectDeals } from "@/actions/deals";
import { toast } from "sonner";
import { UserContext } from "@/context/user-context";

const Page = () => {
  const { user } = useContext(UserContext);
  const locale = useLocale();
  const t = useTranslations("deals_page");
  const tNav = useTranslations("Navbar"); // or breadcrumbs
  const [open, setOpen] = React.useState(false);
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [meta, setMeta] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const tabstyle =
    "bg-gray-100 p-4 data-[state=active]:bg-main-light-green data-[state=active]:border-b data-[state=active]:border-main-green rounde-none rounded-s-lg last:rounded-none last:rounded-s-lg  ";

  useEffect(() => {
    fetchDeals();
  }, [currentPage]);

  async function fetchDeals(page = currentPage) {
    setIsLoading(true);
    try {
      const result = await getDirectDeals(page);

      if (result.success) {
        setDeals(result.data || []);
        setMeta(result.meta);
        setTotalPages(result.meta?.lastPage || 1);
        setCurrentPage(result.meta?.currentPage || 1);
      } else {
        console.error("API Error Response:", result);
        toast.error(result.message || t("error_fetch"));
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
      toast.error(t("error_generic"));
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (deal) => {
    setSelectedDeal(deal);
    setOpen(true);
  };

  const handleAddNew = () => {
    setSelectedDeal(null);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedDeal(null);
  };

  return (
    <main className="space-y-6">
      <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
        <CustomBreadcrumbs items={[{ label: t("title") }]} />
        <h1 className="text-main-navy text-2xl font-bold">{t("title")}</h1>
      </div>
      <div className="container border border-gray-300 p-10">
        <Tabs dir={locale === "ar" ? "rtl" : "ltr"} defaultValue="houre">
          <div className="flex justify-between items-center">
            {/* search */}
            {/* <div className="relative">
              <MdOutlineLocationOn className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="جميع المناطق"
                className={
                  "!h-10 placeholder:text-xs rounded-none rounded-s-lg"
                }
              />
            </div> */}
            {/* tabs */}
            {/* <TabsList className="bg-transparent !h-auto flex items-center gap-1">
              <TabsTrigger value="houre" className={tabstyle}>
                ساعة
              </TabsTrigger>
              <TabsTrigger value="day" className={tabstyle}>
                يوم
              </TabsTrigger>
              <TabsTrigger value="week" className={tabstyle}>
                اسبوع
              </TabsTrigger>
              <TabsTrigger value="month" className={tabstyle}>
                شهر
              </TabsTrigger>
              <TabsTrigger value="year" className={tabstyle}>
                سنة
              </TabsTrigger>
            </TabsList> */}
            {/* add */}
            {user && (
              <>
                <button
                  onClick={handleAddNew}
                  className="text-main-green px-4 ms-auto py-2 rounded flex items-center gap-2 border border-main-green text-sm hover:bg-main-green hover:text-white transition-all duration-300"
                >
                  <FaPlus />
                  {t("add_deal")}
                </button>

                <Dialog open={open} onOpenChange={handleCloseDialog}>
                  <DialogContent className="lg:w-[80%]">
                    <DialogHeader className="">
                      <DialogTitle className="text-center text-xl font-bold">
                        {selectedDeal ? t("edit_deal") : t("new_deal")}
                      </DialogTitle>
                      <DialogDescription asChild className="">
                        <AddDealForm
                          setOpen={handleCloseDialog}
                          onSuccess={fetchDeals}
                          deal={selectedDeal}
                        />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
          {["houre", "day", "week", "month", "year"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <DealsTable
                deals={deals}
                isLoading={isLoading}
                onEdit={handleEdit}
              />

              {/* Pagination */}
              {!isLoading && deals.length > 0 && meta && (
                <div className="flex items-center justify-between mt-6 px-4">
                  <div className="text-sm text-gray-600">
                    {t("page_info", {
                      page: currentPage,
                      totalPages: totalPages,
                      total: meta.total,
                    })}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      {t("previous")}
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      {t("next")}
                    </button>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
};

export default Page;
