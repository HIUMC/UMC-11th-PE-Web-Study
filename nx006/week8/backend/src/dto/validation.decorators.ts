import { registerDecorator, type ValidationOptions } from 'class-validator';

// validator.js discounts variation selectors; keep Week 5's Array.from policy.
export function CodePointLength(
  min: number,
  max: number,
  options?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'codePointLength',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate: (value: unknown) =>
          typeof value === 'string' &&
          Array.from(value).length >= min &&
          Array.from(value).length <= max,
      },
    });
  };
}
