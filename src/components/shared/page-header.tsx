import React from "react";
import CustomBreadcrumbs from "./custom-breadcrumbs";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  breadcrumbItems?: { label: string; href?: string }[];
  className?: string;
  children?: React.ReactNode;
}

const PageHeader = ({
  title,
  breadcrumbItems = [],
  className,
  children,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "bg-main-light-gray py-2 px-4 rounded-b-lg container",
        className,
      )}
    >
      <CustomBreadcrumbs items={breadcrumbItems} />
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-main-navy text-lg font-bold">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
