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
var superagent_1 = require("superagent");
var Log_1 = require("@util/Log");
var SelfWeChatPlugin_1 = require("./SelfWeChatPlugin");
var util_1 = require("../util");
var Log = Log_1["default"]('Message from 第三方：');
var ThirdPartWeChatPlugins = function (_a) {
    var appid = _a.appid, secret = _a.secret, Router = _a.Router, root = _a.root;
    var ACCESS_TOKEN = '';
    // step1 发送第三方的预授权码
    Router.get('/wechat_open_platform/preauthcode', function (ctx, res) { return __awaiter(void 0, void 0, void 0, function () {
        var code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!SelfWeChatPlugin_1.EnctypeTicket) {
                        Log("EnctypeTicket(" + SelfWeChatPlugin_1.EnctypeTicket + ")\u9519\u8BEF\uFF0C\u53D1\u9001\u9884\u6388\u6743\u7801\u5931\u8D25");
                        ctx.response.body = 'error';
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, SelfWeChatPlugin_1.getComponentAccessToken({
                            appid: appid,
                            secret: secret,
                            enctypeTicket: SelfWeChatPlugin_1.EnctypeTicket
                        })];
                case 1:
                    ACCESS_TOKEN = _a.sent();
                    return [4 /*yield*/, SelfWeChatPlugin_1.getPreCode({ access_token: ACCESS_TOKEN, appid: appid })];
                case 2:
                    code = _a.sent();
                    ctx.response.body = code;
                    return [2 /*return*/];
            }
        });
    }); });
    // step2 接收从前端页面跳转发来的authorization_code
    Router.get("/wechat_open_platform/submitac", function (ctx, res) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!ACCESS_TOKEN) {
                Log("ACCESS_TOKEN(" + ACCESS_TOKEN + ")\u4EE4\u724C\u4E3A\u7A7A\uFF0C\u9700\u8981\u83B7\u53D6\u81EA\u8EAB\u5E73\u53F0\u7684\u4EE4\u724C\uFF0C\u624D\u53EF\u4EE5\u8FDB\u884C\u6388\u6743\u3002");
                ctx.response.body = 'error';
                return [2 /*return*/];
            }
            Authorization(ctx.query.ac, ACCESS_TOKEN, appid, root);
            ctx.response.body = 'success';
            return [2 /*return*/];
        });
    }); });
};
function Authorization(authorization_code, ACCESS_TOKEN, appid, root) {
    var _this = this;
    Log("\u6388\u6743\u5F00\u59CB\uFF0Cauthorization_code: " + authorization_code);
    return new Promise(function (resolve) {
        superagent_1["default"].post("https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=" + ACCESS_TOKEN)
            .send({
            component_appid: appid,
            authorization_code: authorization_code
        })
            .end(function (err, res) { return __awaiter(_this, void 0, void 0, function () {
            var AUTHORIZATION_INFO, authorizer_access_token, refresh_authorizer_refresh_token, platFormInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!res) {
                            return [2 /*return*/];
                        }
                        if (res.body.hasOwnProperty('errcode')) {
                            Log("\u65E0\u6548\u7684authorization_code\uFF1A" + ACCESS_TOKEN);
                            Log("\u672C\u6B21\u6388\u6743\u5931\u8D25");
                            return [2 /*return*/];
                        }
                        AUTHORIZATION_INFO = res.body.authorization_info;
                        authorizer_access_token = AUTHORIZATION_INFO.authorizer_access_token;
                        refresh_authorizer_refresh_token = AUTHORIZATION_INFO.authorizer_refresh_token;
                        Log("\u83B7\u53D6\u6210\u529F\uFF01\r\nauthorizer_access_token\uFF1A" + authorizer_access_token + "\r\nrefresh_authorizer_refresh_token\uFF1A" + refresh_authorizer_refresh_token);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                superagent_1["default"].post("https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info?component_access_token=" + ACCESS_TOKEN)
                                    .send({
                                    component_appid: appid,
                                    authorizer_appid: AUTHORIZATION_INFO.authorizer_appid
                                })
                                    .then(function (err) {
                                    if (!err) {
                                        return;
                                    }
                                    resolve(err.body.authorizer_info);
                                });
                            })];
                    case 1:
                        platFormInfo = _a.sent();
                        Log(platFormInfo.nick_name + "\u7B2C\u4E09\u65B9\u6388\u6743\u5B8C\u6210\uFF0C\u5C06\u51ED\u501Frefresh_authorizer_refresh_token\uFF0C\u6BCF\u4E00\u4E2A\u5C0F\u65F6\u5237\u65B0\u4E00\u6B21authorizer_access_token");
                        // 写入&更新第三方平台的信息
                        setupPlatFormData({ AUTHORIZATION_INFO: AUTHORIZATION_INFO, authorizer_access_token: authorizer_access_token, refresh_authorizer_refresh_token: refresh_authorizer_refresh_token, platFormInfo: platFormInfo, root: root });
                        // 返回第三方平台的id
                        resolve(AUTHORIZATION_INFO.authorizer_appid);
                        return [2 /*return*/];
                }
            });
        }); });
    });
}
// todo 类型
// 写入或更新第三方平台的信息
function setupPlatFormData(_a) {
    var _b = _a === void 0 ? {} : _a, AUTHORIZATION_INFO = _b.AUTHORIZATION_INFO, authorizer_access_token = _b.authorizer_access_token, refresh_authorizer_refresh_token = _b.refresh_authorizer_refresh_token, platFormInfo = _b.platFormInfo, root = _b.root;
    var targetIndex = null;
    var thirdPlatForm = {
        appid: AUTHORIZATION_INFO.authorizer_appid,
        authorizer_access_token: authorizer_access_token,
        refresh_authorizer_refresh_token: refresh_authorizer_refresh_token,
        update: new Date().getTime(),
        create: new Date().getTime(),
        qrcode_url: platFormInfo.qrcode_url,
        name: platFormInfo.nick_name
    };
    for (var i = 0; i < SelfWeChatPlugin_1.DATA.thirdPart.length; i++) {
        var old = SelfWeChatPlugin_1.DATA.thirdPart[i];
        if (old.appid === AUTHORIZATION_INFO.authorizer_appid) {
            targetIndex = i;
            thirdPlatForm.create = old.create;
            break;
        }
    }
    if (!targetIndex) {
        SelfWeChatPlugin_1.DATA.thirdPart.push(thirdPlatForm);
    }
    else {
        SelfWeChatPlugin_1.DATA.thirdPart[targetIndex] = thirdPlatForm;
    }
    // todo 数据库保存平台的信息 与刷新token
    util_1.writeFile(root, SelfWeChatPlugin_1.DATA);
}
exports["default"] = ThirdPartWeChatPlugins;
