/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
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
} from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useCampaignsActiveWithPagination } from "../../hooks/useCampaignsActive";
import { getStatusColor } from "../../hooks/useCampaignStats";

const ITEMS_PER_PAGE = 5;

export default function CampaignsTable() {
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
  } = useCampaignsActiveWithPagination({
    limit: ITEMS_PER_PAGE,
    enabled: true,
  });

  React.useEffect(() => {
    if (isError && error) {
      toast.error(`Erreur lors du chargement des campagnes: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [isError, error]);

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

  const translateStatus = (status: "ACTIVE" | "PAUSED" | "FINISHED") => {
    switch (status) {
      case "ACTIVE":
        return "Active";
      case "PAUSED":
        return "En pause";
      case "FINISHED":
        return "Terminée";
      default:
        return status;
    }
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
      <div className="overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-[var(--spacing-6)]">
          <div className="text-center py-8">
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-700 font-medium mb-2">
                Erreur de chargement
              </div>
              <div className="text-red-600 text-sm mb-4">
                {error?.message || "Erreur inconnue"}
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeCampaignsCount = campaignsData?.data?.length || 0;
  const currentStartIndex = (page - 1) * ITEMS_PER_PAGE + 1;
  const currentEndIndex = Math.min(page * ITEMS_PER_PAGE, totalItems);

  return (
    <div className="overflow-hidden">
      <div className="p-4 sm:p-6 lg:p-[var(--spacing-6)]">
        <div className="flex flex-col gap-4 mb-6 lg:mb-[var(--spacing-6)]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-gray-900)] flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] rounded-lg shadow-sm">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span>Campagnes actives</span>
              <span className="px-2.5 py-0.5 text-xs sm:text-sm font-medium bg-[var(--color-primary-500)]/10 text-[var(--color-primary-700)] rounded-full">
                {activeCampaignsCount}{" "}
                {activeCampaignsCount === 1 ? "active" : "actives"}
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-gray-600)] mt-2">
              Gestion et suivi de vos campagnes publicitaires
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2 sm:mt-4">
            <button className="flex items-center justify-center text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] font-medium group/cta order-2 sm:order-1">
              <span className="px-3 py-1.5 bg-[var(--color-primary-500)]/10 rounded-lg group-hover/cta:bg-[var(--color-primary-500)]/20 transition-colors text-sm sm:text-base">
                Explorer toutes les campagnes
              </span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover/cta:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white font-medium rounded-[var(--radius-md)] hover:shadow-[var(--shadow-md)] transition-all shadow-sm group order-1 sm:order-2 sm:ml-auto">
              <Plus className="w-4 h-4" />
              <span className="text-sm sm:text-base">Nouvelle campagne</span>
            </button>
          </div>
        </div>

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
                              <button className="p-1.5 hover:bg-[var(--color-primary-50)] rounded-[var(--radius-md)] transition-colors group/eye">
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
                      <button className="p-2 hover:bg-[var(--color-primary-50)] rounded-[var(--radius-md)] transition-colors group/eye">
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
              Aucune campagne active
            </h3>
            <p className="text-[var(--color-gray-500)] text-sm mb-4">
              Créez votre première campagne pour commencer
            </p>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white font-medium rounded-[var(--radius-md)] hover:shadow-[var(--shadow-md)] transition-all shadow-sm mx-auto">
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
