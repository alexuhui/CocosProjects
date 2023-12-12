// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const HtmlTextParser = require("../../libs/html-text-parser")
const _htmlTextParser = new HtmlTextParser();

const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@menu("自定义组件/Common/RichTextAdaptive")
@requireComponent(cc.RichText)
export default class RichTextAdaptive extends cc.Component {
    // @property()
    private _string: string = ""
    // @property(cc.String)
    set string(value: string) {
        if (this._string === value) {
            return;
        }
        this._string = value;
        this.checkMaxWidth()
        if (this.richText) {
            this.richText.string = this._string
        }
    }
    get string(): string {
        return this._string;
    }

    @property(cc.Integer)
    maxWidth: number = 0;

    private richText: cc.RichText = null;

    private lastWidth: number = -1;

    start() {
        this.richText = this.getComponent(cc.RichText)
        if (!this.richText) {
            console.error(`error : LabelAdaptive, there is no component "cc.Label"`)
            this.enabled = false
            return
        }
        if (!this._string) {
            this._string = this.richText.string
        }
        this.checkMaxWidth()
        this.richText.string = this._string
    }

    checkMaxWidth(): boolean {
        if (!this.richText || !this.enabledInHierarchy) return false;
        let newTextArray = _htmlTextParser.parse(this.string);
        let maxLineWidth = 0
        let tempWidth = 0
        let changed = false

        outerLoop:
        for (let i = 0; i < newTextArray.length; ++i) {
            let richTextElement = newTextArray[i];
            let text = richTextElement.text;
            //handle <br/> <img /> tag
            if (text === "") {
                if (richTextElement.style && richTextElement.style.newline) {
                    continue;
                }
                if (richTextElement.style && richTextElement.style.isImage && this.richText.imageAtlas) {
                    tempWidth += this._addRichTextImageElement(richTextElement);
                    if (tempWidth > this.maxWidth) {
                        tempWidth = this.maxWidth
                        break outerLoop;
                    }
                    continue;
                }
            }
            let multilineTexts = text.split("\n");

            for (let j = 0; j < multilineTexts.length; ++j) {
                if (j > 0) {
                    if (tempWidth > maxLineWidth) {
                        maxLineWidth = tempWidth
                    }
                    // 换行
                    tempWidth = 0
                }
                let labelString = multilineTexts[j];
                if (labelString === "") {
                    continue;
                }

                let labelWidth = this.richText['_measureText'](i, labelString);
                tempWidth += labelWidth
                // console.log('labelString : ', labelString, 'labelWidth : ', labelWidth, "tempWidth : ", tempWidth)

                if (tempWidth > this.maxWidth) {
                    tempWidth = this.maxWidth
                    break outerLoop;
                }
            }
        }
        maxLineWidth = Math.min(this.maxWidth, Math.max(maxLineWidth, tempWidth))
        if (maxLineWidth != this.lastWidth) {
            this.lastWidth = maxLineWidth
            // this.node.width = this.lastWidth
            this.richText.maxWidth = this.lastWidth
            changed = true
        }
        // console.log(`------------------------------------- maxLineWidth : ${maxLineWidth}     this.lastWidth : ${this.lastWidth}   this.node.width : ${this.node.width}`)

        return changed
    }

    // 计算富文本图片宽度，对应cocos-engine 2.4.6， 不同版本可能有差异
    _addRichTextImageElement(richTextElement: any): number {
        if (!richTextElement || !this.richText || !this.richText.imageAtlas) {
            return 0;
        }
        let spriteFrameName = richTextElement.style.src;
        let spriteFrame = this.richText.imageAtlas.getSpriteFrame(spriteFrameName);
        let imgW = 0
        if (spriteFrame) {
            let spriteRect = spriteFrame.getRect();
            let scaleFactor = 1;
            let spriteWidth = spriteRect.width;
            let spriteHeight = spriteRect.height;
            let expectWidth = richTextElement.style.imageWidth;
            let expectHeight = richTextElement.style.imageHeight;

            if (expectHeight > 0) {
                scaleFactor = expectHeight / spriteHeight;
                spriteWidth = spriteWidth * scaleFactor;
                spriteHeight = spriteHeight * scaleFactor;
            }
            else {
                scaleFactor = this.richText.lineHeight / spriteHeight;
                spriteWidth = spriteWidth * scaleFactor;
                spriteHeight = spriteHeight * scaleFactor;
            }

            if (expectWidth > 0) spriteWidth = expectWidth;

            // console.log('richTextElement : ', JSON.stringify(richTextElement), "spriteWidth : ", spriteWidth)
            imgW = spriteWidth
        }
        return imgW;
    }

    private _test = 0
    private _testCnt = 5
    onRichTextTest() {
        switch (this._test++ % this._testCnt) {
            case 0:
                this.string = `<color=#00ff00>Rich ttttt bbbbb</c><color=#0fffff>ggggg hh<img src='icon_history_item_ball'/>hh Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich </c><color=#0fffff><b>bbbbb</b> Text</color><img src='icon_history_item_ball'/><img src='icon_level_reward_end'/>`
                break;
            case 1:
                this.string = `<color=#00ff00>Rich</c>`
                break;
            case 2:
                this.string = `<color=#00ff00>Rich\ntext</c>`
                break;
            case 3:
                this.string = `<color=#00ff00>Rich \nttttt bbbbb</c><color=#0fffff>ggggg hh<img src='icon_history_item_ball'/>hh Text</color><color=#00ff00>Rich</c><color=#0fffff>Text</color><color=#00ff00>Rich </c><color=#0fffff><b>bbbbb</b> Text</color><img src='icon_history_item_ball'/><img src='icon_level_reward_end'/>`
                break;
            default:
                this.string = 'default'
        }
    }
}
