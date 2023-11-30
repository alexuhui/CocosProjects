///<reference path="../../editor/editor-assetDB.d.ts"/>
///<reference path="../../editor/editor-main.d.ts"/>
///<reference path="../../editor/editor-renderer.d.ts"/>
///<reference path="../../editor/editor-scene.d.ts"/>
///<reference path="../../editor/editor-share.d.ts"/>
///<reference path="../../editor/engine.d.ts"/>
///<reference path="../../editor/fs.d.ts"/>
///<reference path="../../creator.d.ts"/>
///<reference path="../_module/instance_base.ts"/>
///<reference path="../_module/log_base.ts"/>
///<reference path="../_module/menu.ts"/>
///<reference path="./core/config.ts"/>
///<reference path="./core/log.ts"/>
//@ts-ignore
const config = require("./core/config");
//@ts-ignore
const log = require("./core/log");
//@ts-ignore
const menu = require("../_module/menu");

module main {
	const log_o: log = log.instance();
	const menu_o: menu = menu.instance();
	export function load() {
		// ------------------资源菜单
		menu_o.add(menu.area_type.asset, { "type": "separator" });
		menu_o.add(menu.area_type.asset, {
			"path_s": "置灰按钮（一级）",
			"ash_f": ()=> true,
		});
		menu_o.add(menu.area_type.asset, {
			"path_s": "正常按钮（一级）",
			"click": ()=> {
				log_o.l("资源菜单：正常按钮（一级）");
			},
		});
		let enable_b = true;
		menu_o.add(menu.area_type.asset, {
			"path_s": "隐藏按钮",
			"click": ()=> {
				log_o.l("资源菜单：隐藏按钮");
			},
			"show_f": ()=> enable_b,
		});
		menu_o.add(menu.area_type.asset, {
			"path_s": "隐藏按钮控制/显示",
			"click": ()=> {
				enable_b = true;
				log_o.l("资源菜单：显示按钮");
			},
		});
		menu_o.add(menu.area_type.asset, {
			"path_s": "隐藏按钮控制/隐藏",
			"click": ()=> {
				enable_b = false;
				log_o.l("资源菜单：隐藏按钮");
			},
		});
		menu_o.add(menu.area_type.asset, {
			"path_s": "子菜单按钮（一级）/正常按钮1（二级）",
			"click": ()=> {
				log_o.l("资源菜单：正常按钮1（二级）");
			}
		});
		menu_o.add(menu.area_type.asset, {
			"path_s": "子菜单按钮（一级）/",
			"type": "separator"
		});
		menu_o.add(menu.area_type.asset, {
			"path_s": "子菜单按钮（一级）/正常按钮2（二级）",
			"click": ()=> {
				log_o.l("资源菜单：正常按钮2（二级）");
			}
		});
		menu_o.add(menu.area_type.asset, {
			"last_s": "文件夹",
			"path_s": "新建/插入按钮（二级）",
			"click": ()=> {
				log_o.l("资源菜单：插入按钮（二级）");
			}
		});
		// ------------------节点菜单
		menu_o.add(menu.area_type.node, { "type": "separator" });
		menu_o.add(menu.area_type.node, {
			"path_s": "示例按钮（一级）",
			"click": ()=> {
				log_o.l("节点菜单按钮");
			},
		});
		// ------------------节点设置菜单
		menu_o.add(menu.area_type.node_setting, { "type": "separator" });
		menu_o.add(menu.area_type.node_setting, {
			"path_s": "示例按钮（一级）",
			"click": ()=> {
				log_o.l("节点设置菜单");
			},
		});
		// ------------------组件设置菜单
		menu_o.add(menu.area_type.component_setting, { "type": "separator" });
		menu_o.add(menu.area_type.component_setting, {
			"path_s": "示例按钮（一级）",
			"click": ()=> {
				log_o.l("组件设置菜单");
			},
		});
		// ------------------添加组件菜单
		menu_o.add(menu.area_type.add_component, { "type": "separator" });
		menu_o.add(menu.area_type.add_component, {
			"path_s": "示例按钮（一级）",
			"click": ()=> {
				log_o.l("添加组件菜单");
			},
		});
		// ------------------控制台菜单
		menu_o.add(menu.area_type.console, { "type": "separator" });
		menu_o.add(menu.area_type.console, {
			"path_s": "示例按钮（一级）",
			"click": ()=> {
				log_o.l("控制台菜单");
			},
		});
		menu_o.modify(menu.area_type.node, "创建节点/创建空节点", {
			"cb_f": (item_a: menu.item)=> {
				item_a.message = undefined;
				item_a.click = ()=> {
					log_o.l("修改点击");
				};
			},
			"mode_e": menu.find_mode.label
		});
	}
	export function unload() {
		// execute when package unloaded
	};
	// register your ipc messages here
	//@ts-ignore
	export const messages = {
		/**打开面板 */
		open() {
			Editor.Panel.open(config.name_s);
		},
	};
}

module.exports = main;