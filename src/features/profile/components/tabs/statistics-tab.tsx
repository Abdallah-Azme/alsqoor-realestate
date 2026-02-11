import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
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

const data = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 8000 },
  { name: "Mar", value: 15000 },
  { name: "Apr", value: 24000 },
  { name: "May", value: 24000 },
  { name: "Jun", value: 20000 },
  { name: "Jul", value: 24000 },
];

// Mock secondary line data for the "shadow" effect seen in design
const data2 = [
  { name: "Jan", value: 12000 },
  { name: "Feb", value: 13000 },
  { name: "Mar", value: 18000 },
  { name: "Apr", value: 8000 },
  { name: "May", value: 12000 },
  { name: "Jun", value: 26000 },
  { name: "Jul", value: 30000 },
];

const mergedData = data.map((item, index) => ({
  name: item.name,
  value1: item.value,
  value2: data2[index].value,
}));

const StatisticsTab = () => {
  const t = useTranslations("Profile");

  const stats = [
    {
      title: t("total_earnings"),
      value: "53,000 " + t("currency"), // Assuming currency key exists or just hardcode SR/LE based on locale if needed, but for now using value from screenshot
      valuePrefix: "53,000", // To match exactly
      percentage: "+55%",
      isPositive: true,
      icon: <Wallet className="h-6 w-6" />,
    },
    {
      title: t("views_count"),
      value: "2,300",
      percentage: "+5%",
      isPositive: true,
      icon: <Globe className="h-6 w-6" />,
    },
    {
      title: t("ads_count"),
      value: "24",
      percentage: "-14%",
      isPositive: false,
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: t("visitors_count"),
      value: "44",
      percentage: "+8%",
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
            value={stat.valuePrefix || stat.value} // Use valuePrefix if available for currency formatting manually if needed
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
                <span className="text-sm text-gray-500">2024</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                <span className="text-sm text-gray-500">2025</span>
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
              data={mergedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                allowDuplicatedCategory={false}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000}${t("k_suffix")}`}
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
              <Area
                type="monotone"
                dataKey="value2"
                stroke="#9CA3AF"
                fillOpacity={1}
                fill="url(#colorValue2)"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default StatisticsTab;
