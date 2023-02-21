import _axios from 'axios'

const axios = _axios.create()

const execa = require('execa')
const path = require('path')

const projectDir = path.join(__dirname, 'project')
let server

describe('hmr', () => {
    test('图片测试', () => {
        const activityFlow = require('../dist/node/Activity/Avatar.js').default
        activityFlow({ targetInfo: {}, uid: '123', content: '123', root: process.cwd(), frameName: ['xs1'], dir: 'xuesong' })
    })

    test('消息hmr测试', async () => {
        const port = 3007
        server = execa(path.resolve(__dirname, '../bin/run.js'), ['--port', port, '--test'], {
            cwd: projectDir
        })
        axios.defaults.baseURL = `http://localhost:${port}`

        // 等待服务运行
        await new Promise<void>((resolve) => {
            server.stdout.on('data', (data) => {
                if (data.toString().match('Running')) {
                    resolve()
                }
            })
        })

        // 消息回调测试
        await axios.post('/wechat_open_platform/wx0ea308250417bd30/message', `<xml>
    <ToUserName><![CDATA[gh_ac3c63ec5284]]></ToUserName>
    <Encrypt><![CDATA[4gP/XFPY16kuQIE/L2D3z6uLupytXBsXsCbtz4+yviSjaPWjD84M5pva7dTJR82VLlJW+60arZLdkk7Z1vTXWP0YpGAS63Tjx1e/ZWVQo1O+9upduI2brsAE9cXUdHAFKHE/pwZhO3pv3ZuhLk4DDnFt3wjCPs0lxYnleC/hizhclMWPwBoVkOQ
P7ecf78oMa9e22u8dv6DNyAsh4oUz304Mh53I4ZgtwDBSq9NbRx+l/MY6rT2zIKJeFBInFJ9Q8Y3zT4k0V9V0v5YCrqbKuQ8M32PH8YyO3a/fCbNoeuQbID/Ds/f+pL/k0adidfc1U44IVrfM7vGmls1072+jil/1pF+m2iDIqvfA2RNDMLG9au53sb1uQ0biiAz7JISJCpUB
6RVQ6bHomHxNztDwkkqjNAt4aoqSNe+g/Iy5y0k=]]></Encrypt>
</xml>`, { headers: { 'Content-Type': 'text/xml' } }).then((res) => {
    expect(res.data).toEqual('success')
        })
    })
})
