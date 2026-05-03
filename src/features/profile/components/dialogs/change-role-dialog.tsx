"use client";

import { useState, useContext, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
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
import { UserContext } from "@/context/user-context";
import { useChangeRole } from "../../hooks/use-profile";
import { UserRole, AgentType } from "../../types/profile.types";

// ─── schema ──────────────────────────────────────────────────────────────────

const getFormSchema = (t: any) =>
  z
    .object({
      role: z.enum(["developer", "owner", "agent", "seeker"] as const),
      fal_number: z.string().optional(),
      fal_expiry_date: z.string().optional(),
      agent_type: z.enum(["individual", "office"] as const).optional(),
      has_ad_license: z.enum(["0", "1"] as const).optional(),
      commercial_register: z.string().optional(),
      has_fal_license: z.enum(["0", "1"] as const).optional(),
      company_name: z.string().optional(),
      fal_license_document: z.any().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.role === "agent" || data.role === "developer") {
        if (!data.fal_number) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              t("validation.fal_number_required") || "FAL number is required",
            path: ["fal_number"],
          });
        }
        if (!data.fal_expiry_date) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              t("validation.fal_expiry_required") ||
              "FAL expiry date is required",
            path: ["fal_expiry_date"],
          });
        }
        if (data.has_ad_license === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.field_required") || "This field is required",
            path: ["has_ad_license"],
          });
        }
        if (!data.fal_license_document) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              t("validation.fal_license_doc_required") ||
              "FAL license document is required",
            path: ["fal_license_document"],
          });
        }
      }
      if (data.role === "agent") {
        if (!data.agent_type) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              t("validation.agent_type_required") || "Agent type is required",
            path: ["agent_type"],
          });
        }
      }
      if (data.role === "developer") {
        if (!data.commercial_register) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              t("validation.commercial_register_required") ||
              "Commercial register is required",
            path: ["commercial_register"],
          });
        }
        if (data.has_fal_license === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.field_required") || "This field is required",
            path: ["has_fal_license"],
          });
        }
      }
    });

type FormValues = z.infer<ReturnType<typeof getFormSchema>>;

// ─── component ───────────────────────────────────────────────────────────────

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRole?: string;
}

export const ChangeRoleDialog = ({
  open,
  onOpenChange,
  currentRole,
}: ChangeRoleDialogProps) => {
  const t = useTranslations("Profile");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { fetchUserProfile } = useContext(UserContext);
  const { mutate: changeRole, isPending } = useChangeRole();

  const ROLES: {
    value: UserRole;
    icon: string;
    labelKey: string;
    descKey: string;
  }[] = useMemo(() => [
    {
      value: "seeker",
      icon: "🔍",
      labelKey: "change_role.roles.seeker.label",
      descKey: "change_role.roles.seeker.description",
    },
    {
      value: "owner",
      icon: "🏠",
      labelKey: "change_role.roles.owner.label",
      descKey: "change_role.roles.owner.description",
    },
    {
      value: "agent",
      icon: "🤝",
      labelKey: "change_role.roles.agent.label",
      descKey: "change_role.roles.agent.description",
    },
    {
      value: "developer",
      icon: "🏗️",
      labelKey: "change_role.roles.developer.label",
      descKey: "change_role.roles.developer.description",
    },
  ], []);

  const AGENT_TYPES: { value: AgentType; labelKey: string }[] = useMemo(() => [
    { value: "individual", labelKey: "change_role.agent_types.individual" },
    { value: "office", labelKey: "change_role.agent_types.office" },
  ], []);

  const form = useForm<FormValues>({
    resolver: zodResolver(getFormSchema(t)),
    defaultValues: {
      role: (currentRole as UserRole) || "seeker",
      fal_number: "",
      fal_expiry_date: "",
      agent_type: undefined,
      has_ad_license: undefined,
      commercial_register: "",
      has_fal_license: undefined,
      company_name: "",
      fal_license_document: undefined,
    },
  });

  const selectedRole = form.watch("role");
  const needsFal = selectedRole === "agent" || selectedRole === "developer";
  const needsAgentType = selectedRole === "agent";
  const needsDeveloperFields = selectedRole === "developer";

  const onSubmit = (values: FormValues) => {
    changeRole(values as any, {
      onSuccess: async (response: any) => {
        toast.success(response?.message || t("change_role.success"));
        if (fetchUserProfile) {
          await fetchUserProfile();
        }
        onOpenChange(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir={isRtl ? "rtl" : "ltr"}
        className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-0 gap-0"
      >
        {/* Header */}
        <div className="bg-linear-to-l from-main-green/10 to-emerald-50 px-6 pt-6 pb-4 rounded-t-2xl">
          <DialogHeader className={isRtl ? "text-right" : "text-left"}>
            <DialogTitle className="text-xl font-bold text-main-navy">
              {t("change_role.title")}
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm mt-1">
              {t("change_role.description")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            {/* ── Role Selector ────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 block mb-3">
                    {t("change_role.select_role")} <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map((r) => {
                      const isSelected = field.value === r.value;
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => {
                            field.onChange(r.value);
                            // Reset conditional fields when role changes
                            form.setValue("fal_number", "");
                            form.setValue("fal_expiry_date", "");
                            form.setValue("agent_type", undefined);
                            form.setValue("has_ad_license", undefined);
                            form.setValue("commercial_register", "");
                            form.setValue("has_fal_license", undefined);
                            form.setValue("fal_license_document", undefined);
                          }}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:border-main-green/50 hover:bg-main-green/5 ${isRtl ? "text-right" : "text-left"} ${
                            isSelected
                              ? "border-main-green bg-main-green/10 shadow-sm"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="text-2xl mb-1">{r.icon}</div>
                          <div
                            className={`font-bold text-sm ${
                              isSelected ? "text-main-green" : "text-main-navy"
                            }`}
                          >
                            {t(r.labelKey)}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {t(r.descKey)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Conditional Fields ───────────────────────────────────── */}
            {needsFal && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t("change_role.fal_data")}
                </p>

                {/* Has FAL License */}
                <FormField
                  control={form.control}
                  name="has_fal_license"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-700">
                        {t("change_role.has_fal")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="flex gap-3">
                        {[
                          { value: "1", label: t("sign_up.yes") },
                          { value: "0", label: t("sign_up.no") },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              field.onChange(opt.value as "0" | "1")
                            }
                            className={`flex-1 h-11 rounded-lg border-2 text-sm font-medium transition-all ${
                              field.value === opt.value
                                ? "border-main-green bg-main-green/10 text-main-green"
                                : "border-gray-200 bg-white text-gray-600 hover:border-main-green/40"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* FAL Number */}
                <FormField
                  control={form.control}
                  name="fal_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-700">
                        {t("change_role.fal_number")} <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("change_role.fal_number_placeholder")}
                          className={`h-11 bg-white border-gray-200 rounded-lg ${isRtl ? "text-right" : "text-left"}`}
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
                        {t("change_role.fal_expiry")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className={`h-11 bg-white border-gray-200 rounded-lg ${isRtl ? "text-right" : "text-left"}`}
                          onChange={(e) => {
                            // Convert YYYY-MM-DD → DD-MM-YYYY for API
                            const raw = e.target.value; // YYYY-MM-DD
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

                {/* Has Ad License */}
                <FormField
                  control={form.control}
                  name="has_ad_license"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-700">
                        {t("change_role.has_ad_license")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="flex gap-3">
                        {[
                          { value: "1", label: t("sign_up.yes") },
                          { value: "0", label: t("sign_up.no") },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              field.onChange(opt.value as "0" | "1")
                            }
                            className={`flex-1 h-11 rounded-lg border-2 text-sm font-medium transition-all ${
                              field.value === opt.value
                                ? "border-main-green bg-main-green/10 text-main-green"
                                : "border-gray-200 bg-white text-gray-600 hover:border-main-green/40"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fal_license_document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        {t("change_role.fal_license_doc")}{" "}
                        <span className="text-red-500">*</span>
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
                                  {t("change_role.click_to_upload")}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {t("change_role.upload_types")}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-3 bg-main-green/5 border border-main-green/20 rounded-lg animate-in fade-in zoom-in-95 duration-200">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="bg-main-green/10 p-2 rounded-lg">
                                  <FileText className="text-main-green size-5" />
                                </div>
                                <div className="flex flex-col min-w-0 text-right">
                                  <span className="text-sm font-medium text-main-navy truncate">
                                    {(field.value as File).name}
                                  </span>
                                  <span className="text-[10px] text-gray-400">
                                    {(
                                      (field.value as File).size /
                                      (1024 * 1024)
                                    ).toFixed(2)}{" "}
                                    {tCommon("mb")}
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
            )}

            {/* ── Agent-specific Fields ────────────────────────────────── */}
            {needsAgentType && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="agent_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        {t("change_role.agent_type")} <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="flex gap-3">
                        {AGENT_TYPES.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => field.onChange(type.value)}
                            className={`flex-1 h-11 rounded-lg border-2 text-sm font-medium transition-all ${
                              field.value === type.value
                                ? "border-main-green bg-main-green/10 text-main-green"
                                : "border-gray-200 bg-white text-gray-600 hover:border-main-green/40"
                            }`}
                          >
                            {t(type.labelKey)}
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* ── Developer-specific Fields ────────────────────────────── */}
            {needsDeveloperFields && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  {t("change_role.developer_data")}
                </p>

                {/* Commercial Register */}
                <FormField
                  control={form.control}
                  name="commercial_register"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-700">
                        {t("change_role.commercial_register")} <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("change_role.commercial_register_placeholder")}
                          className={`h-11 bg-white border-gray-200 rounded-lg ${isRtl ? "text-right" : "text-left"}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* ── Company Name (optional always) ───────────────────────── */}
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">
                    {t("change_role.company_name")}{" "}
                    <span className="text-gray-400 text-xs">{t("change_role.optional")}</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("change_role.company_name_placeholder")}
                      className={`h-11 bg-gray-50 border-gray-200 rounded-lg ${isRtl ? "text-right" : "text-left"}`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Actions ──────────────────────────────────────────────── */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 h-12 bg-main-green hover:bg-main-green/90 text-white font-bold rounded-xl gap-2 text-sm"
              >
                {isPending && <Loader2 size={16} className="animate-spin" />}
                {isPending ? t("change_role.saving") : t("change_role.confirm_change")}
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
                {t("cancel")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRoleDialog;
