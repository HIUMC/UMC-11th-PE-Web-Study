import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity.js';
import { Category } from '../category/category.entity.js';
import { BookController } from './book.controller.js';
import { BookRepository } from './book.repository.js';
import { BookService } from './book.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Category])],
  controllers: [BookController],
  providers: [BookRepository, BookService],
})
export class BookModule {}
