#!/usr/bin/env node
const fs = require('fs').promises
const argv = require('minimist')(process.argv.slice(2))
const path = require('path')

try {
  // todo 创建模板
  if (process.argv.includes('create')) {
    if (!argv.appid || !argv.url) {
      console.log('\x1B[31m%s\x1B[0m', '请配置appid或url参数')
      return
    }
    createTemp({ appid: argv.appid, url: argv.url })
  } else {
    let json
    //  3@CZ9RXf3-x_y_$
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

    const config = json.wechat || argv || {}

    console.log(config, argv)

    config.input = json.input

    config.data = json.data

    global.__CONFIG__ = config

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

async function createTemp({ appid, url }) {
  console.time('Done')
  const projectDir = path.join(__dirname, '../project')
  const tempDir = path.join(process.cwd(), 'temp')
  await fs.mkdir(tempDir)
  await circleCopy(projectDir, tempDir, appid, url)
  console.log(
    '\033[42;30m DONE \033[40;32m Create ' + tempDir + ' successfully\033[0m'
  )
  console.timeEnd('Done')
}

async function circleCopy(projectDir, tempDir, appid, url) {
  for (const file of await fs.readdir(projectDir)) {
    if (!file.toString().includes('.')) {
      const dir = path.join(tempDir, file)
      await fs.mkdir(dir)
      await circleCopy(path.join(projectDir, file), dir, appid, url)
    } else {
      if (/.html$/.exec(file)) {
        await rewriteIndexHtml({
          tempDir,
          file: file.toString(),
          projectDir,
          appid,
          url
        })
      } else {
        await fs.copyFile(path.join(projectDir, file), path.join(tempDir, file))
      }
    }
  }
}

async function rewriteIndexHtml({ tempDir, file, projectDir, appid, url }) {
  let source = (await fs.readFile(path.join(projectDir, file))).toString()
  source = source
    .replace('$component_appid$', appid)
    .replace('$redirect_uri$', url)
  await fs.writeFile(path.join(tempDir, file), source)
}
