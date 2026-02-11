"use client";

import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { UserContext } from "@/context/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { profileService } from "../services/profile.service";
import { UpdateProfileRequest } from "../types/profile.types";
import ProfileSidebar from "./side-menu/profile-sidebar";
import ProfileTabs from "./tabs/profile-tabs";

const ProfileLayout = () => {
  const t = useTranslations("Profile");
  const { user, setUser, fetchUserProfile, loading } = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      // Get locale from pathname (e.g., /ar/profile -> ar)
      const locale = pathname.split("/")[1] || "ar";
      router.replace(`/${locale}/auth/login`);
    }
  }, [loading, user, router, pathname]);

  const formSchema = z.object({
    name: z.string().min(2, t("validation_name")),
    email: z.string().email(t("validation_email")),
    phone: z.string().min(8, t("validation_phone")),
  });

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || user?.mobile || "",
    },
    values: {
      // Update form when user data loads
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || user?.mobile || "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = async (values: UpdateProfileRequest) => {
    // Optimistic UI or wait for response? Wait is safer.
    try {
      const success = await profileService.updateProfile(values);
      if (success) {
        toast.success(t("save_success"));
        await fetchUserProfile(); // Refresh data
        setIsEditing(false); // Exit edit mode on success
      } else {
        toast.error(t("save_error"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("save_error"));
    }
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-main-green border-t-transparent"></div>
      </div>
    );
  }

  // Redirect is happening, show minimal loading
  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-main-green border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      {/* Header Container */}
      <div className="bg-gray-50 rounded-xl p-6 md:p-8 flex justify-between items-start md:items-center">
        <div className="space-y-2">
          {/* Breadcrumb - Align Start */}
          <div className="flex justify-start">
            <CustomBreadcrumbs
              items={[{ label: t("my_account") }]}
              className="!p-0 !bg-transparent shadow-none"
            />
          </div>
          <h1 className="text-3xl font-bold text-main-navy">
            {t("my_account")}
          </h1>
        </div>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-main-green font-medium hover:underline transition-all mt-2 md:mt-0"
        >
          <span className="text-sm">{t("back")}</span>
          <span className="text-lg">‹</span>
        </button>
      </div>

      <FormProvider {...methods}>
        <form
          id="profile-form"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Sidebar - spans 4 columns (1/3 width) */}
          <div className="lg:col-span-4 order-1">
            <ProfileSidebar
              user={user}
              isSubmitting={methods.formState.isSubmitting}
              isEditing={isEditing}
              onEditToggle={() => setIsEditing(!isEditing)}
            />
          </div>

          {/* Main Content - spans 8 columns (2/3 width) */}
          <div className="lg:col-span-8 order-2">
            <ProfileTabs isEditing={isEditing} user={user} />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ProfileLayout;
