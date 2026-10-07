import 'reflect-metadata';
import { createValidationPipe } from '../../common/validation.js';
import { CreateBookDto } from './create-book.dto.js';

const validate = (body: unknown) =>
  createValidationPipe().transform(body, {
    type: 'body',
    metatype: CreateBookDto,
  });

describe('CreateBookDto boundary', () => {
  it('accepts an integer or a digits-only numeric string', async () => {
    expect((await validate({ categoryId: '1', title: '책' })).categoryId).toBe(
      1,
    );
    expect((await validate({ categoryId: 1, title: '책' })).categoryId).toBe(1);
  });

  it.each([
    { categoryId: 1, title: '' },
    { categoryId: 1, title: ' \t\n ' },
    { categoryId: 1, title: 'a'.repeat(101) },
    { categoryId: 0, title: '책' },
    { categoryId: true, title: '책' },
    { categoryId: '1e0', title: '책' },
    { categoryId: 1.5, title: '책' },
    { categoryId: '9007199254740992', title: '책' },
    { categoryId: 1, title: '책', isAvailable: false },
    { categoryId: 1, title: '책', description: null },
  ])('rejects invalid requests: %j', async (body) => {
    await expect(validate(body)).rejects.toMatchObject({ status: 400 });
  });
});
