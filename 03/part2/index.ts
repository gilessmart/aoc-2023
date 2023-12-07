import * as fs from 'fs';
import Token from './Token';

const inputPath = process.argv[2];
if (inputPath === undefined) {
    console.log('input path required');
    process.exit(1);
}

console.log(`input path: ${inputPath}`);

const input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
const inputLines = input.trim().split('\n').map(x => x.trim());
const numberTokens = getNumberTokens(inputLines);
const symbolTokens = getSymbolTokens(inputLines);
const partNumberTokens = getPartNumberTokens(numberTokens, symbolTokens);
const gearRatios = getGearRatios(symbolTokens, partNumberTokens);
const sumOfGearRatios = gearRatios.reduce((sum, curr) => sum + curr, 0);

console.log(`sum of gear ratios: ${sumOfGearRatios}`);

function getNumberTokens(inputLines: string[]): Token[] {
    return getTokensByPattern(inputLines, /\d+/dg);
}

function getSymbolTokens(inputLines: string[]): Token[] {
    return getTokensByPattern(inputLines, /[^\.\d]/dg);
}

function getTokensByPattern(inputLines: string[], pattern: RegExp): Token[] {
    const tokens: Token[] = [];

    inputLines.forEach((lineText, lineIndex) => {
        const matches = lineText.matchAll(pattern);
        for (const match of matches) {
            const inputElement = new Token(match[0], lineIndex, match.index as number);
            tokens.push(inputElement);
        }
    });

    return tokens;
}

function getPartNumberTokens(numberTokens: Token[], symbolTokens: Token[]): Token[] {
    const partNumberTokens: Token[] = [];

    for (const numberToken of numberTokens)
        for (const symbolToken of symbolTokens)
            if (areTokensAdjacent(numberToken, symbolToken))
                partNumberTokens.push(numberToken);

    return partNumberTokens;
}

function getGearRatios(symbolTokens: Token[], partNumberTokens: Token[]): number[] {
    const gearRatios: number[] = [];
    
    const asteriskTokens = symbolTokens.filter(t => t.text === '*');
    for (const asteriskToken of asteriskTokens) {
        const adjacentPartNumberTokens = partNumberTokens.filter(pnt => areTokensAdjacent(asteriskToken, pnt));
        if (adjacentPartNumberTokens.length === 2) {
            const partNumber1 = parseInt(adjacentPartNumberTokens[0].text);
            const partNumber2 = parseInt(adjacentPartNumberTokens[1].text);
            gearRatios.push((partNumber1 * partNumber2));
        }
    }

    return gearRatios;
}

function areTokensAdjacent(a: Token, b: Token): boolean {
    if (a.lineIndex < b.lineIndex - 1) return false;
    if (a.lineIndex > b.lineIndex + 1) return false;
    if (a.endIndex < b.startIndex - 1) return false;
    if (a.startIndex > b.endIndex + 1) return false;
    return true;
}