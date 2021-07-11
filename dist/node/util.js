"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = exports.writeFile = exports.getPostData = exports.randomString = void 0;
const fs_1 = require("fs");
const path = require('path');
const getPostData = (ctx) => {
    return new Promise(function (resolve, reject) {
        try {
            let str = '';
            ctx.req.on('data', function (data) {
                str += data;
            });
            ctx.req.on('end', function () {
                resolve(str);
            });
        }
        catch (e) {
            reject(e);
        }
    });
};
exports.getPostData = getPostData;
const writeFile = (ROOT = process.cwd(), data) => {
    let dataJSON = JSON.stringify(data);
    fs_1.promises.writeFile(path.join(ROOT, global.__CONFIG__.input), dataJSON);
};
exports.writeFile = writeFile;
const getData = async (ctx, encrypt, tagName) => {
    const bodyXML = await getPostData(ctx);
    let result = '';
    let match = null;
    if (match = /<Encrypt\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/Encrypt>/gm.exec(bodyXML)) {
        result = encrypt.decode(match[1]);
        if (tagName === 'ComponentVerifyTicket') {
            result = // (eval(`/<${tagName}\\b[^>]*>\\<\\!\\[CDATA\\[([\\s\\S]*?)\\]\\]\\><\\/${tagName}>/gm`)).exec(result)![1]
                (/<ComponentVerifyTicket\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/ComponentVerifyTicket>/gm.exec(result) || [])[1];
        }
    }
    return {
        result,
        bodyXML
    };
};
exports.getData = getData;
function randomString(len) {
    len = len || 32;
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
exports.randomString = randomString;
