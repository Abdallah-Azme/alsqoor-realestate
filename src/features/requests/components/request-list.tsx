"use client";

import { useTranslations } from "next-intl";
import { useMyRequests } from "../hooks/use-requests";
import { RequestCard } from "./request-card";
import { RequestDialog } from "./request-dialog";
import { RequestDetailsDialog } from "./request-details-dialog";
import { RequestActionDialog } from "./request-action-dialog";
import { useState, useEffect } from "react";
import { PropertyRequest } from "../types/request.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiPlus, FiAlertCircle, FiSearch, FiX } from "react-icons/fi";
import { Loader2 } from "lucide-react";

export const RequestList = () => {
  const t = useTranslations("propertyRequestsPage");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading, isError } = useMyRequests({
    search: debouncedSearch || undefined,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const [selectedRequest, setSelectedRequest] =
    useState<PropertyRequest | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isActionDialogOpen, setActionDialogOpen] = useState(false);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const requests = data?.data?.data || [];

  if (isLoading && !debouncedSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-main-green animate-spin mb-4" />
        <p className="text-gray-500">
          {t("messages.loading") || "جاري تحميل الطلبات..."}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 text-red-600 p-8 rounded-xl text-center">
        <FiAlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>{t("messages.error_fetch") || "حدث خطأ أثناء تحميل الطلبات"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-main-navy">
            {t("title") || "طلباتي العقارية"}
          </h2>
          <p className="text-sm text-gray-500">
            {t("subtitle", { count: requests.length }) ||
              `لديك ${requests.length} طلبات`}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t("fields.search") || "بحث في الطلبات..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 pl-10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-main-green hover:bg-main-green/90 text-white gap-2"
          >
            <FiPlus />
            <span className="hidden sm:inline">
              {t("actions.create") || "إضافة طلب"}
            </span>
          </Button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t("no_requests_title") || "لا توجد طلبات بعد"}
          </h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            {t("no_requests_desc") ||
              "بادر بإضافة طلبك العقاري الأول الآن وسيسعى شركاؤنا لتوفير أفضل العروض لك."}
          </p>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-main-green hover:bg-main-green/90 text-white"
          >
            {t("actions.create_first") || "إضافة طلبك الأول"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onEdit={(req) => {
                setSelectedRequest(req);
                setEditDialogOpen(true);
              }}
              onView={(req) => {
                setSelectedRequest(req);
                setDetailsDialogOpen(true);
              }}
              onAction={(req) => {
                setSelectedRequest(req);
                setActionDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <RequestDialog
        open={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        request={null}
      />

      <RequestDialog
        open={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        request={selectedRequest}
      />

      <RequestDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        request={selectedRequest}
      />

      <RequestActionDialog
        open={isActionDialogOpen}
        onOpenChange={setActionDialogOpen}
        request={selectedRequest}
      />
    </div>
  );
};
