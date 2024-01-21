import * as fs from 'fs';
import { getHandType } from './hand-type-resolver';

if (process.argv.length < 3) {
    throw new Error('Input path required');
}

const inputPath = process.argv[2];
const inputText = fs.readFileSync(inputPath, { encoding: 'utf-8' });

type Hand = { cards: string[], type: string };
type Input = { hand: Hand; bid: number; };

const cardRanking = [ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ];
const handTypeRanking = [ 'HighCard', 'OnePair', 'TwoPair', 'ThreeOfAKind', 'FullHouse', 'FourOfAKind', 'FiveOfAKind' ];

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
        const cards = match[1].split('');
        const hand = { cards: cards, type: getHandType(cards) };
        return { hand: hand, bid: parseInt(match[2])};
    });
}

function orderByHand(inputs: Input[]): Input[] {
    return inputs.sort((a, b) => compareHands(a.hand, b.hand));
}

function compareHands(a: Hand, b: Hand): number {
    const handRankA = getHandTypeRank(a.type);
    const handRankB = getHandTypeRank(b.type);

    if (handRankA < handRankB) return -1
    if (handRankA > handRankB) return 1;
    
    for (let i = 0; i < 5; i++) {
        const cardRankA = getCardRank(a.cards[i]);
        const cardRankB = getCardRank(b.cards[i]);
        if (cardRankA < cardRankB) return -1;
        if (cardRankA > cardRankB) return 1;
    }
    
    return 0;
}

function getHandTypeRank(handType: string) {
    const rank = handTypeRanking.indexOf(handType);
    if (rank === -1) throw new Error(`Could not find rank for hand type '${handType}'`);
    return rank;
}

function getCardRank(card: string) {
    const rank = cardRanking.indexOf(card);
    if (rank === -1) throw new Error(`Could not find rank for card '${card}'`);
    return rank;
}

function calculateWinnings(orderedInputs: Input[]): number {
    let winnings = 0;
    for (const [i, input] of orderedInputs.entries()) {
        winnings += (i+1) * input.bid;
    }
    return winnings;
}
