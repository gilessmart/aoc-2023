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
const prizeCardMap = buildPrizeCardNumberMap();
const cardCounts = cards.map(card => getCountIncludingPrizeCards(card.cardNumber));
console.log(`total cards: ${sum(cardCounts)}`);

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
    for (const match of matches)
        numbers.push(parseInt(match[0]));
    return numbers;
}

function buildPrizeCardNumberMap(): Map<number, number[]> {
    const prizeCardMap = new Map<number, number[]>();
    for (const card of cards)
        prizeCardMap.set(card.cardNumber, getPrizeCardNumbers(card));
    return prizeCardMap;
}

function getPrizeCardNumbers(card: Card): number[] {
    const startCardNum = card.cardNumber + 1;
    const endCardNum = card.cardNumber + card.matchCount;
    const prizeCards = cards.filter(card => card.cardNumber >= startCardNum && card.cardNumber <= endCardNum);
    return prizeCards.map(prizeCard => prizeCard.cardNumber);
}

function getCountIncludingPrizeCards(cardNumber: number): number {
    const prizeCardNumbers = prizeCardMap.get(cardNumber) as number[];
    const prizeCardCounts = prizeCardNumbers.map(prizeCardNumber => getCountIncludingPrizeCards(prizeCardNumber));
    return 1 + sum(prizeCardCounts);
}