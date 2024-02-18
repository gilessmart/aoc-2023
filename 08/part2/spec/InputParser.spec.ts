import { parse } from '../InputParser';
import Node from "../Node";

describe('InputParser', function () {
    describe('with example input', function() {
        let input, result: { directions: any; nodes: Node[]; };

        beforeEach(function () {
            input = 'LR' + '\n' +
                '\n' +
                '11A = (11B, XXX)' + '\n' +
                '11B = (XXX, 11Z)' + '\n' +
                '11Z = (11B, XXX)' + '\n' +
                '22A = (22B, XXX)' + '\n' +
                '22B = (22C, 22C)' + '\n' +
                '22C = (22Z, 22Z)' + '\n' +
                '22Z = (22B, 22B)' + '\n' +
                'XXX = (XXX, XXX)';

            result = parse(input);
        });

        it('parses directions', function() {
            expect(result.directions).toEqual(['L', 'R']);
        });

        it('parses nodes', function() {
            expect(result.nodes.length).toBe(8);
            const node11A = result.nodes.find(n => n.name === '11A') as Node;
            const node11B = result.nodes.find(n => n.name === '11B') as Node;
            const node11Z = result.nodes.find(n => n.name === '11Z') as Node;
            expect(node11A.leftChild).toBe(node11B);
            expect(node11B.rightChild).toBe(node11Z);
            expect(node11Z.leftChild).toBe(node11B);
        });
    })
});