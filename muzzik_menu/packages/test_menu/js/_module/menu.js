"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
///<reference path="./instance_base.ts"/>
// @ts-ignore
const instance_base = require("./instance_base");
//@ts-ignore
var _menu;
(function (_menu) {
    class data {
        constructor() {
            /**添加的菜单 */
            this.add_as = [];
            /**修改的菜单 */
            this.modify_o = new Map;
        }
    }
    _menu.data = data;
    class global {
        constructor() {
            /**初始化菜单状态 */
            this.init_menu_b = false;
        }
    }
    _menu.global = global;
})(_menu || (_menu = {}));
// ------------------全局变量
//@ts-ignore
let muzzik_a = Editor;
muzzik_a = muzzik_a.__muzzik || (muzzik_a.__muzzik = {});
muzzik_a = muzzik_a.menu || (muzzik_a.menu = new _menu.global);
let global_o = muzzik_a;
/**编辑器菜单 */
//@ts-ignore
class menu extends instance_base {
    constructor() {
        super();
        if (!global_o.menu_os) {
            global_o.menu_os = [];
        }
        for (let k1_a in menu.area_type) {
            if (!isNaN(k1_a) && !global_o.menu_os[Number(k1_a)]) {
                global_o.menu_os[Number(k1_a)] = new _menu.data;
            }
        }
    }
    /* -------------------------------segmentation------------------------------- */
    /**初始化 */
    _init() {
        try {
            // ------------------防止多次加载
            if (global_o.init_menu_b) {
                return;
            }
            global_o.init_menu_b = true;
            // ------------------准备参数
            let temp1_a;
            let self = this;
            // ------------------监听点击
            let listen_a = new Editor.IpcListener;
            listen_a.on("selection:context", function () {
                global_o.area_type_e = Number(menu.area_type[arguments[1]]);
            });
            // ------------------在 selection:context 消息后触发
            // listen_a.on("inspector:popup-component-inspector-menu", function() {
            //     global_o.area_type_e = menu.area_type.component_setting;
            // });
            // listen_a.on("inspector:popup-comp-menu", function() {
            //     global_o.area_type_e = menu.area_type.add_component;
            // ------------------创建替换menu
            let new_menu_o = function (args1_a) {
                let temp1_f = function (..._args_as) {
                    try {
                        self._update_area_type(_args_as[0]);
                        if (global_o.area_type_e == menu.area_type.null) {
                            throw "其他类型菜单";
                        }
                        let cur_menu_o = global_o.menu_os[global_o.area_type_e];
                        // ------------------添加菜单
                        cur_menu_o.add_as.forEach((v1_a) => __awaiter(this, void 0, void 0, function* () {
                            self._add(_args_as[0], v1_a);
                        }));
                        // ------------------修改菜单
                        cur_menu_o.modify_o.forEach((v1_a, k1_s) => {
                            self._modify(_args_as[0], k1_s, v1_a);
                        });
                        global_o.area_type_e = menu.area_type.null;
                        return new args1_a(..._args_as);
                    }
                    catch (e) {
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
            Editor.Menu = new_menu_o(Editor.Menu);
        }
        catch (err_a) {
            Editor.error(err_a);
        }
    }
    /**更新检测菜单类型 */
    _update_area_type(menu_as_) {
        switch (menu_as_[0].message) {
            case "scene:remove-component":
                {
                    global_o.area_type_e = menu.area_type.component_setting;
                }
                break;
            case "scene:add-component":
                {
                    global_o.area_type_e = menu.area_type.add_component;
                }
                break;
            case "scene:reset-node":
                {
                    global_o.area_type_e = menu.area_type.node_setting;
                }
                break;
        }
        switch (menu_as_[0].label) {
            case "编辑器日志":
                {
                    global_o.area_type_e = menu.area_type.console;
                }
                break;
            case "删除":
                {
                    global_o.area_type_e = menu.area_type.component_library;
                }
                break;
        }
    }
    /**添加菜单项 */
    _add(item_as_, add_item_a_) {
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
            let insert_n = add_item_a_.last_s ? item_as_.findIndex(v1_a => v1_a.label == add_item_a_.last_s) : -1;
            /**路径信息 */
            let path_ss = [];
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
            let item_root_a = path_ss ? item_as_.find(v1_a => v1_a.label == path_ss[0]) : null;
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
                    item_root_a = item_root_a.submenu.find(v2_a => v2_a.label == path_ss[k1_n]);
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
                insert_n = add_item_a_.last_s ? item_root_a.submenu.findIndex(v1_a => v1_a.label == add_item_a_.last_s) : -1;
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
                if (!add_item_a_.path_s || item_root_a.submenu.findIndex(v1_a => v1_a.path_s == add_item_a_.path_s) == -1) {
                    item_root_a.submenu.splice(insert_n + 1, 0, add_item_a_);
                }
            }
            else {
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
                if (!add_item_a_.path_s || item_as_.findIndex(v1_a => v1_a.path_s == add_item_a_.path_s) == -1) {
                    item_as_.splice(insert_n + 1, 0, add_item_a_);
                }
            }
        }
        catch (err_a) {
            Editor.error(err_a);
        }
    }
    /**修改菜单项 */
    _modify(item_as_, path_s_, data_a_) {
        try {
            let item_root_a;
            switch (data_a_.mode_e) {
                case menu.find_mode.label:
                    {
                        // ------------------准备参数
                        /**路径信息 */
                        let path_ss = [];
                        if (path_s_) {
                            path_s_ = path_s_.replace(/\\/g, "/");
                            path_ss = path_s_.split(/\//g);
                            if (!path_ss.length) {
                                return false;
                            }
                        }
                        /**菜单根节点 */
                        item_root_a = path_ss ? item_as_.find(v1_a => v1_a.label == path_ss[0]) : null;
                        if (!item_root_a) {
                            return false;
                        }
                        if (path_ss && path_ss.length > 1) {
                            for (let k1_n = 1; k1_n < path_ss.length; ++k1_n) {
                                if (!item_root_a.submenu) {
                                    item_root_a.submenu = [];
                                }
                                item_root_a = item_root_a.submenu.find(v2_a => v2_a.label == path_ss[k1_n]);
                                if (!item_root_a) {
                                    return false;
                                }
                            }
                        }
                    }
                    break;
                case menu.find_mode.path:
                    {
                        item_root_a = item_as_.find(v1_a => v1_a.path == path_s_);
                    }
                    break;
            }
            if (item_root_a) {
                data_a_.cb_f(item_root_a);
            }
        }
        catch (err_a) {
            Editor.error(err_a);
        }
    }
    /**添加菜单项
     * - type: separator(分割符)
     */
    add(type_e_, item_a_) {
        try {
            if (!global_o.init_menu_b) {
                this._init();
            }
            if (item_a_.path_s && global_o.menu_os[type_e_].add_as.findIndex(v1_a => v1_a.path_s == item_a_.path_s) != -1) {
                this.del(type_e_, item_a_.path_s);
            }
            global_o.menu_os[type_e_].add_as.push(item_a_);
        }
        catch (err_a) {
            Editor.error(err_a);
        }
    }
    /**删除菜单项 */
    del(type_e_, path_s_) {
        try {
            if (!global_o.init_menu_b) {
                this._init();
            }
            //@ts-ignore
            let index_n = global_o.menu_os[type_e_].add_as.findIndex(v1_a => v1_a.path_s == path_s_);
            if (index_n == -1) {
                return false;
            }
            global_o.menu_os[type_e_].add_as.splice(index_n, 1);
            return true;
        }
        catch (err_a) {
            Editor.error(err_a);
        }
    }
    /**修改菜单项
     * modify_cb_f_：修改回调, 为空则删除修改
     */
    modify(type_e_, path_s_, data_a_) {
        try {
            if (!global_o.init_menu_b) {
                this._init();
            }
            if (data_a_) {
                global_o.menu_os[type_e_].modify_o.set(path_s_, data_a_);
            }
            else {
                global_o.menu_os[type_e_].modify_o.delete(path_s_);
            }
            return;
        }
        catch (err_a) {
            Editor.error(err_a);
        }
    }
}
//@ts-ignore
(function (menu) {
    /**菜单区域 */
    let area_type;
    (function (area_type) {
        area_type[area_type["null"] = 0] = "null";
        /**资源管理器 */
        area_type[area_type["asset"] = 1] = "asset";
        /**节点树 */
        area_type[area_type["node"] = 2] = "node";
        /**属性面板节点设置 */
        area_type[area_type["node_setting"] = 3] = "node_setting";
        /**属性面板组件设置 */
        area_type[area_type["component_setting"] = 4] = "component_setting";
        /**属性面板添加组件 */
        area_type[area_type["add_component"] = 5] = "add_component";
        /**打印 */
        area_type[area_type["console"] = 6] = "console";
        /**控件库 */
        area_type[area_type["component_library"] = 7] = "component_library";
    })(area_type = menu.area_type || (menu.area_type = {}));
    /**查找模式 */
    let find_mode;
    (function (find_mode) {
        find_mode[find_mode["label"] = 0] = "label";
        find_mode[find_mode["path"] = 1] = "path";
    })(find_mode = menu.find_mode || (menu.find_mode = {}));
})(menu || (menu = {}));
module.exports = menu;
