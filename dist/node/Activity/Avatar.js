"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBlockTypeAvatar = void 0;
const canvas_1 = require("canvas");
const fs_1 = require("fs");
const util_1 = require("../util");
const path = require("path");
// 边框贴图渲染活动
async function parseBlockTypeAvatar({ root, frameName, userPicUrl = '' } = {}) {
    const width = 256;
    const height = 256;
    const canvas = canvas_1.createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    // 绘制头像
    await canvas_1.loadImage(userPicUrl.replace(/132$/, '0')).then((image) => {
        ctx.drawImage(image, 0, 0, width, height);
    });
    // 绘制叠加的框框
    await canvas_1.loadImage(path.join(root, './assets/avatar/xuesong/' + frameName)).then((image) => {
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
        fs_1.promises.writeFile(path.join(root, `./assets/avatar/${hash}.png`), canvas.toBuffer('image/jpeg', { quality: 1 }), (err) => {
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
