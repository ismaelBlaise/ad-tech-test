export interface Campaign {
  _id: string;
  name: string;
  advertiser: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "PAUSED" | "FINISHED";
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CampaignsResponse {
  data: Campaign[];
  total: number;
}

export interface CampaignStats {
  ctr: number;
  cpc: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  conversionRate?: number;
  spent?: number;
  remainingBudget?: number;
  avgPosition?: number;
  lastUpdated?: string;
}

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
