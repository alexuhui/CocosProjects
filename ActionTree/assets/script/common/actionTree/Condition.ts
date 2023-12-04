import { Behavior } from "./IBehavior";

export class Condition implements Behavior {
    constructor(private condition: () => boolean, private trueBehavior: Behavior, private falseBehavior: Behavior) { }

    execute(): boolean {
        return this.condition() ? this.trueBehavior.execute() : this.falseBehavior.execute();
    }
}
