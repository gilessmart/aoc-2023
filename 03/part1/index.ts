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
const partNumbers = partNumberTokens.map(e => parseInt(e.text));
const sumOfPartNumbers = partNumbers.reduce((sum, curr) => sum + curr, 0);

console.log(`sum of part numbers: ${sumOfPartNumbers}`);

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

function areTokensAdjacent(a: Token, b: Token): boolean {
    if (a.lineIndex < b.lineIndex - 1) return false;
    if (a.lineIndex > b.lineIndex + 1) return false;
    if (a.endIndex < b.startIndex - 1) return false;
    if (a.startIndex > b.endIndex + 1) return false;
    return true;
}