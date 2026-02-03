import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalValidationPipe } from './common/pipes/validation.pipe';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new GlobalValidationPipe());
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.use(helmet());
  const config = new DocumentBuilder()
    .setTitle('AdTech Campaign API')
    .setDescription('API pour gérer les campagnes publicitaires')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
