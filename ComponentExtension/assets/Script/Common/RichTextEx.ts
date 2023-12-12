// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const HtmlTextParser = require("../../libs/html-text-parser")
const _htmlTextParser = new HtmlTextParser();

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("自定义组件/Common/RichTextEx")
export default class RichTextEx extends cc.RichText {

    protected start(): void {
        this.updateRichText()
    }

    updateRichText () {
        if (!this.enabledInHierarchy) return;

        console.log("--------------- HtmlTextParser", JSON.stringify(_htmlTextParser))
        let newTextArray = _htmlTextParser.parse(this.string);
        console.log("--------------- newTextArray", JSON.stringify(newTextArray))

        // if (!this._needsUpdateTextLayout(newTextArray)) {
        //     this._textArray = newTextArray;
        //     this._updateLabelSegmentTextAttributes();
        //     return;
        // }

        // this._textArray = newTextArray;
        // this._resetState();

        // let lastEmptyLine = false;
        // let label;
        // let labelSize;

        // for (let i = 0; i < this._textArray.length; ++i) {
        //     let richTextElement = this._textArray[i];
        //     let text = richTextElement.text;
        //     //handle <br/> <img /> tag
        //     if (text === "") {
        //         if (richTextElement.style && richTextElement.style.newline) {
        //             this._updateLineInfo();
        //             continue;
        //         }
        //         if (richTextElement.style && richTextElement.style.isImage && this.imageAtlas) {
        //             this._addRichTextImageElement(richTextElement);
        //             continue;
        //         }
        //     }
        //     let multilineTexts = text.split("\n");

        //     for (let j = 0; j < multilineTexts.length; ++j) {
        //         let labelString = multilineTexts[j];
        //         if (labelString === "") {
        //             //for continues \n
        //             if (this._isLastComponentCR(text)
        //                 && j === multilineTexts.length - 1) {
        //                 continue;
        //             }
        //             this._updateLineInfo();
        //             lastEmptyLine = true;
        //             continue;
        //         }
        //         lastEmptyLine = false;

        //         if (this.maxWidth > 0) {
        //             let labelWidth = this._measureText(i, labelString);
        //             this._updateRichTextWithMaxWidth(labelString, labelWidth, i);

        //             if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
        //                 this._updateLineInfo();
        //             }
        //         }
        //         else {
        //             label = this._addLabelSegment(labelString, i);
        //             labelSize = label.getContentSize();

        //             this._lineOffsetX += labelSize.width;
        //             if (this._lineOffsetX > this._labelWidth) {
        //                 this._labelWidth = this._lineOffsetX;
        //             }

        //             if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
        //                 this._updateLineInfo();
        //             }
        //         }
        //     }
        // }
        // if (!lastEmptyLine) {
        //     this._linesWidth.push(this._lineOffsetX);
        // }

        // if (this.maxWidth > 0) {
        //     this._labelWidth = this.maxWidth;
        // }
        // this._labelHeight = (this._lineCount + textUtils.BASELINE_RATIO) * this.lineHeight;

        // // trigger "size-changed" event
        // this.node.setContentSize(this._labelWidth, this._labelHeight);

        // this._updateRichTextPosition();
        // this._layoutDirty = false;
    }
}
