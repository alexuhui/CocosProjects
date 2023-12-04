import { Action } from "../../common/actionTree/Action";

export class Action_Move extends Action{

    execute(): boolean {
        console.log("移动")
        return true
    }

}