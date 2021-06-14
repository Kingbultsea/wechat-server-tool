import chalk from 'chalk';
export default function Log(from) {
    return function _Log(msg) {
        console.log(chalk.blue(`${chalk.red(from)}\r\n${msg}`));
    };
}
export function convertPlugins(_ctx, res, type) {
    let ctx = {};
    if (type === 'express') {
        ctx.request = ctx;
        ctx.response = res;
    }
    else {
        return _ctx;
    }
    return ctx;
}
