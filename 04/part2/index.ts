import * as fs from 'fs';
import Card from './Card';

const startTime = new Date();

const inputPath = process.argv[2];
if (inputPath === undefined) {
    console.log('input path required');
    process.exit(1);
}

console.log(`input path: ${inputPath}`);

const input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
const inputLines = input.trim().split('\n').map(x => x.trim());
const cards = inputLines.map(line => parseCard(line));
processCards(cards);
console.log(cards.length);

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

function processCards(cards: Card[]) {
    for (let i = 0; i < cards.length; i++) {
        const winnings = getWinnings(cards[i], cards);
        cards.push(...winnings);
    }
}

function getWinnings(card: Card, cards: Card[]): Card[] {
    const winnings: Card[] = [];

    for (let i = 0; i < card.matchCount; i++) {
        const wonCard = cards.find(c => c.cardNumber === card.cardNumber + 1 + i);
        winnings.push(wonCard as Card);
    }

    return winnings;
}