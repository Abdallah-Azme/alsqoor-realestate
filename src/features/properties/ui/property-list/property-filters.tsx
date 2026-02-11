"use client";

import { useState } from "react";
import { PropertyFilters } from "../../types/property.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";

interface PropertyFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
}

export function PropertyFiltersComponent({
  filters,
  onFiltersChange,
}: PropertyFiltersProps) {
  const t = useTranslations("properties");
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters);

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters: PropertyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t("filters.title")}</span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4" />
            {t("filters.clear")}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label>{t("filters.search")}</Label>
          <Input
            placeholder={t("filters.search_placeholder")}
            value={localFilters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        {/* Operation Type */}
        <div className="space-y-2">
          <Label>{t("filters.operation_type")}</Label>
          <Select
            value={localFilters.operation_type || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "operation_type",
                value === "all" ? undefined : value,
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filters.all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.all")}</SelectItem>
              <SelectItem value="sale">{t("operation_type.sale")}</SelectItem>
              <SelectItem value="rent">{t("operation_type.rent")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Use */}
        <div className="space-y-2">
          <Label>{t("filters.property_use")}</Label>
          <Select
            value={localFilters.property_use || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "property_use",
                value === "all" ? undefined : value,
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filters.all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.all")}</SelectItem>
              <SelectItem value="apartment">
                {t("property_use.apartment")}
              </SelectItem>
              <SelectItem value="villa">{t("property_use.villa")}</SelectItem>
              <SelectItem value="land_residential">
                {t("property_use.land_residential")}
              </SelectItem>
              <SelectItem value="commercial_shop">
                {t("property_use.commercial_shop")}
              </SelectItem>
              <SelectItem value="office">{t("property_use.office")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Finishing Type */}
        <div className="space-y-2">
          <Label>{t("filters.finishing_type")}</Label>
          <Select
            value={localFilters.finishing_type || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "finishing_type",
                value === "all" ? undefined : value,
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filters.all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.all")}</SelectItem>
              <SelectItem value="none">{t("finishing_type.none")}</SelectItem>
              <SelectItem value="basic">{t("finishing_type.basic")}</SelectItem>
              <SelectItem value="good">{t("finishing_type.good")}</SelectItem>
              <SelectItem value="luxury">
                {t("finishing_type.luxury")}
              </SelectItem>
              <SelectItem value="super_luxury">
                {t("finishing_type.super_luxury")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>{t("filters.price_range")}</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={t("filters.min_price")}
              value={localFilters.min_price || ""}
              onChange={(e) =>
                handleFilterChange(
                  "min_price",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
            <Input
              type="number"
              placeholder={t("filters.max_price")}
              value={localFilters.max_price || ""}
              onChange={(e) =>
                handleFilterChange(
                  "max_price",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="space-y-2">
          <Label>{t("filters.rooms")}</Label>
          <Select
            value={localFilters.rooms?.toString() || "any"}
            onValueChange={(value) =>
              handleFilterChange(
                "rooms",
                value === "any" ? undefined : Number(value),
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filters.any")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("filters.any")}</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <Label>{t("filters.bathrooms")}</Label>
          <Select
            value={localFilters.bathrooms?.toString() || "any"}
            onValueChange={(value) =>
              handleFilterChange(
                "bathrooms",
                value === "any" ? undefined : Number(value),
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("filters.any")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("filters.any")}</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={applyFilters}>
          <Search className="mr-2 h-4 w-4" />
          {t("filters.apply")}
        </Button>
      </CardContent>
    </Card>
  );
}
