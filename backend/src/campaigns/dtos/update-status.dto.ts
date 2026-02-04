/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CampaignStatus } from '../schemas/campaign.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({
    enum: CampaignStatus,
    enumName: 'CampaignStatus',
    description: 'Nouveau statut de la campagne',
  })
  @IsEnum(CampaignStatus, {
    message: `Le statut doit être l'un de: ${Object.values(CampaignStatus).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Le statut ne peut pas être vide' })
  status: CampaignStatus;
}
