import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entity/member.entity.js';
import { Rating } from './entity/rating.entity.js';
import { MemberController } from './controller/member.controller.js';
import { RatingController } from './controller/rating.controller.js';
import { MemberService } from './service/member.service.js';
import { RatingService } from './service/rating.service.js';
import { validateEnvironment } from './config/environment.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USER'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        timezone: 'Z',
        charset: 'utf8mb4',
        supportBigNumbers: true,
        bigNumberStrings: true,
        autoLoadEntities: true,
        synchronize: false,
        retryAttempts: 2,
      }),
    }),
    TypeOrmModule.forFeature([Member, Rating]),
  ],
  controllers: [MemberController, RatingController],
  providers: [MemberService, RatingService],
})
export class AppModule {}
