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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useState } from "react";
import { HiOutlineUsers, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { motion, AnimatePresence } from "motion/react";

interface AddRequestDialogProps {
  setOpen: (open: boolean) => void;
}

const AddRequestDialog = ({ setOpen }: AddRequestDialogProps) => {
  const t = useTranslations("propertyRequestsPage");
  const tVal = useTranslations("validations");
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    requestType: z.string().min(1, tVal("required")),
    propertyType: z.string().min(1, tVal("required")),
    city: z.string().min(1, tVal("required")),
    budget: z.string().optional(),
    area: z.string().optional(),
    description: z.string().optional(),
    contactInApp: z.boolean().optional(),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestType: "",
      propertyType: "",
      city: "",
      budget: "",
      area: "",
      description: "",
      contactInApp: true,
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    try {
      console.log("Form values:", values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t("form.success"));
      setOpen(false);
      form.reset();
      setStep(1);
    } catch (error) {
      toast.error(t("form.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <HiOutlineUsers className="text-2xl text-amber-500" />,
      title: t("welcome.feature1_title"),
      description: t("welcome.feature1_desc"),
    },
    {
      icon: <MdOutlineRealEstateAgent className="text-2xl text-amber-500" />,
      title: t("welcome.feature2_title"),
      description: t("welcome.feature2_desc"),
    },
    {
      icon: (
        <HiOutlineChatBubbleLeftRight className="text-2xl text-amber-500" />
      ),
      title: t("welcome.feature3_title"),
      description: t("welcome.feature3_desc"),
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  // Welcome Screen (Step 1)
  if (step === 1) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="welcome"
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, x: -50 }}
          variants={containerVariants}
          className="flex flex-col items-center text-center py-10 px-8"
          dir="rtl"
        >
          {/* Illustration - Phone mockup */}
          <motion.div
            variants={itemVariants}
            className="w-36 h-36 bg-gray-100 rounded-full flex items-center justify-center mb-8"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
              className="relative"
            >
              <div className="w-16 h-24 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col items-center justify-center p-2 relative overflow-hidden">
                <div className="absolute top-1 w-6 h-1 bg-gray-200 rounded-full"></div>
                <div className="text-amber-500 text-[10px] font-bold mt-2">
                  Deal
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center my-1"
                >
                  <svg
                    className="w-4 h-4 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
                <div className="text-[6px] text-gray-400 text-center leading-tight">
                  {t("welcome.received")}
                </div>
                <div className="w-10 h-1.5 bg-amber-400 rounded-full mt-2"></div>
              </div>
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-gray-900 mb-3"
          >
            {t("welcome.title")}
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-gray-500 mb-10 text-sm leading-relaxed max-w-sm"
          >
            {t("welcome.description")}
          </motion.p>

          {/* Features - RTL aligned with stagger */}
          <motion.div
            variants={containerVariants}
            className="w-full space-y-5 mb-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: -5, transition: { duration: 0.2 } }}
                className="flex items-center gap-4 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-100"
                >
                  {feature.icon}
                </motion.div>
                <div className="flex-1 text-start">
                  <h4 className="font-bold text-gray-900 text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="w-full">
            <Button
              onClick={() => setStep(2)}
              className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-6 text-base rounded-xl shadow-sm"
            >
              {t("welcome.cta_button")}
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Form Screen (Step 2)
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="form"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
        className="py-6 px-6"
        dir="rtl"
      >
        {/* Step indicator / Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-start mb-8"
        >
          <h3 className="text-lg font-bold text-gray-900">
            {t("form.step_title")}
          </h3>
        </motion.div>

        <Form {...form}>
          <motion.form
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.15 },
              },
            }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Request Type */}
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                      <FormLabel className="text-sm font-medium">
                        {t("form.request_type")}
                      </FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-gray-50">
                          <SelectValue placeholder={t("form.request_type")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buy">
                          {t("operations.sale")}
                        </SelectItem>
                        <SelectItem value="rent">
                          {t("operations.rent")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Property Type */}
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <FormLabel className="text-sm font-medium">
                        {t("form.property_type")}
                      </FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-gray-50">
                          <SelectValue placeholder={t("form.property_type")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="villa">
                          {t("types.villa_sale")}
                        </SelectItem>
                        <SelectItem value="apartment">
                          {t("types.apartment_sale")}
                        </SelectItem>
                        <SelectItem value="land">
                          {t("types.land_sale")}
                        </SelectItem>
                        <SelectItem value="floor">
                          {t("types.floor_sale")}
                        </SelectItem>
                        <SelectItem value="shop">
                          {t("types.shop_sale")}
                        </SelectItem>
                        <SelectItem value="warehouse">
                          {t("types.warehouse_sale")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* City */}
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <FormLabel className="text-sm font-medium">
                        {t("form.city")}
                      </FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-gray-50">
                          <SelectValue placeholder={t("form.city")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="riyadh">الرياض</SelectItem>
                        <SelectItem value="jeddah">جدة</SelectItem>
                        <SelectItem value="dammam">الدمام</SelectItem>
                        <SelectItem value="makkah">مكة</SelectItem>
                        <SelectItem value="madinah">المدينة</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Budget */}
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                      <FormLabel className="text-sm font-medium">
                        {t("form.budget")}
                      </FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-gray-50">
                          <SelectValue placeholder={t("form.budget")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0-500000">أقل من 500,000</SelectItem>
                        <SelectItem value="500000-1000000">
                          500,000 - 1,000,000
                        </SelectItem>
                        <SelectItem value="1000000-2000000">
                          1,000,000 - 2,000,000
                        </SelectItem>
                        <SelectItem value="2000000+">
                          أكثر من 2,000,000
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Area */}
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                      <FormLabel className="text-sm font-medium">
                        {t("form.area")}
                      </FormLabel>
                    </div>
                    <Input
                      type="text"
                      placeholder={t("form.area")}
                      className="w-full h-12 rounded-xl border-gray-200 bg-gray-50"
                      {...field}
                    />
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Details */}
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                      <FormLabel className="text-sm font-medium">
                        {t("form.details")}
                      </FormLabel>
                    </div>
                    <Textarea
                      placeholder={t("form.details_placeholder")}
                      className="min-h-[120px] rounded-xl border-gray-200 bg-gray-50 resize-none"
                      {...field}
                    />
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Communication Channels */}
            <motion.div variants={itemVariants} className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-sm font-medium">
                  {t("form.contact_channels")}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {t("form.contact_channels_desc")}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <input
                  type="checkbox"
                  id="contactInApp"
                  checked={form.watch("contactInApp") || false}
                  onChange={(e) =>
                    form.setValue("contactInApp", e.target.checked)
                  }
                  className="w-5 h-5 accent-emerald-500 rounded"
                />
                <label
                  htmlFor="contactInApp"
                  className="text-sm cursor-pointer"
                >
                  {t("form.contact_in_app")}
                </label>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-6 text-base rounded-xl shadow-sm mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("form.submitting") : t("form.next")}
              </Button>
            </motion.div>
          </motion.form>
        </Form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddRequestDialog;
