import { Behavior } from "../common/actionTree/IBehavior";

export class Robot {
    private behaviorTree: Behavior;

    constructor(behaviorTree: Behavior) {
        this.behaviorTree = behaviorTree;
    }

    executeBehaviorTree(): void {
        console.log('开始执行行为树');
        this.behaviorTree.execute();
        console.log('行为树执行结束');
    }
}
