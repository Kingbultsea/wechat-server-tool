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
exports.getUserInfo = exports.sendMediaContent = void 0;
var superagent_1 = require("superagent");
var server_1 = require("@node/server");
// 发送媒体信息给用户
function sendMediaContent(toUser, mediaId, serveAccessToken, type) {
    return new Promise(function (resolve) {
        var _a;
        var serviceData = (_a = {
                'touser': toUser,
                'msgtype': type
            },
            _a[type] = {
                'media_id': mediaId
            },
            _a);
        superagent_1["default"].post("https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + serveAccessToken).send(serviceData).end(function () {
            resolve(null);
        });
    });
}
exports.sendMediaContent = sendMediaContent;
// 获取用户信息
function getUserInfo(_a) {
    var serveAccessToken = _a.serveAccessToken, uid = _a.uid, platFormName = _a.platFormName;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var cache = server_1.userInfoCache.get(uid);
                    if (cache) {
                        resolve(cache);
                        return;
                    }
                    superagent_1["default"].get("https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + serveAccessToken + "&openid=" + uid + "&lang=zh_CN").end(function (err, res) {
                        if (!res) {
                            console.log('获取用户信息没有相应');
                            return;
                        }
                        if (res.body) {
                            var data = { name: res.body.nickname, picUrl: res.body.headimgurl, openid: res.body.openid, sex: res.body.sex, all: res.body };
                            if (res.body.openid) {
                                server_1.userInfoCache.set(res.body.openid, data);
                            }
                            resolve(data);
                            return;
                        }
                        resolve(undefined);
                    });
                })];
        });
    });
}
exports.getUserInfo = getUserInfo;
