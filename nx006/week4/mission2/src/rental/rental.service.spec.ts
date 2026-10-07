import { NotFoundException } from '@nestjs/common';
import { RentalService } from './rental.service.js';
import type { RentalRepository } from './rental.repository.js';

describe('RentalService', () => {
  it('reports a missing rental when UPDATE changes no row', async () => {
    const repository = {
      returnBook: async () => 0,
    } as unknown as RentalRepository;
    await expect(new RentalService(repository).returnBook(999)).rejects.toThrow(
      NotFoundException,
    );
  });
});
