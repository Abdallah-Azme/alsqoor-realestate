"use client";

import { useState, useContext } from "react";
import { useRouter } from "@/i18n/navigation";
import { UserContext } from "@/context/user-context";
import PlanCard from "@/components/shared/plan-card";
import { AnimatedItem } from "@/components/motion/animated-section";
import { SubscriptionDialog } from "@/features/profile/components/tabs/subscription-dialog";
import { useSubscribeToPackage } from "@/features/packages/hooks/use-packages";

interface PackagesListClientProps {
  plansData: any[];
}

export default function PackagesListClient({
  plansData,
}: PackagesListClientProps) {
  const { user } = useContext(UserContext) || { user: null };
  const router = useRouter();
  const { mutate: subscribe } = useSubscribeToPackage();
  const [selectedPackageId, setSelectedPackageId] = useState<
    string | number | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectPackage = (id: string | number, isTrial?: boolean) => {
    if (!user) {
      // Redirect to login if not logged in
      router.push("/auth/login"); // Localized push
      return;
    }

    if (isTrial) {
      subscribe({ packageId: id });
      return;
    }

    setSelectedPackageId(id);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plansData.map((plan, index) => (
          <AnimatedItem key={index} index={index} className="h-full">
            <PlanCard
              {...plan}
              onSelect={(id: string | number) =>
                handleSelectPackage(id, plan?.isTrial)
              }
            />
          </AnimatedItem>
        ))}
      </div>

      <SubscriptionDialog
        packageId={selectedPackageId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
