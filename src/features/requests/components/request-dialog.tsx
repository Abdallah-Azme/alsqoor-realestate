"use client";

import { useTranslations, useLocale } from "next-intl";
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
import { cn } from "@/lib/utils";

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
  const locale = useLocale();
  const isRtl = locale === "ar";
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
      country_id: 2, // HIDDEN: always Saudi Arabia
      city_id: 1,
      district: "",
      is_urgent: "0",
    },
  }) as any;

  // HIDDEN: Country is always Saudi Arabia (country_id = 2)
  const SAUDI_ARABIA_ID = 2;
  const { data: citiesData, isLoading: loadingCities } =
    useCities(SAUDI_ARABIA_ID);

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
        country_id: 2, // HIDDEN: always Saudi Arabia
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
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader className={cn(isRtl ? "text-right" : "text-left")}>
          <DialogTitle>
            {isEditing
              ? t("edit_request")
              : t("create_request")}
          </DialogTitle>
          <DialogDescription>
            {t("dialog_desc")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="request_type"
                render={({ field }) => (
                  <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                    <FormLabel>
                      {t("fields.request_type")}
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger dir={isRtl ? "rtl" : "ltr"}>
                          <SelectValue placeholder={t("fields.select_type")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                        <SelectItem value="buy">
                          {t("types.buy")}
                        </SelectItem>
                        <SelectItem value="rent">
                          {t("types.rent")}
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
                  <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                    <FormLabel>
                      {t("fields.payment_method")}
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger dir={isRtl ? "rtl" : "ltr"}>
                          <SelectValue
                            placeholder={t("fields.select_payment")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                        <SelectItem value="cash">
                          {t("payment.cash")}
                        </SelectItem>
                        <SelectItem value="finance">
                          {t("payment.finance")}
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
                  <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                    <FormLabel>{t("fields.area")}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="200" 
                        {...field} 
                        className={cn(isRtl ? "text-right" : "text-left")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="property_age"
                render={({ field }) => (
                  <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                    <FormLabel>
                      {t("fields.property_age")}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="5" 
                        {...field} 
                        className={cn(isRtl ? "text-right" : "text-left")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city_id"
                render={({ field }) => (
                  <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                    <FormLabel>{t("fields.city")}</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : undefined}
                      disabled={loadingCities}
                    >
                      <FormControl>
                        <SelectTrigger dir={isRtl ? "rtl" : "ltr"}>
                          <SelectValue placeholder={t("fields.select_city")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent dir={isRtl ? "rtl" : "ltr"}>
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
                <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                  <FormLabel>{t("fields.district")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("fields.district_placeholder")}
                      {...field}
                      className={cn(isRtl ? "text-right" : "text-left")}
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
                  <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                    <FormLabel>
                      {t("fields.budget_type")}
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger dir={isRtl ? "rtl" : "ltr"}>
                          <SelectValue
                            placeholder={t("fields.select_budget_type")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                        <SelectItem value="market_price">
                          {t("budget.market_price")}
                        </SelectItem>
                        <SelectItem value="specific_budget">
                          {t("budget.specific")}
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
                    <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                      <FormLabel>
                        {t("fields.budget_amount")}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="500000" 
                          {...field} 
                          className={cn(isRtl ? "text-right" : "text-left")}
                        />
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
                  <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                    <FormLabel>{t("fields.whatsapp")}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0500000000" 
                        {...field} 
                        className={cn(isRtl ? "text-right" : "text-left")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telegram"
                render={({ field }) => (
                  <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                    <FormLabel>{t("fields.telegram")}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="@username" 
                        {...field} 
                        className={cn(isRtl ? "text-right" : "text-left")}
                      />
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
                <FormItem className={cn("flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm", isRtl ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn("space-y-0.5", isRtl ? "text-right" : "text-left")}>
                    <FormLabel>{t("fields.is_urgent")}</FormLabel>
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
                <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                  <FormLabel>{t("fields.details")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("fields.details_placeholder")}
                      {...field}
                      className={cn(isRtl ? "text-right" : "text-left")}
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
                <FormItem className={cn(isRtl ? "text-right" : "text-left")}>
                  <FormLabel>{t("fields.offer")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("fields.offer_placeholder")}
                      {...field}
                      className={cn(isRtl ? "text-right" : "text-left")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={cn("flex gap-3 pt-2", isRtl ? "flex-row-reverse" : "flex-row")}>
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
                {isPending && <Loader2 className={cn("h-4 w-4 animate-spin", isRtl ? "ml-2" : "me-2")} />}
                {isEditing
                  ? tProfile("save_data")
                  : t("actions.create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
