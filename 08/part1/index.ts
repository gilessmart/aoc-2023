import fs from 'fs';
import DirectionIterator from './DirectionIterator';

type Node = {
    name: string,
    leftChildName: string,
    rightChildName: string
};

if (process.argv.length < 3)
    throw new Error('No input file path supplied');

const filepath = process.argv[2];
const inputText = fs.readFileSync(filepath, { encoding: 'utf-8' });

const { directions, nodes } = parseInput(inputText);
const steps = calculateSteps('AAA', 'ZZZ');
console.log(steps);

function parseInput(text: string): { directions: Iterable<string>, nodes: Map<string, Node> } {
    const lines = text.split('\n').map(l => l.trim());
    const directions = parseDirections(lines[0]);
    const nodes = parseNodes(lines.slice(2));
    return { directions, nodes };
}

function parseDirections(text: string): Iterable<string> {
    const directions = text.trim().split('');
    return new DirectionIterator(directions);
}

function parseNodes(lines: string[]): Map<string, Node> {
    const map = new Map<string, Node>();
    for (const line of lines) {
        const match = line.match(/([A-Z]+) = \(([A-Z]+), ([A-Z]+)\)/);
        if (match === null)
            throw new Error(`Failed to parse line '${line}'`);
        
        const nodeName = match[1];
        const node = {
            name: nodeName,
            leftChildName: match[2],
            rightChildName: match[3]
        };
        map.set(nodeName, node);
    }
    return map;
}

function calculateSteps(originNodeName: string, destinationNodeName: string): number {
    let steps = 0;

    let node = getNodeOrThrow(originNodeName);
    for (const direction of directions) {
        steps++;
        
        const newNodeName = getNewNodeName(node, direction);
        
        if (newNodeName === destinationNodeName)
            break;

        node = getNodeOrThrow(newNodeName);
    }

    return steps;
}

function getNodeOrThrow(nodeName: string): Node {
    const node = nodes.get(nodeName);
    if (node === undefined)
        throw new Error('Origin node not found');
    return node;
}

function getNewNodeName(node: Node, direction: string) {
    switch (direction) {
        case 'L':
            return node.leftChildName;
        case 'R':
            return node.rightChildName;
        default:
            throw new Error(`Invalind direction '${direction}'`);
    }
}
