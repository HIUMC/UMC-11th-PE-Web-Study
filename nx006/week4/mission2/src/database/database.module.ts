import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryLogger } from './query.logger.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const rawPort = config.getOrThrow<string>('DB_PORT');
        const port = Number(rawPort);
        if (
          !/^\d+$/.test(rawPort) ||
          !Number.isInteger(port) ||
          port < 1 ||
          port > 65535
        ) {
          throw new Error('DB_PORT must be an integer between 1 and 65535');
        }
        return {
          type: 'mysql' as const,
          host: config.getOrThrow<string>('DB_HOST'),
          port,
          username: config.getOrThrow<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD') ?? '',
          database: config.getOrThrow<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: false,
          supportBigNumbers: true,
          bigNumberStrings: true,
          timezone: 'Z',
          poolSize: 10,
          extra: { waitForConnections: true, queueLimit: 0 },
          logger: new QueryLogger(config.get('DB_LOG_QUERIES') === 'true'),
          retryAttempts: 3,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
