import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DATABASE_CONNECTION, databaseProvider } from './database.provider.js';

@Module({
  imports: [ConfigModule],
  providers: [databaseProvider],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
