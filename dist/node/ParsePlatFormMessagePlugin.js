"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SelfWeChatPlugin_1 = require("./SelfWeChatPlugin");
const util_1 = require("./util");
const Log_1 = __importDefault(require("../util/Log"));
const pickParser_1 = __importDefault(require("./MessageParser/PicActivity/pickParser"));
const ParsePlatFormMessagePlugins = ({ Router, encrypt, root }) => {
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
        Log(result);
        ctx.response.body = 'success';
        // todo 消息插件
        if ((target.appid === 'wx7630866bd98a50de' || target.appid === 'wx0ea308250417bd30') && ['百年', '100年', '头像', '我要头像', '党旗', '建党'].includes(Content)) {
            // 图片活动
            pickParser_1.default({ targetInfo: target, uid: FromUserName, content: Content, root, frameName: ['1', '2', '3', '6', '7', '8', '10'], dir: 'sanwei' });
            return;
        }
        else if ((target.appid === 'wx85df74b62aad79ed' || target.appid === 'wx0ea308250417bd30') && ['七一', '建党', '百年风华', '建党百年', '七一建党', '建党100周年', '71'].includes(Content)) {
            // 图片活动
            pickParser_1.default({ targetInfo: target, uid: FromUserName, content: Content, root, frameName: ['xs1', 'xs2', 'xs3'], dir: 'xuesong' });
            return;
        }
    });
};
exports.default = ParsePlatFormMessagePlugins;
