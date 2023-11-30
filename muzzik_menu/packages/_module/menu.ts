///<reference path="./instance_base.ts"/>
// @ts-ignore
const instance_base = require("./instance_base");

//@ts-ignore
module _menu {
    export class data {
        /**添加的菜单 */
        add_as: menu.item[] = [];
        /**删除的菜单 */
        del_o: Map<string, menu.find_mode> = new Map;
        /**修改的菜单 */
        modify_o: Map<string, menu.modify_data> = new Map;
    }
    export class global {
        /**初始化菜单状态 */
        init_menu_b = false;
        /**菜单数据 */
        menu_os: data[];
        /**当前区域类型 */
        area_type_e: menu.area_type;
    }
}
// ------------------全局变量
//@ts-ignore
let muzzik_a: any = Editor;
muzzik_a = muzzik_a.__muzzik || (muzzik_a.__muzzik = {});
muzzik_a = muzzik_a.menu || (muzzik_a.menu = new _menu.global);
let global_o: _menu.global = muzzik_a;

/**编辑器菜单 */
//@ts-ignore
class menu extends instance_base {
    constructor() {
        super();
        if (!global_o.menu_os) {
            global_o.menu_os = [];
        }
        for (let k1_a in menu.area_type) {
            if (!isNaN(<any>k1_a) && !global_o.menu_os[Number(k1_a)]) {
                global_o.menu_os[Number(k1_a)] = new _menu.data;
            }
        }
    }
    /* -------------------------------segmentation------------------------------- */
    /**初始化 */
    private _init(): void {
        try {
            // ------------------防止多次加载
            if (global_o.init_menu_b) {
                return;
            }
            global_o.init_menu_b = true;
            // ------------------准备参数
            let temp1_a: any;
            let self = this;
            // ------------------监听点击
            let listen_a = new Editor.IpcListener;
            listen_a.on("selection:context", function() {
                global_o.area_type_e = Number(menu.area_type[arguments[1]]);
            });
            // ------------------在 selection:context 消息后触发
            // listen_a.on("inspector:popup-component-inspector-menu", function() {
            //     global_o.area_type_e = menu.area_type.component_setting;
            // });
            // listen_a.on("inspector:popup-comp-menu", function() {
            //     global_o.area_type_e = menu.area_type.add_component;
            // ------------------创建替换menu
            let new_menu_f = function (args1_a: any) {
                let temp1_f = function (..._args_as: any[]) {
                    try {
                        self._update_area_type(_args_as[0]);
                        if (global_o.area_type_e == menu.area_type.null) {
                            throw "其他类型菜单";
                        }
                        let cur_menu_o = global_o.menu_os[global_o.area_type_e];
                        // ------------------添加菜单
                        cur_menu_o.add_as.forEach(async v1_a=> {
                            self._add(_args_as[0], v1_a);
                        });
                        // ------------------修改菜单
                        cur_menu_o.modify_o.forEach((v1_a, k1_s)=> {
                            self._modify(_args_as[0], k1_s, v1_a);
                        });
                        // ------------------删除菜单
                        cur_menu_o.del_o.forEach((v1_a, k1_s)=> {
                            self._del(_args_as[0], k1_s, v1_a);
                        });
                        global_o.area_type_e = menu.area_type.null;
                        return new args1_a(..._args_as);
                    } catch (e) {
                        return new args1_a(..._args_as);
                    }
                };
                // ------------------复制原有属性
                for (let k1_s of Object.getOwnPropertyNames(args1_a)) {
                    temp1_a = Object.getOwnPropertyDescriptor(args1_a, k1_s);
                    if (temp1_a && temp1_a.writable) {
                        //@ts-ignore
                        temp1_f[k1_s] = args1_a[k1_s];
                    }
                }
                Object.assign(temp1_f, args1_a);
                return temp1_f;
            };
            //@ts-ignore
            Editor.Menu = new_menu_f(Editor.Menu);
        } catch (err_a: any) {
            Editor.error(err_a);
        }
    }
    /**更新检测菜单类型 */
    private _update_area_type(menu_as_: menu.item[]): void {
        switch (menu_as_[0].message) {
            case "scene:remove-component": {
                global_o.area_type_e = menu.area_type.component_setting;
            } break;
            case "scene:add-component": {
                global_o.area_type_e = menu.area_type.add_component;
            } break;
            case "scene:reset-node": {
                global_o.area_type_e = menu.area_type.node_setting;
            } break;
        }
        switch (menu_as_[0].label) {
            case "编辑器日志": {
                global_o.area_type_e = menu.area_type.console;
            } break;
            case "删除": {
                global_o.area_type_e = menu.area_type.component_library;
            } break;
        }
    }
    /**添加菜单项 */
    private _add(item_as_: menu.item[], add_item_a_: menu.item): Promise<void> {
        try {
            // ------------------展示控制
            if (add_item_a_.show_f && !add_item_a_.show_f()) {
                return;
            }
            // ------------------置灰
            if (add_item_a_.ash_f) {
                add_item_a_.enabled = !add_item_a_.ash_f();
            }
            // ------------------准备参数
            /**插入位置 */
            let insert_n = add_item_a_.last_s ? item_as_.findIndex(v1_a=> v1_a.label == add_item_a_.last_s) : -1;
            /**路径信息 */
            let path_ss: string[] = [];
            if (add_item_a_.path_s) {
                add_item_a_.path_s = add_item_a_.path_s.replace(/\\/g, "/");
                path_ss = add_item_a_.path_s.split(/\//g);
                if (!path_ss.length) {
                    return;
                }
                // label：按钮文本
                add_item_a_.label = path_ss[path_ss.length - 1];
            }
            /**菜单根节点 */
            let item_root_a = path_ss ? item_as_.find(v1_a=> v1_a.label == path_ss[0]) : null;
            if (path_ss && path_ss.length > 1) {
                if (!item_root_a) {
                    item_as_.push({
                        "label": path_ss[0],
                    });
                    item_root_a = item_as_[item_as_.length - 1];
                }
                for (let k1_n = 1; k1_n < path_ss.length - 1; ++k1_n) {
                    if (!item_root_a.submenu) {
                        item_root_a.submenu = [];
                    }
                    item_root_a = item_root_a.submenu.find(v2_a=> v2_a.label == path_ss[k1_n]);
                    if (!item_root_a) {
                        item_root_a = item_as_[item_as_.push({
                            "label": path_ss[k1_n],
                        }) - 1];
                    }
                }
                if (!item_root_a.submenu) {
                    item_root_a.submenu = [];
                }
                // ------------------插入
                insert_n = add_item_a_.last_s ? item_root_a.submenu.findIndex(v1_a=> v1_a.label == add_item_a_.last_s) : -1;
                if (add_item_a_.last_s) {
                    item_root_a.submenu.push({
                        type: "separator",
                    });
                }
                // ------------------未找到插入位置默认最后
                if (insert_n == -1) {
                    insert_n = item_root_a.submenu.length - 1;
                }
                // ------------------检测是否重复
                if (!add_item_a_.path_s || item_root_a.submenu.findIndex(v1_a=> v1_a.path_s == add_item_a_.path_s) == -1) {
                    item_root_a.submenu.splice(insert_n + 1, 0, add_item_a_);
                }
            } else {
                if (add_item_a_.last_s) {
                    item_as_.push({
                        type: "separator",
                    });
                }
                // ------------------未找到插入位置默认最后
                if (insert_n == -1) {
                    insert_n = item_as_.length - 1;
                }
                // ------------------检测是否重复
                if (!add_item_a_.path_s || item_as_.findIndex(v1_a=> v1_a.path_s == add_item_a_.path_s) == -1) {
                    item_as_.splice(insert_n + 1, 0, add_item_a_);
                }
            }
        } catch (err_a: any) {
            Editor.error(err_a);
        }
    }
    /**修改菜单项 */
    private _modify(item_as_: menu.item[], path_s_: string, data_a_: menu.modify_data): boolean {
        try {
            let item_root_a: menu.item;
            switch (data_a_.mode_e) {
                case menu.find_mode.label: {
                    // ------------------准备参数
                    /**路径信息 */
                    let path_ss: string[] = [];
                    if (path_s_) {
                        path_s_ = path_s_.replace(/\\/g, "/");
                        path_ss = path_s_.split(/\//g);
                        if (!path_ss.length) {
                            return false;
                        }
                    }
                    /**菜单根节点 */
                    item_root_a = path_ss ? item_as_.find(v1_a=> v1_a.label == path_ss[0]) : null;
                    if (!item_root_a) {
                        return false;
                    }
                    if (path_ss && path_ss.length > 1) {
                        for (let k1_n = 1; k1_n < path_ss.length; ++k1_n) {
                            item_root_a = item_root_a.submenu.find(v2_a=> v2_a.label == path_ss[k1_n]);
                            if (!item_root_a) {
                                return false;
                            }
                        }
                    }
                } break;
                case menu.find_mode.path: {
                    item_root_a = item_as_.find(v1_a=> v1_a.path == path_s_);
                } break;
            }
            if (item_root_a) {
                data_a_.cb_f(item_root_a);
            }
        } catch (err_a: any) {
            Editor.error(err_a);
        }
    }
    /**删除菜单项 */
    private _del(item_as_: menu.item[], path_s_: string, mode_e: menu.find_mode): boolean {
        try {
            /**删除节点所在数组 */
            let item_as: menu.item[];
            /**删除节点所在下标 */
            let index_n: number;
            switch (mode_e) {
                case menu.find_mode.label: {
                    // ------------------准备参数
                    /**路径信息 */
                    let path_ss: string[] = [];
                    if (path_s_) {
                        path_s_ = path_s_.replace(/\\/g, "/");
                        path_ss = path_s_.split(/\//g);
                        if (!path_ss.length) {
                            return false;
                        }
                    }
                    item_as = item_as_;
                    // 根节点下标
                    index_n = path_ss ? item_as.findIndex(v1_a=> v1_a.label == path_ss[0]) : null;
                    if (index_n == -1) {
                        return false;
                    }
                    /**菜单根节点 */
                    let root_a = item_as_[index_n];
                    if (path_ss && path_ss.length > 1) {
                        for (let k1_n = 1; k1_n < path_ss.length; ++k1_n) {
                            item_as = root_a.submenu;
                            index_n = item_as.findIndex(v2_a=> v2_a.label == path_ss[k1_n]);
                            if (index_n == -1) {
                                return false;
                            }
                            root_a = item_as[index_n];
                        }
                    }
                } break;
                case menu.find_mode.path: {
                    item_as = item_as_;
                    index_n = item_as.findIndex(v1_a=> v1_a.path == path_s_);
                } break;
            }
            if (index_n != -1) {
                item_as.splice(index_n, 1);
            }
        } catch (err_a: any) {
            Editor.error(err_a);
        }
    }
    /**添加菜单项
     * - type: separator(分割符)
     */
    public add(type_e_: menu.area_type, item_a_: menu.item): void {
        try {
            if (!global_o.init_menu_b) {
                this._init();
            }
            if (item_a_.path_s && global_o.menu_os[type_e_].add_as.findIndex(v1_a=> v1_a.path_s == item_a_.path_s) != -1) {
                this.del(type_e_, item_a_.path_s);
            }
            global_o.menu_os[type_e_].add_as.push(item_a_);
        } catch (err_a: any) {
            Editor.error(err_a);
        }
    }
    /**删除菜单项 */
    public del(type_e_: menu.area_type, path_s_: string, mode_e = menu.find_mode.label): void {
        try {
            if (!global_o.init_menu_b) {
                this._init();
            }
            global_o.menu_os[type_e_].del_o.set(path_s_, mode_e);
        } catch (err_a: any) {
            Editor.error(err_a);
        }
    }
    /**撤销删除 */
    public revoke_del(type_e_: menu.area_type, path_s_: string): void {
        try {
            if (!global_o.init_menu_b) {
                this._init();
            }
            global_o.menu_os[type_e_].del_o.delete(path_s_);
        } catch (err_a: any) {
            Editor.error(err_a);
        }
    }
    /**修改菜单项 */
    public modify(type_e_: menu.area_type, path_s_: string, data_a_: menu.modify_data): void {
        try {
            if (!global_o.init_menu_b) {
                this._init();
            }
            global_o.menu_os[type_e_].modify_o.set(path_s_, data_a_);
        } catch (err_a: any) {
            Editor.error(err_a);
        }
    }
    /**撤销修改 */
    public revoke_modify(type_e_: menu.area_type, path_s_: string): void {
        try {
            if (!global_o.init_menu_b) {
                this._init();
            }
            global_o.menu_os[type_e_].modify_o.delete(path_s_);
        } catch (err_a: any) {
            Editor.error(err_a);
        }
    }
}

//@ts-ignore
module menu {
    /*---------enum_private */
    /*---------enum_public */
    /**菜单区域 */
    export enum area_type {
        null,
        /**资源管理器 */
        asset,
        /**节点树 */
        node,
        /**属性面板节点设置 */
        node_setting,
        /**属性面板组件设置 */
        component_setting,
        /**属性面板添加组件 */
        add_component,
        /**打印 */
        console,
        /**控件库 */
        component_library,
    }
    /**查找模式
     * - 通过选择的属性查找，一般为label
     */
    export enum find_mode {
        label,
        path,
    }
    /*---------interface_private */
    /*---------interface_public */
    /**菜单item */
    export interface item {
        path?: string;
        type?: string;
        submenu?: item[];
        label?: string;
        message?: string;
        panel?: string;
        params?: string[];
        click?: Function;
        enabled?: boolean;
        // ------------------自定义
        /**菜单路径 */
        path_s?: string;
        /**上个键 */
        last_s?: string;
        /**展示 */
        show_f?: ()=> boolean;
        /**置灰 */
        ash_f?: ()=> boolean;
    }
    /*---------var | const */
    /*---------class_private */
    /*---------class_public */
    /**修改数据 */
    export class modify_data {
        /**修改回调
         * - item_a：修改路径的菜单实例
         */
        cb_f: (item_a: menu.item)=> void;
        mode_e = menu.find_mode.label;
    }
}

module.exports = menu;