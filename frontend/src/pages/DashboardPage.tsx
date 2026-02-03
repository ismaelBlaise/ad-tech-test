/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StatsGrid from "../components/dashboard/StatsGrid";
import BudgetCard from "../components/dashboard/BudgetCard";
import CampaignsTable from "../components/dashboard/CampaignsTable";
import { useCampaignStats } from "../hooks/useCampaignStats";

export default function DashboardPage() {
  const {
    data: stats,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useCampaignStats();

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isError && error && !showError) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => setShowError(false),
      });
      setShowError(true);
    }
  }, [isError, error, showError]);

  useEffect(() => {
    if (!isError) {
      setShowError(false);
    }
  }, [isError]);

  if (isLoading) {
    return (
      <div className="p-[var(--spacing-6)] min-h-screen flex flex-col">
        <div className="px-4 sm:px-6 lg:px-[var(--spacing-6)] mb-[var(--spacing-8)]">
          <div className="h-8 w-64 bg-[var(--color-gray-200)] rounded animate-pulse mb-[var(--spacing-2)]"></div>
          <div className="h-4 w-96 bg-[var(--color-gray-200)] rounded animate-pulse"></div>
        </div>

        <div className="flex-1 flex flex-col gap-[var(--spacing-6)]">
          <div className="px-4 sm:px-6 lg:px-[var(--spacing-6)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-4)]">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-gray-200)] p-[var(--spacing-4)]"
              >
                <div className="flex items-center justify-between mb-[var(--spacing-3)]">
                  <div className="w-10 h-10 bg-[var(--color-gray-200)] rounded-lg animate-pulse"></div>
                  <div className="w-6 h-6 bg-[var(--color-gray-200)] rounded-full animate-pulse"></div>
                </div>
                <div className="h-8 w-24 bg-[var(--color-gray-200)] rounded animate-pulse mb-[var(--spacing-2)]"></div>
                <div className="h-4 w-32 bg-[var(--color-gray-200)] rounded animate-pulse mb-[var(--spacing-1)]"></div>
                <div className="h-4 w-40 bg-[var(--color-gray-200)] rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="px-4 sm:px-6 lg:px-[var(--spacing-6)] grid grid-cols-2 gap-[var(--spacing-4)]">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-gray-200)] p-[var(--spacing-4)] animate-pulse"
              >
                <div className="flex items-center gap-[var(--spacing-2)] mb-[var(--spacing-3)]">
                  <div className="w-10 h-10 bg-[var(--color-gray-200)] rounded-lg"></div>
                  <div className="h-5 w-24 bg-[var(--color-gray-200)] rounded"></div>
                </div>
                <div className="h-8 w-32 bg-[var(--color-gray-200)] rounded mb-[var(--spacing-2)]"></div>
                <div className="h-4 w-40 bg-[var(--color-gray-200)] rounded"></div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-gray-200)] p-[var(--spacing-6)] animate-pulse">
            <div className="flex items-center justify-between mb-[var(--spacing-6)]">
              <div className="h-6 w-48 bg-[var(--color-gray-200)] rounded"></div>
              <div className="h-8 w-24 bg-[var(--color-gray-200)] rounded"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-[var(--color-gray-200)] rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError && !stats) {
    return (
      <div className="p-[var(--spacing-6)] min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[var(--color-gray-50)] to-white">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-gray-200)] shadow-[var(--shadow-lg)] overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-[var(--spacing-6)] text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.282 16.5c-.77.833.192 2.5 1.732 2.5z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">
                Erreur de chargement
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Impossible de récupérer les données
              </p>
            </div>

            <div className="p-[var(--spacing-6)]">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-[var(--radius-md)]">
                  <svg
                    className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-800">
                      Détails de l'erreur
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      {error?.message || "Erreur inconnue"}
                    </p>
                  </div>
                </div>

                <div className="bg-[var(--color-gray-50)] rounded-[var(--radius-md)] p-4">
                  <h3 className="text-sm font-semibold text-[var(--color-gray-700)] mb-2">
                    Que faire ?
                  </h3>
                  <ul className="space-y-2 text-sm text-[var(--color-gray-600)]">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      Vérifiez votre connexion internet
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      Rafraîchissez la page
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      Contactez le support si le problème persiste
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-[var(--spacing-6)] pt-[var(--spacing-4)] border-t border-[var(--color-gray-200)] flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => refetch()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-medium rounded-[var(--radius-lg)] transition-all duration-200 hover:shadow-[var(--shadow-md)] active:scale-[0.98]"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                  Réessayer
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[var(--color-gray-300)] hover:bg-[var(--color-gray-50)] text-[var(--color-gray-700)] font-medium rounded-[var(--radius-lg)] transition-all duration-200 active:scale-[0.98]"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    ></path>
                  </svg>
                  Rafraîchir la page
                </button>
              </div>

              <div className="mt-[var(--spacing-4)] text-center">
                <p className="text-xs text-[var(--color-gray-500)]">
                  Problème persistant ?{" "}
                  <button className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] font-medium">
                    Contacter le support
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-[var(--spacing-4)] text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-gray-100)] rounded-full">
              <div
                className={`w-2 h-2 rounded-full ${navigator.onLine ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
              ></div>
              <span className="text-xs text-[var(--color-gray-600)]">
                {navigator.onLine ? "Connecté à Internet" : "Hors ligne"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-[var(--spacing-6)]">
      <div className="px-4 sm:px-6 lg:px-[var(--spacing-6)] mb-[var(--spacing-8)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-gray-900)] mb-[var(--spacing-2)]">
              Dashboard
            </h1>
            <p className="text-[var(--color-gray-600)]">
              Vue d'ensemble de vos campagnes publicitaires
            </p>
          </div>
          {isFetching && (
            <div className="flex items-center gap-2 text-sm text-[var(--color-gray-500)]">
              <div className="w-3 h-3 border-2 border-[var(--color-primary-500)] border-t-transparent rounded-full animate-spin"></div>
              <span>Mise à jour...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-[var(--spacing-6)] mb-[var(--spacing-8)]">
        <div className="grid grid-cols-2 gap-[var(--spacing-6)] lg:col-span-2">
          <div className="col-span-2">
            <StatsGrid
              activeCampaigns={stats?.activeCampaigns}
              totalCampaigns={stats?.totalCampaigns}
              totalImpressionsFormatted={stats?.totalImpressionsFormatted}
              impressionsGrowth={stats?.impressionsGrowth}
              totalClicksFormatted={stats?.totalClicksFormatted}
              clicksGrowth={stats?.clicksGrowth}
              averageCTR={stats?.averageCTR}
              ctrGrowth={stats?.ctrGrowth}
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <BudgetCard
            totalBudget={stats?.totalBudget}
            totalBudgetFormatted={stats?.totalBudgetFormatted}
            averageCPC={stats?.averageCPC}
          />
        </div>
      </div>

      <CampaignsTable />
    </div>
  );
}
