import {
  TrendingUp,
  BarChart3,
  Eye,
  MousePointer,
  Percent,
} from "lucide-react";

interface StatsGridProps {
  activeCampaigns?: number;
  totalCampaigns?: number;
  totalImpressions?: number;
  totalImpressionsFormatted?: string;
  impressionsGrowth?: number;
  totalClicks?: number;
  totalClicksFormatted?: string;
  clicksGrowth?: number;
  averageCTR?: number;
  ctrGrowth?: number;
}

const StatsGrid = ({
  activeCampaigns = 0,
  totalCampaigns = 0,
  totalImpressions = 0,
  totalImpressionsFormatted = "0",
  impressionsGrowth = 0,
  totalClicks = 0,
  totalClicksFormatted = "0",
  clicksGrowth = 0,
  averageCTR = 0,
  ctrGrowth = 0,
}: StatsGridProps) => {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1).replace(".", ",")} M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)} k`;
    }
    return formatNumber(num);
  };

  const formatCTR = (ctr: number) => {
    return `${ctr.toFixed(2).replace(".", ",")}%`;
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? "↑" : "↓";
    const value = Math.abs(growth).toFixed(1).replace(".", ",");
    return `${sign} ${value}% vs mois dernier`;
  };

  // Utiliser les valeurs formatées si disponibles, sinon formater les nombres
  const impressionsValue =
    totalImpressionsFormatted !== "0"
      ? totalImpressionsFormatted
      : formatLargeNumber(totalImpressions);

  const clicksValue =
    totalClicksFormatted !== "0"
      ? totalClicksFormatted
      : formatLargeNumber(totalClicks);

  const stats = [
    {
      title: "Campagnes actives",
      value: formatNumber(activeCampaigns),
      description: `sur ${formatNumber(totalCampaigns)} total`,
      change: null as "up" | "down" | null,
      icon: BarChart3,
      color: "bg-[var(--color-primary-50)]",
      iconColor: "text-[var(--color-primary-600)]",
    },
    {
      title: "Impressions totales",
      value: impressionsValue,
      description: formatGrowth(impressionsGrowth),
      change: impressionsGrowth >= 0 ? "up" : "down",
      icon: Eye,
      color: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Clics totaux",
      value: clicksValue,
      description: formatGrowth(clicksGrowth),
      change: clicksGrowth >= 0 ? "up" : "down",
      icon: MousePointer,
      color: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "CTR moyen",
      value: formatCTR(averageCTR),
      description: formatGrowth(ctrGrowth),
      change: ctrGrowth >= 0 ? "up" : "down",
      icon: Percent,
      color: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-[var(--spacing-6)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-4)]">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-gray-200)] p-[var(--spacing-4)]"
          >
            <div className="flex items-center justify-between mb-[var(--spacing-3)]">
              <div className={`p-2 ${stat.color} rounded-lg`}>
                <Icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
              {stat.change === "up" && (
                <div className="flex items-center text-[var(--color-success-500)]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              )}
              {stat.change === "down" && (
                <div className="flex items-center text-[var(--color-error-500)] rotate-180">
                  <TrendingUp className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-[var(--color-gray-900)] mb-[var(--spacing-2)]">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-[var(--color-gray-700)] mb-[var(--spacing-1)]">
              {stat.title}
            </div>
            <div
              className={`text-sm ${
                stat.change === "up"
                  ? "text-[var(--color-success-500)]"
                  : stat.change === "down"
                    ? "text-[var(--color-error-500)]"
                    : "text-[var(--color-gray-500)]"
              }`}
            >
              {stat.description}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
