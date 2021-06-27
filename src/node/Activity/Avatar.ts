import { createCanvas, loadImage } from 'canvas'
import { promises as fs } from 'fs'
import { randomString } from '../util';

const path = require("path")


// 边框贴图渲染活动
export async function parseBlockTypeAvatar({ root, frameName, userPicUrl = '' }: { root?: any, frameName?: any, userPicUrl?: string } = {}) {
    const width = 1024
    const height = 1024
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // 绘制头像
    await loadImage(userPicUrl.replace(/132$/, '0')).then((image) => {
        ctx.drawImage(image, 0, 0, width, height)
    })

    // 绘制叠加的框框
    await loadImage(path.join(root, './assets/avatar/xuesong/' + frameName)).then((image) => {
        ctx.drawImage(image, 0, 0, width, height)
    })

    // todo 不要使用写进本地文件的方式
    return new Promise((resolve) => {
        const hash = randomString(6)
        // @ts-ignore
        fs.writeFile(path.join(root, `./assets/temp/${hash}.png`), canvas.toBuffer('image/jpeg', { quality: 1 }), (err: any) => {
            if (err) {
                console.log(err)
                return
            }
            resolve(path.join(root, `./assets/temp/${hash}.png`))
        })
    })
}
