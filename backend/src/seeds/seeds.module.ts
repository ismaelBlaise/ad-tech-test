import { Module } from '@nestjs/common';
import { CampaignSeed } from './campaign.seed';
import { CampaignsModule } from 'src/campaigns/campaigns.module';

@Module({
  imports: [CampaignsModule],
  providers: [CampaignSeed],
})
export class SeedsModule {}
