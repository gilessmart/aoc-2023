import Node from './Node';
import StepCounter from './StepCounter';

export default class FinishingNodeStepCountIterator {
    private stepCounter: StepCounter = new StepCounter();
    private defaultFinder: DefaultFinishingNodeStepCountFinder;
    private fastFinder: FastFinishingNodeStepCountFinder | null = null;

    constructor(directions: string[], startingNode: Node) {
        this.defaultFinder = new DefaultFinishingNodeStepCountFinder(
            directions, 
            startingNode, 
            this.stepCounter,
            loopNodes => { this.setupFastImplementation(loopNodes); });
    }

    private setupFastImplementation(loopNodes: Node[]) {
        this.fastFinder = new FastFinishingNodeStepCountFinder(loopNodes, this.stepCounter);
    }

    public next() {
        if (this.fastFinder !== null) {
            this.fastFinder.next();
            return;
        }

        this.defaultFinder.next();
    }

    public runToOrBeyond(targetStepCount: number) {
        if (this.stepCounter.current >= targetStepCount)
            return;

        if (this.fastFinder !== null) {
            this.fastFinder.runToOrBeyond(targetStepCount);
            return;
        }

        while (true) {
            this.defaultFinder.next();

            if (this.stepCounter.current >= targetStepCount)
                return;

            if (this.fastFinder !== null) {
                (this.fastFinder as FastFinishingNodeStepCountFinder).runToOrBeyond(targetStepCount);
                return;
            }
        }
    }

    public get current(): number {
        return this.stepCounter.current;
    }
}

class DefaultFinishingNodeStepCountFinder {
    private stepCounter: StepCounter;
    private readonly onLoopFound: (loopNodes: Node[]) => undefined;

    private readonly directions: string[];
    private history: { directionIndex: number, node: Node }[] = [];
    private node: Node;
    
    constructor(directions: string[], startingNode: Node, stepCounter: StepCounter, onLoopFound: (loopNodes: Node[]) => undefined) {
        this.directions = directions;
        this.node = startingNode;
        this.stepCounter = stepCounter;
        this.onLoopFound = onLoopFound;
    }

    next() {   
        while (true) {
            const loopNodes = this.detectLoop();
            if (loopNodes !== null) {
                if (!loopNodes.some(node => isFinishingNode(node)))
                    throw new Error('no finishing nodes in the path');

                this.stepCounter.advance(loopNodes.findIndex(node => isFinishingNode(node)));
                this.onLoopFound(loopNodes);
                return;
            }

            this.recordHistory();
            this.node = this.getNextNode();
            this.stepCounter.advance(1);

            if (isFinishingNode(this.node))
                return;
        }   
    }

    private recordHistory() {
        this.history.push({ directionIndex: this.directionIndex, node: this.node });
    }

    private detectLoop() {
        const loopStartIndex = this.history.findIndex(h => h.directionIndex === this.directionIndex && h.node === this.node);
        return (loopStartIndex === -1) ? null : this.history.slice(loopStartIndex).map(x => x.node);
    }

    private getNextNode(): Node {
        switch (this.direction) {
            case 'L':
                return this.node.leftChild;
            case 'R':
                return this.node.rightChild;
            default:
                throw new Error(`Invalid direction '${this.direction}'`);
        }
    }

    private get directionIndex(): number {
        return this.stepCounter.current % this.directions.length;
    }

    private get direction(): string {
        return this.directions[this.directionIndex];
    }
}

class FastFinishingNodeStepCountFinder {
    private stepCounter: StepCounter;
    private readonly stepCountIntervals: number[];
    private readonly loopLength: number;
    
    constructor(loopNodes: Node[], stepCounter: StepCounter) {
        this.stepCountIntervals = FastFinishingNodeStepCountFinder.getStepCountIntervals(loopNodes);
        this.stepCounter = stepCounter;
        this.loopLength = loopNodes.length;
    }

    public next() {
        const delta = this.stepCountIntervals[0] as number;
        this.stepCounter.advance(delta);
        FastFinishingNodeStepCountFinder.rotateLeft(this.stepCountIntervals);
    }

    public runToOrBeyond(targetStepCount: number) {
        const wholeLoops = Math.floor((targetStepCount - this.stepCounter.current) / this.loopLength);
        this.stepCounter.advance(wholeLoops * this.loopLength);
        while (this.stepCounter.current < targetStepCount)
            this.next();
    }

    private static getStepCountIntervals(loopNodes: Node[]): number[] {
        const finishingNodeOffsets = loopNodes
            .filter(node => isFinishingNode(node))
            .map((_, i) => i);
    
        const stepCountIntervals = [];
    
        for (let i = 1; i < finishingNodeOffsets.length; i++)
            stepCountIntervals.push(finishingNodeOffsets[i] - finishingNodeOffsets[i - 1]);
        
        const lastOffsetToLoopEnd = loopNodes.length - finishingNodeOffsets[finishingNodeOffsets.length - 1];
        const loopStartToFirstOffset = finishingNodeOffsets[0];
        stepCountIntervals.push(lastOffsetToLoopEnd + loopStartToFirstOffset);
    
        return stepCountIntervals;
    }

    private static rotateLeft<T>(list: T[]) {
        const item = list.shift();
        list.push(item!);
    }
}

function isFinishingNode(node: Node): boolean {
    return node.name.endsWith('Z');
}
