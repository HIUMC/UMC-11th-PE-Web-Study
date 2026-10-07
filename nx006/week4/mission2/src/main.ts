import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
import { createValidationPipe } from './common/validation.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(createValidationPipe());
  app.enableShutdownHooks();
  const config = app.get(ConfigService);
  await app.listen(Number(config.get('PORT') ?? 3000));
}
await bootstrap();
