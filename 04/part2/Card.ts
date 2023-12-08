export default class {
    readonly cardNumber: number;
    readonly winningNumbers: number[];
    readonly yourNumbers: number[];

    get matches(): number[] {
        return this.winningNumbers.filter(wn => this.yourNumbers.includes(wn));
    }

    get matchCount(): number {
        return this.matches.length;
    }

    constructor(cardNumber: number, winningNumbers: number[], yourNumbers: number[]) {
        this.cardNumber = cardNumber;
        this.winningNumbers = winningNumbers;
        this.yourNumbers = yourNumbers;
    }
}