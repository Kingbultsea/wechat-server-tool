"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreCode = exports.getComponentAccessToken = exports.EnctypeTicket = exports.DATA = void 0;
const Log_1 = __importDefault(require("../util/Log"));
const superagent_1 = __importDefault(require("superagent"));
const util_1 = require("./util");
const DATA_json_1 = __importDefault(require("../../DATA.json"));
exports.DATA = DATA_json_1.default;
const Log = Log_1.default('Message from 自身平台：');
exports.EnctypeTicket = DATA_json_1.default && DATA_json_1.default.self && DATA_json_1.default.self.Encrypt;
Log(`读取本地DATA文件，获取EnctypeTicket: ${exports.EnctypeTicket}`);
// 微信第三方自身授权
const SelfWeChatPlugin = ({ app, Router, root, encrypt, appid, secret }) => {
    if (app) {
        app.use(async (ctx, next) => { });
    }
    // 每10分钟会有请求进来
    Router.post('/wechat_open_platform/auth/callback', async (ctx, res) => {
        const { result: _EnctypeTicket, bodyXML } = await util_1.getData(ctx, encrypt, 'ComponentVerifyTicket');
        if (_EnctypeTicket) {
            exports.EnctypeTicket = _EnctypeTicket;
            // todo 抓获setter
            DATA_json_1.default.self.Encrypt = exports.EnctypeTicket;
            util_1.writeFile(root, DATA_json_1.default);
            Log(`微信端接收EnctypeTicket：${exports.EnctypeTicket}`);
            ctx.response.body = 'success';
        }
        else {
            Log(`微信端接收EnctypeTicket异常: ${bodyXML}`);
        }
    });
    getSelfAccessComponentToken({ appid, root, secret });
    refleash({ appid, root });
};
// 获取自身平台的令牌
function getComponentAccessToken({ appid, secret, enctypeTicket } = {}) {
    const params = {
        component_appid: appid,
        component_appsecret: secret,
        component_verify_ticket: enctypeTicket
    };
    console.log(params);
    return new Promise((resolve) => {
        // 这个方法怎么不是返回promise?
        // todo 改写为request
        superagent_1.default.post(`https://api.weixin.qq.com/cgi-bin/component/api_component_token`)
            .send(params)
            .end((err, res) => {
            console.log(res.body);
            Log(`获取令牌access_token:${res.body.component_access_token}`);
            resolve(res.body.component_access_token);
        });
    });
}
exports.getComponentAccessToken = getComponentAccessToken;
// 获取预授权码
// https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/pre_auth_code.html
async function getPreCode({ appid, access_token } = {}) {
    return new Promise((resolve) => {
        const _URL = `https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=${access_token}`;
        const _Params = {
            component_appid: appid
        };
        return superagent_1.default.post(_URL)
            .send(_Params)
            .end((err, res) => {
            const code = res.body.pre_auth_code;
            Log(`获取预授权码: ${code}`);
            resolve(code);
            return code;
        });
    });
}
exports.getPreCode = getPreCode;
// 获取账号自身的AccessComponentToken 用于刷新
// todo也需要刷新机制
// 好像每次刷新都只有一次吧
function getSelfAccessComponentToken({ appid, root, secret } = {}) {
    const minTime = new Date().getTime() - parseInt(DATA_json_1.default.self.update || 0);
    const time = 1000 * 60 * 60;
    console.log('检测过期', minTime, DATA_json_1.default.self.update);
    if (minTime >= time) {
        const params = {
            component_appid: appid,
            component_appsecret: secret,
            component_verify_ticket: DATA_json_1.default.self.Encrypt
        };
        // todo 做刷新机制
        superagent_1.default.post(`https://api.weixin.qq.com/cgi-bin/component/api_component_token`).send(params).end((err, res) => {
            Log(`获取自身access_token:${res.body.component_access_token}`);
            console.log(res.body);
            DATA_json_1.default.self.component_access_token = res.body.component_access_token;
            DATA_json_1.default.self.update = new Date().getTime();
            util_1.writeFile(root, DATA_json_1.default);
        });
    }
    // 每一小时请求一次
    setTimeout((() => {
        getSelfAccessComponentToken({ appid, root, secret });
    }), 1000 * 60 * 60);
}
// 刷新机制
// todo 删除
function refleash({ appid, root } = {}) {
    DATA_json_1.default.thirdPart.forEach((v, index) => {
        const minTime = new Date().getTime() - parseInt(v.update);
        const time = 1000 * 60 * 110;
        const params = {
            component_appid: appid,
            authorizer_appid: v.appid,
            authorizer_refresh_token: v.refresh_authorizer_refresh_token // 授权方的刷新令牌
        };
        if (v.appid && (minTime >= time)) {
            const target = DATA_json_1.default.thirdPart[index];
            Log(`刷新${target.name}的accessToken`);
            superagent_1.default.post(`https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token=${DATA_json_1.default.self.component_access_token}`).send(params).end(async (err, res) => {
                if (res.body.authorizer_access_token) {
                    target.update = new Date().getTime();
                    target.authorizer_access_token = res.body.authorizer_access_token;
                    target.refresh_authorizer_refresh_token = res.body.authorizer_refresh_token;
                    util_1.writeFile(root, DATA_json_1.default);
                }
                else {
                    Log(`刷新后，没有数据`);
                    console.log(res.body);
                }
            });
        }
    });
    // 1小时请求一次
    setTimeout(() => {
        refleash({ appid, root });
    }, 1000 * 60 * 60);
}
exports.default = SelfWeChatPlugin;
