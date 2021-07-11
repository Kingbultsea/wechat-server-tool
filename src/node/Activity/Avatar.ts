// @ts-ignore
import { createCanvas, loadImage } from 'canvas'
import { randomString } from '../util';
// @ts-ignore
import request from 'request'
import { getUserInfo, sendMediaContent } from '../MessageParser'

const fs = require('fs')
const path = require("path")

// 边框贴图渲染
export async function parseBlockTypeAvatar({ root, frameName, userPicUrl = '', dir }: { root?: any, frameName?: any, userPicUrl?: string, dir?: string } = {}) {
    const width = 512
    const height = 512
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // 绘制头像
    await loadImage(userPicUrl.replace(/132$/, '0')).then((image: any) => {
        ctx.drawImage(image, 0, 0, width, height)
    })

    const data = fs.readFileSync(path.join(root, `./assets/avatar/${dir}/` + frameName))
    // // 绘制叠加的框框
    await loadImage(data).then((image: any) => {
        ctx.drawImage(image, 0, 0, width, height)
    })

    // todo 不要使用写进本地文件的方式
    const promise = new Promise((resolve) => {
        const hash = randomString(6)
        let done: boolean = false
        setTimeout(() => {
            if (!done) {
                resolve(undefined)
            }
        }, 5000)

        // @ts-ignore
        fs.writeFile(path.join(root, `./assets/avatar/${hash}.png`), canvas.toBuffer('image/jpeg', { quality: 1 }), (err: any) => {
            done = true
            if (err) {
                console.log(err)
                resolve(undefined)
                return
            }
            resolve(path.join(root, `./assets/avatar/${hash}.png`))
        })
    }).catch((e) => {
        console.log(e)
    })

    return promise
}

async function avatarPlugins({ targetInfo, uid, frameName, root, dir, index = 0 }: any = {}) {
    console.log('图片渲染活动')
    let formData = {
        my_field: 'my_value',
        my_file:  ''
    }

    // 获取用户信息头像
    const userInfo = await getUserInfo({ serveAccessToken: targetInfo.authorizer_access_token, uid, platFormName: targetInfo.name  })

    console.log(userInfo)

    let resultPath: any = ''
    if (userInfo && userInfo.picUrl) {
        console.log('userInfo')
        resultPath = await parseBlockTypeAvatar({ root, frameName: frameName[index] + '.png', userPicUrl: (userInfo || {}).picUrl, dir  })
        if (resultPath) {
            formData.my_file =  fs.createReadStream(resultPath)
        } else {
            console.log('没有用户信息，不进行头像渲染')
            return
        }
    }

    if (global.__TEST__) {
        // 测试模式下 不需要上传图片并发送给用户
        return ''
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

        if (JSON.parse(body).media_id) {
            // 发送消息给用户
            sendMediaContent(uid, JSON.parse(body).media_id, targetInfo.authorizer_access_token, 'image')
            if (frameName.length > index + 1) {
                avatarPlugins({ userInfo, formData, targetInfo, uid, frameName, index: index + 1, root, dir })
            }
        }
    })
}

export default avatarPlugins
