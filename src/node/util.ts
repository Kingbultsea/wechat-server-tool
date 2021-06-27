import { promises as fs } from 'fs'
const path = require('path')

const getPostData = (ctx: any): Promise<string> => {
    return new Promise(function (resolve, reject) {
        try {
            let str = ''
            ctx.req.on('data', function (data: any) {
                str += data;
            })
            ctx.req.on('end', function () {
                resolve(str)
            })
        }catch (e) {
            reject(e)
        }
    })
}

const writeFile = (ROOT: string = process.cwd(), data: Record<any, any>) => {
    let dataJSON = JSON.stringify(data)

    fs.writeFile(
        path.join(ROOT, 'DATA.json'),
        dataJSON
    )
}

export { getPostData, writeFile }
