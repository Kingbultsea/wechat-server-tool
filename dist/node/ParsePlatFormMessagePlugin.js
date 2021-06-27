"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SelfWeChatPlugin_1 = require("./SelfWeChatPlugin");
const util_1 = require("@node/util");
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
        const { result, bodyXML } = await util_1.getData(ctx, encrypt);
        console.log(`收到来自${target.name}(${bodyXML})的消息：\r\n${result}`);
        ctx.response.body = 'success';
        // todo 消息插件
    });
};
exports.default = ParsePlatFormMessagePlugins;
