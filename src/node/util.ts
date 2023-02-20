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
        } catch (e) {
            reject(e)
        }
    })
}

const writeFile = (ROOT: string = process.cwd(), data: Record<any, any>) => {
    let dataJSON = JSON.stringify(data)
    console.log(ROOT, global.__CONFIG__, '写入')
    fs.writeFile(
        path.join(ROOT, global.__CONFIG__.data),
        dataJSON
    )
}

const getData = async (ctx: any, encrypt: any, tagName?: string): Promise<{ result: any, bodyXML: any }> => {
    const bodyXML: string = await getPostData(ctx)
    let result = ''
    let match: RegExpExecArray | null = null
    if (match = /<Encrypt\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/Encrypt>/gm.exec(bodyXML)) {
        result = encrypt.decode(match[1])
        if (tagName === 'ComponentVerifyTicket') {
            result = // (eval(`/<${tagName}\\b[^>]*>\\<\\!\\[CDATA\\[([\\s\\S]*?)\\]\\]\\><\\/${tagName}>/gm`)).exec(result)![1]
                (/<ComponentVerifyTicket\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/ComponentVerifyTicket>/gm.exec(result) || [])![1]
        }
    }
    return {
        result,
        bodyXML
    }
}

export function randomString(len: number): string {
    len = len || 32;
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

export { getPostData, writeFile, getData }
