import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { RentalService } from './rental.service.js';

@Controller('rentals')
export class RentalController {
  constructor(
    private readonly rentalService: RentalService,
  ) {}

  @Post()
  async createRental(
    @Body() body: Record<string, any>,
  ): Promise<string> {
    return await this.rentalService.createRental(body);
  }
  
  @Patch(':rentalId/return')
  async returnRental(
    @Param('rentalId') rentalId: string,
  ): Promise<string> {
    return await this.rentalService.returnRental(Number(rentalId));
  }
}