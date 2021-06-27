"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreCode = exports.getComponentAccessToken = exports.EnctypeTicket = exports.DATA = void 0;
const Log_1 = __importDefault(require("../util/Log"));
const superagent_1 = __importDefault(require("superagent"));
const util_1 = require("./util");
const util_2 = require("./util");
const DATA_json_1 = __importDefault(require("../../DATA.json"));
exports.DATA = DATA_json_1.default;
const Log = Log_1.default('Message from 自身平台：');
exports.EnctypeTicket = DATA_json_1.default && DATA_json_1.default.self && DATA_json_1.default.self.Encrypt;
Log(`读取本地DATA文件，获取EnctypeTicket: ${exports.EnctypeTicket}`);
// 微信第三方自身授权
const SelfWeChatPlugin = ({ app, Router, root }) => {
    if (app) {
        app.use(async (ctx, next) => { });
    }
    // 每10分钟会有请求进来
    Router.post('/wechat_open_platform/auth/callback', async (ctx, res) => {
        const bodyXML = await util_2.getPostData(ctx);
        let match = null;
        if (match = /<Encrypt\b[^>]*><\!\[CDATA\[([\s\S]*?)\]\]<\/Encrypt>/gm.exec(bodyXML)) {
            exports.EnctypeTicket = match[1];
            console.log(exports.EnctypeTicket);
            // update
            // todo 抓获setter
            DATA_json_1.default.self.Encrypt = exports.EnctypeTicket;
            util_1.writeFile(root, DATA_json_1.default);
            Log(`微信端接收EnctypeTicket：${exports.EnctypeTicket}`);
        }
        else {
            Log(`微信端接收EnctypeTicket异常: ${bodyXML}`);
        }
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
