import { getPrime } from '../src/prime';

it('should return a number', () => {
  const result = getPrime(3);
  expect(result).toEqual(5);
});

it('should return a big number', () => {
  const result = getPrime(300);
  expect(result).toEqual(1987);
});

it('should return first number', () => {
  const result = getPrime(1);
  expect(result).toEqual(2);
});

it('should return a number', () => {
  let err: Error | undefined;
  try {
    const result = getPrime(0);
  } catch (error) {
    err = error;
  }

  expect(err).toBeDefined();
});
