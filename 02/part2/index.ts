import * as fs from 'fs';
import Game from './Game';
import CubeSet from './Round';

const inputPath = process.argv[2];
if (inputPath === undefined) {
    console.log('input path required');
    process.exit(1);
}

console.log(`input path: ${inputPath}`);

const input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
const inputLines = input.trim().split('\n').map(x => x.trim());
const games = inputLines.map(line => parseGame(line));
const minCubeSets = games.map(g => calculateMinCubeSet(g.rounds));
const powers = minCubeSets.map(x => x.red * x.green * x.blue);
const sumOfPowers = powers.reduce((sum, curr) => sum + curr, 0);
console.log(`sum of powers: ${sumOfPowers}`);

function parseGame(line : string) : Game {
    const execResult = /Game (\d+)\:(.*)/.exec(line);
    if (execResult === null) throw Error(`Failed to match line '${line}`);    
    const id = parseInt(execResult[1]);
    const rounds = execResult[2].split(';').map(x => parseCubeSet(x.trim()));
    return new Game(id, rounds);
}

function parseCubeSet(text: string) : CubeSet {
    const redExecResult = /(\d+) red/.exec(text);
    const redCount = redExecResult === null ? 0 : parseInt(redExecResult[1]);

    const greenExecResult = /(\d+) green/.exec(text);
    const greenCount = greenExecResult === null ? 0 : parseInt(greenExecResult[1]);

    const blueExecResult = /(\d+) blue/.exec(text);
    const blueCount = blueExecResult === null ? 0 : parseInt(blueExecResult[1]);

    return new CubeSet(redCount, greenCount, blueCount);
}

function calculateMinCubeSet(rounds: CubeSet[]): CubeSet {
    const red = Math.max(...rounds.map(r => r.red));
    const green = Math.max(...rounds.map(r => r.green));
    const blue = Math.max(...rounds.map(r => r.blue));
    return new CubeSet(red, green, blue);
}
