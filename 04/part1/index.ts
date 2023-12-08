import * as fs from 'fs';
import Card from './Card';

const inputPath = process.argv[2];
if (inputPath === undefined) {
    console.log('input path required');
    process.exit(1);
}

console.log(`input path: ${inputPath}`);

const input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
const inputLines = input.trim().split('\n').map(x => x.trim());
const cards = inputLines.map(line => parseCard(line));
const points = cards.map(card => card.calculatePoints());
const sumOfPoints = points.reduce((sum, curr) => sum + curr, 0);
console.log(sumOfPoints);

function parseCard(text: string): Card {
    const match = text.match(/Card\s+\d+\:(.*)\|(.*)/);
    if (match === null) throw new Error(`could not parse card '${text}'`);
    const winningNumbers = parseNumberList(match[1]);
    const myNumbers = parseNumberList(match[2]);
    return new Card(winningNumbers, myNumbers);
}

function parseNumberList(text: string): number[] {
    const matches = text.trim().matchAll(/\d+/g);
    const numbers: number[] = [];
    for (const match of matches) {
        numbers.push(parseInt(match[0]));
    }
    return numbers;
}