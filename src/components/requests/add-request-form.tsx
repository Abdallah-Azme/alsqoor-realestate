"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useState } from "react";

interface AddRequestFormProps {
  setOpen: (open: boolean) => void;
}

const AddRequestForm = ({ setOpen }: AddRequestFormProps) => {
  const t = useTranslations("propertyRequestsPage");
  const tVal = useTranslations("validations");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    title: z.string().min(5, tVal("required")),
    type: z.string().min(1, tVal("required")),
    operationType: z.string().min(1, tVal("required")),
    city: z.string().min(1, tVal("required")),
    neighborhoods: z.string().optional(),
    minArea: z.string().optional(),
    maxArea: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    description: z.string().optional(),
    isSerious: z.boolean().optional(),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      operationType: "sale",
      city: "",
      neighborhoods: "",
      minArea: "",
      maxArea: "",
      minPrice: "",
      maxPrice: "",
      description: "",
      isSerious: false,
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create request
      console.log("Form values:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(t("form.success"));
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error(t("form.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="">{t("form.title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form.title_placeholder")} {...field} />
              </FormControl>
              <FormMessage className="" />
            </FormItem>
          )}
        />

        {/* Type and Operation Type row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">{t("form.property_type")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="">
                      <SelectValue placeholder={t("form.select_type")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="villa">
                      {t("types.villa_sale")}
                    </SelectItem>
                    <SelectItem value="apartment">
                      {t("types.apartment_sale")}
                    </SelectItem>
                    <SelectItem value="land">{t("types.land_sale")}</SelectItem>
                    <SelectItem value="floor">
                      {t("types.floor_sale")}
                    </SelectItem>
                    <SelectItem value="shop">{t("types.shop_sale")}</SelectItem>
                    <SelectItem value="warehouse">
                      {t("types.warehouse_sale")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="operationType"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">{t("form.operation_type")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="">
                      <SelectValue placeholder={t("form.select_operation")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sale">{t("operations.sale")}</SelectItem>
                    <SelectItem value="rent">{t("operations.rent")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="" />
              </FormItem>
            )}
          />
        </div>

        {/* City and Neighborhoods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">{t("form.city")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("form.city_placeholder")} {...field} />
                </FormControl>
                <FormMessage className="" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="neighborhoods"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">{t("form.neighborhoods")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.neighborhoods_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="" />
              </FormItem>
            )}
          />
        </div>

        {/* Area range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minArea"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">{t("form.min_area")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("form.min_area_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxArea"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">{t("form.max_area")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("form.max_area_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="" />
              </FormItem>
            )}
          />
        </div>

        {/* Price range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minPrice"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">{t("form.min_price")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("form.min_price_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxPrice"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">{t("form.max_price")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("form.max_price_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="" />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="">{t("form.description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("form.description_placeholder")}
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage className="" />
            </FormItem>
          )}
        />

        {/* Serious request toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isSerious"
            checked={form.watch("isSerious") || false}
            onChange={(e) => form.setValue("isSerious", e.target.checked)}
            className="w-4 h-4 accent-main-green"
          />
          <label htmlFor="isSerious" className="text-sm cursor-pointer">
            {t("form.is_serious")}
          </label>
        </div>

        {/* Submit buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            {t("form.cancel")}
          </Button>
          <Button
            type="submit"
            className="bg-main-green hover:bg-main-green/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("form.submitting") : t("form.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddRequestForm;
