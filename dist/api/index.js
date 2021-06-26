"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../node/server");
function convert(app) {
    const serverContext = {
        appid: '',
        secret: '',
        Router: app,
        type: 'express'
    };
    [...server_1.internalPlugins].forEach(m => m(serverContext));
    return app;
}
exports.default = convert;
