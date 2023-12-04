import { Utils } from "../../common/Utils";
import { Action } from "../../common/actionTree/Action";

export class Action_Defind extends Action{

    execute(): boolean {
        let defend = Utils.getRandom() < 0.6
        console.log("防御 : ", defend)
        return defend
    }

}