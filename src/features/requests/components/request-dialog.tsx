"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getRequestSchema, RequestFormData } from "../schemas/request.schema";
import { useCreateRequest, useUpdateRequest } from "../hooks/use-requests";
import { PropertyRequest } from "../types/request.types";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  useCountries,
  useCities,
} from "@/features/properties/hooks/use-properties";

interface RequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request?: PropertyRequest | null;
}

export const RequestDialog = ({
  open,
  onOpenChange,
  request,
}: RequestDialogProps) => {
  const t = useTranslations("propertyRequestsPage");
  const tProfile = useTranslations("Profile");
  const isEditing = !!request;

  const createMutation = useCreateRequest();
  const updateMutation = useUpdateRequest();

  const form = useForm<RequestFormData>({
    resolver: zodResolver(getRequestSchema(t) as any) as any,
    defaultValues: {
      request_type: "buy",
      area: "",
      property_age: "",
      payment_method: "cash",
      details: "",
      offer: "",
      budget_type: "market_price",
      budget_amount: "",
      whatsapp: "",
      telegram: "",
      country_id: 1,
      city_id: 1,
      district: "",
      is_urgent: "0",
    },
  }) as any;

  const watchCountryId = form.watch("country_id");
  const { data: countriesData, isLoading: loadingCountries } = useCountries();
  const { data: citiesData, isLoading: loadingCities } =
    useCities(watchCountryId);

  const countries = Array.isArray(countriesData)
    ? countriesData
    : (countriesData as any)?.data || [];
  const cities = Array.isArray(citiesData)
    ? citiesData
    : (citiesData as any)?.data || [];

  useEffect(() => {
    if (request && open) {
      form.reset({
        request_type: request.requestType,
        area: request.area,
        property_age: request.propertyAge,
        payment_method: request.paymentMethod,
        details: request.details,
        offer: request.offer,
        budget_type: request.budgetType,
        budget_amount: request.budgetAmount || "",
        whatsapp: request.whatsapp || "",
        telegram: request.telegram || "",
        country_id: request.country.id,
        city_id: request.city.id,
        district: request.district,
        is_urgent: request.isUrgent || "0",
      });
    } else if (!open) {
      form.reset();
    }
  }, [request, open, form]);

  const onSubmit = async (data: any) => {
    try {
      if (isEditing && request) {
        await updateMutation.mutateAsync({ id: request.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("edit_request") || "تعديل الطلب"
              : t("create_request") || "إضافة طلب جديد"}
          </DialogTitle>
          <DialogDescription>
            {t("dialog_desc") || "أدخل تفاصيل طلبك العقاري"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="request_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("fields.request_type") || "نوع الطلب"}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("fields.select_type")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buy">
                          {t("types.buy") || "شراء"}
                        </SelectItem>
                        <SelectItem value="rent">
                          {t("types.rent") || "إيجار"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("fields.payment_method") || "طريقة الدفع"}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("fields.select_payment")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">
                          {t("payment.cash") || "كاش"}
                        </SelectItem>
                        <SelectItem value="finance">
                          {t("payment.finance") || "تمويل"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.area") || "المساحة (م²)"}</FormLabel>
                    <FormControl>
                      <Input placeholder="200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="property_age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("fields.property_age") || "عمر العقار"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.country") || "الدولة"}</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : undefined}
                      disabled={loadingCountries}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("fields.select_country")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((c: any) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.city") || "المدينة"}</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : undefined}
                      disabled={loadingCities || !watchCountryId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("fields.select_city")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((c: any) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.district") || "الحي"}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("fields.district_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("fields.budget_type") || "نوع الميزانية"}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("fields.select_budget_type")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="market_price">
                          {t("budget.market_price") || "سعر السوق"}
                        </SelectItem>
                        <SelectItem value="specific_budget">
                          {t("budget.specific") || "ميزانية محددة"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("budget_type") === "specific_budget" && (
                <FormField
                  control={form.control}
                  name="budget_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("fields.budget_amount") || "المبلغ"}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="500000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.whatsapp") || "واتساب"}</FormLabel>
                    <FormControl>
                      <Input placeholder="0500000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.telegram") || "تيليجرام"}</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_urgent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{t("fields.is_urgent") || "طلب عاجل"}</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === "1"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "1" : "0")
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.details") || "التفاصيل"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("fields.details_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.offer") || "العرض"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("fields.offer_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                {tProfile("cancel")}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-main-green hover:bg-main-green/90"
                disabled={isPending}
              >
                {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {isEditing
                  ? tProfile("save_data")
                  : t("actions.create") || "إضافة الطلب"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
