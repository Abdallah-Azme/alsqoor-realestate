"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useLocale, useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { complaintsService } from "@/features/complaints";
import { useState, useEffect } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { getToken } from "@/services";
const ComplaintsForm = () => {
  const [types, setTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const t = useTranslations("Complaints");
  const locale = useLocale();
  const router = useRouter();
  async function getComplaints() {
    try {
      setIsLoadingTypes(true);
      const data = await complaintsService.getComplaintTypes();
      setTypes(data);
    } catch (error) {
      console.error("Error fetching complaint types:", error);
    } finally {
      setIsLoadingTypes(false);
    }
  }
  useEffect(() => {
    getComplaints();
  }, []);

  const formSchema = z.object({
    complaint_type_id: z.string({
      required_error: t("validation.complaint_type_required"),
    }),
    phone: z.string().min(10, {
      message: t("validation.phone_min"),
    }),
    email: z.string().email({
      message: t("validation.email_invalid"),
    }),
    body: z.string().min(10, {
      message: t("validation.message_min"),
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      complaint_type_id: "",
      phone: "",
      email: "",
      body: "",
    },
  });
  const { isSubmitting } = form.formState;

  async function onSubmit(values) {
    const token = await getToken();
    if (!token) {
      toast.error(t("validation.unauthorized"));
      router.push("/auth/login");
      return;
    }

    const success = await complaintsService.submitComplaint(values);
    if (success) {
      toast.success(t("validation.success"));
      form.reset();
    } else {
      toast.error(t("validation.error"));
    }
  }

  const inputStyle = "!h-14 rounded-none rounded-s-lg";

  return (
    <div className=" w-full ">
      <Form {...form}>
        <form
          dir={locale === "ar" ? "rtl" : "ltr"}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="complaint_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("complaint_type")}</FormLabel>
                <Select
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className={`${inputStyle} w-full`}>
                      <SelectValue placeholder={t("select_type")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingTypes ? (
                      <SelectItem key="loading" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      </SelectItem>
                    ) : (
                      types?.map((type) => (
                        <SelectItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("enter_email")}
                    className={inputStyle}
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phone_number")}</FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    defaultCountry="sa"
                    withFlagShown
                    withFullNumber
                    inputClassName={`${inputStyle} w-full`}
                    containerClassName={`${inputStyle} w-full`}
                    inputComponent={Input}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("message_label")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("message_placeholder")}
                    className={`${inputStyle} !h-30`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button
            disabled={isSubmitting}
            type="submit"
            className="rounded-none h-12 bg-main-green text-white lg:py-4 lg:!px-8 p-3 rounded-tr-2xl max-lg:text-xs font-semibold flex items-center gap-2 w-fit  mt-8"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              t("submit_complaint")
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ComplaintsForm;
