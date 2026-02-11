"use client";
import CustomBreadcrumbs from "@/components/shared/custom-breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaMoneyBillWave,
  FaTag,
  FaRulerCombined,
  FaBuilding,
  FaChartLine,
  FaExchangeAlt,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { offersService } from "@/features/offers";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const SingleDealPage = () => {
  const t = useTranslations("deals_page");
  const params = useParams();
  const offerId = params.id;
  const [offer, setOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (offerId) {
      fetchOffer();
    }
  }, [offerId]);

  async function fetchOffer() {
    setIsLoading(true);
    try {
      const data = await offersService.getById(offerId as string);
      setOffer(data);
    } catch (error) {
      toast.error(t("error_generic"));
      console.error("Error fetching offer:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <main className="space-y-6">
        <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="container border border-gray-300 p-10 space-y-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!offer) {
    return (
      <main className="space-y-6">
        <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
          <CustomBreadcrumbs items={[{ label: t("title"), href: "/deals" }]} />
          <h1 className="text-main-navy text-2xl font-bold">
            {t("not_found")}
          </h1>
        </div>
        <div className="container border border-gray-300 p-10">
          <p className="text-center text-gray-500">{t("not_found_desc")}</p>
        </div>
      </main>
    );
  }

  const stats = [
    {
      icon: <FaTag />,
      label: t("price"),
      value: `${offer.price} ${t("currency") || "SAR"}`,
    },
    {
      icon: <FaCalendarAlt />,
      label: t("validity"),
      value: `${offer.validityDays} ${t("days") || "Days"}`,
    },
    {
      icon: <FaCheckCircle />,
      label: t("features_count"),
      value: offer.features?.length || 0,
    },
    {
      icon: <FaBuilding />,
      label: t("status"),
      value: offer.isActive ? t("active") : t("inactive"),
    },
  ];

  const data = [
    { name: "Jan", high: 10000, avg: 8000, low: 6000 },
    { name: "Feb", high: 12000, avg: 9000, low: 7000 },
    { name: "Mar", high: 20000, avg: 15000, low: 9000 },
    { name: "Apr", high: 25000, avg: 18000, low: 10000 },
    { name: "May", high: 30000, avg: 20000, low: 12000 },
  ];

  return (
    <main className="space-y-6">
      <div className="bg-main-light-gray p-4 pb-12 space-y-4 rounded-b-xl container">
        <CustomBreadcrumbs
          items={[{ label: t("title"), href: "/deals" }, { label: offer.name }]}
        />
        <h1 className="text-main-navy text-2xl font-bold">{offer.name}</h1>
        <p className="text-gray-600">{offer.description}</p>
      </div>
      <div className="container border border-gray-300 p-10 space-y-8">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item, i) => (
            <Card
              key={i}
              className="shadow-sm border border-gray-100 rounded-none rounded-s-lg"
            >
              <CardContent className="flex items-center p-4 gap-3">
                <div className="bg-main-green text-white p-3 text-lg rounded">
                  {item.icon}
                </div>
                <div>
                  <div className="text-gray-500 text-sm">{item.label}</div>
                  <div className="text-sm font-semibold">{item.value}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        {offer.features && offer.features.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-main-navy">
              {t("features")}
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {offer.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <FaCheckCircle className="text-main-green flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Chart */}
        <Card className="p-4 lg:w-1/2 mx-auto">
          <h3 className="text-center font-semibold mb-4">
            {t("price_change")}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="high"
                stroke="#16a34a"
                strokeWidth={2}
                name={t("high")}
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#86efac"
                strokeDasharray="5 5"
                name={t("avg")}
              />
              <Line
                type="monotone"
                dataKey="low"
                stroke="#a3a3a3"
                name={t("low")}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Additional Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-main-navy">
            {t("additional_info")}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">{t("created_at")}: </span>
              <span className="font-semibold">
                {new Date(offer.createdAt).toLocaleDateString("ar-SA")}
              </span>
            </div>
            <div>
              <span className="text-gray-500">{t("updated_at")}: </span>
              <span className="font-semibold">
                {new Date(offer.updatedAt).toLocaleDateString("ar-SA")}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default SingleDealPage;
