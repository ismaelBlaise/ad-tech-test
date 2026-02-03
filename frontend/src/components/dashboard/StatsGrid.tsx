import {
  TrendingUp,
  BarChart3,
  Eye,
  MousePointer,
  Percent,
} from "lucide-react";

const stats = [
  {
    title: "Campagnes actives",
    value: "3",
    description: "sur 8 total",
    change: null,
    icon: BarChart3,
    color: "bg-[var(--color-primary-50)]",
    iconColor: "text-[var(--color-primary-600)]",
  },
  {
    title: "Impressions totales",
    value: "14,5 M",
    description: "↑ 12.5% vs mois dernier",
    change: "up",
    icon: Eye,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Clics totaux",
    value: "358,9 k",
    description: "↑ 8.2% vs mois dernier",
    change: "up",
    icon: MousePointer,
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "CTR moyen",
    value: "2.48%",
    description: "↑ 3.1% vs mois dernier",
    change: "up",
    icon: Percent,
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
];

export default function StatsGrid() {
  return (
    <div className=" px-4 sm:px-6 lg:px-[var(--spacing-6)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-4)]">
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
            </div>
            <div className="text-2xl font-bold text-[var(--color-gray-900)] mb-[var(--spacing-2)]">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-[var(--color-gray-700)] mb-[var(--spacing-1)]">
              {stat.title}
            </div>
            <div
              className={`text-sm ${stat.change === "up" ? "text-[var(--color-success-500)]" : "text-[var(--color-gray-500)]"}`}
            >
              {stat.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
