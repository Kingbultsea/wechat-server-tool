// 处理第三方平台的信息
import { Plugin } from './server';
import { DATA } from './SelfWeChatPlugin'
import { getData } from './util';
import _Log from '../util/Log'
import sendMediaDataCopy from './MessageParser/PicActivity/pickParser'

const ParsePlatFormMessagePlugins: Plugin = ({ Router, encrypt }) => {
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

        ctx.response.body = 'success'

        // todo 消息插件

        // 图片活动
        sendMediaDataCopy({ targetInfo: target, uid: FromUserName, content: result })
    })
}

export default ParsePlatFormMessagePlugins
