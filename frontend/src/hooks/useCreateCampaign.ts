/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCampaigns.ts (ajouter cette fonction à votre fichier existant)

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../lib/api";
import type { ApiError } from "../types/apiError";
import type { Campaign, CampaignStatus } from "../types/campaigns";

interface CreateCampaignRequest {
  name: string;
  advertiser: string;
  budget: number;
  startDate: string;
  endDate: string;
  status?: CampaignStatus;
  impressions?: number;
  clicks?: number;
}

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  const createCampaign = async (
    campaignData: CreateCampaignRequest,
  ): Promise<Campaign> => {
    try {
      if (!campaignData.name.trim()) {
        throw new Error("Le nom de la campagne est requis");
      }
      if (!campaignData.advertiser.trim()) {
        throw new Error("Le nom de l'annonceur est requis");
      }
      if (campaignData.budget <= 0) {
        throw new Error("Le budget doit être supérieur à 0");
      }
      if (!campaignData.startDate) {
        throw new Error("La date de début est requise");
      }
      if (!campaignData.endDate) {
        throw new Error("La date de fin est requise");
      }

      const startDate = new Date(campaignData.startDate);
      const endDate = new Date(campaignData.endDate);

      if (endDate <= startDate) {
        throw new Error(
          "La date de fin doit être postérieure à la date de début",
        );
      }

      const defaultImpressions =
        campaignData.impressions !== undefined ? campaignData.impressions : 0;
      const defaultClicks =
        campaignData.clicks !== undefined ? campaignData.clicks : 0;

      if (defaultImpressions < 0) {
        throw new Error("Le nombre d'impressions ne peut pas être négatif");
      }
      if (defaultClicks < 0) {
        throw new Error("Le nombre de clics ne peut pas être négatif");
      }
      if (defaultClicks > defaultImpressions) {
        throw new Error(
          "Le nombre de clics ne peut pas être supérieur au nombre d'impressions",
        );
      }

      const response = await axios.post<Campaign>(
        `${API_BASE_URL}/api/campaigns`,
        {
          ...campaignData,
          status: campaignData.status || "ACTIVE",
          impressions: defaultImpressions,
          clicks: defaultClicks,
        },
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
            `Erreur ${axiosError.response.status}: ${axiosError.response.data?.message || "Erreur lors de la création de la campagne"}`,
          );
        } else if (axiosError.request) {
          throw new Error(
            "Aucune réponse du serveur. Vérifiez votre connexion.",
          );
        }
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "Une erreur inattendue est survenue lors de la création de la campagne",
      );
    }
  };

  const mutation = useMutation<Campaign, Error, CreateCampaignRequest>({
    mutationFn: createCampaign,
    onSuccess: (newCampaign) => {
      queryClient.invalidateQueries({
        queryKey: ["campaigns"],
      });

      queryClient.invalidateQueries({
        queryKey: ["campaigns", { status: "ACTIVE" }],
      });

      queryClient.setQueryData<Campaign[]>(["campaigns"], (oldData = []) => {
        return [newCampaign, ...oldData];
      });

      queryClient.setQueryData(
        ["campaigns", { status: "ACTIVE", page: 1 }],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: [newCampaign, ...oldData.data],
            total: oldData.total + 1,
          };
        },
      );
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la campagne:", error);
    },
  });

  return mutation;
};
