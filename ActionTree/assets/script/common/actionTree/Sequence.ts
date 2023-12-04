import { Behavior } from "./IBehavior";

export class Sequence implements Behavior {
    private behaviors: Behavior[];

    constructor(behaviors: Behavior[]) {
        this.behaviors = behaviors;
    }

    execute(): boolean {
        for (const behavior of this.behaviors) {
            if (!behavior.execute()) {
                return false;
            }
        }
        return true;
    }
}