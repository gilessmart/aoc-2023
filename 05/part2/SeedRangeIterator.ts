export default class {
    readonly startNum: number;
    readonly rangeLength: number;
    iteratorPosition: number = 0;

    constructor(startNum: number, rangeLength: number) {
        this.startNum = startNum;
        this.rangeLength = rangeLength;
    }

    getNext(): number | null {
        const result = this.iteratorPosition < this.rangeLength
            ? this.startNum + this.iteratorPosition
            : null;
        this.iteratorPosition++;
        return result;
    }
}