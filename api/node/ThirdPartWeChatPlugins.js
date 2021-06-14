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
const superagent_1 = __importDefault(require("superagent"));
const Log_1 = __importStar(require("../util/Log"));
const SelfWeChatPlugin_1 = require("./SelfWeChatPlugin");
// import {app} from '@api/index';
const Log = Log_1.default('Message from 第三方：');
const ThirdPartWeChatPlugins = ({ appid, secret, Router, type }) => {
    let ACCESS_TOKEN = '';
    if (type === 'express') {
    }
    // step1 发送第三方的预授权码
    Router.get('/wechat_open_platform/preauthcode', async (_ctx, res) => {
        let ctx = Log_1.convertPlugins(_ctx, res, type);
        if (!SelfWeChatPlugin_1.EnctypeTicket) {
            Log(`EnctypeTicket(${SelfWeChatPlugin_1.EnctypeTicket})错误，发送预授权码失败`);
            ctx.response.body = 'error';
            return;
        }
        ACCESS_TOKEN = await SelfWeChatPlugin_1.getComponentAccessToken({
            appid,
            secret,
            enctypeTicket: SelfWeChatPlugin_1.EnctypeTicket
        });
        const code = await SelfWeChatPlugin_1.getPreCode({ access_token: ACCESS_TOKEN, appid });
        ctx.response.body = code;
    });
    // step2 接收从前端页面跳转发来的authorization_code
    Router.get(`/wechat_open_platform/submitac`, async (_ctx, res) => {
        let ctx = Log_1.convertPlugins(_ctx, res, type);
        if (!ACCESS_TOKEN) {
            Log(`ACCESS_TOKEN(${ACCESS_TOKEN})令牌为空，需要获取自身平台的令牌，才可以进行授权。`);
            ctx.response.body = 'error';
            return;
        }
        Authorization(ctx.query.ac, ACCESS_TOKEN, appid);
        ctx.response.body = 'success';
    });
};
function Authorization(authorization_code, ACCESS_TOKEN, appid) {
    Log(`授权开始，authorization_code: ${authorization_code}`);
    superagent_1.default.post(`https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=${ACCESS_TOKEN}`)
        .send({
        component_appid: appid,
        authorization_code: authorization_code
    })
        .end(async (err, res) => {
        if (res.body.hasOwnProperty('errcode')) {
            Log(`无效的authorization_code：${ACCESS_TOKEN}`);
            Log(`本次授权失败`);
            return;
        }
        const AUTHORIZATION_INFO = res.body.authorization_info;
        let authorizer_access_token = AUTHORIZATION_INFO.authorizer_access_token;
        let refresh_authorizer_refresh_token = AUTHORIZATION_INFO.authorizer_refresh_token;
        Log(`获取成功！\r\nauthorizer_access_token：${authorizer_access_token}\r\nrefresh_authorizer_refresh_token：${refresh_authorizer_refresh_token}`);
        // 获取第三方平台的信息
        const platFormInfo = await new Promise((resolve) => {
            superagent_1.default.post(`https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info?component_access_token=${ACCESS_TOKEN}`)
                .send({
                component_appid: appid,
                authorizer_appid: AUTHORIZATION_INFO.authorizer_appid
            })
                .then((err) => {
                resolve(err.body.authorizer_info);
            });
        });
        Log(`${platFormInfo.nick_name}第三方授权完成，将凭借refresh_authorizer_refresh_token，每一个小时刷新一次authorizer_access_token`);
        // todo 数据库保存平台的信息 与刷新token
    });
}
exports.default = ThirdPartWeChatPlugins;
