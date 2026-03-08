"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Upload, X, FileText } from "lucide-react";
import { useRenewFal } from "../../hooks/use-profile";

const formSchema = z.object({
  fal_number: z.string().min(1, "رقم الفال مطلوب"),
  fal_expiry_date: z.string().min(1, "تاريخ انتهاء الفال مطلوب"),
  fal_license_document: z
    .any()
    .refine((file) => file instanceof File, "وثيقة ترخيص الفال مطلوبة"),
});

type FormValues = z.infer<typeof formSchema>;

interface RenewFalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RenewFalDialog = ({ open, onOpenChange }: RenewFalDialogProps) => {
  const { mutate: renewFal, isPending } = useRenewFal();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fal_number: "",
      fal_expiry_date: "",
      fal_license_document: undefined,
    },
  });

  const onSubmit = (values: FormValues) => {
    renewFal(values as any, {
      onSuccess: (response: any) => {
        toast.success(response?.message || "تم تجديد ترخيص الفال بنجاح");
        onOpenChange(false);
        form.reset();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "حدث خطأ أثناء تجديد ترخيص الفال",
        );
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-lg rounded-2xl p-0 gap-0">
        <div className="bg-linear-to-l from-main-green/10 to-emerald-50 px-6 pt-6 pb-4 rounded-t-2xl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-xl font-bold text-main-navy">
              تجديد ترخيص الفال
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm mt-1">
              يرجى إدخال بيانات ترخيص الفال الجديدة لتحديث بيانات حسابك.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              {/* FAL Number */}
              <FormField
                control={form.control}
                name="fal_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      رقم الفال <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="أدخل رقم الفال"
                        className="h-11 bg-white border-gray-200 rounded-lg text-right"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FAL Expiry Date */}
              <FormField
                control={form.control}
                name="fal_expiry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      تاريخ انتهاء الفال <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-11 bg-white border-gray-200 rounded-lg text-right"
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw) {
                            const [y, m, d] = raw.split("-");
                            field.onChange(`${d}-${m}-${y}`);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FAL License Document */}
              <FormField
                control={form.control}
                name="fal_license_document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      وثيقة ترخيص الفال <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {!field.value ? (
                          <div
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = ".pdf,.jpg,.jpeg,.png";
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement)
                                  .files?.[0];
                                if (file) field.onChange(file);
                              };
                              input.click();
                            }}
                            className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-main-green/50 hover:bg-main-green/5 transition-all text-center"
                          >
                            <Upload className="text-gray-400 size-6" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                انقر لرفع وثيقة ترخيص الفال
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PDF أو صور (JPG, PNG)
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-main-green/5 border border-main-green/20 rounded-lg animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="bg-main-green/10 p-2 rounded-lg">
                                <FileText className="text-main-green size-5" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium text-main-navy truncate">
                                  {(field.value as File).name}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {(
                                    (field.value as File).size /
                                    (1024 * 1024)
                                  ).toFixed(2)}{" "}
                                  MB
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => field.onChange(undefined)}
                              className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-gray-400"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 h-12 bg-main-green hover:bg-main-green/90 text-white font-bold rounded-xl gap-2 text-sm"
              >
                {isPending && <Loader2 size={16} className="animate-spin" />}
                {isPending ? "جارٍ الحفظ..." : "تأكيد التجديد"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
                disabled={isPending}
                className="px-6 h-12 border-gray-200 text-gray-500 hover:text-gray-700 font-medium rounded-xl"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
