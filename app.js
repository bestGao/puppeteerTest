const puppeteer = require("puppeteer");
const path = require("path");
const { trainsInfo } = require("./config.js");
const saveData = require("./utils/saveData.js");
// const { deviceName } = require("./src/utils/index");

const processArgv = process.argv;
const headless = processArgv.slice(2).join("") === "false" ? false : true;
const imageDir = path.join(__dirname, "./files/tickets.png")

async function launchApp() {
  const browser = await puppeteer.launch({
    headless, // https://peter.sh/experiments/chromium-command-line-switches/
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // devtools: false, // 调试面板
    slowMo: 300, // 操作延迟300ms
    timeout: 90000, // 导航延迟 Issues a stop after the specified number of milliseconds. This cancels all navigation and causes the DOMContentLoaded event to fire
    ignoreHTTPSErrors: true,
    args: ["--start-fullscreen", '--no-sandbox'], // 全屏打开浏览器 浏览器无故崩溃的问题
    defaultViewport: null // 最大页面
  });

  const page = await browser.newPage();
  // await page.emulate(deviceName); // 设置模拟器

  await page.goto("https://www.12306.cn", {
    waitUntil: "networkidle0" // 0个网络请求 500毫秒
  });
  await page.click(".icon.icon-wangfan");
  await page.evaluate(trainsInfo => {
    const {
      fromStationText,
      fromStation,
      toStation,
      backDate,
      goDate,
      toStationText
    } = trainsInfo;
    document.querySelector("#fromStationFan").value = fromStation;
    document.querySelector("#fromStationFanText").value = fromStationText;
    document.querySelector("#toStationFan").value = toStation;
    document.querySelector("#toStationFanText").value = toStationText;
    document.querySelector("#go_date").value = goDate;
    document.querySelector("#from_date").value = backDate;
  }, trainsInfo);
  await page.waitFor(1500)
  let searchBtn = await page.waitForSelector('#search_two');

  async function openTicketPage() {
    const newPagePromise = new Promise(resolve =>
      // emitter.once注册监听是一次性监听，当触发一次后，会移除该监听
      browser.once("targetcreated", target => resolve(target.page()))   // http://nodejs.cn/api/events.html#events_emitter_once_eventname_listener
    );

    await searchBtn.click();
    const ticketsPage = await newPagePromise;
    await ticketsPage.waitFor(3000) // 等待接口响应
    await ticketsPage.waitForSelector('#queryLeftTable', {
      visible: true,
    });

    ticketsPage.on("console", msg => { // 监听ticketsPage页面 js源码 evaluate的console
      for (let i = 0; i < msg.args().length; ++i)
        console.log(`${i}: ${msg.args()[i]}`);
    });

    await ticketsPage.exposeFunction("saveData", saveData(ticketsPage)); // 暴露函数给window
    if (/kyfw\.12306\.cn\/otn\/leftTicket\/init/.test(ticketsPage.url())) {
      // await ticketsPage.waitForSelector('#query_ticket', {
      //   visible: true,
      // });
      // await ticketsPage.click('#query_ticket', { delay: 500 })
      // await ticketsPage.waitFor(3000);
      // await ticketsPage.screenshot({ path: imageDir, fullPage: true });
      // 不能直接把 saveData函数当参数传进去 因为函数不能序列化
      await ticketsPage.evaluate(() => {
        window.saveData();
      });
    } else if (ticketsPage.url() === 'https://www.12306.cn/mormhweb/logFiles/error.html') { // 页面crash 可能因为ip被屏蔽
      await ticketsPage.waitFor(1000);
      await ticketsPage.close();
      await ticketsPage.waitFor(3000);
      await openTicketPage()
    }
  }

  await openTicketPage()

  // await page.waitFor(990000);
  // await page.close();
  // await browser.close();
}

launchApp();
