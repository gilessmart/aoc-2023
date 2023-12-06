import Round from "./Round";

export default class Game {
    readonly id: number;
    readonly rounds: Round[];

    constructor(id : number, rounds : Round[]) {
        this.id = id;
        this.rounds = rounds;
    }

    isPossibleWithCubes(red: number, green: number, blue: number) : boolean {
        return this.rounds.every(round => round.isPossibleWithCubes(red, green, blue));
    }
}