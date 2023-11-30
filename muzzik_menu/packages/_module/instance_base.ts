/**继承单例 */
//@ts-ignore
abstract class instance_base {
    /* ***************private*************** */
    private static _instance_o: object;
    /* -------------------------------segmentation------------------------------- */
    /**单例方法 */
    public static instance(...args_as_: any): any {
        if (!this._instance_o) {
            this._instance_o = new (<any>this)(...args_as_);
        }
        return this._instance_o;
    }
}

module.exports = instance_base;