// @ts-ignore
import request from 'request'
import SuperAgent from 'superagent'
import { parseBlockTypeAvatar } from '../../Activity/Avatar'
import LRUCache from 'lru-cache'

interface UserInfoCache  {
    name: string,
    picUrl: string,
    openid: string,
    sex: string,
    all: any
}

export const userInfoCache = new LRUCache<string, UserInfoCache>({
    max: 65535
})

// const path = require('path')
const fs = require('fs')

async function sendMediaDataCopy({ targetInfo, uid, root, frameName = [], dir }: any = {}) {
    // todo 用户繁忙设置
    return new Promise(async (resolve) => {
        let formData = {
            my_field: 'my_value',
            my_file:  '' // fs.createReadStream(path.join(process.cwd(), `./test.jpg`))
        }

        // 获取用户信息头像
        const userInfo = await getUserInfo({ serveAccessToken: targetInfo.authorizer_access_token, uid, platFormName: targetInfo.name  })
        activityFlow({ userInfo, formData, targetInfo, uid, resolve, frameName, index: 0, root, dir })
    })
}

async function activityFlow({ userInfo, formData, targetInfo, uid, resolve, frameName, index = 0, root, dir }: any = {}) {
    let resultPath: any = ''
    if (userInfo && userInfo.picUrl) {
        resultPath = await parseBlockTypeAvatar({ root, frameName: frameName[index] + '.png', userPicUrl: (userInfo || {}).picUrl, dir  })
        if (resultPath) {
            formData.my_file =  fs.createReadStream(resultPath)
        } else {
            console.log('没有用户信息，不进行头像渲染')
            return
        }
    }

    // 上传图片 并发送
    request.post({url:`https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${targetInfo.authorizer_access_token}&type=image`, formData: formData}, async function(err: any, httpResponse: any, body: any) {
        // 删除文件 免得占用内存
        if (resultPath) {
            fs.unlink(resultPath, function(err: any){
                if(err){
                    throw err;
                }
                console.log('文件删除成功！');
            })
        }

        if (err) {
            return console.error('upload failed: ', err)
        }

        console.log(body)

        if (JSON.parse(body).media_id) {
            // 发送消息给用户
            sendMediaContent(uid, JSON.parse(body).media_id, targetInfo.authorizer_access_token, 'image')
            if (frameName.length > index + 1) {
                activityFlow({ userInfo, formData, targetInfo, uid, resolve, frameName, index: index + 1, root, dir })
            }
        }

        resolve(null)
    })
}

// 发送媒体信息给用户
function sendMediaContent(toUser: any, mediaId: any, serveAccessToken: any, type: any) { // type voice video image
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
    console.log(serveAccessToken, uid, platFormName)
    return new Promise((resolve) => {
        let cache = userInfoCache.get(uid)
        if (cache) {
            resolve(cache)
            return
        }
        SuperAgent.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${serveAccessToken}&openid=${uid}&lang=zh_CN`).end((err, res) => {
            if (!res) {
                console.log('获取用户信息没有相应')
                return
            }
            if (res.body) {
                console.log(`获取用户信息(${platFormName})`)
                console.log(res.body)
                const data = { name: res.body.nickname, picUrl: res.body.headimgurl, openid: res.body.openid, sex: res.body.sex, all: res.body }
                if (res.body.openid) {
                    // todo 怕传的是指引
                    userInfoCache.set(res.body.openid, data)
                }
                resolve(data)
                return
            }
            resolve(undefined)
        })
    })
}

export default sendMediaDataCopy
