import http, { Server } from 'http'
import Koa from 'koa'
import SelfWeChatPlugin from './SelfWeChatPlugin'
import ThirdPartWeChatPlugins from './ThirdPartWeChatPlugins'
import _Router from 'koa-router'
import _BodyParser from 'koa-bodyparser'
export type Plugin = (ctx: PluginContext) => void
export const Router = new _Router()

export interface ServerConfig {
  root?: string
  plugins?: Plugin[]
  appid?: string
  secret?: string
}

export interface PluginContext {
  root: string
  appid: string
  secret: string
  app: Koa
  server: Server
  Router: typeof Router
}

const internalPlugins: Plugin[] = [SelfWeChatPlugin, ThirdPartWeChatPlugins]

export function createServer({
  appid = '',
  secret = '',
  root = process.cwd(),
  plugins = []
}: ServerConfig = {}): Server {
  const app = new Koa()

  app.use(Router.routes())
  app.use(_BodyParser())
  const server = http.createServer(app.callback())

  ;[...plugins, ...internalPlugins].forEach((m) =>
    m({
      root,
      appid,
      secret,
      app,
      server,
      Router
    })
  )

  return server
}
