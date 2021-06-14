const app = require('express')()
const convert = require('../dist/api/index')

app.get('/wechat_open_platform/preauthcode', (req, res) => {
    res.end('????')
})

module.exports = app
