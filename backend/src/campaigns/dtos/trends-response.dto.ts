// dtos/trends-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class TrendsResponseDto {
  @ApiProperty({ type: [String], description: 'Noms des mois' })
  months: string[];

  @ApiProperty({ type: [Number], description: 'Impressions par mois' })
  impressions: number[];

  @ApiProperty({ type: [Number], description: 'Clics par mois' })
  clicks: number[];

  @ApiProperty({ type: [Number], description: 'CTR par mois (%)' })
  ctr: number[];

  @ApiProperty({ type: [Number], description: 'Budget par mois (€)' })
  budget: number[];
}
