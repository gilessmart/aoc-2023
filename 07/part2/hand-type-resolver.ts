import { getHandTypeRank } from './handTypeRanking';

export function getHandType(hand: string[]): string {
    if (isFiveOfAKind(hand)) return 'FiveOfAKind';
    if (isFourOfAKind(hand)) return 'FourOfAKind';
    if (isFullHouse(hand)) return 'FullHouse';
    if (isThreeOfAKind(hand)) return 'ThreeOfAKind';
    if (isTwoPair(hand)) return 'TwoPair';
    if (isOnePair(hand)) return 'OnePair';
    return 'HighCard';
}

function isFiveOfAKind(hand: string[]): boolean {
    return getMaxCardFrequency(hand) === 5;
}

function isFourOfAKind(hand: string[]): boolean {
    return getMaxCardFrequency(hand) === 4;
}

function isFullHouse(hand: string[]): boolean {
    const frequencies = getCardFrequencies(hand);
    return frequencies.size === 2;
}

function isThreeOfAKind(hand: string[]): boolean {
    return getMaxCardFrequency(hand) === 3;
}

function isTwoPair(hand: string[]): boolean {
    const frequencies = getCardFrequencies(hand);
    return frequencies.size === 3;
}

function isOnePair(hand: string[]): boolean {
    const frequencies = getCardFrequencies(hand);
    return frequencies.size === 4;
}

function getMaxCardFrequency(hand: string[]): number {
    const frequencies = getCardFrequencies(hand);
    return Math.max(...frequencies.values());
}

function getCardFrequencies(hand: string[]): Map<string, number> {
    const frequencies = new Map<string, number>();
    for (const card of hand) {
        let frequency = frequencies.get(card) || 0;
        frequencies.set(card, frequency + 1);
    }
    return frequencies;
}
