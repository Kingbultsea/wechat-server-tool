"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = exports.Router = void 0;
const http_1 = __importDefault(require("http"));
const koa_1 = __importDefault(require("koa"));
const SelfWeChatPlugin_1 = __importDefault(require("./SelfWeChatPlugin"));
const ThirdPartWeChatPlugins_1 = __importDefault(require("./ThirdPartWeChatPlugins"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
exports.Router = new koa_router_1.default();
const internalPlugins = [SelfWeChatPlugin_1.default, ThirdPartWeChatPlugins_1.default];
function createServer({ appid = '', secret = '', root = process.cwd(), plugins = [] } = {}) {
    const app = new koa_1.default();
    app.use(exports.Router.routes());
    app.use(koa_bodyparser_1.default());
    const server = http_1.default.createServer(app.callback());
    [...plugins, ...internalPlugins].forEach((m) => m({
        root,
        appid,
        secret,
        app,
        server,
        Router: exports.Router
    }));
    return server;
}
exports.createServer = createServer;
