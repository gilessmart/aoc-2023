import Mapping from "./Mapping";

export default class {
    readonly mappings: Mapping[];
    mostRecentMapping: Mapping;

    constructor(mappings: Mapping[]) {
        this.mappings = mappings.sort((a, b) => {
            return a.srcRangeStart - b.srcRangeStart;
        });
        this.mostRecentMapping = mappings[0];
    }

    map(src: number): number {
        if (src >= this.mostRecentMapping.srcRangeStart && src <= this.mostRecentMapping.srcRangeEnd)
            return this.mostRecentMapping.dstSrcOffset + src
        
        for (const mapping of this.mappings) {
            if (src < mapping.srcRangeStart)
                return src;
            if (src > mapping.srcRangeEnd)
                continue;
            
            this.mostRecentMapping = mapping;
            return mapping.dstSrcOffset + src;
        }

        return src;
    }
}