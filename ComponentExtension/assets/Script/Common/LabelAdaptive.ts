// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@menu("自定义组件/Common/LabelAdaptive")
@requireComponent(cc.Label)
export default class LabelAdaptive extends cc.Component {
    private _string: string = ""
    get string(): string {
        return this._string;
    }

    set string(value: string) {
        if (this._string === value) {
            return;
        }
        this._string = value;
        this.checkMaxWidth()
        this.label.string = this._string
    }

    @property(cc.Integer)
    maxWidth: number = 0;

    private label: cc.Label = null;

    private lastWidth: number = -1;

    start() {
        // if (CC_EDITOR) {
        //     return
        // }
        this.label = this.getComponent(cc.Label)
        if (!this.label) {
            console.error(`error : LabelAdaptive, there is no component "cc.Label"`)
            this.enabled = false
            return
        }
        this.label.overflow = cc.Label.Overflow.RESIZE_HEIGHT
        this._string = this.label.string
        this.checkMaxWidth()
    }

    checkMaxWidth(): boolean {
        let paragraphedStrings = this._string.split('\n');
        let _context = this.label['_assemblerData']["context"]
        // let _fontDesc = this.label["_assembler"]["_getFontDesc"]();
        // console.log(`_context  : ${JSON.stringify(_context)}`)
        // console.log(`_fontDesc  : ${JSON.stringify(_fontDesc)}`)
        let maxLineWidth = 0
        // console.log("paragraphedStrings", JSON.stringify(paragraphedStrings))
        for (let i = 0; i < paragraphedStrings.length; ++i) {
            let metric = _context["measureText"](paragraphedStrings[i]);
            let paraLength = metric && metric.width || 0;
            maxLineWidth = maxLineWidth > paraLength ? maxLineWidth : paraLength;

            // console.log(`paraLength  : ${paraLength}   maxLineWidth : ${maxLineWidth}`)
            if (maxLineWidth >= this.maxWidth) {
                maxLineWidth = this.maxWidth
                break;
            }
        }
        if (maxLineWidth != this.lastWidth) {
            this.lastWidth = maxLineWidth
            this.node.width = this.lastWidth
            return true
        }
        return false
    }

    private test = 0
    onTestClick() {
        this.test++
        if (this.test % 5 === 0)
            this.string = "bagagke"
        if (this.test % 5 === 1)
            this.string = "!#en Content string of label. !#zh 标签显示的文本内容。"
        if (this.test % 5 === 2)
            this.string = "!#en"
        if (this.test % 5 === 3)
            this.string = "!#en Horizontal Alignment of label. !#zh 文本内容的水平对齐方式。"
        if (this.test % 5 === 4)
            this.string = "bagagke\nkdadka kdakdk adkadka55 44545454ad kdakdk 45455dfadad\ndkdkaddkadakdkadkad"
    }
}
