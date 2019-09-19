const puppeteer = require("puppeteer");

async function login() {
  const browser = await puppeteer.launch({
    headless: false, // 有界面
    devtools: false, // 调试台相当于 F12
    // slowMo: 300, // 每个操作慢300毫秒
    ignoreHTTPSErrors: true, // 忽略 https 报错
    pipe: true,
    args: ["--start-fullscreen"] // 全屏打开浏览器
  });
  const page = await browser.newPage(); // 打开一个tab页面
  // await page.emulate(deviceName); // 设置模拟器
  await page.setViewport({ width: 1360, height: 800 });
  await page.setRequestInterception(true); // 拦截请求
  page.on("request", async req => {
    // console.log('所有的', req.url())
    if (
      /passport\/captcha\/captcha-image64/.test(req.url()) ||
      req.url === "https://kyfw.12306.cn/passport/web/login"
    ) {
      req.respond({
        status: 200,
        contentType: "application/javascript; charset=utf-8",
        body: ""
      });
    }
    if (req.resourceType() === "xhr") {
      await req.continue();
    } else {
      await req.continue();
    }
  });
  await page.evaluate(() => {
    alert("2");
  });
  page.on("response", async res => {
    if (/passport\/captcha\/captcha-check/.test(res.url())) {
      // console.log(res.status());
      const text = await res.text();
      // 原本接口返回的数据 {"code":0,"data":"hello ajanuw"}
      console.log("提交校验验证码", text);
      // await browser.close();
    }
  });

  page.on("requestfinished", req => {
    // console.log(`请求完成: ${req.url()}`);
  });

  page.on("requestfailed", req => {
    console.log(`请求失败: ${req.url()}`);
  });
  await page.goto("https://kyfw.12306.cn/otn/resources/login.html", {
    waitUntil: "load"
  });
  await page.waitFor("#J-loginImg");
  await page.click(".login-hd-account");

  // 输入账号密码
  await page.type("#J-userName", "12306user");
  await page.type("#J-password", "12306password"); // 模拟真实输入的速度 { delay: 100 }
  const validImg = await page.$("#J-loginImg");
  if (validImg) {
    const validImgPos = await validImg.boundingBox();
    console.log("validImg啊: ", validImg.boundingBox());
    const x = validImgPos.x + 40;
    const y = validImgPos.y + 44;
    const x2 = validImgPos.x + 66;
    const y2 = validImgPos.y + 65;
    console.log("坐标: ", x, y, x2, y2);
    await page.mouse.click(x, y);
    await page.mouse.click(x2, y2);
  }
  // await validImg.click();
  await page.click("#J-login");
  await page.waitForNavigation();
  await page.close();
  await browser.close();
}

login();
