import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { RentalService } from './rental.service.js';
import { parseCreateRentalInput } from './rental.input.js';
import { positiveId } from '../common/input.js';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentals: RentalService) {}

  @Post()
  create(@Body() body: Record<string, unknown>) {
    const { userId, bookId } = parseCreateRentalInput(body);
    return this.rentals.create(userId, bookId);
  }

  @Patch(':rentalId/return')
  returnBook(@Param('rentalId') rentalId: string) {
    return this.rentals.returnBook(positiveId(rentalId, 'rentalId'));
  }
}
