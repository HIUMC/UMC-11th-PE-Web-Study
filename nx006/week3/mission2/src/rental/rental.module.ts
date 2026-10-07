import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { RentalController } from './rental.controller.js';
import { RentalRepository } from './rental.repository.js';
import { RentalService } from './rental.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [RentalController],
  providers: [RentalService, RentalRepository],
})
export class RentalModule {}
