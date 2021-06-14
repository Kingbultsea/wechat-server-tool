import _app from 'express'
import {internalPlugins, PluginContext } from '../node/server'

export const app = _app()

const serverContext: PluginContext = {
    appid: '',
    secret: '',
    Router: app,
    type: 'express'
}

;[...internalPlugins].forEach(m => m(serverContext))

module.exports = app
