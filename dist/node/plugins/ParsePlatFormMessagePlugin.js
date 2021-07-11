"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const Log_1 = __importDefault(require("../../util/Log"));
const madge = require('madge');
const path = require("path");
// 需插件引入
// import avatarPlugins from '../Activity/Avatar'
const ParsePlatFormMessagePlugin = ({ app, Router, encrypt, root, DATA, input, watcher }) => {
    let inputMth;
    try {
        const Log = Log_1.default(`热更新：`);
        watcher.on('change', (file) => {
            madge(path.join(root, input)).then((res) => {
                if (Object.keys(res.tree).includes(path.relative(root, file))) {
                    Log(`文件${file}改动，将重加载入口方法`);
                    // 消息处理
                    inputMth = require(path.join(root, input));
                }
            });
        });
        // 消息处理
        inputMth = require(path.join(root, input));
    }
    catch (e) {
        console.log(e);
    }
    if (app) {
        app.use(async (ctx, next) => {
        });
    }
    // 监听第三方平台信息
    Router.post(`/wechat_open_platform/:id/message`, async (ctx) => {
        const platFormId = ctx.params.id;
        let target = {};
        for (let i = 0; i < DATA.thirdPart.length; i++) {
            const _target = DATA.thirdPart[i];
            if (_target.appid === platFormId) {
                target = _target;
                break;
            }
        }
        const { result } = await util_1.getData(ctx, encrypt);
        const Content = (/<Content\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/Content>/gm.exec(result) || [])[1];
        const FromUserName = (/<FromUserName\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/FromUserName>/gm.exec(result) || [])[1];
        const Log = Log_1.default(`收到来自${target.name}(${platFormId})的消息：`);
        Log(Content);
        Log(result);
        ctx.response.body = 'success';
        // todo 消息插件  target content FromUserName
        if (inputMth && typeof inputMth === 'function') {
            inputMth({ target, Content, FromUserName, root });
        }
    });
};
exports.default = ParsePlatFormMessagePlugin;
