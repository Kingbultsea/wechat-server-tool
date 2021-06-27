import { Plugin } from './server'
import _Log from '../util/Log'
import SuperAgent from 'superagent'
import { writeFile } from './util';
import { getPostData } from './util'
import DATA from "../../DATA.json"
export { DATA }

const Log = _Log('Message from 自身平台：')

export let EnctypeTicket = DATA && DATA.self && DATA.self.Encrypt
Log(`读取本地DATA文件，获取EnctypeTicket: ${EnctypeTicket}`)

// 微信第三方自身授权
const SelfWeChatPlugin: Plugin = ({  app, Router, root, encrypt }) => {
  if (app) {
    app.use(async (ctx, next) => {})
  }

  // 每10分钟会有请求进来
  Router.post('/wechat_open_platform/auth/callback', async (ctx: any, res: any) => {
    const bodyXML: string = await getPostData(ctx)

    let match: RegExpExecArray | null = null
    if (match = /<Encrypt\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/Encrypt>/gm.exec(bodyXML)) {
      EnctypeTicket = encrypt.decode(match[1])
      console.log(EnctypeTicket)
      EnctypeTicket = /<ComponentVerifyTicket\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/ComponentVerifyTicket>/gm.exec(EnctypeTicket)![1]

      // update
      // todo 抓获setter
      DATA.self.Encrypt = EnctypeTicket
      writeFile(root, DATA)

      Log(`微信端接收EnctypeTicket：${EnctypeTicket}`)
      ctx.response.body = 'success'
    } else {
      Log(`微信端接收EnctypeTicket异常: ${bodyXML}`)
    }
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

  console.log(params)

  return new Promise((resolve) => {
    // 这个方法怎么不是返回promise?
    // todo 改写为request
    SuperAgent.post(
      `https://api.weixin.qq.com/cgi-bin/component/api_component_token`
    )
      .send(params)
      .end((err, res) => {
        console.log(res.body)
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
  return new Promise((resolve) => {
    const _URL = `https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=${access_token}`
    const _Params = {
      component_appid: appid
    }
    return SuperAgent.post(_URL)
        .send(_Params)
        .end((err, res) => {
          const code: string = res.body.pre_auth_code
          Log(`获取预授权码: ${code}`)
          resolve(code)
          return code
        })
  })
}

export default SelfWeChatPlugin
