import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { BookController } from './book.controller.js';
import { BookRepository } from './book.repository.js';
import { BookService } from './book.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [BookController],
  providers: [BookService, BookRepository],
})
export class BookModule {}
