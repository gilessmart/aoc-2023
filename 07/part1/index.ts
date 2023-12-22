import * as fs from 'fs';
import { getHandClass } from './hand-class-resolver';

if (process.argv.length < 3) {
    throw new Error('Input path required');
}

const inputPath = process.argv[2];
const inputText = fs.readFileSync(inputPath, { encoding: 'utf-8' });

type Input = { hand: string; bid: number; };

const cards = [ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ];
const handClasses = [ 'HighCard', 'OnePair', 'TwoPair', 'ThreeOfAKind', 'FullHouse', 'FourOfAKind', 'FiveOfAKind' ];

const inputs = parseInput(inputText);
const orderedInputs = orderByHand(inputs);

fs.writeFileSync('debug.txt', orderedInputs.map(i => i.hand).join('\n'));

const winnings = calculateWinnings(orderedInputs);

console.log(winnings);

function parseInput(text: string): Input[] {
    const lines = text.trim().split('\n');
    return lines.map(line => {
        const match = line.match(/(\w+) (\d+)/);
        if (match === null) throw new Error(`Failed to parse line ${line}`);
        return { hand: match[1], bid: parseInt(match[2])};
    });
}

function orderByHand(inputs: Input[]): Input[] {
    return inputs.sort((a, b) => compareHands(a.hand, b.hand));
}

function compareHands(a: string, b: string): number {
    const handRankA = getHandClassRank(a);
    const handRankB = getHandClassRank(b);

    if (handRankA < handRankB) return -1
    if (handRankA > handRankB) return 1;
    
    for (let i = 0; i < 5; i++) {
        const cardRankA = cards.indexOf(a[i]);
        const cardRankB = cards.indexOf(b[i]);
        if (cardRankA < cardRankB) return -1;
        if (cardRankA > cardRankB) return 1;
    }
    
    return 0;
}

function getHandClassRank(hand: string): number {
    const handClass = getHandClass(hand);
    return handClasses.indexOf(handClass);
}

function calculateWinnings(orderedInputs: Input[]): number {
    let winnings = 0;
    for (const [i, input] of orderedInputs.entries()) {
        winnings += (i+1) * input.bid;
    }
    return winnings;
}
