/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Campaign,
  CampaignDocument,
  CampaignStatus,
} from 'src/campaigns/schemas/campaign.schema';

@Injectable()
export class CampaignSeed {
  constructor(
    @InjectModel(Campaign.name)
    private readonly campaignModel: Model<CampaignDocument>,
  ) {}

  async run() {
    // const count = await this.campaignModel.countDocuments();

    // if (count > 0) {
    //   console.log('📢 Campaigns déjà seedées');
    //   return;
    // }

    const campaigns: Partial<Campaign>[] = [];

    const advertisers = [
      'google_ads',
      'meta_ads',
      'amazon_ads',
      'apple_search_ads',
      'microsoft_ads',

      'tiktok_ads',
      'snapchat_ads',
      'twitter_ads',
      'linkedin_ads',
      'pinterest_ads',

      'alibaba_ads',
      'ebay_ads',
      'etsy_ads',
      'shopify_partners',
      'rakuten_ads',

      'dv360',
      'the_trade_desk',
      'criteo',
      'outbrain',
      'taboola',

      'unity_ads',
      'ironsource',
      'applovin',
      'vungle',
      'chartboost',

      'nike',
      'adidas',
      'coca_cola',
      'pepsi',
      'samsung',
      'xiaomi',
      'huawei',

      'paypal',
      'visa',
      'mastercard',
      'stripe',
    ];

    let index = 1;

    for (let year = 2024; year <= 2026; year++) {
      for (let month = 0; month < 12; month++) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        campaigns.push({
          name: `Campaign ${index} - ${year}/${month + 1}`,
          advertiser: advertisers[index % advertisers.length],
          budget: 1000 + index * 250,
          startDate,
          endDate,
          status:
            year < 2025
              ? CampaignStatus.FINISHED
              : year === 2025
                ? CampaignStatus.ACTIVE
                : CampaignStatus.PAUSED,
          impressions: Math.floor(Math.random() * 100_000),
          clicks: Math.floor(Math.random() * 5_000),
        });

        index++;
      }
    }

    await this.campaignModel.insertMany(campaigns);

    console.log(`📢 ${campaigns.length} campaigns seedées (2024 → 2026)`);
  }
}
