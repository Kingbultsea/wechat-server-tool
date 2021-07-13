#!/usr/bin/env node
const fs = require('fs').promises
const argv = require('minimist')(process.argv.slice(2))
const path = require('path')

try {
  // todo 创建模板
  if (process.argv.includes('create')) {
    createTemp()
  } else {
    let json

    try {
      json = require(path.join(process.cwd(), './config.json'))
    } catch (e) {
      console.log('请配置config.json文件')
      return
    }

    if (argv.test) {
      global.__TEST__ = true
    }

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

    const config = json.wechat || argv

    global.__config__ = config

    try {
      // 磁盘数据
      config.DATA = require(path.join(process.cwd(), json.data))
    } catch (e) {
      // 无则创建
      if (!config.DATA) {
        const temp = {
          self: {
            Encrypt: ''
          },
          thirdPart: []
        }

        config.DATA = temp

        fs.writeFile(
          path.join(process.cwd(), path.relative(process.cwd(), json.data)),
          JSON.stringify(temp)
        )
      }
    }

    const server = require('../dist/node').createServer(config)

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
  }
} catch (e) {
  console.log(e)
}

async function createTemp() {
  const projectDir = path.join(__dirname, '../project')
  const tempDir = path.join(process.cwd(), 'temp')

  await circleCopy(projectDir, tempDir)
  console.log('模板创建成功')
}

async function circleCopy(projectDir, tempDir) {
  for (const file of await fs.readdir(projectDir)) {
    if (!file.toString().includes('.')) {
      await circleCopy(path.join(projectDir, file), tempDir)
    } else {
      console.log(`创建${path.join(tempDir, file)}`)
      await fs.copyFile(
        path.join(projectDir, file),
        path.join(tempDir, file)
      )
    }
  }
}

