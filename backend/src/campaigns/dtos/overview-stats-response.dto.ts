// dtos/overview-stats-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class OverviewStatsResponseDto {
  @ApiProperty({ description: 'Nombre de campagnes actives' })
  activeCampaigns: number;

  @ApiProperty({ description: 'Nombre total de campagnes' })
  totalCampaigns: number;

  @ApiProperty({ description: 'Impressions totales formatées' })
  totalImpressionsFormatted: string;

  @ApiProperty({ description: 'Impressions totales' })
  totalImpressions: number;

  @ApiProperty({
    description: 'Croissance des impressions vs mois dernier (%)',
  })
  impressionsGrowth: number;

  @ApiProperty({ description: 'Clics totaux formatés' })
  totalClicksFormatted: string;

  @ApiProperty({ description: 'Clics totaux' })
  totalClicks: number;

  @ApiProperty({ description: 'Croissance des clics vs mois dernier (%)' })
  clicksGrowth: number;

  @ApiProperty({ description: 'CTR moyen (%)' })
  averageCTR: number;

  @ApiProperty({ description: 'Croissance du CTR vs mois dernier (%)' })
  ctrGrowth: number;

  @ApiProperty({ description: 'Budget total' })
  totalBudget: number;

  @ApiProperty({ description: 'Budget total formaté' })
  totalBudgetFormatted: string;

  @ApiProperty({ description: 'CPC moyen (€)' })
  averageCPC: number;
}
