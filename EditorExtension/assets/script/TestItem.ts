// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ListItem from "../extension/list/ListItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestItem extends ListItem {

    @property(cc.Label)
    label: cc.Label = null;

    onRenderItem(data: any, idx: number): void {
        console.log(`onRenderItem  idx : ${idx}`)
        this.label.string = data.tag

        if (data.height) {
            this.node.height = data.height
        }
    }
}
