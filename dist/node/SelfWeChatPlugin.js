"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreCode = exports.getComponentAccessToken = exports.EnctypeTicket = void 0;
const Log_1 = __importStar(require("../util/Log"));
const superagent_1 = __importDefault(require("superagent"));
// import { app } from '@api/index.ts'
const Log = Log_1.default('Message from 自身平台：');
exports.EnctypeTicket = '';
// 微信第三方自身授权
const SelfWeChatPlugin = ({ app, Router, type }) => {
    if (app) {
        app.use(async (ctx, next) => { });
    }
    // 每10分钟会有请求进来
    Router.post('/wechat_open_platform/auth/callback', async (_ctx, res) => {
        let ctx = Log_1.convertPlugins(_ctx, res, type);
        // @ts-ignore
        exports.EnctypeTicket = ctx.request.body.xml.Encrypt[0];
        Log(`微信端接收EnctypeTicket：${exports.EnctypeTicket}`);
    });
};
// 获取自身平台的令牌
function getComponentAccessToken({ appid, secret, enctypeTicket } = {}) {
    const params = {
        component_appid: appid,
        component_appsecret: secret,
        component_verify_ticket: enctypeTicket
    };
    return new Promise((resolve) => {
        // 这个方法怎么不是返回promise?
        // todo 改写为request
        superagent_1.default.post(`https://api.weixin.qq.com/cgi-bin/component/api_component_token`)
            .send(params)
            .end((err, res) => {
            Log(`获取令牌access_token:${res.body.component_access_token}`);
            resolve(res.body.component_access_token);
        });
    });
}
exports.getComponentAccessToken = getComponentAccessToken;
// 获取预授权码
// https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/pre_auth_code.html
async function getPreCode({ appid, access_token } = {}) {
    const _URL = `https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=${access_token}`;
    const _Params = {
        component_appid: appid
    };
    return superagent_1.default.post(_URL)
        .send(_Params)
        .end((err, res) => {
        const code = res.body.pre_auth_code;
        Log(`获取预授权码: ${code}`);
        return code;
    });
}
exports.getPreCode = getPreCode;
exports.default = SelfWeChatPlugin;
