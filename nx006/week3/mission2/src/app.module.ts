import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './book/book.module.js';
import { RentalModule } from './rental/rental.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BookModule, RentalModule],
})
export class AppModule {}
