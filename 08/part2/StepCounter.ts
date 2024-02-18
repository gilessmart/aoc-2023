export default class StepCounter {
    private stepCount: number = 0;

    public get current() {
        return this.stepCount;
    }

    public advance(delta: number) {
        this.stepCount += delta;
    }
};
