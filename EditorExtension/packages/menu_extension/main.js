"use strict";

const config = require("./core/config");
const log = require("./core/log");
const menu = require("./_module/menu");
var main;
(function (main) {
    const log_o = log.instance();
    const menu_o = menu.instance();

    function createNode(name, parent, callback) {
        
        Editor.Ipc.sendToPanel('scene', 'scene:create-node-by-classid', name, '', parent, () => {
            /**
             * 这是一个hack, 没有找到获取新建node uuid的方法，
             * 但设置了timeout之后，这个回调会在timeout的时候报error
             * 而此时编辑器已选中新创建的node
             */
            let newNodeUuids = Editor.Selection.curSelection("node");
            let newUid = newNodeUuids[0]
            if (callback) {
                callback(newUid)
            }
        }, 300);
    }

    function load() {
        // ------------------节点菜单
        menu_o.add(menu.area_type.node, { "type": "separator" });
        menu_o.add(menu.area_type.node, {
            "path_s": "Create/Create List View",
            "click": () => {
                // const node = new cc.Node('CustomNode');
                // Editor.log('node : ' + cc.Node)
                // const scriptNode = node.addComponent(cc.Component);
                // scriptNode._name = 'CustomScript';
                // scriptNode._file = 'db://assets/scripts/custom-script.ts';

                // let list = 'db://assets/extension/list/List.ts'

                let nodeUuids = Editor.Selection.curSelection("node");
                let parent = nodeUuids[0]
                createNode("ListView", parent, (list_uid) => { 
                    Editor.Ipc.sendToPanel('scene', 'scene:add-component', list_uid, 'cc.ScrollView');
                    Editor.Ipc.sendToPanel('scene', 'scene:add-component', list_uid, 'List');
                    createNode("Mask", list_uid, (mask_uid) => { 
                        createNode("centent", mask_uid, (centent_uid) => { 
                            Editor.log(`list_uid : ${list_uid}   mask_uid : ${mask_uid}    centent_uid : ${centent_uid}`)
                        })
                    })
                })
                // Editor.Ipc.sendToPanel('scene', 'scene:add-component', list_uid, 'List');
                // let mask_uid = createNode("Mask")
                // let centent_uid = createNode("centent")
                // Editor.log(`list_uid : ${list_uid}   mask_uid : ${mask_uid}    centent_uid : ${centent_uid}`)

            },
        });
        // ------------------组件设置菜单
        menu_o.add(menu.area_type.component_setting, { "type": "separator" });
        menu_o.add(menu.area_type.component_setting, {
            "path_s": "示例按钮（一级）",
            "click": () => {
                log_o.l("组件设置菜单");
            },
        });
    }
    main.load = load;
    function unload() {
        // execute when package unloaded
    }
    main.unload = unload;
    ;
    // register your ipc messages here
    //@ts-ignore
    main.messages = {
        /**打开面板 */
        open() {
            Editor.Panel.open(config.name_s);
        },
    };
})(main || (main = {}));
module.exports = main;
