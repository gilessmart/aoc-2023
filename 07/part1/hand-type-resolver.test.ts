import { describe, test, expect } from '@jest/globals';
import { getHandType } from './hand-type-resolver';

describe('resolves hand types', () => {
  test('resolves 32T3K', () => {
    expect(getHandType(['3','2','T','3','K'])).toBe('OnePair');
  });

  test('resolves T55J5', () => {
    expect(getHandType(['T','5','5','J','5'])).toBe('ThreeOfAKind');
  });

  test('resolves KK677', () => {
    expect(getHandType(['K','K','6','7','7'])).toBe('TwoPair');
  });

  test('resolves KTJJT', () => {
    expect(getHandType(['K','T','J','J','T'])).toBe('TwoPair');
  });

  test('resolves QQQJA', () => {
    expect(getHandType(['Q','Q','Q','J','A'])).toBe('ThreeOfAKind');
  });
});
