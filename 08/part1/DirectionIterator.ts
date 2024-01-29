export default class DirectionIterator implements IterableIterator<string> {
    readonly directions: string[];
    iterationCount: number = 0;

    constructor(directions: string[]) {
        this.directions = directions;
    }

    [Symbol.iterator](): IterableIterator<string> {
        return this;
    }

    next(): IteratorResult<string> {
        const index = this.iterationCount % this.directions.length;
        this.iterationCount++;
        return { done: false, value: this.directions[index] };
    }
}
