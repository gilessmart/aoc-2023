export default class {
    readonly winningNumbers: number[];
    readonly yourNumbers: number[];

    constructor(winningNumbers: number[], yourNumbers: number[]) {
        this.winningNumbers = winningNumbers;
        this.yourNumbers = yourNumbers;
    }

    calculatePoints(): number {
        const matchingNumbers = this.yourNumbers.filter(yn => this.winningNumbers.includes(yn));

        if (matchingNumbers.length === 0) 
            return 0;

        return Math.pow(2, matchingNumbers.length - 1);
    }
}