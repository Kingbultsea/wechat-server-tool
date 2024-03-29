<p align="center">
<a href="https://vuejs.org" target="_blank" rel="noopener noreferrer"><img width="300" src="https://res.psy-1.com/FvTT425ug8QRGSj06vjbfKXjwpUe">
</a></p>

<p align="center">
  <a href="https://www.npmjs.com/package/wx-serve"><img src="https://img.shields.io/npm/v/wx-serve.svg" alt=""></a>
  <a href="https://github.com/Kingbultsea/wechat-server-tool/actions/workflows/node.js.yml"><img src="https://github.com/Kingbultsea/wechat-server-tool/actions/workflows/node.js.yml/badge.svg?branch=npm" alt=""></a>
</p>

**wx-serve** 是一个基于微信第三方公众号而搭建的框架，目的在于解决快速开发与部署微信服务，让开发者可以专注于插件的开发之中。

![](https://res.psy-1.com/Fvhwh76XUZjkdieubH-3ptkF9woy)

#### 和我们平时的微信第三方搭建方式有什么区别?
1.通过npm命令行，开箱即用，无需额外代码

2.监听业务代码，实行热更新功能

3.线上服务启动后，只需要开发者关注业务代码本身，功能持续运行

4.插件式开发（希望开发者的插件可以共享起来）

5.记录微信数据的文件，可以随时通过磁盘文件的方式同步，这意味着线上环境的数据可以与测试环境的数据进行同步，不用担心过期丢失刷新的问题。

#### 目前谁在用？
![](https://res.psy-1.com/FiEYEGfPNPXh0EiQ7hS2FepPVg6l)
![](https://res.psy-1.com/FvyvUnfID9IQyl0-dbtGGEv7-P2d)

刚拿出来共享，还需要完善的API还有很多。


## Installation
```shell script
npm install wx-serve --save
```

## Usgae
在使用该服务前，请先在微信开放平台上进行注册

https://open.weixin.qq.com/

注册成功后，配置参数，在域名上运行wx-serve即可，可以自动监听入口依赖文件的改变。

（注意不会监听```config.json```的变动，如需改变，请重新开启服务）

**step1创建模板**:
```shell script
wx-serve create --appid yourAppid --url yourUrl
```

**step2修改config**: 

创建模板后，修改```config.json```，根据微信配置输入appid，secret，encodingAESKey，token。

**step3修改txt验证**: 

修改文件```自行更改文件名称与内容验证微信```(该文件用于微信域名验证)

**step4开启服务**:
```shell script
wx-serve --port 3000
```

微信公众号拥有者扫码打开localhost:3000，点击按钮进行授权。

微信公众号窗口发送任意信息，可以获得一张图片，服务运行成功。

## config.json
```json
{
  "wechat": {
    "appid": "微信平台提供",
    "secret": "微信平台提供",
    "encodingAESKey": "微信平台提供",
    "token": "微信平台提供"
  },
  "data": "./DATA.json",
  "input": "./index.js"
}
```

```wechat```: 微信配置提供

```data```: 储存运行状态信息的文件

```input```: 插件入口

## 插件入口参数
```typescript
function input({ target, Content, FromUserName, root, rawContent }) {
}
```

```target```: 第三方平台信息

```Content```: 用户发送的消息内容

```FromUserName```: 用户平台id

```root```: 命令行运行路径

```rawContent```: 用户发送的消息内容XML

## API
### sendContent
```typescript
function sendContent(toUser: any, content: any, serveAccessToken: any, type: 'voice' | 'video' | 'image' | 'text') { // type voice video image
}
```

```toUser```: 用户平台id (入口```FromUserName```参数)

```type```: 消息类型

```content```: 内容|媒体ID

```serveAccessToken```: 目标平台的serveAccessToken（入口```target.authorizer_access_token```参数可取）


## TODO
[] 完善测试action

[√] 消息API兼容

[] 开源交友插件
