const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("自定义组件/Common/LabelEx")
export default class LabelEx extends cc.Label {

    /** 是否开启自动自动设置大小 */
    @property(cc.Boolean)
    enabledAutoSize: boolean = false;
    /** 自动设置大小的最大宽度 */
    @property({
        type: cc.Integer,
        visible() {
            return this.enabledAutoSize
        },
    })
    maxWidth: number = 0;
    private lastWidth: number = -1;

    private _tempString: string

    private proxy : ProxyConstructor

    handle = {
        set(target, property, value, receiver) {
            if (property === 'string') {
                console.log('--------------- custom set : ' , value)
            }
            return Reflect.set(target, property, value, receiver)
        }
    }

    protected onLoad(): void {
        // this.proxy = new Proxy(this, this.handle);

        // this.proxy['string'] = "aaaaa"
        // this.string = "bbbbb"
    }


    /** 检测Label的宽度变化 */
    checkLbWidth(): boolean {
        let paragraphedStrings = this._tempString.split('\n');
        let _context = this['_assemblerData']["context"]
        let _fontDesc = this["_assembler"]["_getFontDesc"]();
        console.log(`_context  : ${JSON.stringify(_context)}`)
        console.log(`_fontDesc  : ${JSON.stringify(_fontDesc)}`)
        let maxLineWidth = 0
        for (let i = 0; i < paragraphedStrings.length; ++i) {
            let metric = _context["measureText"](paragraphedStrings[i]);
            let paraLength = metric && metric.width || 0;
            maxLineWidth = maxLineWidth > paraLength ? maxLineWidth : paraLength;

            if (maxLineWidth >= this.maxWidth) {
                maxLineWidth = this.maxWidth
                break;
            }
            console.log(`paraLength  : ${paraLength}   maxLineWidth : ${maxLineWidth}`)
        }
        if (maxLineWidth != this.lastWidth) {
            this.lastWidth = maxLineWidth
            this.node.width = this.lastWidth
            return true
        }
        return false
    }
}

// @ts-ignore 继承基类的原型
// LabelEx.prototype.string = function (value) {
//     console.log('-----------------------')
    
// }
