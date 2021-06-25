import {internalPlugins, PluginContext } from '../node/server'

export default function convert(app: any) {
    const serverContext: PluginContext = {
            appid: '',
            secret: '',
            Router: app,
            type: 'express'
        }

    ;[...internalPlugins].forEach(m => m(serverContext))

    return app
}
