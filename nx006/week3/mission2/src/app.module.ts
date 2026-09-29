import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProvider } from './database.provider.js';
import { BookController } from './book.controller.js';
import { BookService } from './book.service.js';
import { BookRepository } from './book.repository.js';
import { RentalController } from './rental.controller.js';
import { RentalService } from './rental.service.js';
import { RentalRepository } from './rental.repository.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [BookController, RentalController],
  providers: [databaseProvider, BookService, BookRepository, RentalService, RentalRepository],
})
export class AppModule {}
