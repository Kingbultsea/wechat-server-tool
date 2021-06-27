import request from 'request'
import SuperAgent from 'superagent'
const path = require('path')
const fs = require('fs')

async function sendMediaDataCopy ({ targetInfo, uid, content }: any = {}) {
    if (!['请给我一张头像'].indexOf(content)) {
        return
    }

    // todo 用户繁忙设置
    return new Promise((resolve) => {
        let formData = {
            my_field: 'my_value',
            my_file:  fs.createReadStream(path.join(process.cwd(), `./test.jpg`))
        }

        // 上传图片 并发送
        request.post({url:`https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${targetInfo.authorizer_access_token}&type=image`, formData: formData}, async function(err: any, httpResponse: any, body: any) {
            if (err) {
                return console.error('upload failed:', err)
            }
            sendMediaContent(uid, JSON.parse(body).media_id, targetInfo.authorizer_access_token, 'image')
            resolve(null)
        })
    })
}

function sendMediaContent(toUser: any, mediaId: any, serveAccessToken: any, type: any) { // type voice video image
    const serviceData = {
        'touser': toUser,
        'msgtype': type,
        [type]:
            {
                'media_id': mediaId
            }
    }
    SuperAgent.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${serveAccessToken}`).send(serviceData).end(() => {
    })
}

export default sendMediaDataCopy
