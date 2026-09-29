import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { RentalService } from './rental.service.js';
import { positiveId } from './input.js';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentals: RentalService) {}

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.rentals.create(positiveId(body?.userId, 'userId'), positiveId(body?.bookId, 'bookId'));
  }

  @Patch(':rentalId/return')
  returnBook(@Param('rentalId') rentalId: string) {
    return this.rentals.returnBook(positiveId(rentalId, 'rentalId'));
  }
}
