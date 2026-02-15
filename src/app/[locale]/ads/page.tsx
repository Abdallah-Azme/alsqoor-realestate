"use client";

import { useLocale, useTranslations } from "next-intl";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { AddPropertyDialog } from "@/features/properties/ui";
import { useFeaturedProperties } from "@/features/properties";
import { PropertyCard } from "@/features/properties/ui/property-list/property-card";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const AdsPage = () => {
  const t = useTranslations("breadcrumbs");
  const tPage = useTranslations("home.estates_page");
  const tProps = useTranslations("properties");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { data: properties, isLoading, error } = useFeaturedProperties();

  const handleAddProperty = () => {
    router.push("/advertisements/add");
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
            <CustomBreadcrumbs items={[{ label: t("advertisements") }]} />
            <h1 className="text-2xl font-bold">{tPage("title")}</h1>
          </div>
          <Button onClick={handleAddProperty} className="gap-2">
            <FiPlus className="h-5 w-5" />
            {tPage("add_ad")}
          </Button>
        </div>
      </motion.div>

      {/* Featured Properties List */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-destructive">{tProps("error_loading")}</p>
          </div>
        ) : properties && properties.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {tProps("showing_results", {
                count: properties.length,
                total: properties.length,
              })}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{tProps("no_properties")}</p>
          </div>
        )}
      </motion.section>
    </main>
  );
};

export default AdsPage;
