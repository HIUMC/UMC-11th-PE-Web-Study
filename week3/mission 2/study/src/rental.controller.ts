import { Body, Controller, Post } from '@nestjs/common';
import { RentalService } from './rental.service.js';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  // POST /rentals → 성공 시 HTTP 201
  @Post()
  async createRental(
    @Body('userId') userId: unknown,
    @Body('bookId') bookId: unknown,
  ) {
    return this.rentalService.createRental(userId, bookId);
  }
}
