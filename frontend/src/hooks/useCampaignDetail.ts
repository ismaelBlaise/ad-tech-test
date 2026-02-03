/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../lib/api";
import type { ApiError } from "../types/apiError";
import type {
  Campaign,
  CampaignStatus,
  CampaignStats,
} from "../types/campaigns";

interface UpdateStatusRequest {
  status: CampaignStatus;
}

interface UseCampaignDetailOptions {
  enabled?: boolean;
}

export const useCampaignDetail = (
  id?: string,
  options: UseCampaignDetailOptions = {},
) => {
  const { enabled = true } = options;

  const fetchCampaign = async (): Promise<Campaign> => {
    if (!id) {
      throw new Error("ID de campagne requis");
    }

    try {
      const response = await axios.get<Campaign>(
        `${API_BASE_URL}/api/campaigns/${id}`,
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
            `Erreur ${axiosError.response.status}: ${axiosError.response.data?.message || "Campagne non trouvée"}`,
          );
        } else if (axiosError.request) {
          throw new Error(
            "Aucune réponse du serveur. Vérifiez votre connexion.",
          );
        }
      }
      throw new Error(
        "Une erreur inattendue est survenue lors de la récupération de la campagne",
      );
    }
  };

  const query = useQuery<Campaign, Error>({
    queryKey: ["campaign", id],
    queryFn: fetchCampaign,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: enabled && !!id,
  });

  return query;
};

export const useCampaignStats = (id?: string) => {
  const fetchCampaignStats = async (): Promise<CampaignStats> => {
    if (!id) {
      throw new Error("ID de campagne requis");
    }

    try {
      const response = await axios.get<CampaignStats>(
        `${API_BASE_URL}/api/campaigns/${id}/stats`,
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
            `Erreur ${axiosError.response.status}: ${axiosError.response.data?.message || "Statistiques non disponibles"}`,
          );
        } else if (axiosError.request) {
          throw new Error(
            "Aucune réponse du serveur. Vérifiez votre connexion.",
          );
        }
      }
      throw new Error(
        "Une erreur inattendue est survenue lors de la récupération des statistiques",
      );
    }
  };

  return useQuery<CampaignStats, Error>({
    queryKey: ["campaign-stats", id],
    queryFn: fetchCampaignStats,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!id,
  });
};

export const useUpdateCampaignStatus = () => {
  const queryClient = useQueryClient();

  const updateCampaignStatus = async ({
    id,
    status,
  }: {
    id: string;
    status: CampaignStatus;
  }): Promise<Campaign> => {
    try {
      const response = await axios.patch<Campaign>(
        `${API_BASE_URL}/api/campaigns/${id}/status`,
        { status } as UpdateStatusRequest,
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
            `Erreur ${axiosError.response.status}: ${axiosError.response.data?.message || "Erreur lors de la mise à jour du statut"}`,
          );
        } else if (axiosError.request) {
          throw new Error(
            "Aucune réponse du serveur. Vérifiez votre connexion.",
          );
        }
      }
      throw new Error(
        "Une erreur inattendue est survenue lors de la mise à jour du statut",
      );
    }
  };

  const mutation = useMutation<
    Campaign,
    Error,
    { id: string; status: CampaignStatus }
  >({
    mutationFn: updateCampaignStatus,
    onSuccess: (updatedCampaign, variables) => {
      queryClient.setQueryData(["campaign", variables.id], updatedCampaign);

      queryClient.invalidateQueries({
        queryKey: ["campaigns"],
      });

      queryClient.invalidateQueries({
        queryKey: ["campaign", variables.id],
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du statut:", error);
    },
  });

  return mutation;
};

export const useCampaignDetailWithStats = (id?: string) => {
  const campaignQuery = useCampaignDetail(id);
  const statsQuery = useCampaignStats(id);
  const updateStatusMutation = useUpdateCampaignStatus();

  const isLoading = campaignQuery.isLoading || statsQuery.isLoading;
  const isError = campaignQuery.isError || statsQuery.isError;
  const error = campaignQuery.error || statsQuery.error;

  const combinedData =
    campaignQuery.data && statsQuery.data
      ? {
          ...campaignQuery.data,
          stats: statsQuery.data,
        }
      : undefined;

  const handleUpdateStatus = (status: CampaignStatus) => {
    if (id) {
      updateStatusMutation.mutate({ id, status });
    }
  };

  return {
    data: combinedData,
    isLoading,
    isError,
    error,
    campaignQuery,
    statsQuery,
    updateStatus: handleUpdateStatus,
    isUpdating: updateStatusMutation.isPending,
    updateError: updateStatusMutation.error,
    refetch: () => {
      campaignQuery.refetch();
      statsQuery.refetch();
    },
  };
};
