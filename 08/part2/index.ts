import fs from 'fs';
import Node from './Node';
import { parse as parseInput } from './InputParser';
import FinishingNodeStepCountIterator from './FinishingNodeStepCountIterator';

const startTime = new Date();

if (process.argv.length < 3)
    throw new Error('No input file path supplied');

const filepath = process.argv[2];
const inputText = fs.readFileSync(filepath, { encoding: 'utf-8' });
const { directions, nodes } = parseInput(inputText);
const iterators = getFinishingNodeIterators(nodes, directions);
const stepCount = getFinishingStepCount(iterators);
console.log(stepCount);

const endTime = new Date();
console.log(`elapsed: ${(endTime.valueOf() - startTime.valueOf()) / 1000}s`);

function getFinishingNodeIterators(nodes: Node[], directions: string[]): FinishingNodeStepCountIterator[] {
    const startingNodes = nodes.filter(node => node.name.endsWith('A'));
    return startingNodes.map(startingNode => new FinishingNodeStepCountIterator(directions, startingNode));
}

function getFinishingStepCount(iterators: FinishingNodeStepCountIterator[]) {
    // iterators must be run at least once
    iterators.forEach(iterator => iterator.next());
    if (stepCountsMatch(iterators))
        return iterators[0].current;

    outerLoop: while (true) {
        // (reverse) sorting by avg step counts between finishing nodes might be faster 
        // becuase we'd be ruling out more wrong step counts per iteration
        // and once each iterator has loop, there's no need to keep sorting
        sortIterators(iterators);

        const [firstIterator, secondIterator, ...remainingIterators] = iterators;

        if (firstIterator.current !== secondIterator.current)
            raceIterators(firstIterator, secondIterator);

        for (const iterator of remainingIterators) {
            iterator.runToOrBeyond(firstIterator.current);
            if (iterator.current !== firstIterator.current)
                continue outerLoop;
        }

        return firstIterator.current;
    }
}

function stepCountsMatch(iterators: FinishingNodeStepCountIterator[]): boolean {
    const [ firstIterator, ...remainingIterators ] = iterators;
    return remainingIterators.every(iterator => iterator.current === firstIterator.current);
}

function raceIterators(a: FinishingNodeStepCountIterator, b: FinishingNodeStepCountIterator) {
    while (true) {
        if (a.current < b.current) {
            a.next();
            continue;
        }
        
        if (a.current > b.current) {
            b.next();
            continue;
        }
        
        break;
    }
}

function sortIterators(iterators: FinishingNodeStepCountIterator[]) {
    iterators.sort((a, b) => b.current - a.current);
}
