export default class {
    readonly text: string;
    readonly lineIndex: number;
    readonly startIndex: number;

    get endIndex(): number {
        return this.startIndex + this.text.length - 1;
    }

    constructor(text: string, lineIndex: number, startIndex: number) {
        this.text = text;
        this.lineIndex = lineIndex;
        this.startIndex = startIndex;
    }
}
