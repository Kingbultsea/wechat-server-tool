import SuperAgent from 'superagent'
import _Log from '../util/Log'
import { Plugin } from './server'
import {
  EnctypeTicket,
  getComponentAccessToken,
  getPreCode,
  DATA
} from './SelfWeChatPlugin'
import { writeFile } from './util';

const Log = _Log('Message from 第三方：')

const ThirdPartWeChatPlugins: Plugin = ({ appid, secret, Router, root }) => {
  let ACCESS_TOKEN = ''

  // step1 发送第三方的预授权码
  Router.get('/wechat_open_platform/preauthcode', async (ctx: any, res: any) => {
    if (!EnctypeTicket) {
      Log(`EnctypeTicket(${EnctypeTicket})错误，发送预授权码失败`)
      ctx.response.body = 'error'
      return
    }

    ACCESS_TOKEN = await getComponentAccessToken({
      appid,
      secret,
      enctypeTicket: EnctypeTicket
    })
    const code = await getPreCode({ access_token: ACCESS_TOKEN, appid })
    ctx.response.body = code
  })

  // step2 接收从前端页面跳转发来的authorization_code
  Router.get(`/wechat_open_platform/submitac`, async (ctx: any, res: any) => {

    if (!ACCESS_TOKEN) {
      Log(
        `ACCESS_TOKEN(${ACCESS_TOKEN})令牌为空，需要获取自身平台的令牌，才可以进行授权。`
      )
      ctx.response.body = 'error'
      return
    }

    Authorization(ctx.query.ac as string, ACCESS_TOKEN, appid, root!)
    ctx.response.body = 'success'
  })
}

function Authorization(
  authorization_code: string,
  ACCESS_TOKEN: string,
  appid: string,
  root: string
): Promise<string> {
  Log(`授权开始，authorization_code: ${authorization_code}`)

  return new Promise((resolve) => {
    SuperAgent.post(
        `https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=${ACCESS_TOKEN}`
    )
        .send({
          component_appid: appid,
          authorization_code: authorization_code
        })
        .end(async (err, res) => {
          if (res.body.hasOwnProperty('errcode')) {
            Log(`无效的authorization_code：${ACCESS_TOKEN}`)
            Log(`本次授权失败`)
            return
          }

          const AUTHORIZATION_INFO = res.body.authorization_info

          let authorizer_access_token = AUTHORIZATION_INFO.authorizer_access_token
          let refresh_authorizer_refresh_token =
              AUTHORIZATION_INFO.authorizer_refresh_token

          Log(
              `获取成功！\r\nauthorizer_access_token：${authorizer_access_token}\r\nrefresh_authorizer_refresh_token：${refresh_authorizer_refresh_token}`
          )

          // 获取第三方平台的信息
          const platFormInfo: any = await new Promise((resolve) => {
            SuperAgent.post(
                `https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info?component_access_token=${ACCESS_TOKEN}`
            )
                .send({
                  component_appid: appid,
                  authorizer_appid: AUTHORIZATION_INFO.authorizer_appid
                })
                .then((err) => {
                  resolve(err.body.authorizer_info)
                })
          })

          Log(
              `${platFormInfo.nick_name}第三方授权完成，将凭借refresh_authorizer_refresh_token，每一个小时刷新一次authorizer_access_token`
          )

          // 写入&更新第三方平台的信息
          setupPlatFormData({ AUTHORIZATION_INFO, authorizer_access_token, refresh_authorizer_refresh_token, platFormInfo, root })

          // 返回第三方平台的id
          resolve(AUTHORIZATION_INFO.authorizer_appid)
        })
  })
}

// todo 类型
// 写入或更新第三方平台的信息
function setupPlatFormData({ AUTHORIZATION_INFO, authorizer_access_token, refresh_authorizer_refresh_token, platFormInfo, root }: any = {}) {
  let targetIndex: null | number = null
  const thirdPlatForm = {
    appid: AUTHORIZATION_INFO.authorizer_appid,
    authorizer_access_token,
    refresh_authorizer_refresh_token,
    update: new Date().getTime(),
    create: new Date().getTime(),
    qrcode_url: platFormInfo.qrcode_url,
    name: platFormInfo.nick_name
  }

  for (let i = 0; i < DATA.thirdPart.length; i++) {
    const old = DATA.thirdPart[i]
    if (old.appid === AUTHORIZATION_INFO.authorizer_appid) {
      targetIndex = i
      thirdPlatForm.create = old.create
      break
    }
  }

  if (!targetIndex) {
    DATA.thirdPart.push(thirdPlatForm)
  }

  // todo 数据库保存平台的信息 与刷新token
  writeFile(root, DATA)
}

export default ThirdPartWeChatPlugins
