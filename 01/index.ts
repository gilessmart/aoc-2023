import * as fs from 'fs';

const inputPath = process.argv[2];
if (inputPath === undefined) {
    console.log('input path required');
    process.exit(1);
}

console.log(`input path: ${inputPath}`);

const input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
const inputLines = input.trim().split('\n').map(x => x.trim());
const values = inputLines.map(line => parseInputLine(line));
const total = values.reduce((sum, curr) => sum + curr, 0);

console.log(total);

function parseInputLine(line : string) : number {
    const digits = getDigits(line);
    const firstAndLast = `${digits[0]}${digits[digits.length - 1]}`;
    return parseInt(firstAndLast);
}

function getDigits(input : string) : string[] {
    const digits : string[] = [];
    for (const c of input)
        if (/\d/.test(c))
            digits.push(c);
    return digits;
}