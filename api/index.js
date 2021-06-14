import _app from 'express';
import { internalPlugins } from '@node/server';
export const app = _app();
const serverContext = {
    appid: '123',
    secret: '2H,p37XE$6AfHdn',
    Router: app,
    type: 'express'
};
// 转换接口
function convert() {
    ;
    [...internalPlugins].forEach(m => m(serverContext));
}
convert();
module.exports = app;
