# puppeteer 初体验之爬虫与 UI 自动化

<a name="7b1Mc"></a>
### puppeteer科普
> Puppeteer is a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol. Puppeteer runs headless by default, but can be configured to run full (non-headless) Chrome or Chromium.
> 从本质上来说，这货就是无需开启 chrome 浏览器来调用 Chrome 的功能！它将 Chromium 和 Blink 渲染引擎提供的所有现代 Web 平台的功能都带入了命令行。<br />


- headless chrome
> Headless Chrome is shipping in Chrome 59. It's a way to run the Chrome browser in a headless environment. Essentially, running Chrome without chrome! It brings all modern web platform features provided by Chromium and the Blink rendering engine to the command line


- 可以做什么<br />
生成页面的屏幕截图和 PDF。<br />
抓取 SPA（单页面应用程序）并生成预渲染内容（即“SSR”（服务器端渲染））。<br />
自动化表单提交，UI 测试，键盘输入等。<br />
创建最新的自动化测试环境。使用最新的 JavaScript 和浏览器功能直接在最新版本的 Chrome 中运行测试。<br />
捕获网站的时间线跟踪，帮助诊断性能问题。<br />
测试 Chrome 扩展程序

<a name="GuE4C"></a>
### 什么是爬虫
> 爬虫是一段自动获取网页内容的程序同时也是搜索引擎的重要组成部分 

- robots.txt 协议
> robots.txt 是一种遵照爬虫排除标准创建的纯文本文件，由一条或多条规则组成。每条规则可禁止（或允许）特定抓取工具抓取相应网站中的指定文件路径
> eg: [http://www.dxy.cn/robots.txt](http://www.dxy.cn/robots.txt)
>  [https://www.google.com/robots.txt](https://www.google.com/robots.txt)

<a name="MFeiz"></a>
### 实现爬虫
作为一个程序员开始写代码之前一定要有信心，坚定一个信念：“万事开头难，然后中间难，结尾难”
<a name="qfkSC"></a>
##### installation
mkdir practice && cd practice<br />npm init && npm i -save puppeteer

- 其实对于使用爬虫来说，流程无外乎这四步

抓取数据<br />数据入库<br />启动服务<br />渲染数据<br />我们在此只是实现抓取数据。

- 项目目录

├── README.md<br />├── app.js 入口文件<br />├── assets<br />│   └── images<br />├── config.js<br />├── files 返回结果<br />│   ├── result.json<br />│   ├── tickets.png<br />│   └── verifiCode.png<br />├── package-lock.json<br />├── package.json<br />└── utils<br />   ├── buyTicket.js 买票<br />   ├── crackCode.js 破解验证码<br />   ├── index.js<br />   ├── login.js<br />   ├── saveData.js  保存数据<br />   ├── scheduleTask.js 任务队列<br />   └── sendEmail.js 发送邮件

<a name="P913R"></a>
#### FAQ

- 一般写爬虫的时候，是去分析 DOM 呢，还是直接去拦截接口去获取数据呢？DOM 数据不都是通过接口请求到的吗？为什么不直接去拦截接口呢?
> 因为有的页面不是前后端分离开发的呀，后端通过 php jsp 等方式直接把数据渲染到 html 里面了,或者返回数据是加密的

- 思考：puppeteer 能帮助做些什么

<a name="h6UxR"></a>
#### usage
> npm start false // 有界面
> npm start ipnone 5 // 设备

<a name="cG0sy"></a>
#### 思考

- 是不是可以绕过验证码 通过获取登录的 cookie实现登录
- 分析接口数据 ，判断是否还有余票，再发送买票请求
- 怎样调用本机上安装的Chrome 而不是安装chromium
> 打开 chrome://version/ 找到 可执行文件路径 例如 executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 添加该参数到puppeteer.launch启动参数

<a name="yNqzC"></a>
##### 参考文献
[官网](https://pptr.dev/)<br />[chrome 启动参数列表](https://peter.sh/experiments/chromium-command-line-switches/)<br />[键盘列表](https://github.com/GoogleChrome/puppeteer/blob/master/lib/USKeyboardLayout.js)<br />[设备列表](https://github.com/GoogleChrome/puppeteer/blob/master/lib/DeviceDescriptors.js)
[node优秀库](https://awehunt.com/?tnid=5af1c0b67b4fac67bf3af2b4)

- 下载地址

[国内下载地址](https://brickyang.github.io/2019/01/14/%E5%9B%BD%E5%86%85%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85-Puppeteer-%E7%9A%84%E6%96%B9%E6%B3%95/)<br />[手动下载地址](https://marxjiao.com/2018/08/26/puppeteer-install/)

<a name="tlm9P"></a>
##### 知识拓展：

- [chrome vs chromium](https://chromium.googlesource.com/chromium/src/+/master/docs/chromium_browser_vs_google_chrome.md)
- [什么是 chrome devtools protocol](https://chromedevtools.github.io/devtools-protocol/)
- 在node 环境下使用 ECMAScript Modules 的 import/export
- [社区优秀 puppeteer 库](https://github.com/transitive-bullshit/awesome-puppeteer)
> 并不是重复造轮子啊，自己学习可以更好的理解用法

- [官方说明](https://nodejs.org/api/esm.html#esm_ecmascript_modules)
> usage: 将后缀.js 改成 .mjs 增加启动参数"start": "node --experimental-modules app.mjs"


<a name="qSwPM"></a>
##### 遇到的问题

- 图片点触验证码破解 (付费 超级鹰)
- [验证码破解-有接口](https://github.com/zhaipro/easy12306)
- [验证码破解-页面](http://littlebigluo.qicp.net:47720/)
<a name="LBpRk"></a>
##### 结语
> 这玩意儿挺有用的，我就是写个栗子，抛砖引玉，有志之士可以看看工作生活中哪里适用，用好了可以节省很多时间同时提升效率


