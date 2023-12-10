export default class Mapping {
    readonly dstRangeStart: number;
    readonly srcRangeStart: number;
    readonly rangeLength: number;

    constructor(dstRangeStart: number, srcRangeStart: number, rangeLength: number) {
        this.dstRangeStart = dstRangeStart;
        this.srcRangeStart = srcRangeStart;
        this.rangeLength = rangeLength;
    }

    map(src: number): number | undefined {
        if (src >= this.srcRangeStart && src < this.srcRangeStart + this.rangeLength)
            return this.dstRangeStart + src - this.srcRangeStart;
        return undefined;
    }
}