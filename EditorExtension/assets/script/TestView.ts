// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import List from "../extension/list/List";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestView extends cc.Component {

    @property(List)
    list: List = null;
    @property(List)
    list2: List = null;

    start () {
        let datas = []
        for (let i = 0; i < 1000; i++) {
            datas.push({id : i, tag : "item" + (i + 1)})
        }

        this.list.setItemDatas(datas)


        let datas2 = []
        for (let i = 0; i < 1000; i++) {
            datas2.push({id : i, tag : "item" + (i + 1) , height : 50 + Math.random() * 100})
        }
        this.list2.setItemDatas(datas2)
    }

}
