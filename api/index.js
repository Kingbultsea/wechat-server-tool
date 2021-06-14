const app = require('express')()
const convert = require('../dist/api/index')

app.get('/wechat_open_platform/preauthcode', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
    res.end('????')
})

module.exports = app
