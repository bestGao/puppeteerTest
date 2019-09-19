## puppeteer 初体验之爬虫与 UI 自动化

1. 什么是 puppeteer
   > Puppeteer is a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol. Puppeteer runs headless by default, but can be configured to run full (non-headless) Chrome or Chromium.
   > 中文：从本质上来说，这货就是无需开启 chrome 浏览器来调用 Chrome 的功能！它将 Chromium 和 Blink 渲染引擎提供的所有现代 Web 平台的功能都带入了命令行。

> 什么是 headless chrome
> Headless Chrome is shipping in Chrome 59. It's a way to run the Chrome browser in a headless environment. Essentially, running Chrome without chrome! It brings all modern web platform features provided by Chromium and the Blink rendering engine to the command line

- 可以做什么
  生成页面的屏幕截图和 PDF。
  抓取 SPA（单页面应用程序）并生成预渲染内容（即“SSR”（服务器端渲染））。
  自动化表单提交，UI 测试，键盘输入等。
  创建最新的自动化测试环境。使用最新的 JavaScript 和浏览器功能直接在最新版本的 Chrome 中运行测试。
  捕获网站的时间线跟踪，帮助诊断性能问题。
  测试 Chrome 扩展程序
  ...

2. 什么是爬虫

   > 是一段自动获取网页内容的程序同时也是搜索引擎的重要组成部分
   > 什么是 robots 和 robots.txt 协议
   > robots.txt 是一种遵照漫游器排除标准创建的纯文本文件，由一条或多条规则组成。每条规则可禁止（或允许）特定抓取工具抓取相应网站中的指定文件路径
   > 所有机器人不可爬的页面链接/文件
   > eg: (dxy)[http://www.dxy.cn/robots.txt], (google)[https://www.google.com/robots.txt]

3. 实现爬虫
   作为一个程序员开始写代码之前一定要有信心，坚定一个信念：“万事开头难，然后中间难，结尾难”
   installation
   mkdir practice && cd practice
   npm init && npm i -save puppeteer

其实对于使用爬虫来说，流程无外乎这四步
抓取数据
数据入库
启动服务
渲染数据

4.FAQ

- 一般写爬虫的时候，是去分析 DOM 呢，还是直接去拦截接口去获取数据呢？DOM 数据不都是通过接口请求到的吗？为什么不直接去拦截接口呢?
  因为有的页面不是前后端分离开发的呀，后端通过 php jsp 等方式直接把数据渲染到 html 里面了,或者返回数据加密
- 绕过验证码 通过 cookie 登录
- 另外做法 分析数据 ，通过cookie 发请求 分析接口数据
- 思考：puppeteer 能帮助做些什么

参考文献
https://developers.google.com/web/tools/puppeteer/
[官网](https://pptr.dev/)
https://support.google.com/
[chrome 启动参数列表](https://peter.sh/experiments/chromium-command-line-switches/)
[键盘列表](https://github.com/GoogleChrome/puppeteer/blob/master/lib/USKeyboardLayout.js)

> PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org npm install puppeteer
> 国内下载 https://brickyang.github.io/2019/01/14/%E5%9B%BD%E5%86%85%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85-Puppeteer-%E7%9A%84%E6%96%B9%E6%B3%95/
> 手动下载：https://marxjiao.com/2018/08/26/puppeteer-install/
> 手动下载：https://www.google.com/chrome/canary/

> [chrome vs chromium](https://chromium.googlesource.com/chromium/src/+/master/docs/chromium_browser_vs_google_chrome.md)

知识拓展：

1. [什么是 chrome devtools protocol](https://chromedevtools.github.io/devtools-protocol/)

###### node 环境使用 ECMAScript Modules 的 import/export

[官方说明](https://nodejs.org/api/esm.html#esm_ecmascript_modules)
.js 改成 .mjs 增加启动参数"start": "node --experimental-modules app.mjs"

安装 vscode puppeteer 插件 或 typescript @type/puppeteer
问题

2. 图片点触验证码破解 (付费 超级鹰)

3. babel-node

[社区优秀 puppeteer 库](https://github.com/transitive-bullshit/awesome-puppeteer)
并不是重复造轮子啊，自己学习可以更好的理解用法

#### usage

npm start false // 有界面

[验证码破解-有接口](https://github.com/zhaipro/easy12306)
[验证码破解-页面](http://littlebigluo.qicp.net:47720/)
