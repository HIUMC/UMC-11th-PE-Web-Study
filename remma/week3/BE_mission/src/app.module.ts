// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.provider';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Book 관련 임포트
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';

// 👇 Rental 관련 임포트 추가
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { RentalRepository } from './rental.repository';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    AppController,
    BookController,
    RentalController, // 추가!
  ],
  providers: [
    ...databaseProviders,
    AppService,
    BookService,
    BookRepository,
    RentalService,    // 추가!
    RentalRepository, // 추가!
  ],
  exports: [...databaseProviders],
})
export class AppModule {}