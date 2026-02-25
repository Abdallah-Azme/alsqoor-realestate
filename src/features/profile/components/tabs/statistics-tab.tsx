import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useStatistics } from "../../hooks/use-profile";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Wallet,
  Globe,
  FileText,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  percentage: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const StatCard = ({
  title,
  value,
  percentage,
  isPositive,
  icon,
}: StatCardProps) => {
  return (
    <Card className="shadow-sm border-gray-100 rounded-xl">
      <CardContent className="p-5 flex items-center gap-4">
        {/* Icon - always on LEFT side visually */}
        <div className="h-12 w-12 shrink-0 rounded-xl bg-main-green text-white flex items-center justify-center">
          {icon}
        </div>
        {/* Content */}
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium truncate">{title}</p>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-gray-900 truncate">
              {value}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <span
                className={`text-xs font-semibold ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
                dir="ltr"
              >
                {percentage}
              </span>
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatisticsTab = () => {
  const t = useTranslations("Profile");
  const { data: statsData } = useStatistics();

  const chartData = [
    { name: t("views_count"), value1: statsData?.viewsCount || 0 },
    { name: t("ads_count"), value1: statsData?.adsCount || 0 },
    {
      name: t("transactions_count"),
      value1: statsData?.transactionsCount || 0,
    },
    {
      name: t("property_news_count"),
      value1: statsData?.propertyNewsCount || 0,
    },
    {
      name: t("property_requests_count"),
      value1: statsData?.propertyRequestsCount || 0,
    },
  ];

  const stats = [
    {
      title: t("views_count"),
      value: statsData?.viewsCount?.toString() || "0",
      percentage: "+0%",
      isPositive: true,
      icon: <Globe className="h-6 w-6" />,
    },
    {
      title: t("ads_count"),
      value: statsData?.adsCount?.toString() || "0",
      percentage: "+0%",
      isPositive: true,
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: t("transactions_count"),
      value: statsData?.transactionsCount?.toString() || "0",
      percentage: "+0%",
      isPositive: true,
      icon: <Wallet className="h-6 w-6" />,
    },
    {
      title: t("property_news_count"),
      value: statsData?.propertyNewsCount?.toString() || "0",
      percentage: "+0%",
      isPositive: true,
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      title: t("property_requests_count"),
      value: statsData?.propertyRequestsCount?.toString() || "0",
      percentage: "+0%",
      isPositive: true,
      icon: <Users className="h-6 w-6" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            percentage={stat.percentage}
            isPositive={stat.isPositive}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Chart Section */}
      <Card className="shadow-sm border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-8">
            <h3 className="font-bold text-gray-900">
              {t("views_chart_title")}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-main-green"></span>
                <span className="text-sm text-gray-500">
                  {t("current_stats", { fallback: "Current Stats" })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{t("status_label")}</span>
            <span className="font-semibold text-gray-900">
              {t("all_projects")}
            </span>
          </div>
        </div>

        <div
          className="h-[300px] w-full"
          style={{ direction: "ltr", minHeight: "300px", minWidth: "100px" }}
        >
          {/* Force LTR for chart to display correctly even in RTL mode typically, 
              but let's check if Recharts handles RTL nicely. 
              Usually charts are LTR (time goes left to right). */}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickFormatter={(value) => value.toString()}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value1"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorValue1)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default StatisticsTab;
