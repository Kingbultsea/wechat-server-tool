"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.createServer = exports.internalPlugins = exports.ROOT = exports.Router = exports.userInfoCache = void 0;
var http_1 = require("http");
var koa_1 = require("koa");
var SelfWeChatPlugin_1 = require("./plugins/SelfWeChatPlugin");
var ThirdPartWeChatPlugins_1 = require("./plugins/ThirdPartWeChatPlugins");
var koa_router_1 = require("koa-router");
var koa_bodyparser_1 = require("koa-bodyparser");
var Encrypt_1 = require("./Encrypt");
var ParsePlatFormMessagePlugin_1 = require("./plugins/ParsePlatFormMessagePlugin");
var lru_cache_1 = require("lru-cache");
exports.userInfoCache = new lru_cache_1["default"]({
    max: 65535
});
exports.Router = new koa_router_1["default"]();
exports.ROOT = '';
exports.internalPlugins = [SelfWeChatPlugin_1["default"], ThirdPartWeChatPlugins_1["default"], ParsePlatFormMessagePlugin_1["default"]];
function createServer(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.root, root = _c === void 0 ? process.cwd() : _c, _d = _b.appid, appid = _d === void 0 ? '' : _d, _e = _b.secret, secret = _e === void 0 ? '' : _e, _f = _b.plugins, plugins = _f === void 0 ? [] : _f, encodingAESKey = _b.encodingAESKey, token = _b.token;
    exports.ROOT = root;
    var app = new koa_1["default"]();
    app.use(exports.Router.routes());
    app.use(koa_bodyparser_1["default"]());
    app.use(require('koa-static')(root));
    var server = http_1["default"].createServer(app.callback());
    // @ts-ignore
    var encrypt = new Encrypt_1["default"]({
        appId: appid,
        encodingAESKey: encodingAESKey,
        token: token
    });
    __spreadArray(__spreadArray([], exports.internalPlugins), plugins).forEach(function (m) {
        return m({
            encrypt: encrypt,
            appid: appid,
            secret: secret,
            app: app,
            type: 'koa',
            Router: exports.Router,
            root: root
        });
    });
    return server;
}
exports.createServer = createServer;
process.on('uncaughtException', function (err) {
    console.log(err);
});
