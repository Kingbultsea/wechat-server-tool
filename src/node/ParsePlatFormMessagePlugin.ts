// 处理第三方平台的信息
import { Plugin } from './server';
import { DATA } from './SelfWeChatPlugin'
import { getData } from './util';
import _Log from '../util/Log'
import sendMediaDataCopy from './MessageParser/PicActivity/pickParser'

const ParsePlatFormMessagePlugins: Plugin = ({ Router, encrypt, root }) => {
    // 监听第三方平台信息
    Router.post(`/wechat_open_platform/:id/message`, async (ctx) => {
        const platFormId = ctx.params.id
        let target: any = {}

        for (let i = 0; i < DATA.thirdPart.length; i++) {
            const _target = DATA.thirdPart[i]
            if (_target.appid === platFormId) {
                target = _target
                break
            }
        }

        const { result } = await getData(ctx, encrypt)

        const Content = (/<Content\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/Content>/gm.exec(result) || [])![1]
        const FromUserName = (/<FromUserName\b[^>]*>\<\!\[CDATA\[([\s\S]*?)\]\]\><\/FromUserName>/gm.exec(result) || [])![1]

        const Log = _Log(`收到来自${target.name}(${platFormId})的消息：`)

        Log(Content)
        Log(result)

        ctx.response.body = 'success'

        // todo 消息插件
        if ((target.appid === 'wx7630866bd98a50de' || target.appid === 'wx0ea308250417bd30') && ['百年', '100年', '头像', '我要头像', '党旗', '建党'].includes(Content)) {
            // 图片活动
            sendMediaDataCopy({ targetInfo: target, uid: FromUserName, content: Content, root, frameName: ['1', '2', '4', '5', '6','7','8', '10'], dir: 'sanwei' })
            return
        } else if ((target.appid === 'wx85df74b62aad79ed' || target.appid === 'wx0ea308250417bd30') && ['七一', '建党', '百年风华', '建党百年', '七一建党', '建党100周年', '71'].includes(Content)) {
            // 图片活动
            sendMediaDataCopy({ targetInfo: target, uid: FromUserName, content: Content, root, frameName: ['xs1', 'xs2', 'xs3', 'xs4'], dir: 'xuesong' })
            return
        }
    })
}

export default ParsePlatFormMessagePlugins
