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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BsSearch } from "react-icons/bs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const FormSchema = z.object({
  operationType: z.string().optional(),
  rooms: z.string().optional(),
  type: z.string().optional(),
  finish: z.string().optional(),
});

export default function FilterForm() {
  const t = useTranslations("estates_filter");
  const [operationType, setOperationType] = useState("sale");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      operationType: "sale",
      rooms: "",
      type: "",
      finish: "",
    },
  });

  const onSubmit = (values) => {
    // Build query parameters
    const params = new URLSearchParams();

    // Add operation type (sale/rent)
    params.set("operation_type", operationType);

    // Add number of rooms
    if (values.rooms) {
      params.set("rooms", values.rooms);
    }

    // Map type to category (matching estates filter logic)
    if (values.type) {
      const categoryMap = {
        villa: "فيلا",
        apartment: "شقة",
        land: "برج",
      };
      params.set("category", categoryMap[values.type] || values.type);
    }

    // Add finishing type
    if (values.finish) {
      params.set("finishing_type", values.finish);
    }

    // Navigate to estates page with search params
    router.push(`/estats?${params.toString()}`);
  };

  return (
    <div className="w-full self-end">
      <div className="flex items-center cursor-pointer ">
        <button
          onClick={() => setOperationType("sale")}
          className={`h-12 bg-[#F5F5F5] text-[#A6A6A6]  px-6 ${
            operationType === "sale" && "text-main-green bg-[#FEFEFF]"
          }`}
        >
          {t("operations.sale")}
        </button>
        <button
          onClick={() => setOperationType("rent")}
          className={`h-12 bg-[#F5F5F5] text-[#A6A6A6]  px-6 ${
            operationType === "rent" && "text-main-green bg-[#FEFEFF]"
          }`}
        >
          {t("operations.rent")}
        </button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-[#FEFEFF] p-6 flex items-center justify-between rounded-lg rounded-tr-none max-md:flex-wrap max-md:gap-4"
        >
          {/* نوع العقار */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className={"max-md:w-1/2"}>
                <FormLabel>{t("property_type")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0">
                      <SelectValue
                        placeholder={t("property_type")}
                        className="text-main-navy"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="apartment">
                      {t("types.apartment")}
                    </SelectItem>
                    <SelectItem value="villa">{t("types.villa")}</SelectItem>
                    <SelectItem value="land">{t("types.land")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* عدد الغرف */}
          <FormField
            control={form.control}
            name="rooms"
            render={({ field }) => (
              <FormItem className={"max-md:w-1/2"}>
                <FormLabel>{t("rooms")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0">
                      <SelectValue
                        placeholder={t("rooms")}
                        className="text-main-navy"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((item) => (
                      <SelectItem key={item} value={item.toString()}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* نوع التشطيب */}
          <FormField
            control={form.control}
            name="finish"
            render={({ field }) => (
              <FormItem className={"max-md:w-1/2"}>
                <FormLabel>{t("finishing_type")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-none shadow-none focus-visible:ring-0 p-0">
                      <SelectValue
                        placeholder={t("finishing_type")}
                        className="text-main-navy"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="luxury">
                      {t("finishes.luxury")}
                    </SelectItem>
                    <SelectItem value="good">
                      {t("finishes.average")}
                    </SelectItem>
                    <SelectItem value="basic">
                      {t("finishes.simple")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={
              "bg-main-green text-white font-bold rounded-s-lg rounded-e-none  md:h-14 h-10  flex items-center gap-2 hover:gap-3 transition-all duration-500 hover:bg-main-green max-md:mx-auto"
            }
          >
            <BsSearch size={20} /> {t("search")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
