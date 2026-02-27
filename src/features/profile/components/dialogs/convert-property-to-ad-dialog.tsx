"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { FileUploader } from "@/components/shared/file-uploader";
import { useConvertToAdvertisement } from "@/features/properties/hooks/use-properties";
import { Property } from "@/features/properties/types/property.types";

const formSchema = z.object({
  license_number: z.string().min(1, { message: "License number is required" }),
  license_expiry_date: z
    .string()
    .min(1, { message: "License expiry date is required" }),
  qr_code: z
    .any()
    .refine((files) => files && files.length > 0, "QR code is required"),
  marketing_option: z.enum(["none", "advertising", "agent"]),
  is_featured: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ConvertPropertyToAdDialogProps {
  property: Property;
  trigger?: React.ReactNode;
}

export const ConvertPropertyToAdDialog = ({
  property,
  trigger,
}: ConvertPropertyToAdDialogProps) => {
  const t = useTranslations("Profile");
  const [open, setOpen] = useState(false);
  const convertMutation = useConvertToAdvertisement();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      license_number: property.license_number || "",
      license_expiry_date: property.license_expiry_date
        ? property.license_expiry_date.substring(0, 10)
        : "",
      marketing_option: "advertising",
      is_featured: false,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const submitData = {
        ...values,
        qr_code: values.qr_code?.[0],
        category_id: property.category?.id || 1,
        operation_type: property.operation_type || "sale",
        // Pass existing property fields to satisfy API if needed
        usable_area: property.usable_area,
        bathrooms: property.bathrooms,
        balconies: property.balconies,
        garages: property.garages,
        finishing_type: property.finishing_type,
        property_use: property.property_use,
        facade: property.facade,
        property_age: property.property_age,
        services: property.services,
        plan_number: property.plan_number,
        plot_number: property.plot_number,
        area_name: property.area_name,
        has_mortgage: property.has_mortgage,
        has_restriction: property.has_restriction,
        guarantees: property.guarantees,
        price_per_meter: property.price_per_meter,
        amenity_ids: property.amenities?.map((a: any) =>
          typeof a === "object" ? a.id : a,
        ),
      };

      await convertMutation.mutateAsync({
        propertyId: property.id,
        data: submitData as any,
      });

      toast.success(t("convert_success"));
      setOpen(false);
    } catch (error: any) {
      console.error("Conversion error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-main-green text-white hover:bg-main-green/90 transition-all">
            <TrendingUp size={16} />
            {t("make_it_ad")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">{t("make_it_ad")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="license_number"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>{t("license_number")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="12345"
                      className="text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="license_expiry_date"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>{t("license_expiry")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="text-right" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="qr_code"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>{t("qr_code")}</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onChange={field.onChange}
                      accept="image/*"
                      maxFiles={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketing_option"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>{t("marketing_option")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-right">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">
                        {t("marketing_none")}
                      </SelectItem>
                      <SelectItem value="advertising">
                        {t("marketing_advertising")}
                      </SelectItem>
                      <SelectItem value="agent">
                        {t("marketing_agent")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-main-green text-white"
              disabled={convertMutation.isPending}
            >
              {convertMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("make_it_ad")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
