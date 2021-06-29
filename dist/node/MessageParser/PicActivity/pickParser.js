"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.userInfoCache = void 0;
// @ts-ignore
const request_1 = __importDefault(require("request"));
const superagent_1 = __importDefault(require("superagent"));
const Avatar_1 = require("../../Activity/Avatar");
const lru_cache_1 = __importDefault(require("lru-cache"));
exports.userInfoCache = new lru_cache_1.default({
    max: 65535
});
// const path = require('path')
const fs = require('fs');
async function sendMediaDataCopy({ targetInfo, uid, root, frameName = [], dir } = {}) {
    // todo 用户繁忙设置
    return new Promise(async (resolve) => {
        let formData = {
            my_field: 'my_value',
            my_file: '' // fs.createReadStream(path.join(process.cwd(), `./test.jpg`))
        };
        // 获取用户信息头像
        const userInfo = await getUserInfo({ serveAccessToken: targetInfo.authorizer_access_token, uid, platFormName: targetInfo.name });
        activityFlow({ userInfo, formData, targetInfo, uid, resolve, frameName, index: 0, root, dir });
    }).catch((e) => {
        console.log(e, 'error');
    });
}
async function activityFlow({ userInfo, formData, targetInfo, uid, resolve, frameName, index = 0, root, dir } = {}) {
    let resultPath = '';
    if (userInfo && userInfo.picUrl) {
        resultPath = await Avatar_1.parseBlockTypeAvatar({ root, frameName: frameName[index] + '.png', userPicUrl: (userInfo || {}).picUrl, dir });
        if (resultPath) {
            formData.my_file = fs.createReadStream(resultPath);
        }
        else {
            console.log('没有用户信息，不进行头像渲染');
            return;
        }
    }
    // 上传图片 并发送
    request_1.default.post({ url: `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${targetInfo.authorizer_access_token}&type=image`, formData: formData }, async function (err, httpResponse, body) {
        // 删除文件 免得占用内存
        if (resultPath) {
            fs.unlink(resultPath, function (err) {
                if (err) {
                    throw err;
                }
                console.log('文件删除成功！');
            });
        }
        if (err) {
            return console.error('upload failed: ', err);
        }
        console.log(body);
        if (JSON.parse(body).media_id) {
            // 发送消息给用户
            sendMediaContent(uid, JSON.parse(body).media_id, targetInfo.authorizer_access_token, 'image');
            if (frameName.length > index + 1) {
                activityFlow({ userInfo, formData, targetInfo, uid, resolve, frameName, index: index + 1, root, dir });
            }
        }
        resolve(null);
    });
}
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
// 获取用户信息
async function getUserInfo({ serveAccessToken, uid, platFormName }) {
    console.log(serveAccessToken, uid, platFormName);
    return new Promise((resolve) => {
        let cache = exports.userInfoCache.get(uid);
        if (cache) {
            resolve(cache);
            return;
        }
        superagent_1.default.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${serveAccessToken}&openid=${uid}&lang=zh_CN`).end((err, res) => {
            if (!res) {
                console.log('获取用户信息没有相应');
                return;
            }
            if (res.body) {
                console.log(`获取用户信息(${platFormName})`);
                console.log(res.body);
                const data = { name: res.body.nickname, picUrl: res.body.headimgurl, openid: res.body.openid, sex: res.body.sex, all: res.body };
                if (res.body.openid) {
                    // todo 怕传的是指引
                    exports.userInfoCache.set(res.body.openid, data);
                }
                resolve(data);
                return;
            }
            resolve(undefined);
        });
    });
}
exports.getUserInfo = getUserInfo;
exports.default = sendMediaDataCopy;
