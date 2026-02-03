/* eslint-disable react-hooks/set-state-in-effect */
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../lib/api";
import type { ApiError } from "../types/apiError";
import { useEffect, useState } from "react";
import type { CampaignsResponse } from "../types/campaigns";

export interface UseCampaignsActiveOptions {
  page?: number;
  limit?: number;
  advertiser?: string;
  budgetMin?: number;
  budgetMax?: number;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  enabled?: boolean;
}

const fetchCampaignsActive = async (
  options: UseCampaignsActiveOptions = {},
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
  } = options;

  try {
    const response = await axios.get<CampaignsResponse>(
      `${API_BASE_URL}/api/campaigns`,
      {
        params: {
          status: "ACTIVE",
          page,
          limit,
          ...(advertiser && { advertiser }),
          ...(budgetMin !== undefined && { budgetMin }),
          ...(budgetMax !== undefined && { budgetMax }),
          ...(startDateFrom && { startDateFrom }),
          ...(startDateTo && { startDateTo }),
          ...(endDateFrom && { endDateFrom }),
          ...(endDateTo && { endDateTo }),
        },
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

export const useCampaignsActive = (
  options: UseCampaignsActiveOptions = {},
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
    enabled = true,
  } = options;

  return useQuery<CampaignsResponse, Error>({
    queryKey: [
      "campaignsActive",
      page,
      limit,
      advertiser,
      budgetMin,
      budgetMax,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
    ],
    queryFn: () => fetchCampaignsActive(options),
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

export interface UseCampaignsActivePaginationOptions extends UseCampaignsActiveOptions {
  initialPage?: number;
}

export const useCampaignsActiveWithPagination = (
  options: UseCampaignsActivePaginationOptions = {},
) => {
  const { page: initialPage = 1, limit = 10, ...queryOptions } = options;

  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const query = useCampaignsActive({
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
