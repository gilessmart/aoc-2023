import FinishingNodeStepCountIterator from "../FinishingNodeStepCountIterator";
import Node from '../Node';

describe('FinishingNodeStepCountIterator', function () {
    it('finds multiple finishing node step counts', function() {
        const nodeAAA: Node = { name: 'AAA', leftChild: null!, rightChild: null! };
        const nodeBBB: Node = { name: 'BBB', leftChild: null!, rightChild: null! };
        const nodeZZZ: Node = { name: 'ZZZ', leftChild: null!, rightChild: null! };
        const nodeXXX: Node = { name: 'XXX', leftChild: null!, rightChild: null! };

        nodeAAA.leftChild = nodeAAA;
        nodeAAA.rightChild = nodeBBB;
        nodeBBB.leftChild = nodeBBB;
        nodeBBB.rightChild = nodeZZZ;
        nodeZZZ.leftChild = nodeBBB;
        nodeZZZ.rightChild = nodeXXX;
        nodeXXX.leftChild = nodeXXX;
        nodeXXX.rightChild = nodeXXX;

        const directions = [ 'L', 'R' ];
        
        const iterator = new FinishingNodeStepCountIterator(directions, nodeAAA);
        iterator.next();
        expect(iterator.current).toBe(4);
        iterator.next();
        expect(iterator.current).toBe(6);
        iterator.next();
        expect(iterator.current).toBe(8);
    });

    it('finds multiple finshing node step counts where there are multiple in a loop', function() {
        const nodeAAA: Node = { name: 'AAA', leftChild: null!, rightChild: null! };
        const nodeBBB: Node = { name: 'BBB', leftChild: null!, rightChild: null! };
        const nodeZZZ: Node = { name: 'ZZZ', leftChild: null!, rightChild: null! };

        nodeAAA.leftChild = nodeAAA;
        nodeAAA.rightChild = nodeBBB;
        nodeBBB.leftChild = nodeBBB;
        nodeBBB.rightChild = nodeZZZ;
        nodeZZZ.leftChild = nodeZZZ;
        nodeZZZ.rightChild = nodeBBB;

        const directions = [ 'L', 'R' ];

        const iterator = new FinishingNodeStepCountIterator(directions, nodeAAA);
        iterator.next();
        expect(iterator.current).toBe(4);
        iterator.next();
        expect(iterator.current).toBe(5);
        iterator.next();
        expect(iterator.current).toBe(8);
        iterator.next();
        expect(iterator.current).toBe(9);
    });

    describe('with example data', function () {
        let nodes: Node[], directions: string[];

        beforeEach(function() {
            const node11A: Node = { name: '11A', leftChild: null!, rightChild: null! };
            const node11B: Node = { name: '11B', leftChild: null!, rightChild: null! };
            const node11Z: Node = { name: '11Z', leftChild: null!, rightChild: null! };
            
            const node22A: Node = { name: '22A', leftChild: null!, rightChild: null! };
            const node22B: Node = { name: '22B', leftChild: null!, rightChild: null! };
            const node22C: Node = { name: '22C', leftChild: null!, rightChild: null! };
            const node22Z: Node = { name: '22Z', leftChild: null!, rightChild: null! };
            
            const nodeXXX: Node = { name: 'XXX', leftChild: null!, rightChild: null! };

            node11A.leftChild = node11B;
            node11A.rightChild = nodeXXX;
            node11B.leftChild = nodeXXX;
            node11B.rightChild = node11Z;
            node11Z.leftChild = node11B;
            node11Z.rightChild = nodeXXX;

            node22A.leftChild = node22B;
            node22A.rightChild = nodeXXX;
            node22B.leftChild = node22C;
            node22B.rightChild = node22C;
            node22C.leftChild = node22Z;
            node22C.rightChild = node22Z;
            node22Z.leftChild = node22B;
            node22Z.rightChild = node22B;

            nodeXXX.leftChild = nodeXXX;
            nodeXXX.rightChild = nodeXXX;

            nodes = [
                node11A, node11B, node11Z,
                node22A, node22B, node22C, node22Z,
                nodeXXX
            ];

            directions = [ 'L', 'R' ];
        });

        it('solves starting at 11A', function() {
            const startingNode = nodes.find(n => n.name === '11A') as Node;
            const iterator = new FinishingNodeStepCountIterator(directions, startingNode);
            iterator.next();
            expect(iterator.current).toBe(2);
            iterator.next();
            expect(iterator.current).toBe(4);
            iterator.next();
            expect(iterator.current).toBe(6);
        });

        it('solves starting at 22A', function() {
            const startingNode = nodes.find(n => n.name === '22A') as Node;
            const iterator = new FinishingNodeStepCountIterator(directions, startingNode);
            iterator.next();
            expect(iterator.current).toBe(3);
            iterator.next();
            expect(iterator.current).toBe(6);
        });

        it('runs to or beyond', function() {
            const startingNode = nodes.find(n => n.name === '22A') as Node;
            const iterator = new FinishingNodeStepCountIterator(directions, startingNode);
            iterator.runToOrBeyond(2);
            expect(iterator.current).toBe(3);
            iterator.runToOrBeyond(3);
            expect(iterator.current).toBe(3);
            iterator.runToOrBeyond(2);
            expect(iterator.current).toBe(3);
            iterator.runToOrBeyond(3);
            expect(iterator.current).toBe(3);
            
            iterator.runToOrBeyond(4);
            expect(iterator.current).toBe(6);
            iterator.runToOrBeyond(6);
            expect(iterator.current).toBe(6);
            iterator.runToOrBeyond(4);
            expect(iterator.current).toBe(6);
            iterator.runToOrBeyond(6);
            expect(iterator.current).toBe(6);

            iterator.runToOrBeyond(7);
            expect(iterator.current).toBe(9);
            iterator.runToOrBeyond(8);
            expect(iterator.current).toBe(9);
            iterator.runToOrBeyond(9);
            expect(iterator.current).toBe(9);
        });
    });
});
