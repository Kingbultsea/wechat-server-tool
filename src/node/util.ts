import { promises as fs } from 'fs'
import {EnctypeTicket} from './SelfWeChatPlugin';
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

const getData = async (ctx: any, encrypt: any, tagName?: string): Promise<{ result: any, bodyXML: any }> => {
    const bodyXML: string = await getPostData(ctx)
    let result = ''
    let match: RegExpExecArray | null = null
    if (match = /<Encrypt\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/Encrypt>/gm.exec(bodyXML)) {
        result = encrypt.decode(match[1])
        if (tagName === 'ComponentVerifyTicket') {
            result = // (eval(`/<${tagName}\\b[^>]*>\\<\\!\\[CDATA\\[([\\s\\S]*?)\\]\\]\\><\\/${tagName}>/gm`)).exec(result)![1]
                /<ComponentVerifyTicket\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/ComponentVerifyTicket>/gm.exec(EnctypeTicket)![1]
        }
    }
    return {
        result,
        bodyXML
    }
}

export { getPostData, writeFile, getData }
