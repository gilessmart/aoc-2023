import * as fs from 'fs';
import Mapper from './Mapper';
import Mapping from './Mapping';

const inputPath = process.argv[2];
if (inputPath === undefined) {
    console.log('input path required');
    process.exit(1);
}

console.log(`input path: ${inputPath}`);

const input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
const { seeds, mappers } = parseInput(input);
const locations = seeds.map(seed => runMappers(seed, mappers));
const lowestLocation = Math.min(...locations);
console.log(`lowest location number: ${lowestLocation}`)

function parseInput(input: string): { seeds: number[], mappers: Mapper[] } {
    const sections = input.split('\n\n');
    const seeds = parseSeeds(sections[0]);
    const mappers = sections.slice(1).map(section => parseMapper(section));
    return { seeds, mappers };
}

function parseSeeds(text: string): number[] {
    const seeds: number[] = [];
    const matches = text.matchAll(/\d+/g);
    for (const match of matches)
        seeds.push(parseInt(match[0]));
    return seeds;
}

function parseMapper(text: string): Mapper {
    const lines = text.trim().split('\n');
    const mappings = lines.slice(1).map(line => parseMapping(line));
    return new Mapper(mappings);
}

function parseMapping(line: string): Mapping {
    const match = line.match(/(\d+)\s+(\d+)\s+(\d+)/) as RegExpMatchArray;
    const destinationRangeStart = parseInt(match[1]);
    const sourceRangeStart = parseInt(match[2]);
    const rangeLength = parseInt(match[3]);
    return new Mapping(destinationRangeStart, sourceRangeStart, rangeLength);
}

function runMappers(input: number, mappers: Mapper[]) {
    let value = input;
    mappers.forEach(m => value = m.map(value));
    return value;
}
