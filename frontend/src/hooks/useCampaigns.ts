/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
// hooks/useCampaigns.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../lib/api";
import type { ApiError } from "../types/apiError";
import { useEffect, useState } from "react";
import type { CampaignsResponse } from "../types/campaigns";

export type CampaignStatus = "ACTIVE" | "PAUSED" | "FINISHED" | "ALL";

export interface UseCampaignsOptions {
  page?: number;
  limit?: number;
  advertiser?: string;
  budgetMin?: number;
  budgetMax?: number;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  status?: CampaignStatus;
  enabled?: boolean;
}

const fetchCampaigns = async (
  options: UseCampaignsOptions = {},
): Promise<CampaignsResponse> => {
  const {
    page = 1,
    limit = 10,
    advertiser,
    budgetMin,
    budgetMax,
    startDateFrom,
    startDateTo,
    endDateFrom,
    endDateTo,
    status = "ALL",
  } = options;

  const params: Record<string, any> = {
    page,
    limit,
  };

  if (status !== "ALL") {
    params.status = status;
  }

  if (advertiser) params.advertiser = advertiser;
  if (budgetMin !== undefined) params.budgetMin = budgetMin;
  if (budgetMax !== undefined) params.budgetMax = budgetMax;
  if (startDateFrom) params.startDateFrom = startDateFrom;
  if (startDateTo) params.startDateTo = startDateTo;
  if (endDateFrom) params.endDateFrom = endDateFrom;
  if (endDateTo) params.endDateTo = endDateTo;

  try {
    const response = await axios.get<CampaignsResponse>(
      `${API_BASE_URL}/api/campaigns`,
      {
        params,
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
    throw new Error(
      "Une erreur inattendue est survenue lors de la récupération des campagnes",
    );
  }
};

export const useCampaigns = (
  options: UseCampaignsOptions = {},
): UseQueryResult<CampaignsResponse, Error> => {
  const {
    page = 1,
    limit = 10,
    advertiser,
    budgetMin,
    budgetMax,
    startDateFrom,
    startDateTo,
    endDateFrom,
    endDateTo,
    status = "ALL",
    enabled = true,
  } = options;

  return useQuery<CampaignsResponse, Error>({
    queryKey: [
      "campaigns",
      page,
      limit,
      advertiser,
      budgetMin,
      budgetMax,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      status,
    ],
    queryFn: () => fetchCampaigns(options),
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled,
  });
};

export interface UseCampaignsPaginationOptions extends UseCampaignsOptions {
  initialPage?: number;
}

export const useCampaignsWithPagination = (
  options: UseCampaignsPaginationOptions = {},
) => {
  const { page: initialPage = 1, limit = 10, ...queryOptions } = options;

  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const query = useCampaigns({
    ...queryOptions,
    page,
    limit,
  });

  useEffect(() => {
    if (query.data?.total) {
      const calculatedTotalPages = Math.ceil(query.data.total / limit);
      setTotalPages(calculatedTotalPages);
    }
  }, [query.data?.total, limit]);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return {
    ...query,
    page,
    setPage: goToPage,
    totalPages,
    nextPage,
    prevPage,
    limit,
    totalItems: query.data?.total || 0,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const useCampaignsActive = (
  options: Omit<UseCampaignsOptions, "status"> = {},
): UseQueryResult<CampaignsResponse, Error> => {
  return useCampaigns({
    ...options,
    status: "ACTIVE",
  });
};

export const useCampaignsActiveWithPagination = (
  options: UseCampaignsPaginationOptions = {},
) => {
  return useCampaignsWithPagination({
    ...options,
    status: "ACTIVE",
  });
};
