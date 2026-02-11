import React from "react";
import { Link } from "@/i18n/navigation";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CustomBreadcrumbs = ({ items = [], homeHref = "/", className = "" }) => {
  return (
    <Breadcrumb className={`w-fit rounded ${className}`}>
      <BreadcrumbList className="text-xs gap-0.5">
        {/* Home Icon Link */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href={homeHref}
              className="flex items-center text-main-green hover:text-main-green/80"
              aria-label="Home"
            >
              <Home className="size-3" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Breadcrumb Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className="text-main-green hover:text-main-green/80"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-black hover:text-main-green/80">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumbs;
