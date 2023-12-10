import * as fs from 'fs';

const inputPath = process.argv[2];
if (inputPath === undefined) {
    console.log('input path required');
    process.exit(1);
}

console.log(`input path: ${inputPath}`);

const numberMap = new Map<string, number>([
    [ '1', 1 ],
    [ '2', 2 ],
    [ '3', 3 ],
    [ '4', 4 ],
    [ '5', 5 ],
    [ '6', 6 ],
    [ '7', 7 ],
    [ '8', 8 ],
    [ '9', 9 ],
    [ 'one', 1 ],
    [ 'two', 2 ],
    [ 'three', 3 ],
    [ 'four', 4 ],
    [ 'five', 5 ],
    [ 'six', 6 ],
    [ 'seven', 7 ],
    [ 'eight', 8 ],
    [ 'nine', 9 ],
]);

const input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
const inputLines = input.trim().split('\n').map(x => x.trim());
const values = inputLines.map(line => getValue(line));
const total = values.reduce((sum, curr) => sum + curr, 0);

console.log(total);

function getValue(line : string) : number {
    const numbers = getNumbers(line);
    const firstAndLast = `${numbers[0]}${numbers[numbers.length - 1]}`;
    return parseInt(firstAndLast);
}

function getNumbers(input : string) : number[] {
    const numbers : number[] = [];
    
    let remainingInput = input;
    while (remainingInput.length > 0) {
        for (const [numText, num] of numberMap.entries()) {
            if (remainingInput.startsWith(numText)) {
                numbers.push(num);
                break;
            }
        }
        remainingInput = remainingInput.substring(1);
    }
    
    return numbers;
}

