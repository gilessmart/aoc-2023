import * as fs from 'fs';
import Mapper from './Mapper';
import SeedRangeIterator from './SeedRangeIterator';
import MappingData from './MappingData';

const inputPath = process.argv[2];
if (inputPath === undefined) {
    console.log('input path required');
    process.exit(1);
}

console.log(`input path: ${inputPath}`);
const startTime = new Date();

const input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
const { seedRanges, mappers } = parseInput(input);
const lowestLocationNumber = getLowestLocationNumber(seedRanges, mappers);
console.log(`lowest location number: ${lowestLocationNumber}`);

const endTime = new Date();
console.log(`elapsed: ${endTime.valueOf() - startTime.valueOf()}ms`);

function parseInput(input: string): { seedRanges: SeedRangeIterator[], mappers: Mapper[] } {
    const sections = input.split('\n\n');
    const seedRanges = parseSeeds(sections[0]);
    const mappers = sections.slice(1).map(section => parseMapper(section));
    return { seedRanges, mappers };
}

function parseSeeds(text: string): SeedRangeIterator[] {
    const seedRanges: SeedRangeIterator[] = [];
    const matches = text.matchAll(/(\d+)\s+(\d+)/g);
    for (const match of matches) {
        const startNum = parseInt(match[1]);
        const rangeLength = parseInt(match[2]);
        seedRanges.push(new SeedRangeIterator(startNum, rangeLength));
    }
    return seedRanges;
}

function parseMapper(text: string): Mapper {
    const lines = text.trim().split('\n');
    const mappings = lines.slice(1).map(line => parseMapping(line));
    return new Mapper(mappings);
}

function parseMapping(line: string): MappingData {
    const match = line.match(/(\d+)\s+(\d+)\s+(\d+)/) as RegExpMatchArray;
    const dstRangeStart = parseInt(match[1]);
    const srcRangeStart = parseInt(match[2]);
    const rangeLength = parseInt(match[3]);
    return { dstRangeStart, srcRangeStart, rangeLength };
}

function getLowestLocationNumber(seedRanges: SeedRangeIterator[], mappers: Mapper[]): number | null {
    let lowestLocationNumber = Number.POSITIVE_INFINITY;

    for (const seedRange of seedRanges) {
        console.log(`processing seed range ${seedRange.startNum} -> ${seedRange.startNum + seedRange.rangeLength - 1} (size: ${seedRange.rangeLength})`);
        while (true) {
            const seedNumber = seedRange.getNext();
            if (seedNumber === null) break;
            const locationNumber = runMappers(seedNumber, mappers);
            if (locationNumber < lowestLocationNumber)
                lowestLocationNumber = locationNumber;
        }
    }

    return lowestLocationNumber;
}

function runMappers(input: number, mappers: Mapper[]) {
    let value = input;
    mappers.forEach(m => value = m.map(value));
    return value;
}
