import * as fs from 'fs';
import Game from './Game';
import Round from './Round';

const inputPath = process.argv[2];
if (inputPath === undefined) {
    console.log('input path required');
    process.exit(1);
}

console.log(`input path: ${inputPath}`);

const input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
const inputLines = input.trim().split('\n').map(x => x.trim());
const games = inputLines.map(line => parseGame(line));
const possibleGames = games.filter(game => game.isPossibleWithCubes(12, 13, 14));
const sumOfIds = possibleGames.map(game => game.id).reduce((sum, curr) => sum + curr, 0);
console.log(`sum of possible game IDs: ${sumOfIds}`);

function parseGame(line : string) : Game {
    const execResult = /Game (\d+)\:(.*)/.exec(line);
    if (execResult === null) throw Error(`Failed to match line '${line}`);    
    const id = parseInt(execResult[1]);
    const rounds = execResult[2].split(';').map(x => parseRound(x.trim()));
    return new Game(id, rounds);
}

function parseRound(text: string) : Round {
    const redExecResult = /(\d+) red/.exec(text);
    const redCount = redExecResult === null ? 0 : parseInt(redExecResult[1]);

    const greenExecResult = /(\d+) green/.exec(text);
    const greenCount = greenExecResult === null ? 0 : parseInt(greenExecResult[1]);

    const blueExecResult = /(\d+) blue/.exec(text);
    const blueCount = blueExecResult === null ? 0 : parseInt(blueExecResult[1]);

    return new Round(redCount, greenCount, blueCount);
}