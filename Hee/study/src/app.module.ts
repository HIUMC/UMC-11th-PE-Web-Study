import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { BookController } from './book.controller.js';
import { BookService } from './book.service.js';

import { Book } from './book.entity.js';
import { Category } from './category.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: 3306,
        username: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),

        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    TypeOrmModule.forFeature([Book, Category]),
  ],

  controllers: [
    AppController,
    BookController,
  ],

  providers: [
    AppService,
    BookService,
  ],
})
export class AppModule {}