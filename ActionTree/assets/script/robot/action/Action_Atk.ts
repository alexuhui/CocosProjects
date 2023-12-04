import { Utils } from "../../common/Utils";
import { Action } from "../../common/actionTree/Action";

export class Action_Atk extends Action {

    execute(): boolean {

        let atk = Utils.getRandom() < 0.3
        console.log(`攻击 : ${atk}`)
        return atk
    }

}