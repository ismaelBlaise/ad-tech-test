/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsOptional,
  IsNumber,
  Min,
  IsString,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CampaignStatus } from '../schemas/campaign.schema';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCampaignDto {
  @ApiPropertyOptional({
    enum: CampaignStatus,
    enumName: 'CampaignStatus',
    description: 'Statut de la campagne',
  })
  @IsOptional()
  @IsEnum(CampaignStatus, {
    message: `Le statut doit être l'un de: ${Object.values(CampaignStatus).join(', ')}`,
  })
  status?: CampaignStatus;

  @ApiPropertyOptional({ description: "Nom de l'annonceur" })
  @IsOptional()
  @IsString({ message: 'L’annonceur doit être une chaîne de caractères' })
  advertiser?: string;

  @ApiPropertyOptional({
    description: 'Numéro de page',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La page doit être un nombre' })
  @Min(1, { message: 'La page doit être au moins 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Nombre d'éléments par page",
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Le limit doit être un nombre' })
  @Min(1, { message: 'Le limit doit être au moins 1' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Budget minimum',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Le budget minimum doit être un nombre' })
  @Min(0, { message: 'Le budget minimum doit être >= 0' })
  budgetMin?: number;

  @ApiPropertyOptional({
    description: 'Budget maximum',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Le budget maximum doit être un nombre' })
  @Min(0, { message: 'Le budget maximum doit être >= 0' })
  budgetMax?: number;

  @ApiPropertyOptional({
    description: 'Date de début minimum (ISO 8601)',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La date de début (from) doit être valide (ISO 8601)' },
  )
  startDateFrom?: string;

  @ApiPropertyOptional({
    description: 'Date de début maximum (ISO 8601)',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La date de début (to) doit être valide (ISO 8601)' },
  )
  startDateTo?: string;

  @ApiPropertyOptional({
    description: 'Date de fin minimum (ISO 8601)',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La date de fin (from) doit être valide (ISO 8601)' },
  )
  endDateFrom?: string;

  @ApiPropertyOptional({
    description: 'Date de fin maximum (ISO 8601)',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La date de fin (to) doit être valide (ISO 8601)' },
  )
  endDateTo?: string;
}
