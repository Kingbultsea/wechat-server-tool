"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SelfWeChatPlugin_1 = require("./SelfWeChatPlugin");
const util_1 = require("./util");
const Log_1 = __importDefault(require("../util/Log"));
const pickParser_1 = __importDefault(require("./MessageParser/PicActivity/pickParser"));
const ParsePlatFormMessagePlugins = ({ Router, encrypt }) => {
    // 监听第三方平台信息
    Router.post(`/wechat_open_platform/:id/message`, async (ctx) => {
        const platFormId = ctx.params.id;
        let target = {};
        for (let i = 0; i < SelfWeChatPlugin_1.DATA.thirdPart.length; i++) {
            const _target = SelfWeChatPlugin_1.DATA.thirdPart[i];
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
        ctx.response.body = 'success';
        // todo 消息插件
        // 图片活动
        pickParser_1.default({ targetInfo: target, uid: FromUserName, content: result });
    });
};
exports.default = ParsePlatFormMessagePlugins;
