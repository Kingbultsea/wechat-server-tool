"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBlockTypeAvatar = void 0;
// @ts-ignore
const canvas_1 = require("canvas");
const util_1 = require("../util");
// @ts-ignore
const request_1 = __importDefault(require("request"));
const MessageParser_1 = require("../MessageParser");
const fs = require('fs');
const path = require("path");
// 边框贴图渲染
async function parseBlockTypeAvatar({ root, frameName, userPicUrl = '', dir } = {}) {
    const width = 512;
    const height = 512;
    const canvas = canvas_1.createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    // 绘制头像
    await canvas_1.loadImage(userPicUrl.replace(/132$/, '0')).then((image) => {
        ctx.drawImage(image, 0, 0, width, height);
    });
    // 绘制叠加的框框
    await canvas_1.loadImage(path.join(root, `./assets/avatar/${dir}/` + frameName)).then((image) => {
        ctx.drawImage(image, 0, 0, width, height);
    });
    // todo 不要使用写进本地文件的方式
    const promise = new Promise((resolve) => {
        const hash = util_1.randomString(6);
        let done = false;
        console.log(hash);
        setTimeout(() => {
            if (!done) {
                resolve(undefined);
            }
        }, 5000);
        // @ts-ignore
        fs.writeFile(path.join(root, `./assets/avatar/${hash}.png`), canvas.toBuffer('image/jpeg', { quality: 1 }), (err) => {
            done = true;
            if (err) {
                // console.log(err)
                resolve(undefined);
                return;
            }
            resolve(path.join(root, `./assets/avatar/${hash}.png`));
        }).finally(() => {
            resolve(path.join(root, `./assets/avatar/${hash}.png`));
        });
    }).catch((e) => {
        console.log(e);
    });
    return promise;
}
exports.parseBlockTypeAvatar = parseBlockTypeAvatar;
async function activityFlow({ targetInfo, uid, resolve, frameName, root, dir, index = 0 } = {}) {
    let formData = {
        my_field: 'my_value',
        my_file: ''
    };
    // 获取用户信息头像
    const userInfo = await MessageParser_1.getUserInfo({ serveAccessToken: targetInfo.authorizer_access_token, uid, platFormName: targetInfo.name });
    activityFlow({ userInfo, formData, targetInfo, uid, frameName, index: 0, root, dir });
    let resultPath = '';
    if (userInfo && userInfo.picUrl) {
        resultPath = await parseBlockTypeAvatar({ root, frameName: frameName[index] + '.png', userPicUrl: (userInfo || {}).picUrl, dir });
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
        if (JSON.parse(body).media_id) {
            // 发送消息给用户
            MessageParser_1.sendMediaContent(uid, JSON.parse(body).media_id, targetInfo.authorizer_access_token, 'image');
            if (frameName.length > index + 1) {
                activityFlow({ userInfo, formData, targetInfo, uid, resolve, frameName, index: index + 1, root, dir });
            }
        }
        resolve(null);
    });
}
exports.default = activityFlow;
