// src/rental.service.ts
import { Injectable } from '@nestjs/common';
import { RentalRepository } from './rental.repository';

@Injectable()
export class RentalService {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async createRentalRecord(userId: number, bookId: number): Promise<any> {
    return await this.rentalRepository.createRental(userId, bookId);
  }
}