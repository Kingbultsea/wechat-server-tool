"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = exports.internalPlugins = exports.ROOT = exports.Router = void 0;
const http_1 = __importDefault(require("http"));
const koa_1 = __importDefault(require("koa"));
const SelfWeChatPlugin_1 = __importDefault(require("./SelfWeChatPlugin"));
const ThirdPartWeChatPlugins_1 = __importDefault(require("./ThirdPartWeChatPlugins"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const Encrypt_1 = __importDefault(require("./Encrypt"));
// import _xmlParser from 'koa-xml-body'
// import { app } from '@api/index'
const ParsePlatFormMessagePlugin_1 = __importDefault(require("./ParsePlatFormMessagePlugin"));
exports.Router = new koa_router_1.default();
exports.ROOT = '';
exports.internalPlugins = [SelfWeChatPlugin_1.default, ThirdPartWeChatPlugins_1.default, ParsePlatFormMessagePlugin_1.default];
function createServer({ root = process.cwd(), appid = '', secret = '', plugins = [] } = {}) {
    exports.ROOT = root;
    const app = new koa_1.default();
    app.use(exports.Router.routes());
    // app.use(_xmlParser())
    app.use(koa_bodyparser_1.default());
    app.use(require('koa-static')(root));
    const server = http_1.default.createServer(app.callback());
    // @ts-ignore
    const encrypt = new Encrypt_1.default({
        appId: appid,
        encodingAESKey: 'eUbVREqK4jh9XHeYTZPHRTCzFz8PDWL2nieCZzganJv',
        token: 'kingbultsea'
    });
    [...plugins, ...exports.internalPlugins].forEach((m) => m({
        encrypt,
        appid,
        secret,
        app,
        type: 'koa',
        Router: exports.Router,
        root
    }));
    return server;
}
exports.createServer = createServer;
process.on('uncaughtException', function (err) {
    console.log(err);
});
