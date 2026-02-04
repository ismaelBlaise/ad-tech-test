/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { QueryCampaignDto } from './dtos/query-campaign.dto';
import { OverviewStatsResponseDto } from './dtos/overview-stats-response.dto';
import { TrendsResponseDto } from './dtos/trends-response.dto';
import { Campaign, CampaignStatus } from './schemas/campaign.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('CampaignsController', () => {
  let controller: CampaignsController;
  let service: CampaignsService;

  const mockCampaignId = new Types.ObjectId('507f1f77bcf86cd799439011');

  const mockCampaign: Campaign = {
    _id: mockCampaignId,
    name: 'Test Campaign',
    advertiser: 'Test Advertiser',
    budget: 1000,
    status: 'ACTIVE',
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2024-12-31T23:59:59.999Z',
    impressions: 10000,
    clicks: 100,
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-01T10:00:00.000Z',
  } as any;

  const mockCampaignsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
    getStats: jest.fn(),
    getOverviewStats: jest.fn(),
    getTrends: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignsController],
      providers: [
        {
          provide: CampaignsService,
          useValue: mockCampaignsService,
        },
      ],
    }).compile();

    controller = module.get<CampaignsController>(CampaignsController);
    service = module.get<CampaignsService>(CampaignsService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /campaigns', () => {
    it('devrait créer une campagne avec succès', async () => {
      const createDto: CreateCampaignDto = {
        name: 'Test Campaign',
        advertiser: 'Test Advertiser',
        budget: 1000,
        status: CampaignStatus.ACTIVE,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      mockCampaignsService.create.mockResolvedValue(mockCampaign);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockCampaign);
    });

    it('devrait retourner une erreur 400 si les données sont invalides', async () => {
      const invalidDto = {} as CreateCampaignDto;

      mockCampaignsService.create.mockRejectedValue(
        new BadRequestException('Validation failed'),
      );

      await expect(controller.create(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('GET /campaigns', () => {
    it('devrait retourner la liste paginée des campagnes', async () => {
      const queryDto: QueryCampaignDto = {
        page: 1,
        limit: 10,
      };

      const mockResponse = {
        data: [mockCampaign],
        total: 1,
      };

      mockCampaignsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(service.findAll).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('devrait appliquer les filtres de requête', async () => {
      const queryDto: QueryCampaignDto = {
        status: CampaignStatus.ACTIVE,
        advertiser: 'Test',
        page: 2,
        limit: 20,
      };

      const mockResponse = {
        data: [mockCampaign, mockCampaign],
        total: 2,
      };

      mockCampaignsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(service.findAll).toHaveBeenCalledWith(queryDto);
      expect(result.data).toHaveLength(2);
    });

    it('devrait retourner une liste vide si aucune campagne trouvée', async () => {
      const queryDto: QueryCampaignDto = {};

      const mockResponse = {
        data: [],
        total: 0,
      };

      mockCampaignsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('GET /campaigns/:id', () => {
    it('devrait retourner une campagne par ID', async () => {
      const campaignId = '507f1f77bcf86cd799439011';

      mockCampaignsService.findOne.mockResolvedValue(mockCampaign);

      const result = await controller.findOne(campaignId);

      expect(service.findOne).toHaveBeenCalledWith(campaignId);
      expect(result).toEqual(mockCampaign);
    });

    it("devrait retourner 404 si la campagne n'existe pas", async () => {
      const campaignId = 'non-existent-id';

      mockCampaignsService.findOne.mockRejectedValue(
        new NotFoundException(`Campagne avec id ${campaignId} introuvable`),
      );

      await expect(controller.findOne(campaignId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('PATCH /campaigns/:id/status', () => {
    it("devrait mettre à jour le statut d'une campagne", async () => {
      const campaignId = '507f1f77bcf86cd799439011';
      const updateDto: UpdateStatusDto = { status: CampaignStatus.PAUSED };

      const updatedCampaign = {
        ...mockCampaign,
        status: CampaignStatus.PAUSED,
      };

      mockCampaignsService.updateStatus.mockResolvedValue(updatedCampaign);

      const result = await controller.updateStatus(campaignId, updateDto);

      expect(service.updateStatus).toHaveBeenCalledWith(campaignId, updateDto);
      expect(result.status).toBe('PAUSED');
    });

    it("devrait retourner 404 si la campagne n'existe pas", async () => {
      const campaignId = 'non-existent-id';
      const updateDto: UpdateStatusDto = { status: CampaignStatus.PAUSED };

      mockCampaignsService.updateStatus.mockRejectedValue(
        new NotFoundException(`Campagne avec id ${campaignId} introuvable`),
      );

      await expect(
        controller.updateStatus(campaignId, updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET /campaigns/:id/stats', () => {
    it("devrait retourner les statistiques d'une campagne", async () => {
      const campaignId = '507f1f77bcf86cd799439011';
      const mockStats = {
        ctr: 2.5,
        cpc: 0.45,
      };

      mockCampaignsService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats(campaignId);

      expect(service.getStats).toHaveBeenCalledWith(campaignId);
      expect(result).toEqual(mockStats);
      expect(result.ctr).toBe(2.5);
      expect(result.cpc).toBe(0.45);
    });

    it("devrait retourner 404 si la campagne n'existe pas", async () => {
      const campaignId = 'non-existent-id';

      mockCampaignsService.getStats.mockRejectedValue(
        new NotFoundException(`Campagne avec id ${campaignId} introuvable`),
      );

      await expect(controller.getStats(campaignId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('GET /campaigns/stats/overview', () => {
    it('devrait retourner les statistiques globales', async () => {
      const mockOverviewStats: OverviewStatsResponseDto = {
        activeCampaigns: 3,
        totalCampaigns: 8,
        totalImpressionsFormatted: '14,5 M',
        totalImpressions: 14500000,
        impressionsGrowth: 12.5,
        totalClicksFormatted: '358,9 k',
        totalClicks: 358900,
        clicksGrowth: 8.2,
        averageCTR: 2.48,
        ctrGrowth: 3.1,
        totalBudget: 730000,
        totalBudgetFormatted: '730 000 €',
        averageCPC: 2.03,
      };

      mockCampaignsService.getOverviewStats.mockResolvedValue(
        mockOverviewStats,
      );

      const result = await controller.getOverviewStats();

      expect(service.getOverviewStats).toHaveBeenCalled();
      expect(result).toEqual(mockOverviewStats);
      expect(result.activeCampaigns).toBe(3);
      expect(result.totalCampaigns).toBe(8);
      expect(result.totalImpressionsFormatted).toBe('14,5 M');
      expect(result.averageCTR).toBe(2.48);
    });

    it('devrait gérer les erreurs du service', async () => {
      mockCampaignsService.getOverviewStats.mockRejectedValue(
        new Error('Erreur lors du calcul des statistiques'),
      );

      await expect(controller.getOverviewStats()).rejects.toThrow(
        'Erreur lors du calcul des statistiques',
      );
    });
  });

  describe('GET /campaigns/stats/trends', () => {
    it('devrait retourner les tendances mensuelles', async () => {
      const mockTrends: TrendsResponseDto = {
        months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        impressions: [1200000, 1350000, 1420000, 1380000, 1450000, 1500000],
        clicks: [28000, 32000, 35000, 34000, 35800, 38000],
        ctr: [2.33, 2.37, 2.46, 2.46, 2.47, 2.53],
        budget: [650000, 680000, 700000, 690000, 730000, 750000],
      };

      mockCampaignsService.getTrends.mockResolvedValue(mockTrends);

      const result = await controller.getTrends();

      expect(service.getTrends).toHaveBeenCalled();
      expect(result).toEqual(mockTrends);
      expect(result.months).toHaveLength(6);
      expect(result.impressions).toHaveLength(6);
      expect(result.clicks).toHaveLength(6);
      expect(result.ctr).toHaveLength(6);
      expect(result.budget).toHaveLength(6);
    });

    it('devrait gérer les erreurs du service', async () => {
      mockCampaignsService.getTrends.mockRejectedValue(
        new Error('Erreur lors de la récupération des tendances'),
      );

      await expect(controller.getTrends()).rejects.toThrow(
        'Erreur lors de la récupération des tendances',
      );
    });

    it('devrait retourner des tendances vides si pas de données', async () => {
      const mockTrends: TrendsResponseDto = {
        months: [],
        impressions: [],
        clicks: [],
        ctr: [],
        budget: [],
      };

      mockCampaignsService.getTrends.mockResolvedValue(mockTrends);

      const result = await controller.getTrends();

      expect(result.months).toEqual([]);
      expect(result.impressions).toEqual([]);
      expect(result.clicks).toEqual([]);
      expect(result.ctr).toEqual([]);
      expect(result.budget).toEqual([]);
    });
  });

  describe('Validation des paramètres', () => {
    it('devrait valider les paramètres de pagination', async () => {
      const queryDto: QueryCampaignDto = {
        page: 0,
        limit: 0,
      };

      const mockResponse = {
        data: [],
        total: 0,
      };

      mockCampaignsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(service.findAll).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockResponse);
    });

    it('devrait gérer les dates dans les filtres', async () => {
      const queryDto: QueryCampaignDto = {
        startDateFrom: '2024-01-01',
        endDateTo: '2024-12-31',
      };

      const mockResponse = {
        data: [mockCampaign],
        total: 1,
      };

      mockCampaignsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(service.findAll).toHaveBeenCalledWith(queryDto);
      expect(result.total).toBe(1);
    });
  });
});
