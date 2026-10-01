// src/rental.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { RentalService } from './rental.service';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  // Request Body로 userId와 bookId 전달받기
  @Post()
  async createRental(@Body() body: { userId: number; bookId: number }): Promise<any> {
    return await this.rentalService.createRentalRecord(body.userId, body.bookId);
  }
}