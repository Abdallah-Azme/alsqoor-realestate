"use client";

import { useContext } from "react";
import { UserContext } from "@/context/user-context";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

/**
 * Hook to check if the logged-in user can add a new ad.
 * Uses `permissions.adLimit` and `permissions.totalUsedAds` from the profile API.
 *
 * - adLimit === 0  → no package → redirect to /packages
 * - totalUsedAds >= adLimit → limit reached → redirect to /packages
 * - otherwise → ok, returns true
 */
export function useAdLimit() {
  const ctx = useContext(UserContext);
  const t = useTranslations("ad_limit");
  const router = useRouter();

  function checkCanAddAd(): boolean {
    const user = ctx?.user;

    // Not logged in → let caller handle (auth guard elsewhere)
    if (!user) return true;

    const adLimit = user?.permissions?.adLimit ?? 0;
    const totalUsedAds = user?.permissions?.totalUsedAds ?? 0;

    // No active package
    if (adLimit === 0) {
      toast.error(t("no_package_title"), {
        description: t("no_package_desc"),
        action: {
          label: t("view_packages"),
          onClick: () => router.push("/packages"),
        },
        duration: 5000,
      });
      setTimeout(() => router.push("/packages"), 1500);
      return false;
    }

    // Limit reached
    if (totalUsedAds >= adLimit) {
      toast.error(t("limit_exceeded_title"), {
        description: t("limit_exceeded_desc", { limit: adLimit }),
        action: {
          label: t("upgrade_package"),
          onClick: () => router.push("/packages"),
        },
        duration: 5000,
      });
      setTimeout(() => router.push("/packages"), 1500);
      return false;
    }

    return true;
  }

  return { checkCanAddAd };
}
