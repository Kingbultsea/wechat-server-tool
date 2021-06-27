import http, { Server } from 'http'
import Koa from 'koa'
import SelfWeChatPlugin from './SelfWeChatPlugin'
import ThirdPartWeChatPlugins from './ThirdPartWeChatPlugins'
import _Router from 'koa-router'
import _BodyParser from 'koa-bodyparser'
const Encrypt = require('./Encrypt.js')
// import _xmlParser from 'koa-xml-body'
// import { app } from '@api/index'

export type Plugin = (ctx: PluginContext) => void
export const Router = new _Router()

export let ROOT = ''

export interface ServerConfig {
  root?: string
  plugins?: Plugin[]
  appid?: string
  secret?: string
}

export interface PluginContext {
  appid: string
  secret: string
  app?: Koa
  type: 'express' | 'koa'
  Router: any // typeof Router | typeof app
  root?: string
}

export const internalPlugins: Plugin[] = [SelfWeChatPlugin, ThirdPartWeChatPlugins]

export function createServer({
  root = process.cwd(),
  appid = '',
  secret = '',
  plugins = []
}: ServerConfig = {}): Server {
  ROOT = root

  const app = new Koa()

  app.use(Router.routes())
  // app.use(_xmlParser())
  app.use(_BodyParser())
  app.use(require('koa-static')(root))

  const server = http.createServer(app.callback())

  const encrypt = new Encrypt({
      appId: appid,
      encodingAESKey: 'eUbVREqK4jh9XHeYTZPHRTCzFz8PDWL2nieCZzganJv',
      token: 'kingbultsea'
  })

  ;[...plugins, ...internalPlugins].forEach((m) =>
    m({
      appid,
      secret,
      app,
      type: 'koa',
      Router,
      root
    })
  )

  return server
}
