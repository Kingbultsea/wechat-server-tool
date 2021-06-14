import _app from 'express'
import {internalPlugins, PluginContext } from '@node/server'

export const app = _app()

const serverContext: PluginContext = {
    appid: '',
    secret: '',
    Router: app,
    type: 'express'
}

// 转换接口
function convert() {
   ;[...internalPlugins].forEach(m => m(serverContext))
}
convert()

module.exports = app
