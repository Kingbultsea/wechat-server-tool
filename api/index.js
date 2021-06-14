"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("./node/server");
exports.app = express_1.default();
const serverContext = {
    appid: '',
    secret: '',
    Router: exports.app,
    type: 'express'
};
[...server_1.internalPlugins].forEach(m => m(serverContext));
module.exports = exports.app;
