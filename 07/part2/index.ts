import * as fs from 'fs';
import { getHandType } from './hand-type-resolver';
import { getHandTypeRank } from './handTypeRanking';
import { getCardRank } from './cardRanking';

if (process.argv.length < 3) {
    throw new Error('Input path required');
}

const inputPath = process.argv[2];
const inputText = fs.readFileSync(inputPath, { encoding: 'utf-8' });

type Hand = { cards: string[], type: string };
type Input = { hand: Hand; bid: number; };

const inputs = parseInput(inputText);
const orderedInputs = orderByHand(inputs);
const winnings = calculateWinnings(orderedInputs);

console.log(winnings);

function parseInput(text: string): Input[] {
    const lines = text.trim().split('\n');
    return lines.map(line => {
        const match = line.match(/(\w+) (\d+)/);
        if (match === null) 
            throw new Error(`Failed to parse line ${line}`);
        const cards = match[1].split('');
        const hand = { cards: cards, type: getBestHandType(cards) };
        return { hand: hand, bid: parseInt(match[2]) };
    });
}

function getBestHandType(hand: string[]): string {
    if (!hand.includes('J'))
        return getHandType(hand);

    const distinctCards = getDistinctCards(hand);
    
    const possibleBestHandTypes: string[] = [];
    for (const card of distinctCards) {
        const substitutedCards = substituteCards(hand, 'J', card);
        const handType = getHandType(substitutedCards);
        possibleBestHandTypes.push(handType);
    }

    const sortedHandTypes = sortHandTypes(possibleBestHandTypes);
    return sortedHandTypes[sortedHandTypes.length - 1];
};

function getDistinctCards(hand: string[]): string[] {
    return hand.reduce<string[]>((agg, curr) => agg.includes(curr) ? agg : [...agg, curr], []);
}

function substituteCards(hand: string[], find: string, replace: string): string[] {
    return hand.map(card => card === find ? replace : card);
}

function sortHandTypes(handTypes: string[]): string[] {
    return handTypes.sort((a, b) => {
        const handRankA = getHandTypeRank(a);
        const handRankB = getHandTypeRank(b);
        if (handRankA < handRankB) return -1;
        if (handRankA > handRankB) return 1;
        return 0;
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

function calculateWinnings(orderedInputs: Input[]): number {
    let winnings = 0;
    for (const [i, input] of orderedInputs.entries()) {
        winnings += (i+1) * input.bid;
    }
    return winnings;
}
