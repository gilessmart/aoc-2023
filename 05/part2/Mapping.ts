export default class Mapping {
    readonly srcRangeStart: number;
    readonly srcRangeEnd: number;
    readonly dstSrcOffset: number;

    constructor(srcRangeStart: number, srcRangeEnd: number, dstSrcOffset: number) {
        this.srcRangeStart = srcRangeStart;
        this.srcRangeEnd = srcRangeEnd;
        this.dstSrcOffset = dstSrcOffset;
    }
}