export default class Round {
    readonly red: number;
    readonly green: number;
    readonly blue: number;

    constructor(red: number, green: number, blue: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    isPossibleWithCubes(red: number, green: number, blue: number): boolean {
        return this.red <= red && this.green <= green && this.blue <= blue;
    }
}
