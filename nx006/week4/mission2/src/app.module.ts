import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { BookModule } from './book/book.module.js';
import { RentalModule } from './rental/rental.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    BookModule,
    RentalModule,
  ],
})
export class AppModule {}
