///<reference path="./instance_base.ts"/>
// @ts-ignore
const instance_base = require("./instance_base");

/**打印 */
// @ts-ignore
abstract class log_base extends instance_base {
    /* ***************protected*************** */
    protected abstract name_s: string;
    /* -------------------------------segmentation------------------------------- */
    public l(...args_as_: any[]): void {
        Editor.log(`${this.name_s}：`, ...args_as_);
    }
    public w(...args_as_: any[]): void {
        Editor.warn(`${this.name_s}：`, ...args_as_);
    }
    public e(...args_as_: any[]): void {
        Editor.error(`${this.name_s}：`, ...args_as_);
    }
}

module.exports = log_base;