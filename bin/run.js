#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2))
const path = require('path')

try {
  const json = require(path.join(process.cwd(), './config.json'))

  if (
    ['appid', 'secret', 'encodingAESKey', 'token'].some((e) => {
      if (json && json.wechat && !json.wechat[e]) {
        return true
      } else if (!(json && json.wechat) && !argv[e]) {
        return true
      }
      return false
    })
  ) {
    console.error('请正确配置appid secret plugins encodingAESKey token')
    return
  }

  console.log(json)

  const server = require('../dist/node').createServer(json.wechat || argv)
  let port = argv.port || 3000

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`port ${port} is in use, trying another one...`)
      setTimeout(() => {
        server.close()
        server.listen(++port)
      }, 100)
    } else {
      console.error(e)
    }
  })

  server.on('listening', () => {
    console.log(`Running at http://localhost:${port}`)
  })

  server.listen(port)

  module.exports = server
} catch (e) {
  console.log(e)
}
