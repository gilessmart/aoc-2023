import * as fs from 'fs';

if (process.argv.length < 3) {
    console.log('input file name required');
    process.exit(1);
}

const inputFilePath = process.argv[2];
const inputFileText = fs.readFileSync(inputFilePath, { encoding: 'utf-8' });

type RaceData = { time: number; recordDistance: number; };

const races = parseRaceData(inputFileText);
const recordBreakingStrategyCounts = races.map(race => getRecordBreakingStrategyCounts(race));
const product = recordBreakingStrategyCounts.reduce((product, curr) => product * curr, 1);

console.log(product);

function parseRaceData(inputFileText: string): RaceData[] {
    const timesLineMatch = inputFileText.match(/Time\:\s+(.*)$/m);
    if (timesLineMatch === null) throw new Error('"Time" line not found in input');
    const times = parseNumbers(timesLineMatch[1]);

    const distancesLineMatch = inputFileText.match(/Distance\:\s+(.*)$/m);
    if (distancesLineMatch === null) throw new Error('"Distance" line not found in input');
    const distances = parseNumbers(distancesLineMatch[1]);
    
    const result: RaceData[] = [];
    for (let i = 0; i < times.length && i < distances.length; i++)
        result.push({ time: times[i], recordDistance: distances[i] })
    return result;
}

function parseNumbers(text: string): number[] {
    const numbers: number[] = [];
    const matches = text.matchAll(/\d+/g);
    for (const match of matches)
        numbers.push(parseInt(match[0]))
    return numbers;
}

function getRecordBreakingStrategyCounts(race: RaceData): number {
    let count = 0;
    for (let chargeTime = 1; chargeTime < race.time; chargeTime++) {
        const distance = calculateDistance(chargeTime, race.time);
        if (distance > race.recordDistance) count++;
    }
    return count;
}

function calculateDistance(chargeTime: number, raceTime: number): number {
    const speed = chargeTime;
    const remainingRaceTime = raceTime - chargeTime;
    return speed * remainingRaceTime;
}