import { Plugin } from './server'
import _Log from '../util/Log'
import SuperAgent from 'superagent'
// import { app } from '@api/index.ts'

const Log = _Log('Message from 自身平台：')

export let EnctypeTicket = ''

// 微信第三方自身授权
const SelfWeChatPlugin: Plugin = ({  app, Router, type }) => {
  if (app) {
    app.use(async (ctx, next) => {})
  }

  // 每10分钟会有请求进来
  Router.post('/wechat_open_platform/auth/callback', async (ctx: any, res: any) => {
    console.log(ctx.request)
    // @ts-ignore
    EnctypeTicket = ctx.request.body.xml.Encrypt[0]
    Log(`微信端接收EnctypeTicket：${EnctypeTicket}`)
  })
}

// 获取自身平台的令牌
export function getComponentAccessToken({
  appid,
  secret,
  enctypeTicket
}: Record<string, string> = {}): Promise<string> {
  const params = {
    component_appid: appid,
    component_appsecret: secret,
    component_verify_ticket: enctypeTicket
  }

  return new Promise((resolve) => {
    // 这个方法怎么不是返回promise?
    // todo 改写为request
    SuperAgent.post(
      `https://api.weixin.qq.com/cgi-bin/component/api_component_token`
    )
      .send(params)
      .end((err, res) => {
        Log(`获取令牌access_token:${res.body.component_access_token}`)
        resolve(res.body.component_access_token)
      })
  })
}

// 获取预授权码
// https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/pre_auth_code.html
export async function getPreCode({
  appid,
  access_token
}: Record<string, string> = {}) {
  const _URL = `https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=${access_token}`
  const _Params = {
    component_appid: appid
  }
  return SuperAgent.post(_URL)
    .send(_Params)
    .end((err, res) => {
      const code: string = res.body.pre_auth_code
      Log(`获取预授权码: ${code}`)
      return code
    })
}

export default SelfWeChatPlugin
