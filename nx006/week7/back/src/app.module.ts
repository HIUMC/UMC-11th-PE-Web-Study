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
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller/auth.controller.js';
import { RatingReadController } from './controller/rating-read.controller.js';
import { AuthService } from './service/auth.service.js';
import { JwtAuthGuard } from './guard/jwt-auth.guard.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: config.getOrThrow<number>('JWT_ACCESS_EXPIRATION'),
        },
        verifyOptions: { algorithms: ['HS256'] },
      }),
    }),
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
  controllers: [
    MemberController,
    RatingReadController,
    RatingController,
    AuthController,
  ],
  providers: [MemberService, RatingService, AuthService, JwtAuthGuard],
})
export class AppModule {}
