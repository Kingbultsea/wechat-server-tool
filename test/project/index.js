import activityFlow from "../../src/node/Activity/Avatar";

const foo = require('./foo.js')
foo()

function test({ target, Content, FromUserName, root }) {
  if ((target.appid === 'wx7630866bd98a50de' || target.appid === 'wx0ea308250417bd30') && ['百年', '100年', '头像', '我要头像', '党旗', '建党'].includes(Content)) {
    // 图片活动
    activityFlow({ targetInfo: target, uid: FromUserName, content: Content, root, frameName: ['1', '2', '3', '6', '7','8', '10'], dir: 'sanwei' })
  } else if ((target.appid === 'wx85df74b62aad79ed' || target.appid === 'wx0ea308250417bd30') && ['七一', '建党', '百年风华', '建党百年', '七一建党', '建党100周年', '71'].includes(Content)) {
    // 图片活动
    activityFlow({ targetInfo: target, uid: FromUserName, content: Content, root, frameName: ['xs1', 'xs2', 'xs3', 'xs4'], dir: 'xuesong' })
  }
  console.log('test')
}

module.exports = test
