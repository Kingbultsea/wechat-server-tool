"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
function Log(from) {
    return function _Log(msg) {
        console.log(Number(chalk_1.default.blue(`${chalk_1.default.red(from)}\r\n${msg}`)));
    };
}
exports.default = Log;
