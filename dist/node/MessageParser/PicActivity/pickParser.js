"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = void 0;
const request_1 = __importDefault(require("request"));
const superagent_1 = __importDefault(require("superagent"));
const Avatar_1 = require("../../Activity/Avatar");
const path = require('path');
const fs = require('fs');
async function sendMediaDataCopy({ targetInfo, uid, content, root } = {}) {
    if (!['请给我一张头像'].includes(content)) {
        return;
    }
    // todo 用户繁忙设置
    return new Promise(async (resolve) => {
        let formData = {
            my_field: 'my_value',
            my_file: fs.createReadStream(path.join(process.cwd(), `./test.jpg`))
        };
        // 获取用户信息头像
        const userInfo = await getUserInfo({ serveAccessToken: targetInfo.authorizer_access_token, uid });
        if (userInfo && userInfo.picUrl) {
            const resultPath = await Avatar_1.parseBlockTypeAvatar({ root, frameName: '1.png', userPicUrl: userInfo.picUrl });
            formData.my_file = fs.createReadStream(resultPath);
        }
        // 上传图片 并发送
        request_1.default.post({ url: `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${targetInfo.authorizer_access_token}&type=image`, formData: formData }, async function (err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }
            // 发送消息给用户
            sendMediaContent(uid, JSON.parse(body).media_id, targetInfo.authorizer_access_token, 'image');
            resolve(null);
        });
    });
}
// 发送媒体信息给用户
function sendMediaContent(toUser, mediaId, serveAccessToken, type) {
    const serviceData = {
        'touser': toUser,
        'msgtype': type,
        [type]: {
            'media_id': mediaId
        }
    };
    superagent_1.default.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${serveAccessToken}`).send(serviceData).end(() => {
    });
}
// todo 缓存
// 获取用户信息
async function getUserInfo({ serveAccessToken, uid }) {
    return new Promise((resolve) => {
        superagent_1.default.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${serveAccessToken}&openid=${uid}&lang=zh_CN`).end((err, res) => {
            if (res.body) {
                const data = { name: res.body.nickname, picUrl: res.body.headimgurl, unionid: res.body.unionid, sex: res.body.sex, all: res.body };
                resolve(data);
                return;
            }
            console.log('获取用户信息');
            resolve(undefined);
        });
    });
}
exports.getUserInfo = getUserInfo;
exports.default = sendMediaDataCopy;
