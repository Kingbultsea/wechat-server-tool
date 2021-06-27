import request from 'request'
import SuperAgent from 'superagent'
const path = require('path')
const fs = require('fs')

async function sendMediaDataCopy (targetInfo: any, uid: any) {
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
            console.log('上传图片', JSON.parse(body).media_id)
            sendMediaContent(uid, JSON.parse(body).media_id, targetInfo.authorizer_access_token, 'image')
            // await sendTouser.sendMediaContent(openid, JSON.parse(body).media_id, token, type)
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
    SuperAgent.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${serveAccessToken}`).send(serviceData)
}

export default sendMediaDataCopy
