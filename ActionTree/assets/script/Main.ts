import { Utils } from "./common/Utils";
import { Action } from "./common/actionTree/Action";
import { Condition } from "./common/actionTree/Condition";
import { Sequence } from "./common/actionTree/Sequence";
import { Coroutine, LoopCoroutine, Wait, WaitMs } from "./common/coroutine/Coroutine";
import { Robot } from "./robot/Robot";
import { Action_Atk } from "./robot/action/Action_Atk";
import { Action_Defind as Action_Defend } from "./robot/action/Action_Defend";
import { Action_Move } from "./robot/action/Action_Move";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Math extends cc.Component {

    // 创建行为树
    private moveAction = new Action_Move('移动');
    private attackAction = new Action_Atk('攻击');
    private defendAction = new Action_Defend('防御');

    

    start() {
        function* name() {
            console.log('start -----------');
            yield Wait(1);
            console.log(Date.now().toLocaleString());
            yield WaitMs(500);
            console.log(Date.now().toLocaleString());
        }
        let cor = LoopCoroutine(name)
        cor.start()

        setTimeout(() => {
            cor.stop()
        }, 4000);
    }


    update(dt) {
        // const attackCondition = new Condition(
        //     () => Utils.getRandom() > 0.5,
        //     this.attackAction,
        //     this.defendAction
        // );
        // const behaviorTree = new Sequence([this.moveAction, attackCondition]);
        // // 创建机器人并执行行为树
        // const robot = new Robot(behaviorTree);
        // robot.executeBehaviorTree();
    }
}
