'use strict';

module.exports = {
    load() {
        // 当 package 被正确加载的时候执行
        Editor.log(`Editor.Project.path : ${Editor.Project.path}`)
    },

    unload() {
        // 当 package 被正确卸载的时候执行
    },

    messages: {
        'log-hello'(event) {
            Editor.log(`event : ${JSON.stringify(event)}`)
            Editor.log('Hello World!');
        },
        'warn-hello'(event) {
            Editor.log(`event : ${JSON.stringify(event)}`)
            Editor.warn('Hello World!');
        }
    },
};