<p align="center">
<a href="https://vuejs.org" target="_blank" rel="noopener noreferrer"><img width="300" src="https://res.psy-1.com/FvTT425ug8QRGSj06vjbfKXjwpUe">
</a></p>

<p align="center">
  <a href="https://www.npmjs.com/package/wx-serve"><img src="https://img.shields.io/npm/v/wx-serve.svg" alt=""></a>
  <a href="https://github.com/Kingbultsea/wechat-server-tool/actions/workflows/node.js.yml"><img src="https://github.com/Kingbultsea/wechat-server-tool/actions/workflows/node.js.yml/badge.svg?branch=npm" alt=""></a>
</p>

wx-serve是一个基于微信第三方公众号而搭建的框架，目的在于解决快速开发与部署微信服务，让开发者可以专注于插件的开发之中。

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
```shell script
wx-serve create --appid yourAppid --url yourUrl
```
创建模板，修改```config.json```，根据微信配置输入appid，secret，encodingAESKey，token。

修改文件```自行更改文件名称与内容验证微信```(该文件用于微信域名验证)

```shell script
wx-serve --port 3000
```

微信公众号拥有者扫码打开localhost:3000，点击按钮进行授权。

微信公众号窗口发送任意信息，可以获得一张图片，服务运行成功。

## API

## TODO
[] 完善测试ci
