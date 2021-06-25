import http, { Server } from 'http'
import Koa from 'koa'
import SelfWeChatPlugin from './SelfWeChatPlugin'
import ThirdPartWeChatPlugins from './ThirdPartWeChatPlugins'
import _Router from 'koa-router'
import _BodyParser from 'koa-bodyparser'
// import { app } from '@api/index'

export type Plugin = (ctx: PluginContext) => void
export const Router = new _Router()

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
}

export const internalPlugins: Plugin[] = [SelfWeChatPlugin, ThirdPartWeChatPlugins]

export function createServer({
  appid = '',
  secret = '',
  plugins = []
}: ServerConfig = {}): Server {
  const app = new Koa()

  app.use(Router.routes())
  app.use(_BodyParser())
  const server = http.createServer(app.callback())

  ;[...plugins, ...internalPlugins].forEach((m) =>
    m({
      appid,
      secret,
      app,
      type: 'koa',
      Router
    })
  )

  return server
}
