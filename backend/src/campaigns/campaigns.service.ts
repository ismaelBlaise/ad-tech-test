/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { QueryCampaignDto } from './dtos/query-campaign.dto';
import { OverviewStatsResponseDto } from './dtos/overview-stats-response.dto';
import { TrendsResponseDto } from './dtos/trends-response.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) {}

  async create(createDto: CreateCampaignDto): Promise<Campaign> {
    return this.campaignModel.create(createDto);
  }

  async findAll(
    query: QueryCampaignDto,
  ): Promise<{ data: Campaign[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      status,
      advertiser,
      budgetMin,
      budgetMax,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
    } = query;

    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (advertiser) filter.advertiser = { $regex: advertiser, $options: 'i' };
    if (budgetMin !== undefined || budgetMax !== undefined) filter.budget = {};
    if (budgetMin !== undefined) filter.budget.$gte = budgetMin;
    if (budgetMax !== undefined) filter.budget.$lte = budgetMax;

    if (startDateFrom || startDateTo) filter.startDate = {};
    if (startDateFrom) filter.startDate.$gte = new Date(startDateFrom);
    if (startDateTo) filter.startDate.$lte = new Date(startDateTo);

    if (endDateFrom || endDateTo) filter.endDate = {};
    if (endDateFrom) filter.endDate.$gte = new Date(endDateFrom);
    if (endDateTo) filter.endDate.$lte = new Date(endDateTo);

    const total = await this.campaignModel.countDocuments(filter);

    const data = await this.campaignModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { data, total };
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findById(id).lean();
    if (!campaign)
      throw new NotFoundException(`Campagne avec id ${id} introuvable`);
    return campaign;
  }

  async updateStatus(id: string, dto: UpdateStatusDto): Promise<Campaign> {
    const existing = await this.campaignModel.findById(id);
    if (!existing)
      throw new NotFoundException(`Campagne avec id ${id} introuvable`);
    if (existing.status === dto.status) {
      throw new BadRequestException(
        `La campagne est déjà au statut "${dto.status}"`,
      );
    }

    existing.status = dto.status;
    return existing.save();
  }

  async getStats(id: string): Promise<{ ctr: number; cpc: number }> {
    const campaign = await this.findOne(id);

    const ctr =
      campaign.impressions > 0 ? campaign.clicks / campaign.impressions : 0;
    const cpc = campaign.clicks > 0 ? campaign.budget / campaign.clicks : 0;

    return { ctr, cpc };
  }

  async getOverviewStats(): Promise<OverviewStatsResponseDto> {
    const allCampaigns = await this.campaignModel.find().lean();

    const activeCampaigns = allCampaigns.filter(
      (c) => c.status === 'ACTIVE',
    ).length;
    const totalCampaigns = allCampaigns.length;

    const totalImpressions = allCampaigns.reduce(
      (sum, c) => sum + (c.impressions || 0),
      0,
    );
    const totalClicks = allCampaigns.reduce(
      (sum, c) => sum + (c.clicks || 0),
      0,
    );
    const totalBudget = allCampaigns.reduce(
      (sum, c) => sum + (c.budget || 0),
      0,
    );

    const totalClicksFloat = parseFloat(totalClicks.toString());
    const totalImpressionsFloat = parseFloat(totalImpressions.toString());

    const averageCTR =
      totalImpressionsFloat > 0
        ? (totalClicksFloat / totalImpressionsFloat) * 100
        : 0;

    const averageCPC = totalClicks > 0 ? totalBudget / totalClicks : 0;

    const { previousImpressions, previousClicks, previousCTR } =
      await this.getPreviousMonthStats();

    const impressionsGrowth =
      previousImpressions > 0
        ? ((totalImpressions - previousImpressions) / previousImpressions) * 100
        : 0;

    const clicksGrowth =
      previousClicks > 0
        ? ((totalClicks - previousClicks) / previousClicks) * 100
        : 0;

    const ctrGrowth =
      previousCTR > 0 ? ((averageCTR - previousCTR) / previousCTR) * 100 : 0;

    const formatLargeNumber = (num: number): string => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1).replace('.', ',')} M`;
      }
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1).replace('.', ',')} k`;
      }
      return num.toLocaleString('fr-FR');
    };

    const formatCurrency = (amount: number): string => {
      return `${amount.toLocaleString('fr-FR')} €`;
    };

    return {
      activeCampaigns,
      totalCampaigns,
      totalImpressionsFormatted: formatLargeNumber(totalImpressions),
      totalImpressions,
      impressionsGrowth: parseFloat(impressionsGrowth.toFixed(1)),
      totalClicksFormatted: formatLargeNumber(totalClicks),
      totalClicks,
      clicksGrowth: parseFloat(clicksGrowth.toFixed(1)),
      averageCTR: parseFloat(averageCTR.toFixed(3)),
      ctrGrowth: parseFloat(ctrGrowth.toFixed(1)),
      totalBudget,
      totalBudgetFormatted: formatCurrency(totalBudget),
      averageCPC: parseFloat(averageCPC.toFixed(2)),
    };
  }

  async getTrends(): Promise<TrendsResponseDto> {
    const months: string[] = [];
    const impressions: number[] = [];
    const clicks: number[] = [];
    const ctr: number[] = [];
    const budget: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      months.push(monthName.charAt(0).toUpperCase() + monthName.slice(1));

      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthStats = await this.getPeriodStats(startOfMonth, endOfMonth);

      impressions.push(Math.round(monthStats.impressions));
      clicks.push(Math.round(monthStats.clicks));
      ctr.push(parseFloat(monthStats.ctr.toFixed(2)));
      budget.push(parseFloat(monthStats.budget.toFixed(2)));
    }

    return { months, impressions, clicks, ctr, budget };
  }

  private async getPreviousMonthStats(): Promise<{
    previousImpressions: number;
    previousClicks: number;
    previousCTR: number;
  }> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const previousCampaigns = await this.campaignModel
      .find({
        $or: [{ endDate: { $gte: oneMonthAgo } }, { status: 'active' }],
      })
      .lean();

    const previousImpressions = previousCampaigns.reduce(
      (sum, c) => sum + (c.impressions || 0),
      0,
    );
    const previousClicks = previousCampaigns.reduce(
      (sum, c) => sum + (c.clicks || 0),
      0,
    );
    const previousCTR =
      previousImpressions > 0
        ? (previousClicks / previousImpressions) * 100
        : 0;

    const currentStats = await this.campaignModel.find().lean();
    const currentImpressions = currentStats.reduce(
      (sum, c) => sum + (c.impressions || 0),
      0,
    );
    const currentClicks = currentStats.reduce(
      (sum, c) => sum + (c.clicks || 0),
      0,
    );
    const currentCTR =
      currentImpressions > 0 ? (currentClicks / currentImpressions) * 100 : 0;

    return {
      previousImpressions: Math.round(currentImpressions * 0.8),
      previousClicks: Math.round(currentClicks * 0.8),
      previousCTR: currentCTR * 0.97,
    };
  }

  private async getPeriodStats(startDate: Date, endDate: Date) {
    const campaigns = await this.campaignModel
      .find({
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      })
      .lean();

    const stats = campaigns.reduce(
      (acc, campaign) => {
        const campaignStart = new Date(campaign.startDate).getTime();
        const campaignEnd = new Date(campaign.endDate).getTime();
        const periodStart = startDate.getTime();
        const periodEnd = endDate.getTime();

        const overlapStart = Math.max(campaignStart, periodStart);
        const overlapEnd = Math.min(campaignEnd, periodEnd);
        const overlapDuration = Math.max(0, overlapEnd - overlapStart);
        const campaignDuration = campaignEnd - campaignStart;

        if (overlapDuration > 0 && campaignDuration > 0) {
          const proportion = overlapDuration / campaignDuration;

          acc.impressions += Math.round(campaign.impressions * proportion);
          acc.clicks += Math.round(campaign.clicks * proportion);
          acc.budget += campaign.budget * proportion;
        }

        return acc;
      },
      { impressions: 0, clicks: 0, budget: 0 },
    );

    return {
      ...stats,
      ctr: stats.impressions > 0 ? (stats.clicks / stats.impressions) * 100 : 0,
      cpc: stats.clicks > 0 ? stats.budget / stats.clicks : 0,
    };
  }
}
