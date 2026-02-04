/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  MoreVertical,
  Download,
  Share2,
  Calendar,
  Target,
  Eye,
  MousePointer,
  DollarSign,
  BarChart3,
  TrendingUp,
  Info,
  Pause,
  Play,
  StopCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";
import type { CampaignStatus } from "../types/campaigns";
import { useCampaignDetailWithStats } from "../hooks/useCampaignDetail";

interface CampaignDetailProps {
  campaignId?: string;
  onBack?: () => void;
}

export default function CampaignDetail({ onBack }: CampaignDetailProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Récupérer l'ID depuis les query params
  const searchParams = new URLSearchParams(location.search);
  const campaignId = searchParams.get("id");

  const {
    data,
    isLoading,
    isError,
    error,
    updateStatus,
    isUpdating,
    updateError,
    refetch,
  } = useCampaignDetailWithStats(campaignId || undefined);

  useEffect(() => {
    if (isError && error) {
      toast.error(`Erreur: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }

    if (updateError) {
      toast.error(`Erreur de mise à jour: ${updateError.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [isError, error, updateError]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
    } catch (error) {
      return "Date invalide";
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const calculateCTR = () => {
    if (!data?.impressions) return "0.00%";
    const ctr = (data.clicks / data.impressions) * 100;
    return `${ctr.toFixed(2).replace(".", ",")}%`;
  };

  const calculateCPC = () => {
    if (!data?.clicks || data.clicks === 0) return "0.00 €";
    const cpc = data.budget / data.clicks;
    return `${cpc.toFixed(2).replace(".", ",")} €`;
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(budget);
  };

  const getStatusColor = (status: CampaignStatus | string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-800";
      case "PAUSED":
        return "bg-amber-100 text-amber-800";
      case "FINISHED":
        return "bg-[var(--color-gray-200)] text-[var(--color-gray-700)]";
      default:
        return "bg-[var(--color-gray-200)] text-[var(--color-gray-700)]";
    }
  };

  const translateStatus = (status: CampaignStatus | string) => {
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

  const handlePause = () => {
    if (data?._id) {
      updateStatus("PAUSED");
      toast.success("Campagne mise en pause", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleResume = () => {
    if (data?._id) {
      updateStatus("ACTIVE");
      toast.success("Campagne reprise", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleStop = () => {
    if (data?._id) {
      updateStatus("FINISHED");
      toast.success("Campagne arrêtée", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[var(--color-primary-500)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-gray-600)]">
            Chargement de la campagne...
          </p>
        </div>
      </div>
    );
  }

  if (isError && !data) {
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

  const campaign = data;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-[var(--color-gray-200)] bg-white gap-4">
          <button
            onClick={handleBack}
            disabled={isUpdating}
            className="flex items-center gap-2 text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] transition-colors w-full sm:w-auto disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Retour aux campagnes</span>
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              {campaign!.status === "ACTIVE" && (
                <button
                  onClick={handlePause}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-[var(--radius-md)] transition-colors text-sm font-medium w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                  <span>{isUpdating ? "Mise à jour..." : "Pauser"}</span>
                </button>
              )}
              {campaign!.status === "PAUSED" && (
                <button
                  onClick={handleResume}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-[var(--radius-md)] transition-colors text-sm font-medium w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>{isUpdating ? "Mise à jour..." : "Continuer"}</span>
                </button>
              )}
              <button
                onClick={handleStop}
                disabled={isUpdating || campaign!.status === "FINISHED"}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[var(--color-gray-100)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-200)] rounded-[var(--radius-md)] transition-colors text-sm font-medium w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <StopCircle className="w-4 h-4" />
                )}
                <span>{isUpdating ? "Mise à jour..." : "Arrêter"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-gray-900)] mb-3">
                  {campaign!.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(
                      campaign!.status,
                    )}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        campaign!.status === "ACTIVE"
                          ? "bg-emerald-500"
                          : campaign!.status === "PAUSED"
                            ? "bg-amber-500"
                            : "bg-[var(--color-gray-500)]"
                      }`}
                    ></div>
                    {translateStatus(campaign!.status)}
                  </span>

                  <div className="flex items-center gap-2 text-[var(--color-gray-600)]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {formatDate(campaign!.startDate)} -{" "}
                      {formatDate(campaign!.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[var(--color-gray-200)] to-[var(--color-gray-300)] flex items-center justify-center font-medium text-lg sm:text-xl text-[var(--color-gray-700)]">
                  {campaign!.advertiser.charAt(0)}
                </div>
                <div>
                  <div className="text-sm text-[var(--color-gray-500)]">
                    Annonceur
                  </div>
                  <div className="font-semibold text-base sm:text-lg text-[var(--color-gray-900)]">
                    {campaign!.advertiser}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white border border-[var(--color-gray-200)] rounded-[var(--radius-md)] p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-[var(--color-gray-500)]">
                    Impressions
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-gray-900)]">
                    {formatNumber(campaign!.impressions)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[var(--color-gray-200)] rounded-[var(--radius-md)] p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MousePointer className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-[var(--color-gray-500)]">
                    Clics
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-gray-900)]">
                    {formatNumber(campaign!.clicks)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[var(--color-gray-200)] rounded-[var(--radius-md)] p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-[var(--color-gray-500)]">
                    CTR
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-gray-900)]">
                    {calculateCTR()}
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--color-gray-500)] mt-1">
                    Taux de clic
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[var(--color-gray-200)] rounded-[var(--radius-md)] p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-[var(--color-gray-500)]">
                    CPC
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-gray-900)]">
                    {calculateCPC()}
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--color-gray-500)] mt-1">
                    Coût par clic
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-[var(--color-gray-200)] rounded-[var(--radius-md)] p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <BarChart3 className="w-5 h-5 text-[var(--color-gray-700)]" />
                <h2 className="text-lg font-semibold text-[var(--color-gray-900)]">
                  Détails de la campagne
                </h2>
              </div>
              <p className="text-sm text-[var(--color-gray-500)] mb-4 sm:mb-6">
                Informations complètes
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <div className="text-xs font-medium text-[var(--color-gray-500)] mb-1">
                    ID
                  </div>
                  <div className="text-sm font-medium text-[var(--color-gray-900)]">
                    {campaign!._id}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-[var(--color-gray-500)] mb-1">
                    Budget
                  </div>
                  <div className="text-sm font-medium text-[var(--color-gray-900)]">
                    {formatBudget(campaign!.budget)}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-[var(--color-gray-500)] mb-1">
                    Date de début
                  </div>
                  <div className="text-sm font-medium text-[var(--color-gray-900)]">
                    {formatDate(campaign!.startDate)}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-[var(--color-gray-500)] mb-1">
                    Date de fin
                  </div>
                  <div className="text-sm font-medium text-[var(--color-gray-900)]">
                    {formatDate(campaign!.endDate)}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-[var(--color-gray-500)] mb-1">
                    Annonceur
                  </div>
                  <div className="text-sm font-medium text-[var(--color-gray-900)]">
                    {campaign!.advertiser}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-[var(--color-gray-500)] mb-1">
                    Statut
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(
                        campaign!.status,
                      )}`}
                    >
                      {translateStatus(campaign!.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[var(--color-gray-200)] rounded-[var(--radius-md)] p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <TrendingUp className="w-5 h-5 text-[var(--color-gray-700)]" />
                <h2 className="text-lg font-semibold text-[var(--color-gray-900)]">
                  Analyse des performances
                </h2>
              </div>
              <p className="text-sm text-[var(--color-gray-500)] mb-4 sm:mb-6">
                Métriques calculées
              </p>

              <div className="space-y-6 sm:space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-[var(--color-primary-600)]" />
                    <div className="text-sm font-medium text-[var(--color-gray-900)]">
                      Taux de clic (CTR)
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[var(--color-gray-900)] mb-3">
                    {calculateCTR()}
                  </div>
                  <div className="text-sm text-[var(--color-gray-500)] mb-2">
                    Formule: (clics / impressions) × 100
                  </div>
                  <div className="text-sm font-medium text-[var(--color-gray-700)] bg-[var(--color-gray-50)] p-3 sm:p-4 rounded-[var(--radius-md)]">
                    {formatNumber(campaign!.clicks)} /{" "}
                    {formatNumber(campaign!.impressions)} × 100
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-[var(--color-primary-600)]" />
                    <div className="text-sm font-medium text-[var(--color-gray-900)]">
                      Coût par clic (CPC)
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[var(--color-gray-900)] mb-3">
                    {calculateCPC()}
                  </div>
                  <div className="text-sm text-[var(--color-gray-500)] mb-2">
                    Formule: budget / clics
                  </div>
                  <div className="text-sm font-medium text-[var(--color-gray-700)] bg-[var(--color-gray-50)] p-3 sm:p-4 rounded-[var(--radius-md)]">
                    {formatNumber(campaign!.budget)} € /{" "}
                    {formatNumber(campaign!.clicks)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
