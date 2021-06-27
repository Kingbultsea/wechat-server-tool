"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = exports.writeFile = exports.getPostData = void 0;
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
    fs_1.promises.writeFile(path.join(ROOT, 'DATA.json'), dataJSON);
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
