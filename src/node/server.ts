import http, { Server } from 'http'
import Koa from 'koa'
import SelfWeChatPlugin from './plugins/SelfWeChatPlugin'
import ThirdPartWeChatPlugins from './plugins/ThirdPartWeChatPlugins'
import _Router from 'koa-router'
import _BodyParser from 'koa-bodyparser'
import Encrypt from './Encrypt'
import chokidar, { FSWatcher } from 'chokidar'
import ParsePlatFormMessagePlugins from './plugins/ParsePlatFormMessagePlugin';

import LRUCache from 'lru-cache'

export interface UserInfo  {
    name: string,
    picUrl: string,
    openid: string,
    sex: string,
    all: any
}

export const userInfoCache = new LRUCache<string, UserInfo>({
    max: 65535
})

export type Plugin = (ctx: PluginContext) => void
export const Router = new _Router()

export let ROOT = ''

export interface DataType {
    self: {
        Encrypt: string
    },
    thirdPart: {
        appid: string
        authorizer_access_token: string
        refresh_authorizer_refresh_token: string
        update: number
        create: number
        qrcode_url: string
        name: string
    }[]
}

export interface ServerConfig {
  root?: string
  plugins?: Plugin[]
  appid?: string
  secret?: string
  encodingAESKey?: string
  token?: string
    DATA: DataType
    input: string
}

export interface PluginContext {
  encrypt: any
  appid: string
  secret: string
  app?: Koa
  type: 'koa'
  Router: typeof Router
  root?: string
    watcher: FSWatcher
    DATA: DataType
    input: string
}

export const internalPlugins: Plugin[] = [
    SelfWeChatPlugin,
    ThirdPartWeChatPlugins,
    ParsePlatFormMessagePlugins
]

export function createServer({
  root = process.cwd(),
  appid = '',
  secret = '',
  plugins = [],
  encodingAESKey,
  token,
  DATA,
    input = 'index.js'
}: ServerConfig): Server {
  ROOT = root
  const app = new Koa()
  const watcher = chokidar.watch(root, {
      ignored: [/node_modules/]
  })

  app.use(Router.routes())
  app.use(_BodyParser())
  app.use(require('koa-static')(root))

  const server = http.createServer(app.callback())

  // @ts-ignore
  const encrypt = new Encrypt({
      appId: appid,
      encodingAESKey,
      token
  })

  ;[...internalPlugins, ...plugins].forEach((m) =>
    m({
      encrypt,
      appid,
      secret,
      app,
      type: 'koa',
      Router,
      root,
      watcher,
      DATA,
        input
    })
  )

  return server
}

process.on('uncaughtException', function(err){
    console.log(err)
})
