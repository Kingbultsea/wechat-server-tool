"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = exports.getPostData = void 0;
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
