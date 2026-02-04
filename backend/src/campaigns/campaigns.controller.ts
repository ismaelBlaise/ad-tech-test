import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { QueryCampaignDto } from './dtos/query-campaign.dto';
import { OverviewStatsResponseDto } from './dtos/overview-stats-response.dto';
import { TrendsResponseDto } from './dtos/trends-response.dto';
import { Campaign } from './schemas/campaign.schema';

@ApiTags('Campagnes')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer une nouvelle campagne',
    description: 'Endpoint pour créer une campagne publicitaire',
  })
  @ApiBody({
    type: CreateCampaignDto,
    description: 'Données de la campagne à créer',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'Campagne créée avec succès',
    type: Campaign,
  })
  @ApiBadRequestResponse({
    description: 'Données invalides ou validation échouée',
  })
  async create(@Body() createDto: CreateCampaignDto): Promise<Campaign> {
    return this.campaignsService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister toutes les campagnes',
    description: 'Récupère la liste des campagnes avec pagination et filtres',
  })
  @ApiQuery({
    type: QueryCampaignDto,
    description: 'Paramètres de filtrage et pagination',
  })
  @ApiOkResponse({
    description: 'Liste des campagnes récupérée avec succès',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Campaign' },
        },
        total: {
          type: 'number',
          example: 42,
        },
      },
    },
  })
  async findAll(
    @Query() query: QueryCampaignDto,
  ): Promise<{ data: Campaign[]; total: number }> {
    return this.campaignsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer une campagne par ID',
    description: "Endpoint pour obtenir les détails d'une campagne spécifique",
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique de la campagne',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Campagne trouvée',
    type: Campaign,
  })
  @ApiNotFoundResponse({
    description: 'Campagne non trouvée',
  })
  @ApiBadRequestResponse({
    description: 'ID invalide',
  })
  async findOne(@Param('id') id: string): Promise<Campaign> {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: "Mettre à jour le statut d'une campagne",
    description: "Modifier le statut d'une campagne existante",
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique de la campagne',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: UpdateStatusDto,
    description: 'Nouveau statut de la campagne',
    required: true,
  })
  @ApiOkResponse({
    description: 'Statut mis à jour avec succès',
    type: Campaign,
  })
  @ApiNotFoundResponse({
    description: 'Campagne non trouvée',
  })
  @ApiBadRequestResponse({
    description: 'Statut invalide ou données incorrectes',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ): Promise<Campaign> {
    return this.campaignsService.updateStatus(id, dto);
  }

  @Get(':id/stats')
  @ApiOperation({
    summary: "Obtenir les statistiques d'une campagne",
    description:
      "Récupère les métriques de performance d'une campagne (CTR, CPC, etc.)",
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique de la campagne',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Statistiques récupérées avec succès',
    schema: {
      type: 'object',
      properties: {
        ctr: {
          type: 'number',
          example: 2.5,
          description: 'Click-Through Rate en pourcentage',
        },
        cpc: {
          type: 'number',
          example: 0.45,
          description: 'Coût par clic en euros',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Campagne non trouvée',
  })
  async getStats(
    @Param('id') id: string,
  ): Promise<{ ctr: number; cpc: number }> {
    return this.campaignsService.getStats(id);
  }

  @Get('stats/overview')
  @ApiOperation({
    summary: 'Obtenir les statistiques globales',
    description: 'Récupère les KPI globaux pour toutes les campagnes',
  })
  @ApiOkResponse({
    description: 'Statistiques globales récupérées avec succès',
    type: OverviewStatsResponseDto,
  })
  async getOverviewStats(): Promise<OverviewStatsResponseDto> {
    return this.campaignsService.getOverviewStats();
  }

  @Get('stats/trends')
  @ApiOperation({
    summary: 'Obtenir les tendances mensuelles',
    description: "Récupère l'évolution des KPI sur les 6 derniers mois",
  })
  @ApiOkResponse({
    description: 'Tendances récupérées avec succès',
    type: TrendsResponseDto,
  })
  async getTrends(): Promise<TrendsResponseDto> {
    return this.campaignsService.getTrends();
  }
}
