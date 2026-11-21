import type { INestApplication } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';

export function configureCors(app: INestApplication, config: ConfigService) {
  const mode = config.get<string>('CORS_MODE', 'restricted');
  if (mode === 'off') return;
  app.enableCors({
    origin:
      mode === 'all'
        ? '*'
        : config
            .get<string>(
              'CORS_ORIGINS',
              'http://localhost:5173,http://localhost:5174,http://localhost:5176',
            )
            .split(','),
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: false,
  });
}
