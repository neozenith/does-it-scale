
export function getPrime (n: number): number {
  return nth(n);
}

function nth (n: number) {
  const primes: number[] = [];
  if (n < 1) {
    throw new Error('Prime is not possible');
  }

  let next = 1;
  while (primes.length < n) {
    next++;
    isPrime(next, primes);
  }

  return next;
}

function isPrime (input: number, primes: number[]): boolean {
  if (primes.indexOf(input) !== -1) {
    return true;
  }

  for (let i = 2; i < input; i++) {
    if (input % i === 0) {
      return false;
    }
  }
  if (input > 1) {
    primes.push(input);
    return true;
  }

  return false;
}
