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
var SelfWeChatPlugin_1 = require("./SelfWeChatPlugin");
var util_1 = require("../util");
var Log_1 = require("@util/Log");
// 需插件引入
var Avatar_1 = require("../Activity/Avatar");
var ParsePlatFormMessagePlugins = function (_a) {
    var Router = _a.Router, encrypt = _a.encrypt, root = _a.root;
    // 监听第三方平台信息
    Router.post("/wechat_open_platform/:id/message", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var platFormId, target, i, _target, result, Content, FromUserName, Log;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    platFormId = ctx.params.id;
                    target = {};
                    for (i = 0; i < SelfWeChatPlugin_1.DATA.thirdPart.length; i++) {
                        _target = SelfWeChatPlugin_1.DATA.thirdPart[i];
                        if (_target.appid === platFormId) {
                            target = _target;
                            break;
                        }
                    }
                    return [4 /*yield*/, util_1.getData(ctx, encrypt)];
                case 1:
                    result = (_a.sent()).result;
                    Content = (/<Content\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/Content>/gm.exec(result) || [])[1];
                    FromUserName = (/<FromUserName\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/FromUserName>/gm.exec(result) || [])[1];
                    Log = Log_1["default"]("\u6536\u5230\u6765\u81EA" + target.name + "(" + platFormId + ")\u7684\u6D88\u606F\uFF1A");
                    Log(Content);
                    Log(result);
                    ctx.response.body = 'success';
                    // todo 消息插件
                    if ((target.appid === 'wx7630866bd98a50de' || target.appid === 'wx0ea308250417bd30') && ['百年', '100年', '头像', '我要头像', '党旗', '建党'].includes(Content)) {
                        // 图片活动
                        Avatar_1["default"]({ targetInfo: target, uid: FromUserName, content: Content, root: root, frameName: ['1', '2', '3', '6', '7', '8', '10'], dir: 'sanwei' });
                        return [2 /*return*/];
                    }
                    else if ((target.appid === 'wx85df74b62aad79ed' || target.appid === 'wx0ea308250417bd30') && ['七一', '建党', '百年风华', '建党百年', '七一建党', '建党100周年', '71'].includes(Content)) {
                        // 图片活动
                        Avatar_1["default"]({ targetInfo: target, uid: FromUserName, content: Content, root: root, frameName: ['xs1', 'xs2', 'xs3', 'xs4'], dir: 'xuesong' });
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
            }
        });
    }); });
};
exports["default"] = ParsePlatFormMessagePlugins;
