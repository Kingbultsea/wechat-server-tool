"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = void 0;
// @ts-ignore
const request_1 = __importDefault(require("request"));
const superagent_1 = __importDefault(require("superagent"));
const Avatar_1 = require("../../Activity/Avatar");
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
        activityFlow({ userInfo, formData, targetInfo, uid, resolve, frameName, index: 0, root, dir, pairage: true });
        activityFlow({ userInfo, formData, targetInfo, uid, resolve, frameName, index: 1, root, dir, pairage: false });
    });
}
async function activityFlow({ userInfo, formData, targetInfo, uid, resolve, frameName, index = 0, root, dir, pairage } = {}) {
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
                activityFlow({ userInfo, formData, targetInfo, uid, resolve, frameName, index: pairage ? (2 * index) : (2 * index) + 1, root, dir });
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
// todo 缓存
// 获取用户信息
async function getUserInfo({ serveAccessToken, uid, platFormName }) {
    console.log(serveAccessToken, uid, platFormName);
    return new Promise((resolve) => {
        superagent_1.default.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${serveAccessToken}&openid=${uid}&lang=zh_CN`).end((err, res) => {
            console.log(res.body);
            if (res.body) {
                const data = { name: res.body.nickname, picUrl: res.body.headimgurl, unionid: res.body.unionid, sex: res.body.sex, all: res.body };
                console.log(`获取用户信息(${platFormName})`);
                resolve(data);
                return;
            }
            resolve(undefined);
        });
    });
}
exports.getUserInfo = getUserInfo;
exports.default = sendMediaDataCopy;
