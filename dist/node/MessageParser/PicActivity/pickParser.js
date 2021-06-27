"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const superagent_1 = __importDefault(require("superagent"));
const path = require('path');
const fs = require('fs');
async function sendMediaDataCopy(targetInfo, uid) {
    return new Promise((resolve) => {
        let formData = {
            my_field: 'my_value',
            my_file: fs.createReadStream(path.join(process.cwd(), `./test.jpg`))
        };
        // 上传图片 并发送
        request_1.default.post({ url: `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${targetInfo.authorizer_access_token}&type=image`, formData: formData }, async function (err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }
            console.log(formData);
            console.log('上传图片', JSON.parse(body).media_id, body, targetInfo);
            sendMediaContent(uid, JSON.parse(body).media_id, targetInfo.authorizer_access_token, 'image');
            // await sendTouser.sendMediaContent(openid, JSON.parse(body).media_id, token, type)
            resolve(null);
        });
    });
}
function sendMediaContent(toUser, mediaId, serveAccessToken, type) {
    const serviceData = {
        'touser': toUser,
        'msgtype': type,
        [type]: {
            'media_id': mediaId
        }
    };
    superagent_1.default.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${serveAccessToken}`).send(serviceData);
}
exports.default = sendMediaDataCopy;
