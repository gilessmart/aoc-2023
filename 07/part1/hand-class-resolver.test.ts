import { describe, test, expect } from '@jest/globals';
import { getHandClass } from './hand-class-resolver';

describe('resolves test hands', () => {
  test('resolves 32T3K', () => {
    expect(getHandClass('32T3K')).toBe('OnePair');
  });

  test('resolves T55J5', () => {
    expect(getHandClass('T55J5')).toBe('ThreeOfAKind');
  });

  test('resolves KK677', () => {
    expect(getHandClass('KK677')).toBe('TwoPair');
  });

  test('resolves KTJJT', () => {
    expect(getHandClass('KTJJT')).toBe('TwoPair');
  });

  test('resolves QQQJA', () => {
    expect(getHandClass('QQQJA')).toBe('ThreeOfAKind');
  });
});
