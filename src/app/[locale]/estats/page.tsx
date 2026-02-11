"use client";

import { useLocale, useTranslations } from "next-intl";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { PropertyList, AddPropertyDialog } from "@/features/properties/ui";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { useRouter } from "next/navigation";

const EstatsPage = () => {
  const t = useTranslations("breadcrumbs");
  const tPage = useTranslations("home.estates_page");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddProperty = () => {
    // Open the dialog - authentication will be checked on submit
    setIsAddDialogOpen(true);
  };

  return (
    <main className="space-y-12">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container space-y-4 rounded-b-xl bg-main-light-gray p-4 pb-12"
      >
        <div className="flex items-center justify-between">
          <div>
            <CustomBreadcrumbs items={[{ label: t("properties") }]} />
            <h1 className="text-2xl font-bold">{tPage("title")}</h1>
          </div>
          <Button onClick={handleAddProperty} className="gap-2">
            <FiPlus className="h-5 w-5" />
            {tPage("add_property")}
          </Button>
        </div>
      </motion.div>

      {/* Property List */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <PropertyList />
      </motion.section>

      {/* Add Property Dialog */}
      <AddPropertyDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </main>
  );
};

export default EstatsPage;
