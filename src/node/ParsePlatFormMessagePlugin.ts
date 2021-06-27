// 处理第三方平台的信息
import { Plugin } from './server';
import { DATA } from './SelfWeChatPlugin'
import { getData } from '@node/util';

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

        const { result, bodyXML } = await getData(ctx, encrypt)

        console.log(`收到来自${target.name}(${bodyXML})的消息：\r\n${result}`)
        ctx.response.body = 'success'

        // todo 消息插件
    })
}

export default ParsePlatFormMessagePlugins
