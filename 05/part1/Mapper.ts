import Mapping from "./Mapping";

export default class {
    readonly mappings: Mapping[];

    constructor(mappings: Mapping[]) {
        this.mappings = mappings;
    }

    map(src: number): number {
        for (const mapping of this.mappings) {
            const mappingResult = mapping.map(src);
            if (mappingResult !== undefined)
                return mappingResult;
        }
        return src;
    }
}