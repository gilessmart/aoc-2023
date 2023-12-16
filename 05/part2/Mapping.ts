export default class Mapping {
    readonly dstSrcOffset: number;
    readonly srcRangeStart: number;
    readonly srcRangeEnd: number;

    constructor(dstRangeStart: number, srcRangeStart: number, rangeLength: number) {
        this.dstSrcOffset = dstRangeStart - srcRangeStart;
        this.srcRangeStart = srcRangeStart;
        this.srcRangeEnd = srcRangeStart + rangeLength - 1;
    }
}