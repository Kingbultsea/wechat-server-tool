"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostData = void 0;
const getPostData = (ctx) => {
    return new Promise(function (resolve, reject) {
        try {
            let str = '';
            ctx.request.on('data', function (data) {
                str += data;
            });
            ctx.request.on('end', function () {
                resolve(str);
            });
        }
        catch (e) {
            reject(e);
        }
    });
};
exports.getPostData = getPostData;
