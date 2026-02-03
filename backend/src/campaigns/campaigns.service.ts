/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
}
