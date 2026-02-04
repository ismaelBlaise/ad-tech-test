/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Eye,
  ChevronLeft,
  MoreVertical,
  Target,
  Clock,
  Calendar,
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  Filter,
  X,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getStatusColor, translateStatus } from "../hooks/useCampaignStats";
import { useCampaignsWithPagination } from "../hooks/useCampaigns";
import type { CampaignStatus } from "../types/campaigns";

const ITEMS_PER_PAGE = 10;

export default function CampaignsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: "ALL" as CampaignStatus,
    advertiser: "",
    budgetMin: "",
    budgetMax: "",
    startDateFrom: "",
    startDateTo: "",
    endDateFrom: "",
    endDateTo: "",
  });

  const {
    data: campaignsData,
    isLoading,
    isError,
    error,
    page,
    setPage,
    totalPages,
    nextPage,
    prevPage,
    totalItems,
    hasNextPage,
    hasPrevPage,
    refetch,
  } = useCampaignsWithPagination({
    limit: ITEMS_PER_PAGE,
    enabled: true,
    status: filters.status === "ALL" ? undefined : filters.status,
    advertiser: filters.advertiser || undefined,
    budgetMin: filters.budgetMin ? Number(filters.budgetMin) : undefined,
    budgetMax: filters.budgetMax ? Number(filters.budgetMax) : undefined,
    startDateFrom: filters.startDateFrom || undefined,
    startDateTo: filters.startDateTo || undefined,
    endDateFrom: filters.endDateFrom || undefined,
    endDateTo: filters.endDateTo || undefined,
  });

  const [showFilters, setShowFilters] = useState(false);

  React.useEffect(() => {
    if (isError && error) {
      toast.error(`Erreur lors du chargement des campagnes: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [isError, error]);

  const handleViewDetails = (campaignId: string) => {
    navigate(`/detail?id=${campaignId}`);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  const handleApplyFilters = () => {
    refetch();
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters({
      status: "ALL",
      advertiser: "",
      budgetMin: "",
      budgetMax: "",
      startDateFrom: "",
      startDateTo: "",
      endDateFrom: "",
      endDateTo: "",
    });
    setPage(1);
    refetch();
    setShowFilters(false);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    try {
      const start = format(new Date(startDate), "dd/MM/yyyy", { locale: fr });
      const end = format(new Date(endDate), "dd/MM/yyyy", { locale: fr });
      return `${start} - ${end}`;
    } catch (error) {
      return "Date invalide";
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1).replace(".", ",")} M`;
    }
    if (num >= 1000) {
      return `${Math.round(num / 1000)} k`;
    }
    return formatNumber(num);
  };

  const calculateCTR = (impressions: number, clicks: number) => {
    if (impressions === 0) return "0%";
    const ctr = (clicks / impressions) * 100;
    return `${ctr.toFixed(2).replace(".", ",")}%`;
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(budget);
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-[var(--spacing-6)]">
          <div className="flex flex-col gap-4 mb-6 lg:mb-[var(--spacing-6)] animate-pulse">
            <div>
              <div className="h-8 w-64 bg-[var(--color-gray-200)] rounded mb-2"></div>
              <div className="h-4 w-96 bg-[var(--color-gray-200)] rounded"></div>
            </div>
          </div>

          <div className="hidden lg:block space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 bg-[var(--color-gray-200)] rounded"
              ></div>
            ))}
          </div>

          <div className="lg:hidden space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-40 bg-[var(--color-gray-200)] rounded"
              ></div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-[var(--color-gray-200)] animate-pulse">
            <div className="h-4 w-48 bg-[var(--color-gray-200)] rounded"></div>
            <div className="h-8 w-64 bg-[var(--color-gray-200)] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError && !campaignsData) {
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

  const currentStartIndex = (page - 1) * ITEMS_PER_PAGE + 1;
  const currentEndIndex = Math.min(page * ITEMS_PER_PAGE, totalItems);

  return (
    <div className="overflow-hidden mt-10">
      <div className="p-4 sm:p-6 lg:p-[var(--spacing-6)]">
        <div className="flex flex-col gap-4 mb-6 lg:mb-[var(--spacing-6)]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-gray-900)] flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] rounded-lg shadow-sm">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span>Toutes les campagnes</span>
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-gray-600)] mt-2">
              Gestion complète de toutes vos campagnes publicitaires
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2 sm:mt-4">
            <div className="flex items-center gap-2 order-1 sm:order-1">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[var(--color-gray-300)] rounded-[var(--radius-md)] hover:bg-[var(--color-gray-50)] transition-colors text-sm font-medium"
              >
                {showFilters ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Filter className="w-4 h-4" />
                )}
                <span>Filtres</span>
                {(filters.status !== "ALL" ||
                  filters.advertiser ||
                  filters.budgetMin ||
                  filters.budgetMax ||
                  filters.startDateFrom ||
                  filters.startDateTo ||
                  filters.endDateFrom ||
                  filters.endDateTo) && (
                  <span className="w-2 h-2 bg-[var(--color-primary-500)] rounded-full"></span>
                )}
              </button>

              <div className="flex gap-1">
                <button
                  onClick={() => handleFilterChange("status", "ALL")}
                  className={`px-2 py-1 text-xs rounded transition-colors ${filters.status === "ALL" ? "bg-[var(--color-primary-500)] text-white" : "bg-[var(--color-gray-100)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-200)]"}`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => handleFilterChange("status", "ACTIVE")}
                  className={`px-2 py-1 text-xs rounded transition-colors ${filters.status === "ACTIVE" ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"}`}
                >
                  Actives
                </button>
                <button
                  onClick={() => handleFilterChange("status", "PAUSED")}
                  className={`px-2 py-1 text-xs rounded transition-colors ${filters.status === "PAUSED" ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-800 hover:bg-amber-200"}`}
                >
                  En pause
                </button>
                <button
                  onClick={() => handleFilterChange("status", "FINISHED")}
                  className={`px-2 py-1 text-xs rounded transition-colors ${filters.status === "FINISHED" ? "bg-[var(--color-gray-500)] text-white" : "bg-[var(--color-gray-100)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-200)]"}`}
                >
                  Terminées
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate("/create")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white font-medium rounded-[var(--radius-md)] hover:shadow-[var(--shadow-md)] transition-all shadow-sm group order-2 sm:order-3 sm:ml-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm sm:text-base">Nouvelle campagne</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-white border border-[var(--color-gray-200)] rounded-[var(--radius-md)] shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                  Annonceur
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-gray-400)]" />
                  <input
                    type="text"
                    value={filters.advertiser}
                    onChange={(e) =>
                      handleFilterChange("advertiser", e.target.value)
                    }
                    placeholder="Rechercher un annonceur..."
                    className="w-full pl-10 pr-3 py-2 border border-[var(--color-gray-300)] rounded-[var(--radius-md)] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                  Budget minimum
                </label>
                <input
                  type="number"
                  value={filters.budgetMin}
                  onChange={(e) =>
                    handleFilterChange("budgetMin", e.target.value)
                  }
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-[var(--radius-md)] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                  Budget maximum
                </label>
                <input
                  type="number"
                  value={filters.budgetMax}
                  onChange={(e) =>
                    handleFilterChange("budgetMax", e.target.value)
                  }
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-[var(--radius-md)] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                  Début après le
                </label>
                <input
                  type="date"
                  value={filters.startDateFrom}
                  onChange={(e) =>
                    handleFilterChange("startDateFrom", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-[var(--radius-md)] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                  Début avant le
                </label>
                <input
                  type="date"
                  value={filters.startDateTo}
                  onChange={(e) =>
                    handleFilterChange("startDateTo", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-[var(--radius-md)] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                  Fin après le
                </label>
                <input
                  type="date"
                  value={filters.endDateFrom}
                  onChange={(e) =>
                    handleFilterChange("endDateFrom", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-[var(--radius-md)] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                  Fin avant le
                </label>
                <input
                  type="date"
                  value={filters.endDateTo}
                  onChange={(e) =>
                    handleFilterChange("endDateTo", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-[var(--radius-md)] text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-sm font-medium text-[var(--color-gray-700)] bg-[var(--color-gray-100)] hover:bg-[var(--color-gray-200)] rounded-[var(--radius-md)] transition-colors"
              >
                Réinitialiser
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] rounded-[var(--radius-md)] transition-colors"
              >
                Appliquer les filtres
              </button>
            </div>
          </div>
        )}

        {campaignsData?.data && campaignsData.data.length > 0 ? (
          <>
            <div className="hidden lg:block rounded-[var(--radius-md)] border border-[var(--color-gray-200)] bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-gray-200)]">
                      <th className="text-left py-4 px-[var(--spacing-4)] text-sm font-semibold text-[var(--color-gray-700)] bg-[var(--color-gray-50)] whitespace-nowrap">
                        Campagne
                      </th>
                      <th className="text-left py-4 px-[var(--spacing-4)] text-sm font-semibold text-[var(--color-gray-700)] bg-[var(--color-gray-50)] whitespace-nowrap">
                        Annonceur
                      </th>
                      <th className="text-left py-4 px-[var(--spacing-4)] text-sm font-semibold text-[var(--color-gray-700)] bg-[var(--color-gray-50)] whitespace-nowrap">
                        Budget
                      </th>
                      <th className="text-left py-4 px-[var(--spacing-4)] text-sm font-semibold text-[var(--color-gray-700)] bg-[var(--color-gray-50)] whitespace-nowrap">
                        Statistiques
                      </th>
                      <th className="text-left py-4 px-[var(--spacing-4)] text-sm font-semibold text-[var(--color-gray-700)] bg-[var(--color-gray-50)] whitespace-nowrap">
                        Statut
                      </th>
                      <th className="text-left py-4 px-[var(--spacing-4)] text-sm font-semibold text-[var(--color-gray-700)] bg-[var(--color-gray-50)] whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignsData.data.map((campaign: any) => {
                      const ctr = calculateCTR(
                        campaign.impressions,
                        campaign.clicks,
                      );
                      const isCtrGood = parseFloat(ctr) > 2.0;

                      return (
                        <tr
                          key={campaign._id}
                          className="border-b border-[var(--color-gray-100)] hover:bg-gradient-to-r from-[var(--color-primary-50)]/20 to-white transition-all duration-200 group"
                        >
                          <td className="py-4 px-[var(--spacing-4)]">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-gradient-to-br from-[var(--color-primary-500)]/10 to-[var(--color-primary-700)]/10 rounded-lg flex-shrink-0">
                                <Calendar className="w-4 h-4 text-[var(--color-primary-600)]" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-[var(--color-gray-900)] group-hover:text-[var(--color-primary-700)] transition-colors">
                                  {campaign.name}
                                </div>
                                <div className="text-sm text-[var(--color-gray-500)] flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">
                                    {formatDateRange(
                                      campaign.startDate,
                                      campaign.endDate,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-[var(--spacing-4)]">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gray-200)] to-[var(--color-gray-300)] flex items-center justify-center font-medium text-sm text-[var(--color-gray-700)] flex-shrink-0">
                                {campaign.advertiser.charAt(0)}
                              </div>
                              <span className="font-medium text-[var(--color-gray-900)]">
                                {campaign.advertiser}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-[var(--spacing-4)]">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-md flex-shrink-0">
                                <DollarSign className="w-3 h-3 text-amber-600" />
                              </div>
                              <div>
                                <div className="font-bold text-[var(--color-gray-900)] whitespace-nowrap">
                                  {formatBudget(campaign.budget)}
                                </div>
                                <div className="text-xs text-[var(--color-gray-500)]">
                                  Budget
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-[var(--spacing-4)]">
                            <div className="grid grid-cols-3 gap-2">
                              <div className="text-center">
                                <div className="font-bold text-[var(--color-gray-900)] text-sm">
                                  {formatLargeNumber(campaign.impressions)}
                                </div>
                                <div className="text-xs text-[var(--color-gray-500)]">
                                  Impressions
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-[var(--color-gray-900)] text-sm">
                                  {formatLargeNumber(campaign.clicks)}
                                </div>
                                <div className="text-xs text-[var(--color-gray-500)]">
                                  Clics
                                </div>
                              </div>
                              <div className="text-center flex flex-col items-center">
                                <div className="font-bold text-[var(--color-gray-900)] text-sm flex items-center gap-1">
                                  {ctr}
                                  {isCtrGood ? (
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3 text-amber-500" />
                                  )}
                                </div>
                                <div className="text-xs text-[var(--color-gray-500)]">
                                  CTR
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-[var(--spacing-4)]">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(campaign.status)}`}
                            >
                              {translateStatus(campaign.status)}
                            </span>
                          </td>
                          <td className="py-4 px-[var(--spacing-4)]">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDetails(campaign._id)}
                                className="p-1.5 hover:bg-[var(--color-primary-50)] rounded-[var(--radius-md)] transition-colors group/eye"
                              >
                                <Eye className="w-6 h-6 text-[var(--color-gray-500)] group-hover/eye:text-[var(--color-primary-600)]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:hidden space-y-3">
              {campaignsData.data.map((campaign: any) => {
                const ctr = calculateCTR(campaign.impressions, campaign.clicks);
                const isCtrGood = parseFloat(ctr) > 2.0;

                return (
                  <div
                    key={campaign._id}
                    className="bg-white rounded-[var(--radius-md)] border border-[var(--color-gray-200)] shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-gradient-to-br from-[var(--color-primary-500)]/10 to-[var(--color-primary-700)]/10 rounded-lg flex-shrink-0">
                          <Calendar className="w-4 h-4 text-[var(--color-primary-600)]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-[var(--color-gray-900)] mb-1">
                            {campaign.name}
                          </div>
                          <div className="text-xs text-[var(--color-gray-500)] flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">
                              {formatDateRange(
                                campaign.startDate,
                                campaign.endDate,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${getStatusColor(campaign.status)}`}
                      >
                        {translateStatus(campaign.status)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--color-gray-100)]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gray-200)] to-[var(--color-gray-300)] flex items-center justify-center font-medium text-sm text-[var(--color-gray-700)] flex-shrink-0">
                        {campaign.advertiser.charAt(0)}
                      </div>
                      <span className="font-medium text-[var(--color-gray-900)] text-sm">
                        {campaign.advertiser}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-md flex-shrink-0">
                        <DollarSign className="w-3 h-3 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-bold text-[var(--color-gray-900)] text-sm">
                          {formatBudget(campaign.budget)}
                        </div>
                        <div className="text-xs text-[var(--color-gray-500)]">
                          Budget
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3 pb-3 border-b border-[var(--color-gray-100)]">
                      <div className="text-center">
                        <div className="font-bold text-[var(--color-gray-900)] text-sm">
                          {formatLargeNumber(campaign.impressions)}
                        </div>
                        <div className="text-xs text-[var(--color-gray-500)]">
                          Impressions
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-[var(--color-gray-900)] text-sm">
                          {formatLargeNumber(campaign.clicks)}
                        </div>
                        <div className="text-xs text-[var(--color-gray-500)]">
                          Clics
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-[var(--color-gray-900)] text-sm flex items-center justify-center gap-1">
                          {ctr}
                          {isCtrGood ? (
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-amber-500" />
                          )}
                        </div>
                        <div className="text-xs text-[var(--color-gray-500)]">
                          CTR
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(campaign._id)}
                        className="p-2 hover:bg-[var(--color-primary-50)] rounded-[var(--radius-md)] transition-colors group/eye"
                      >
                        <Eye className="w-4 h-4 text-[var(--color-gray-500)] group-hover/eye:text-[var(--color-primary-600)]" />
                      </button>
                      <button className="p-2 hover:bg-[var(--color-gray-100)] rounded-[var(--radius-md)] transition-colors">
                        <MoreVertical className="w-4 h-4 text-[var(--color-gray-500)]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="mb-4">
              <Target className="w-12 h-12 mx-auto text-[var(--color-gray-300)]" />
            </div>
            <h3 className="text-lg font-medium text-[var(--color-gray-700)] mb-2">
              Aucune campagne trouvée
            </h3>
            <p className="text-[var(--color-gray-500)] text-sm mb-4">
              {filters.status !== "ALL" ||
              filters.advertiser ||
              filters.budgetMin ||
              filters.budgetMax ||
              filters.startDateFrom ||
              filters.startDateTo ||
              filters.endDateFrom ||
              filters.endDateTo
                ? "Aucune campagne ne correspond à vos critères de recherche"
                : "Créez votre première campagne pour commencer"}
            </p>
            <button
              onClick={() => navigate("/create")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white font-medium rounded-[var(--radius-md)] hover:shadow-[var(--shadow-md)] transition-all shadow-sm mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une campagne</span>
            </button>
          </div>
        )}

        {campaignsData?.data && campaignsData.data.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-[var(--color-gray-200)]">
            <div className="text-xs sm:text-sm text-[var(--color-gray-600)] text-center sm:text-left">
              Affichage{" "}
              <span className="font-semibold text-[var(--color-gray-900)]">
                {currentStartIndex}-{currentEndIndex}
              </span>{" "}
              sur{" "}
              <span className="font-semibold text-[var(--color-gray-900)]">
                {totalItems}
              </span>{" "}
              campagnes
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={!hasPrevPage}
                  className={`p-2 rounded-[var(--radius-md)] transition-all ${
                    !hasPrevPage
                      ? "opacity-50 cursor-not-allowed bg-[var(--color-gray-100)]"
                      : "hover:bg-[var(--color-gray-100)] hover:shadow-sm"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 text-[var(--color-gray-600)]" />
                </button>

                <div className="flex items-center gap-1 sm:gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPage(index + 1)}
                      className={`w-8 h-8 rounded-[var(--radius-md)] text-xs sm:text-sm font-medium transition-all ${
                        page === index + 1
                          ? "bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white shadow-sm"
                          : "hover:bg-[var(--color-gray-100)] text-[var(--color-gray-700)]"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={!hasNextPage}
                  className={`p-2 rounded-[var(--radius-md)] transition-all ${
                    !hasNextPage
                      ? "opacity-50 cursor-not-allowed bg-[var(--color-gray-100)]"
                      : "hover:bg-[var(--color-gray-100)] hover:shadow-sm"
                  }`}
                >
                  <ChevronRight className="w-4 h-4 text-[var(--color-gray-600)]" />
                </button>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-gray-100)] rounded-full">
                <span className="text-xs text-[var(--color-gray-600)]">
                  Page
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[var(--color-gray-900)]">
                  {page}/{totalPages}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
