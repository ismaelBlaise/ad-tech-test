/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CampaignsService } from './campaigns.service';
import { Campaign, CampaignStatus } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { QueryCampaignDto } from './dtos/query-campaign.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CampaignsService', () => {
  let service: CampaignsService;
  let campaignModel: Model<Campaign>;

  const mockCampaignId = new Types.ObjectId('507f1f77bcf86cd799439011');

  const mockCampaign = {
    _id: mockCampaignId,
    name: 'Test Campaign',
    advertiser: 'Test Advertiser',
    budget: 1000,
    status: 'ACTIVE',
    startDate: new Date('2024-01-01T00:00:00.000Z'),
    endDate: new Date('2024-12-31T23:59:59.999Z'),
    impressions: 10000000,
    clicks: 100,
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
    updatedAt: new Date('2024-01-01T10:00:00.000Z'),
  };

  const mockCampaign2 = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
    name: 'Test Campaign 2',
    advertiser: 'Another Advertiser',
    budget: 2000,
    status: 'PAUSED',
    startDate: new Date('2024-02-01T00:00:00.000Z'),
    endDate: new Date('2024-03-31T23:59:59.999Z'),
    impressions: 5000000,
    clicks: 50,
    createdAt: new Date('2024-02-01T10:00:00.000Z'),
    updatedAt: new Date('2024-02-01T10:00:00.000Z'),
  };

  const createMockCampaignDocument = (overrides = {}) => ({
    ...mockCampaign,
    ...overrides,
    save: jest.fn().mockImplementation(function () {
      return Promise.resolve({
        ...this,
        toObject: () => ({ ...this }),
        toJSON: () => ({ ...this }),
      });
    }),
    toObject: () => ({ ...mockCampaign, ...overrides }),
    toJSON: () => ({ ...mockCampaign, ...overrides }),
  });

  const createMockQuery = (data: any) => ({
    lean: jest.fn().mockResolvedValue(data),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  });

  const mockCampaignModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    countDocuments: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        {
          provide: getModelToken(Campaign.name),
          useValue: mockCampaignModel,
        },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
    campaignModel = module.get<Model<Campaign>>(getModelToken(Campaign.name));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('devrait créer une campagne avec succès', async () => {
      const createDto: CreateCampaignDto = {
        name: 'Test Campaign',
        advertiser: 'Test Advertiser',
        budget: 1000,
        status: CampaignStatus.ACTIVE,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      const mockSavedCampaign = createMockCampaignDocument();
      mockCampaignModel.create.mockResolvedValue(mockSavedCampaign);

      const result = await service.create(createDto);

      expect(mockCampaignModel.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockSavedCampaign);
    });

    it('devrait échouer si les données sont invalides', async () => {
      const invalidDto = {} as CreateCampaignDto;

      mockCampaignModel.create.mockRejectedValue(new Error('Validation error'));

      await expect(service.create(invalidDto)).rejects.toThrow(
        'Validation error',
      );
    });
  });

  describe('findAll', () => {
    it('devrait retourner toutes les campagnes avec pagination', async () => {
      const queryDto: QueryCampaignDto = {
        page: 1,
        limit: 10,
      };

      mockCampaignModel.countDocuments.mockResolvedValue(1);
      mockCampaignModel.find.mockReturnValue(createMockQuery([mockCampaign]));

      const result = await service.findAll(queryDto);

      expect(mockCampaignModel.find).toHaveBeenCalled();
      expect(mockCampaignModel.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({
        data: [mockCampaign],
        total: 1,
      });
    });

    it('devrait filtrer par statut', async () => {
      const queryDto: QueryCampaignDto = {
        status: CampaignStatus.ACTIVE,
      };

      mockCampaignModel.countDocuments.mockResolvedValue(1);
      mockCampaignModel.find.mockReturnValue(createMockQuery([mockCampaign]));

      await service.findAll(queryDto);

      expect(mockCampaignModel.find).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'ACTIVE' }),
      );
    });

    it('devrait filtrer par annonceur', async () => {
      const queryDto: QueryCampaignDto = {
        advertiser: 'Test',
      };

      mockCampaignModel.countDocuments.mockResolvedValue(1);
      mockCampaignModel.find.mockReturnValue(createMockQuery([mockCampaign]));

      await service.findAll(queryDto);

      expect(mockCampaignModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          advertiser: { $regex: 'Test', $options: 'i' },
        }),
      );
    });

    it('devrait filtrer par budget minimum et maximum', async () => {
      const queryDto: QueryCampaignDto = {
        budgetMin: 500,
        budgetMax: 1500,
      };

      mockCampaignModel.countDocuments.mockResolvedValue(1);
      mockCampaignModel.find.mockReturnValue(createMockQuery([mockCampaign]));

      await service.findAll(queryDto);

      expect(mockCampaignModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          budget: {
            $gte: 500,
            $lte: 1500,
          },
        }),
      );
    });

    it('devrait filtrer par dates de début', async () => {
      const queryDto: QueryCampaignDto = {
        startDateFrom: '2024-01-01',
        startDateTo: '2024-12-31',
      };

      mockCampaignModel.countDocuments.mockResolvedValue(1);
      mockCampaignModel.find.mockReturnValue(createMockQuery([mockCampaign]));

      await service.findAll(queryDto);

      expect(mockCampaignModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: {
            $gte: expect.any(Date),
            $lte: expect.any(Date),
          },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('devrait retourner une campagne par ID', async () => {
      const id = '507f1f77bcf86cd799439011';

      mockCampaignModel.findById.mockReturnValue(createMockQuery(mockCampaign));

      const result = await service.findOne(id);

      expect(mockCampaignModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockCampaign);
    });

    it("devrait lancer NotFoundException si la campagne n'existe pas", async () => {
      const id = '507f1f77bcf86cd799439011';

      mockCampaignModel.findById.mockReturnValue(createMockQuery(null));

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });

    it('devrait lancer NotFoundException pour un ID Mongoose invalide', async () => {
      const invalidId = 'invalid-id-format';

      mockCampaignModel.findById.mockReturnValue(createMockQuery(null));

      await expect(service.findOne(invalidId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it("devrait mettre à jour le statut d'une campagne", async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateDto: UpdateStatusDto = { status: CampaignStatus.PAUSED };

      const mockCampaignDoc = createMockCampaignDocument({
        status: CampaignStatus.ACTIVE,
      });

      mockCampaignModel.findById.mockResolvedValue(mockCampaignDoc);
      mockCampaignDoc.save.mockResolvedValue({
        ...mockCampaignDoc,
        status: 'PAUSED',
        toObject: () => ({ ...mockCampaign, status: 'PAUSED' }),
      });

      const result = await service.updateStatus(id, updateDto);

      expect(mockCampaignModel.findById).toHaveBeenCalledWith(id);
      expect(mockCampaignDoc.save).toHaveBeenCalled();
      expect(result.status).toBe('PAUSED');
    });

    it("devrait lancer NotFoundException si la campagne n'existe pas", async () => {
      const id = 'non-existent-id';
      const updateDto: UpdateStatusDto = { status: CampaignStatus.PAUSED };

      mockCampaignModel.findById.mockResolvedValue(null);

      await expect(service.updateStatus(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('devrait lancer BadRequestException si le statut est identique', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateDto: UpdateStatusDto = { status: CampaignStatus.ACTIVE };

      const mockCampaignDoc = createMockCampaignDocument({
        status: CampaignStatus.ACTIVE,
      });
      mockCampaignModel.findById.mockResolvedValue(mockCampaignDoc);

      await expect(service.updateStatus(id, updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getStats', () => {
    it('devrait calculer correctement le CTR et CPC', async () => {
      const id = '507f1f77bcf86cd799439011';

      const campaignWithStats = {
        ...mockCampaign,
        impressions: 1000,
        clicks: 50,
        budget: 500,
      };

      mockCampaignModel.findById.mockReturnValue(
        createMockQuery(campaignWithStats),
      );

      const result = await service.getStats(id);

      expect(result.ctr).toBe(0.05);
      expect(result.cpc).toBe(10);
    });

    it("devrait retourner 0 pour CTR si pas d'impressions", async () => {
      const id = '507f1f77bcf86cd799439011';

      const campaignNoImpressions = {
        ...mockCampaign,
        impressions: 0,
        clicks: 10,
        budget: 100,
      };

      mockCampaignModel.findById.mockReturnValue(
        createMockQuery(campaignNoImpressions),
      );

      const result = await service.getStats(id);

      expect(result.ctr).toBe(0);
    });

    it('devrait retourner 0 pour CPC si pas de clics', async () => {
      const id = '507f1f77bcf86cd799439011';

      const campaignNoClicks = {
        ...mockCampaign,
        impressions: 1000,
        clicks: 0,
        budget: 100,
      };

      mockCampaignModel.findById.mockReturnValue(
        createMockQuery(campaignNoClicks),
      );

      const result = await service.getStats(id);

      expect(result.cpc).toBe(0);
    });

    it("devrait lancer NotFoundException si la campagne n'existe pas", async () => {
      const id = 'non-existent-id';

      mockCampaignModel.findById.mockReturnValue(createMockQuery(null));

      await expect(service.getStats(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOverviewStats', () => {
    it('devrait retourner les statistiques globales', async () => {
      const mockCampaigns = [
        {
          ...mockCampaign,
          status: 'ACTIVE',
          impressions: 10000000,
          clicks: 100,
          budget: 1000,
        },
        {
          ...mockCampaign2,
          status: 'PAUSED',
          impressions: 5000000,
          clicks: 50,
          budget: 2000,
        },
        {
          ...mockCampaign,
          status: 'ACTIVE',
          impressions: 15000000,
          clicks: 150,
          budget: 1500,
        },
      ];

      mockCampaignModel.find.mockReturnValue(createMockQuery(mockCampaigns));

      const result = await service.getOverviewStats();

      expect(result.activeCampaigns).toBe(2);
      expect(result.totalCampaigns).toBe(3);
      expect(result.totalImpressions).toBe(30000000);
      expect(result.totalClicks).toBe(300);
      expect(result.totalBudget).toBe(4500);

      expect(result.averageCTR).toBeCloseTo(0.001, 3);

      expect(result.averageCPC).toBe(15);
      expect(result.totalImpressionsFormatted).toBe('30,0 M');
      expect(result.totalClicksFormatted).toBe('300');
      // expect(result.totalBudgetFormatted).toBe('4 500 €');
    });
  });

  describe('getPeriodStats', () => {
    it('devrait retourner 0 si pas de campagnes dans la période', async () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      mockCampaignModel.find.mockReturnValue(createMockQuery([]));

      const result = await (service as any).getPeriodStats(startDate, endDate);

      expect(result.impressions).toBe(0);
      expect(result.clicks).toBe(0);
      expect(result.budget).toBe(0);
      expect(result.ctr).toBe(0);
      expect(result.cpc).toBe(0);
    });
  });

  describe('getPreviousMonthStats', () => {
    it('devrait calculer les statistiques du mois précédent', async () => {
      const mockCampaigns = [
        {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          status: 'ACTIVE',
          impressions: 10000000,
          clicks: 100,
          budget: 1000,
        },
        {
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-03-31'),
          status: 'PAUSED',
          impressions: 5000000,
          clicks: 50,
          budget: 2000,
        },
      ];

      mockCampaignModel.find
        .mockReturnValueOnce(createMockQuery(mockCampaigns))
        .mockReturnValueOnce(createMockQuery(mockCampaigns));

      const result = await (service as any).getPreviousMonthStats();

      expect(mockCampaignModel.find).toHaveBeenCalledWith({
        $or: [{ endDate: { $gte: expect.any(Date) } }, { status: 'active' }],
      });

      expect(result.previousImpressions).toBe(12000000);

      expect(result.previousClicks).toBe(120);

      expect(result.previousCTR).toBeCloseTo(0.00097);
    });

    it('devrait gérer le cas sans campagnes', async () => {
      mockCampaignModel.find.mockReturnValue(createMockQuery([]));

      const result = await (service as any).getPreviousMonthStats();

      expect(result.previousImpressions).toBe(0);
      expect(result.previousClicks).toBe(0);
      expect(result.previousCTR).toBe(0);
    });
  });

  describe('getPeriodStats', () => {
    it('devrait calculer les statistiques pour une période', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const mockCampaigns = [
        {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-03-31'),
          impressions: 30000000,
          clicks: 300,
          budget: 3000,
        },
        {
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-02-15'),
          impressions: 15000000,
          clicks: 150,
          budget: 1500,
        },
      ];

      mockCampaignModel.find.mockReturnValue(createMockQuery(mockCampaigns));

      const result = await (service as any).getPeriodStats(startDate, endDate);

      expect(result.impressions).toBeGreaterThan(17000000);
      expect(result.impressions).toBeLessThan(19000000);
      expect(result.clicks).toBeGreaterThan(170);
      expect(result.clicks).toBeLessThan(190);
      expect(result.budget).toBeGreaterThan(1700);
      expect(result.budget).toBeLessThan(1900);

      expect(result.ctr).toBeCloseTo(0.001, 3);
      expect(result.cpc).toBeCloseTo(10, 1);
    });

    it('devrait retourner 0 si pas de campagnes dans la période', async () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      mockCampaignModel.find.mockReturnValue(createMockQuery([]));

      const result = await (service as any).getPeriodStats(startDate, endDate);

      expect(result.impressions).toBe(0);
      expect(result.clicks).toBe(0);
      expect(result.budget).toBe(0);
      // expect(result.ctR).toBe(0);
      expect(result.cpc).toBe(0);
    });
  });
});
