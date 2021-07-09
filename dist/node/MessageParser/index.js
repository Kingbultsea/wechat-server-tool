"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.sendMediaContent = void 0;
const superagent_1 = __importDefault(require("superagent"));
const server_1 = require("../server");
// 发送媒体信息给用户
function sendMediaContent(toUser, mediaId, serveAccessToken, type) {
    return new Promise((resolve) => {
        const serviceData = {
            'touser': toUser,
            'msgtype': type,
            [type]: {
                'media_id': mediaId
            }
        };
        superagent_1.default.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${serveAccessToken}`).send(serviceData).end(() => {
            resolve(null);
        });
    });
}
exports.sendMediaContent = sendMediaContent;
// 获取用户信息
async function getUserInfo({ serveAccessToken, uid, platFormName }) {
    return new Promise((resolve) => {
        let cache = server_1.userInfoCache.get(uid);
        if (cache) {
            resolve(cache);
            return;
        }
        superagent_1.default.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${serveAccessToken}&openid=${uid}&lang=zh_CN`).end((err, res) => {
            if (!res) {
                console.log('获取用户信息没有响应');
                return;
            }
            if (res.body) {
                const data = { name: res.body.nickname, picUrl: res.body.headimgurl, openid: res.body.openid, sex: res.body.sex, all: res.body };
                if (res.body.openid) {
                    server_1.userInfoCache.set(res.body.openid, data);
                }
                resolve(data);
                return;
            }
            resolve(undefined);
        });
    });
}
exports.getUserInfo = getUserInfo;
