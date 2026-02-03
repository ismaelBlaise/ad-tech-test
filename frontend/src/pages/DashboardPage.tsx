import StatsGrid from "../components/dashboard/StatsGrid";
import BudgetCard from "../components/dashboard/BudgetCard";
import CampaignsTable from "../components/dashboard/CampaignsTable";

export default function DashboardPage() {
  return (
    <div className="p-[var(--spacing-6)]">
      <div className="px-4 sm:px-6 lg:px-[var(--spacing-6)] mb-[var(--spacing-8)]">
        <h1 className="text-3xl font-bold text-[var(--color-gray-900)] mb-[var(--spacing-2)]">
          Dashboard
        </h1>
        <p className="text-[var(--color-gray-600)]">
          Vue d'ensemble de vos campagnes publicitaires
        </p>
      </div>

      <div className="flex flex-col gap-[var(--spacing-6)] mb-[var(--spacing-8)]">
        <div className="grid grid-cols-2 gap-[var(--spacing-6)] lg:col-span-2">
          <div className="col-span-2">
            <StatsGrid />
          </div>
        </div>
        <div className="lg:col-span-1">
          <BudgetCard />
        </div>
      </div>

      <CampaignsTable />
    </div>
  );
}
