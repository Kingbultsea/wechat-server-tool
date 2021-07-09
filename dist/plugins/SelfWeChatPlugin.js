"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getPreCode = exports.getComponentAccessToken = exports.EnctypeTicket = exports.DATA = void 0;
var Log_1 = require("@util/Log");
var superagent_1 = require("superagent");
var util_1 = require("../util");
var DATA_json_1 = require("../../../DATA.json");
exports.DATA = DATA_json_1["default"];
var Log = Log_1["default"]('Message from 自身平台：');
exports.EnctypeTicket = DATA_json_1["default"] && DATA_json_1["default"].self && DATA_json_1["default"].self.Encrypt;
Log("\u8BFB\u53D6\u672C\u5730DATA\u6587\u4EF6\uFF0C\u83B7\u53D6EnctypeTicket: " + exports.EnctypeTicket);
// 微信第三方自身授权
var SelfWeChatPlugin = function (_a) {
    var app = _a.app, Router = _a.Router, root = _a.root, encrypt = _a.encrypt, appid = _a.appid, secret = _a.secret;
    if (app) {
        app.use(function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); });
    }
    // 每10分钟会有请求进来
    Router.post('/wechat_open_platform/auth/callback', function (ctx, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _EnctypeTicket, bodyXML;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, util_1.getData(ctx, encrypt, 'ComponentVerifyTicket')];
                case 1:
                    _a = _b.sent(), _EnctypeTicket = _a.result, bodyXML = _a.bodyXML;
                    if (_EnctypeTicket) {
                        exports.EnctypeTicket = _EnctypeTicket;
                        // todo 抓获setter
                        DATA_json_1["default"].self.Encrypt = exports.EnctypeTicket;
                        util_1.writeFile(root, DATA_json_1["default"]);
                        Log("\u5FAE\u4FE1\u7AEF\u63A5\u6536EnctypeTicket\uFF1A" + exports.EnctypeTicket);
                        ctx.response.body = 'success';
                    }
                    else {
                        Log("\u5FAE\u4FE1\u7AEF\u63A5\u6536EnctypeTicket\u5F02\u5E38: " + bodyXML);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    getSelfAccessComponentToken({ appid: appid, root: root, secret: secret });
    refleash({ appid: appid, root: root });
};
// 获取自身平台的令牌
function getComponentAccessToken(_a) {
    var _b = _a === void 0 ? {} : _a, appid = _b.appid, secret = _b.secret, enctypeTicket = _b.enctypeTicket;
    var params = {
        component_appid: appid,
        component_appsecret: secret,
        component_verify_ticket: enctypeTicket
    };
    console.log(params);
    return new Promise(function (resolve) {
        // 这个方法怎么不是返回promise?
        // todo 改写为request
        superagent_1["default"].post("https://api.weixin.qq.com/cgi-bin/component/api_component_token")
            .send(params)
            .end(function (err, res) {
            if (!res) {
                return;
            }
            console.log(res.body);
            Log("\u83B7\u53D6\u4EE4\u724Caccess_token:" + res.body.component_access_token);
            resolve(res.body.component_access_token);
        });
    });
}
exports.getComponentAccessToken = getComponentAccessToken;
// 获取预授权码
// https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/pre_auth_code.html
function getPreCode(_a) {
    var _b = _a === void 0 ? {} : _a, appid = _b.appid, access_token = _b.access_token;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_c) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var _URL = "https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=" + access_token;
                    var _Params = {
                        component_appid: appid
                    };
                    return superagent_1["default"].post(_URL)
                        .send(_Params)
                        .end(function (err, res) {
                        if (!res) {
                            return '';
                            resolve(null);
                        }
                        var code = res.body.pre_auth_code;
                        Log("\u83B7\u53D6\u9884\u6388\u6743\u7801: " + code);
                        resolve(code);
                        return code;
                    });
                })];
        });
    });
}
exports.getPreCode = getPreCode;
// 获取账号自身的AccessComponentToken 用于刷新
// todo也需要刷新机制
// 好像每次刷新都只有一次吧
function getSelfAccessComponentToken(_a) {
    var _b = _a === void 0 ? {} : _a, appid = _b.appid, root = _b.root, secret = _b.secret;
    var minTime = new Date().getTime() - parseInt(DATA_json_1["default"].self.update || 0);
    var time = 1000 * 60 * 50;
    console.log('检测过期', minTime, DATA_json_1["default"].self.update);
    if (minTime >= time) {
        var params = {
            component_appid: appid,
            component_appsecret: secret,
            component_verify_ticket: DATA_json_1["default"].self.Encrypt
        };
        // todo 做刷新机制
        superagent_1["default"].post("https://api.weixin.qq.com/cgi-bin/component/api_component_token").send(params).end(function (err, res) {
            if (res) {
                Log("\u83B7\u53D6\u81EA\u8EABaccess_token:" + res.body.component_access_token);
                console.log(res.body);
                DATA_json_1["default"].self.component_access_token = res.body.component_access_token;
                DATA_json_1["default"].self.update = new Date().getTime();
                util_1.writeFile(root, DATA_json_1["default"]);
            }
        });
    }
    // 每一小时请求一次
    setTimeout((function () {
        getSelfAccessComponentToken({ appid: appid, root: root, secret: secret });
    }), 1000 * 60 * 20);
}
// 刷新机制
// todo 删除
function refleash(_a) {
    var _this = this;
    var _b = _a === void 0 ? {} : _a, appid = _b.appid, root = _b.root;
    DATA_json_1["default"].thirdPart.forEach(function (v, index) {
        var minTime = new Date().getTime() - parseInt(v.update);
        var time = 1000 * 60 * 60;
        var params = {
            component_appid: appid,
            authorizer_appid: v.appid,
            authorizer_refresh_token: v.refresh_authorizer_refresh_token // 授权方的刷新令牌
        };
        if (v.appid && (minTime >= time)) {
            var target_1 = DATA_json_1["default"].thirdPart[index];
            Log("\u5237\u65B0" + target_1.name + "\u7684accessToken");
            superagent_1["default"].post("https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token=" + DATA_json_1["default"].self.component_access_token).send(params).end(function (err, res) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (res.body.authorizer_access_token) {
                        target_1.update = new Date().getTime();
                        target_1.authorizer_access_token = res.body.authorizer_access_token;
                        target_1.refresh_authorizer_refresh_token = res.body.authorizer_refresh_token;
                        util_1.writeFile(root, DATA_json_1["default"]);
                    }
                    else {
                        Log("\u5237\u65B0\u540E\uFF0C\u6CA1\u6709\u6570\u636E");
                        console.log(res.body);
                    }
                    return [2 /*return*/];
                });
            }); });
        }
    });
    // 1小时请求一次
    setTimeout(function () {
        refleash({ appid: appid, root: root });
    }, 1000 * 60 * 20);
}
exports["default"] = SelfWeChatPlugin;
