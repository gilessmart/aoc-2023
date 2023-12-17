import * as fs from 'fs';

if (process.argv.length < 3) {
    console.log('input file name required');
    process.exit(1);
}

const inputFilePath = process.argv[2];
const inputFileText = fs.readFileSync(inputFilePath, { encoding: 'utf-8' });

type RaceData = { time: number; recordDistance: number; };

const race = parseRaceData(inputFileText);
const recordBreakingStrategyCount = getRecordBreakingStrategyCounts(race);

console.log(recordBreakingStrategyCount);

function parseRaceData(inputFileText: string): RaceData {
    const timesLineMatch = inputFileText.match(/Time\:\s+(.*)$/m);
    if (timesLineMatch === null) throw new Error('"Time" line not found in input');
    const time = parseNumber(timesLineMatch[1]);

    const distancesLineMatch = inputFileText.match(/Distance\:\s+(.*)$/m);
    if (distancesLineMatch === null) throw new Error('"Distance" line not found in input');
    const distance = parseNumber(distancesLineMatch[1]);

    return { time: time, recordDistance: distance };
}

function parseNumber(text: string): number {
    return parseInt(text.split(' ').join(''));
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