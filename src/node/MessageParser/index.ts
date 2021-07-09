import SuperAgent from 'superagent';
import { userInfoCache } from '../server';

// 发送媒体信息给用户
export function sendMediaContent(toUser: any, mediaId: any, serveAccessToken: any, type: any) { // type voice video image
    return new Promise((resolve) => {
        const serviceData = {
            'touser': toUser,
            'msgtype': type,
            [type]:
                {
                    'media_id': mediaId
                }
        }
        SuperAgent.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${serveAccessToken}`).send(serviceData).end(() => {
            resolve(null)
        })
    })
}

// 获取用户信息
export async function getUserInfo({ serveAccessToken, uid, platFormName }: {serveAccessToken: string, uid: string, platFormName: string}): Promise<{ name: string, picUrl: string } | undefined> {
    return new Promise((resolve) => {
        let cache = userInfoCache.get(uid)
        if (cache) {
            resolve(cache)
            return
        }
        SuperAgent.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${serveAccessToken}&openid=${uid}&lang=zh_CN`).end((err, res) => {
            if (!res) {
                console.log('获取用户信息没有响应')
                return
            }
            if (res.body) {
                const data = { name: res.body.nickname, picUrl: res.body.headimgurl, openid: res.body.openid, sex: res.body.sex, all: res.body }
                if (res.body.openid) {
                    userInfoCache.set(res.body.openid, data)
                }
                resolve(data)
                return
            }
            resolve(undefined)
        })
    })
}
