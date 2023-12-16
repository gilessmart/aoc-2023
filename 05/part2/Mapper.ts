import Mapping from "./Mapping";
import MappingData from "./MappingData";

export default class Mapper {
    readonly mappings: Mapping[];
    mostRecentMapping: Mapping;

    constructor(mappings: MappingData[]) {
        this.mappings = createMappingList(mappings);
        this.mostRecentMapping = createMapping(mappings[0]);
    }

    map(src: number): number {
        if (src >= this.mostRecentMapping.srcRangeStart && src <= this.mostRecentMapping.srcRangeEnd)
            return this.mostRecentMapping.dstSrcOffset + src;
        
        for (const mapping of this.mappings) {
            if (src <= mapping.srcRangeEnd) {
                this.mostRecentMapping = mapping;
                return mapping.dstSrcOffset + src;
            }
        }

        throw new Error(`failed to map ${src}`);
    }
}

function createMappingList(mappingData: MappingData[]): Mapping[] {
    const mappingList: Mapping[] = [];
    
    const orderedMappingData = mappingData.sort((a, b) => a.srcRangeStart - b.srcRangeStart);
    for (let i = 0; i < orderedMappingData.length - 1; i++) {
        const mapping = createMapping(mappingData[i]);
        mappingList.push(mapping);

        const nextSrcRangeStart = orderedMappingData[i+1].srcRangeStart;
        if (nextSrcRangeStart > mapping.srcRangeEnd) {
            mappingList.push(new Mapping(mapping.srcRangeEnd + 1, nextSrcRangeStart - 1, 0));
        }
    }
    mappingList.push(createMapping(orderedMappingData[orderedMappingData.length - 1]));

    mappingList.unshift(new Mapping(Number.NEGATIVE_INFINITY, mappingList[0].srcRangeStart - 1, 0));
    mappingList.push(new Mapping(mappingList[mappingList.length - 1].srcRangeEnd + 1, Number.POSITIVE_INFINITY, 0));

    return mappingList;
}

function createMapping(mappingData: MappingData): Mapping {
    const srcRangeStart = mappingData.srcRangeStart;
    const srcRangeEnd = mappingData.srcRangeStart + mappingData.rangeLength - 1;
    const offset = mappingData.dstRangeStart - mappingData.srcRangeStart;
    return new Mapping(srcRangeStart, srcRangeEnd, offset);
}