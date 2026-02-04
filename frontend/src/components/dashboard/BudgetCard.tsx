import { DollarSign, Target } from "lucide-react";

interface BudgetCardProps {
  totalBudget?: number;
  totalBudgetFormatted?: string;
  averageCPC?: number;
}

export default function BudgetCard({
  totalBudget = 0,
  totalBudgetFormatted = "0 €",
  averageCPC = 0,
}: BudgetCardProps) {
  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget);
  };

  const formatCPC = (cpc: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cpc);
  };

  const formattedBudget =
    totalBudgetFormatted !== "0 €"
      ? totalBudgetFormatted
      : formatBudget(totalBudget);

  const formattedCPC = formatCPC(averageCPC);

  return (
    <div className="px-4 sm:px-6 lg:px-[var(--spacing-6)] grid grid-cols-2 gap-[var(--spacing-4)]">
      <div className="bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] rounded-[var(--radius-lg)] border border-[var(--color-primary-200)] p-[var(--spacing-4)]">
        <div className="flex items-center gap-[var(--spacing-2)] mb-[var(--spacing-3)]">
          <div className="p-2 bg-white rounded-lg">
            <DollarSign className="w-4 h-4 text-[var(--color-primary-600)]" />
          </div>
          <h2 className="text-lg font-bold text-[var(--color-gray-900)]">
            Budget total
          </h2>
        </div>
        <div className="text-2xl font-bold text-[var(--color-gray-900)]">
          {formattedBudget}
        </div>
        <div className="text-sm text-[var(--color-gray-600)]">
          Toutes campagnes confondues
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-[var(--radius-lg)] border border-emerald-200 p-[var(--spacing-4)]">
        <div className="flex items-center gap-[var(--spacing-2)] mb-[var(--spacing-3)]">
          <div className="p-2 bg-white rounded-lg">
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-[var(--color-gray-900)]">
            CPC moyen
          </h2>
        </div>
        <div className="text-2xl font-bold text-[var(--color-gray-900)]">
          {formattedCPC}
        </div>
        <div className="text-sm text-[var(--color-gray-600)]">CPC moyen</div>
        <div className="text-xs text-[var(--color-gray-500)]">
          Coût par clic global
        </div>
      </div>
    </div>
  );
}
