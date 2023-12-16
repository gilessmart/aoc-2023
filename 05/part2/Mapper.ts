import Mapping from "./Mapping";

export default class {
    readonly mappings: Mapping[];

    constructor(mappings: Mapping[]) {
        this.mappings = mappings.sort((a, b) => {
            return a.srcRangeStart - b.srcRangeStart;
        });
    }

    map(src: number): number {
        for (const mapping of this.mappings) {
            if (src < mapping.srcRangeStart)
                return src;
            if (src > mapping.srcRangeEnd)
                continue;
            return mapping.dstSrcOffset + src;
        }
        return src;
    }
}