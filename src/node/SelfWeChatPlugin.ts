import { Plugin } from './server'
import _Log from '../util/Log'
import SuperAgent from 'superagent'
import { writeFile, getData } from './util';

import DATA from "../../DATA.json"
export { DATA }

const Log = _Log('Message from 自身平台：')

export let EnctypeTicket = DATA && DATA.self && DATA.self.Encrypt
Log(`读取本地DATA文件，获取EnctypeTicket: ${EnctypeTicket}`)

// 微信第三方自身授权
const SelfWeChatPlugin: Plugin = ({  app, Router, root, encrypt, appid }) => {
  if (app) {
    app.use(async (ctx, next) => {})
  }

  // 每10分钟会有请求进来
  Router.post('/wechat_open_platform/auth/callback', async (ctx: any, res: any) => {
    const { result: _EnctypeTicket, bodyXML } = await getData(ctx, encrypt, 'ComponentVerifyTicket')

    if (_EnctypeTicket) {
      EnctypeTicket = _EnctypeTicket

      // todo 抓获setter
      DATA.self.Encrypt = EnctypeTicket
      writeFile(root, DATA)

      Log(`微信端接收EnctypeTicket：${EnctypeTicket}`)
      ctx.response.body = 'success'
    } else {
      Log(`微信端接收EnctypeTicket异常: ${bodyXML}`)
    }
  })

  getSelfAccessComponentToken({ encrypt, appid, root })

  refleash({ appid, root })
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

// 获取账号自身的AccessComponentToken 用于刷新
// todo也需要刷新机制
// 好像每次刷新都只有一次吧
function getSelfAccessComponentToken({ appid, encrypt, root }: any = {}) {
  const params = {
    component_appid: appid,
    component_appsecret: encrypt,
    component_verify_ticket: DATA.self.Encrypt
  }

  // todo 做刷新机制

  SuperAgent.post(`https://api.weixin.qq.com/cgi-bin/component/api_component_token`).send(params).end((err, res) => {
    Log(`获取自身access_token:${ res.body.component_access_token}`)
    DATA.self.component_access_token = res.body.component_access_token
    writeFile(root, DATA)
  })

  // 每一小时请求一次
  setTimeout(getSelfAccessComponentToken, 1000 * 60 * 60)
}

// 刷新机制
// todo 删除
function refleash({ appid, root }: any = {}) {
  DATA.thirdPart.forEach((v: any) => {
    const minTime = new Date().getTime() - parseInt(v.update)
    const time = 1000 * 60 * 110

    const params = {
      component_appid: appid,
      authorizer_appid: v.appid, // 授权方的appid
      authorizer_refresh_token: v.authorization_code // 授权方的刷新令牌
    }

    if (v.appid && (minTime <= time) ) {
      Log(`刷新${v.name}的accessToken`)
      SuperAgent.post(`https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token=${DATA.self.component_access_token}`).send(params).end(async (err, res) => {
        v.update = new Date().getTime()
        v.authorizer_access_token = res.body.authorizer_access_token
        v.refresh_authorizer_refresh_token = res.body.authorizer_refresh_token
        writeFile(root, DATA)

        // todo 刷新第三方平台的信息
      })
    }
  })

  // 1小时请求一次
  setTimeout(refleash, 1000 * 60 * 60)
}

export default SelfWeChatPlugin
