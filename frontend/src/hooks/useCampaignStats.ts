import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../lib/api";
import type { CampaignStats } from "../types/campaignStats";
import type { ApiError } from "../types/apiError";

const fetchCampaignStats = async (): Promise<CampaignStats> => {
  try {
    const response = await axios.get<CampaignStats>(
      `${API_BASE_URL}/api/campaigns/stats/overview`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response) {
        throw new Error(
          `Erreur ${axiosError.response.status}: ${axiosError.response.data?.message || "Erreur serveur"}`,
        );
      } else if (axiosError.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      }
    }
    throw new Error("Une erreur inattendue est survenue");
  }
};

export const useCampaignStats = (): UseQueryResult<CampaignStats, Error> => {
  return useQuery<CampaignStats, Error>({
    queryKey: ["campaignStats", "overview"],
    queryFn: fetchCampaignStats,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

export const getStatusColor = (status: "ACTIVE" | "PAUSED" | "FINISHED") => {
  switch (status) {
    case "ACTIVE":
      return "bg-gradient-to-r from-[var(--color-success-500)]/20 to-emerald-500/20 text-[var(--color-success-500)] border border-[var(--color-success-500)]/30";
    case "PAUSED":
      return "bg-gradient-to-r from-[var(--color-warning-500)]/20 to-amber-500/20 text-[var(--color-warning-500)] border border-[var(--color-warning-500)]/30";
    case "FINISHED":
      return "bg-gradient-to-r from-[var(--color-gray-200)] to-[var(--color-gray-300)] text-[var(--color-gray-700)] border border-[var(--color-gray-300)]";
    default:
      return "bg-gradient-to-r from-[var(--color-gray-200)] to-[var(--color-gray-300)] text-[var(--color-gray-700)] border border-[var(--color-gray-300)]";
  }
};

export const translateStatus = (status: "ACTIVE" | "PAUSED" | "FINISHED") => {
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
