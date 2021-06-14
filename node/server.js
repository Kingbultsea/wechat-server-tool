import http from 'http';
import Koa from 'koa';
import SelfWeChatPlugin from './SelfWeChatPlugin';
import ThirdPartWeChatPlugins from './ThirdPartWeChatPlugins';
import _Router from 'koa-router';
import _BodyParser from 'koa-bodyparser';
export const Router = new _Router();
export const internalPlugins = [SelfWeChatPlugin, ThirdPartWeChatPlugins];
export function createServer({ appid = '', secret = '', plugins = [] } = {}) {
    const app = new Koa();
    app.use(Router.routes());
    app.use(_BodyParser());
    const server = http.createServer(app.callback());
    [...plugins, ...internalPlugins].forEach((m) => m({
        appid,
        secret,
        app,
        type: 'koa',
        Router
    }));
    return server;
}
