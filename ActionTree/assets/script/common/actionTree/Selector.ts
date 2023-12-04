import { Behavior } from "./IBehavior";

export class Selector implements Behavior {
    private behaviors: Behavior[];

    constructor(behaviors: Behavior[]) {
        this.behaviors = behaviors;
    }

    execute(): boolean {
        for (const behavior of this.behaviors) {
            if (behavior.execute()) {
                return true;
            }
        }
        return false;
    }
}