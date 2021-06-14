"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPlugins = void 0;
const chalk_1 = __importDefault(require("chalk"));
function Log(from) {
    return function _Log(msg) {
        console.log(chalk_1.default.blue(`${chalk_1.default.red(from)}\r\n${msg}`));
    };
}
exports.default = Log;
function convertPlugins(_ctx, res, type) {
    let ctx = {};
    if (type === 'express') {
        ctx.request = ctx;
        ctx.response = res;
    }
    else {
        return _ctx;
    }
    return ctx;
}
exports.convertPlugins = convertPlugins;
