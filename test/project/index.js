const avatarPlugins = require('../../dist/node/Activity/Avatar.js').default

async function test({ target, Content, FromUserName, root }) {
  // 图片活动
  await avatarPlugins({ targetInfo: target, uid: FromUserName, content: Content, root, frameName: ['xs1'], dir: 'xuesong' })
}

module.exports = test
