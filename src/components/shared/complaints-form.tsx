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
import {
  useComplaintTypes,
  useSubmitComplaint,
} from "@/features/complaints/hooks/use-complaints";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { getToken } from "@/services";

const ComplaintsForm = () => {
  const t = useTranslations("Complaints");
  const locale = useLocale();
  const router = useRouter();

  // Using hooks from use-complaints
  const { data: types, isLoading: isLoadingTypes } = useComplaintTypes();
  const submitComplaint = useSubmitComplaint();

  const formSchema = z.object({
    complaint_type_id: z
      .string({
        message: t("validation.complaint_type_required"),
      })
      .min(1, { message: t("validation.complaint_type_required") }),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      complaint_type_id: "",
      phone: "",
      email: "",
      body: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = await getToken();
    if (!token) {
      toast.error(t("validation.unauthorized"));
      router.push("/auth/login");
      return;
    }

    submitComplaint.mutate(values as any, {
      onSuccess: () => {
        toast.success(t("validation.success") || "تم إرسال الشكوى بنجاح");
        form.reset();
      },
      onError: (error) => {
        toast.error(t("validation.error") || "حدث خطأ ما");
        console.error("Complaint Submission Error:", error);
      },
    });
  }

  const inputStyle =
    "!h-14 rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-main-green focus:bg-white transition-all";

  return (
    <div className="w-full">
      <div className="text-center mb-8 space-y-2">
        <h2 className="text-2xl font-bold text-main-navy">
          {t("complaint_form") || "نموذج الشكاوى"}
        </h2>
        <p className="text-gray-500 text-sm">
          {t("description") || "نحن هنا للاستماع إليك وحل مشاكلك في أسرع وقت."}
        </p>
      </div>

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
                <FormLabel className="font-semibold text-main-navy">
                  {t("complaint_type")}
                </FormLabel>
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
                  <SelectContent className="rounded-xl">
                    {isLoadingTypes ? (
                      <SelectItem key="loading" value="loading" disabled>
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري
                          التحميل...
                        </span>
                      </SelectItem>
                    ) : (
                      types?.map((type: any) => (
                        <SelectItem
                          key={type.id}
                          value={String(type.id)}
                          className="focus:bg-main-green/10 cursor-pointer"
                        >
                          {type.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-main-navy">
                  {t("email")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("enter_email")}
                    className={inputStyle}
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-main-navy">
                  {t("phone_number")}
                </FormLabel>
                <FormControl>
                  {/* @ts-ignore */}
                  <PhoneInput
                    {...field}
                    defaultCountry="sa"
                    withFlagShown
                    withFullNumber
                    inputClassName={`${inputStyle} w-full border-s-0 rounded-s-none focus-visible:ring-0 !border-gray-200`}
                    countrySelectorStyleProps={{
                      // @ts-ignore
                      buttonClassName: `${inputStyle} rounded-e-none !h-[56px] px-3 !border-gray-200 border-e-0 cursor-pointer hover:bg-gray-100`,
                    }}
                    inputComponent={Input}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-main-navy">
                  {t("message_label")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("message_placeholder")}
                    className={`${inputStyle} h-32! resize-none pt-4`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <div className="pt-2">
            <Button
              disabled={isSubmitting || submitComplaint.isPending}
              type="submit"
              className="w-full rounded-xl h-14 bg-main-green text-white font-bold text-lg hover:bg-main-green/90 shadow-lg shadow-main-green/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting || submitComplaint.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> جاري الإرسال
                </>
              ) : (
                t("submit_complaint")
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ComplaintsForm;
