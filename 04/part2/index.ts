import * as fs from 'fs';
import Card from './Card';
import { sum } from './util';

const inputPath = process.argv[2];
if (inputPath === undefined) {
    console.log('input path required');
    process.exit(1);
}

console.log(`input path: ${inputPath}`);
const startTime = new Date();

const input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
const inputLines = input.trim().split('\n').map(x => x.trim());
const cards = inputLines.map(line => parseCard(line));
const totalCards = calculateTotalCards(cards);
console.log(`total cards: ${totalCards}`);

const endTime = new Date();
console.log(`elapsed: ${endTime.valueOf() - startTime.valueOf()}ms`);

function parseCard(text: string): Card {
    const match = text.match(/Card\s+(\d+)\:(.*)\|(.*)/);
    if (match === null) throw new Error(`could not parse card '${text}'`);
    const cardNumber = parseInt(match[1]);
    const winningNumbers = parseNumberList(match[2]);
    const myNumbers = parseNumberList(match[3]);
    return new Card(cardNumber, winningNumbers, myNumbers);
}

function parseNumberList(text: string): number[] {
    const matches = text.trim().matchAll(/\d+/g);
    const numbers: number[] = [];
    for (const match of matches) {
        numbers.push(parseInt(match[0]));
    }
    return numbers;
}

function calculateTotalCards(cards: Card[]) {
    const prizeCardIdMap = new Map<number, number[]>();
    for (const card of cards) {
        const prizeCards = getPrizeCards(card, cards);
        prizeCardIdMap.set(card.cardNumber, prizeCards.map(c => c.cardNumber));
    }

    const prizeCardCountMap = new Map<number, number>();
    for (const card of cards.reverse()) {
        const prizeCardIds = prizeCardIdMap.get(card.cardNumber) as number[];
        const prizeCardCounts = prizeCardIds.map(id => prizeCardCountMap.get(id) as number);
        prizeCardCountMap.set(card.cardNumber, prizeCardIds.length + sum(prizeCardCounts));
    }

    return cards.length + sum(prizeCardCountMap.values());
}

function getPrizeCards(card: Card, cards: Card[]): Card[] {
    const startCardNum = card.cardNumber + 1;
    const endCardNum = card.cardNumber + card.matchCount;
    return cards.filter(card => card.cardNumber >= startCardNum && card.cardNumber <= endCardNum);
}
