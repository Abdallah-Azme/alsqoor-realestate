"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { useForm } from "react-hook-form";
import { BsSearch } from "react-icons/bs";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { IoLocationOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { CiMicrophoneOn } from "react-icons/ci";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";

const EstatesFilter = ({ onSubmit: onSubmitCallback }) => {
  const t = useTranslations("estates_filter");
  const tVal = useTranslations("validations");

  const FormSchema = z.object({
    operationType: z.string().optional(),
    num: z.string().optional(),
    room: z.string().optional(),
    type: z.string().optional(),
    finish: z.string().optional(),
    location: z.string().optional(),
    priceRange: z.array(z.number()).length(2).optional(),
  });

  const selectStyles =
    "border shadow-none focus-visible:ring-0 p-3 rounded-none rounded-s-lg border-gray-400 !h-12 !w-full justify-end";
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [operationType, setOperationType] = useState("sale");

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      operationType: "sale",
      num: "",
      room: "",
      type: "",
      finish: "",
      location: "",
      priceRange: [0, 10000],
    },
  });

  const onSubmit = (values) => {
    // Map form values to API parameters
    const filters: Record<string, any> = {};

    if (values.operationType) filters.operation_type = values.operationType;
    if (values.room) filters.rooms = values.room;
    if (values.type) {
      // API expects "فيلا" etc for category? Previous code had:
      // categoryMap = { فيلا: "فيلا", شقة: "شقة", اراضي: "برج" }
      // "اراضي" mapped to "برج" (Tower??) - assuming meant 'land' or just pass value.
      // Let's assume the API handles the English values OR we map back if needed.
      // Reverting to previous logic for safety but using English inputs now:
      const categoryMap = {
        villa: "فيلا",
        apartment: "شقة",
        land: "برج", // Keeping previous weird mapping for safety "اراضي" -> "برج"
      };
      filters.category = categoryMap[values.type] || values.type;
    }
    if (values.finish) {
      // Values are now 'luxury', 'good', 'basic' directly from Select
      filters.finishing_type = values.finish;
    }
    if (values.location) filters.city = values.location;
    if (values.priceRange) {
      filters.price_min = values.priceRange[0];
      filters.price_max = values.priceRange[1];
    }

    onSubmitCallback?.(filters);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid lg:grid-cols-6 md:grid-cols-2 grid-cols-1   gap-4"
      >
        {/* Operation Type */}
        <FormField
          control={form.control}
          name="operationType"
          render={({ field }) => (
            <FormItem className="">
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setOperationType(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className={selectStyles}
                    iconStyle="size-6 text-main-navy"
                  >
                    <SelectValue
                      placeholder={t("operation_type")}
                      className="text-main-navy"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="">
                  <SelectItem className="" value="sale">
                    {t("operations.sale")}
                  </SelectItem>
                  <SelectItem className="" value="rent">
                    {t("operations.rent")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="room"
          render={({ field }) => (
            <FormItem className="">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={selectStyles}
                    iconStyle="size-6 text-main-navy"
                  >
                    <SelectValue
                      placeholder={t("rooms")}
                      className="text-main-navy"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((item) => (
                    <SelectItem className="" key={item} value={item.toString()}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={selectStyles}
                    iconStyle="size-6 text-main-navy"
                  >
                    <SelectValue
                      placeholder={t("property_type")}
                      className="text-main-navy"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="">
                  <SelectItem className="" value="villa">
                    {t("types.villa")}
                  </SelectItem>
                  <SelectItem className="" value="apartment">
                    {t("types.apartment")}
                  </SelectItem>
                  <SelectItem className="" value="land">
                    {t("types.land")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="finish"
          render={({ field }) => (
            <FormItem className="">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={selectStyles}
                    iconStyle="size-6 text-main-navy"
                  >
                    <SelectValue
                      placeholder={t("finishing_type")}
                      className="text-main-navy"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="">
                  <SelectItem className="" value="luxury">
                    {t("finishes.luxury")}
                  </SelectItem>
                  <SelectItem className="" value="good">
                    {t("finishes.average")}
                  </SelectItem>
                  <SelectItem className="" value="basic">
                    {t("finishes.simple")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="">
              <div className="relative ">
                <Input
                  placeholder={t("location")}
                  className="border shadow-none focus-visible:ring-0 p-3 rounded-none rounded-s-lg border-gray-400 !h-12"
                  {...field}
                />
                <IoLocationOutline className="absolute size-4 end-3 top-1/2 -translate-y-1/2 text-gray-400 " />
              </div>
              <FormMessage className="" />
            </FormItem>
          )}
        />
        {/* buttons */}
        <div className="max-lg:order-2  bg-main-green text-white font-bold rounded-s-lg rounded-e-none  h-12 flex items-center justify-between">
          <Button
            type="submit"
            className={
              "bg-main-green  gap-2  transition-all duration-500 hover:bg-main-green "
            }
          >
            <FiSearch />
            {t("search")}
          </Button>
          <Button
            type="button"
            onClick={() => {
              form.reset();
              onSubmitCallback?.({});
            }}
            className={
              "bg-[#DC2626] hover:bg-[#B91C1C] gap-2 transition-all duration-500 !p-3 h-11 rounded-none"
            }
          >
            {t("clear")}
          </Button>
          {/* <Button
            type="submit"
            className={
              "bg-[#27A479]  gap-2 hover:gap-3 transition-all duration-500 hover:bg-[#27A479]  !p-1 h-11 rounded-none"
            }
          >
            <CiMicrophoneOn className="size-6" />
          </Button> */}
        </div>
        {/* price range slider */}
        <FormField
          control={form.control}
          name="priceRange"
          render={({ field }) => (
            <FormItem className="lg:col-span-3 md:col-span-2 col-span-1">
              <div className="bg-white border border-gray-400 rounded-s-lg p-4  flex items-center gap-4 ">
                <span className="text-gray-400">{t("price_range")}</span>
                <div className="flex-1 space-y-2 ">
                  <div className="flex items-center justify-between text-xs text-main-navy font-semibold">
                    <span>{priceRange[0].toFixed(2)} </span>
                    <span>{priceRange[1].toFixed(2)} </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={0}
                      max={10000}
                      step={100}
                      value={priceRange}
                      defaultValue={[0, 10000]}
                      onValueChange={(value) => {
                        setPriceRange(value);
                        field.onChange(value);
                      }}
                      className="w-full"
                    />
                  </FormControl>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 max-md:hidden">
                  {/* from  */}
                  <div className="bg-main-light-gray p-2 ">
                    {t("from")} <span>{priceRange[0].toFixed(2)} </span>
                  </div>
                  {/* to */}
                  <div className="bg-main-light-gray p-2 ">
                    {t("to")} <span>{priceRange[1].toFixed(2)} </span>
                  </div>
                </div>
              </div>
              <FormMessage className="" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

const EstateFilterPanel = ({ onSubmit }) => {
  const t = useTranslations("estates_filter");
  return (
    <div>
      <div className="max-lg:hidden">
        <EstatesFilter onSubmit={onSubmit} />
      </div>

      <Sheet>
        <SheetTrigger className="lg:hidden bg-main-green text-white font-bold rounded-t-xl hover:bg-main-green/95 transition-all duration-500 w-full !h-12">
          {t("customize_property")}
        </SheetTrigger>
        <SheetContent side="bottom">
          <div className="container py-12">
            <SheetHeader>
              <SheetTitle className={"text-center"}>
                {t("customize_property")}
              </SheetTitle>
              <SheetDescription className="text-center">
                {t("customize_description")}
              </SheetDescription>
            </SheetHeader>
            <EstatesFilter onSubmit={onSubmit} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
export default EstateFilterPanel;
