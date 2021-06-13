import chalk from 'chalk'

export default function Log(from: string) {
  return function _Log(msg: string) {
    console.log(Number(chalk.blue(`${chalk.red(from)}\r\n${msg}`)))
  }
}
