import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

import { CampaignSeed } from './campaign.seed';
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('🌱 Seeding database...');

  await app.get(CampaignSeed).run();

  console.log('✅ Seeding terminé');
  await app.close();
}

bootstrap();
