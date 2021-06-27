import chalk from 'chalk'

export default function Log(from: string) {
  return function _Log(msg: string) {
    console.log(chalk.blue(`\r\n${chalk.red(from)}\r\n${msg}`))
  }
}



export function convertPlugins(_ctx: any, res: any, type: 'express' | 'koa') {
  let ctx: any = {}

  if (type === 'express') {
    ctx.request = ctx
    ctx.response = res
  } else {
    return _ctx
  }

  return ctx
}

export function WechatLog() {

}
