import _axios from 'axios'

const axios = _axios.create()

const execa = require('execa')
const path = require('path')

const projectDir = path.join(__dirname, 'project')
let server

describe('hmr', () => {
    test('消息hmr测试', async () => {
        const port = 3001
        server = execa(path.resolve(__dirname, '../bin/run.js'), {
            argv0: `--port ${port}`,
            cwd: projectDir
        })
        axios.defaults.baseURL = `http://localhost:${port}`

        // 等待服务运行
        await new Promise<void>((resolve) => {
            server.stdout.on('data', (data) => {
                console.log(data.toString())
                if (data.toString().match('Running')) {
                    resolve()
                }
            })
        })

        // 消息回调测试
        await axios.post('/wechat_open_platform/wx0ea308250417bd30/message', `<xml><ToUserName><![CDATA[gh_ac3c63ec5284]]></ToUserName>
<FromUserName><![CDATA[oxM6zwK8vqgPMOfYaxyhcqy4mCN0]]></FromUserName>
<CreateTime>1625933669</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[1]]></Content>
<MsgId>23277772677903046</MsgId>
</xml>`, { headers: { 'Content-Type': 'text/xml' } }).then((res) => {
    expect(res.data).toEqual('success')
        })
    })
})
