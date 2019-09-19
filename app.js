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
    devtools: false,
    slowMo: 300,
    timeout: 90000,
    ignoreHTTPSErrors: true,
    args: ["--start-fullscreen"], // 全屏打开浏览器
    defaultViewport: null // 最大页面
  });

  const page = await browser.newPage();
  // await page.emulate(deviceName); // 设置模拟器

  await page.goto("https://www.12306.cn", {
    waitUntil: "networkidle0"
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
  let searchBtn = await page.waitForSelector('#search_two');

  async function openTicketPage() {
    const newPagePromise = new Promise(resolve =>
      browser.once("targetcreated", target => resolve(target.page()))   // http://nodejs.cn/api/events.html#events_emitter_once_eventname_listener
    );

    await searchBtn.click();
    const ticketsPage = await newPagePromise;
    await ticketsPage.waitFor(3000) // 等待 接口响应
    await ticketsPage.waitForSelector('#queryLeftTable', {
      visible: true,
    });

    ticketsPage.on("console", msg => { // 监听ticketsPage页面 js源码 evaluate的console
      for (let i = 0; i < msg.args().length; ++i)
        console.log(`${i}: ${msg.args()[i]}`);
    });

    await ticketsPage.exposeFunction("saveData", saveData(ticketsPage)); // 暴露函数给window
    if (/kyfw\.12306\.cn\/otn\/leftTicket\/init/.test(ticketsPage.url())) {
      await ticketsPage.screenshot({ path: imageDir });
      // 不能直接把 buyTicket函数当参数传进去 因为buyTicket函数不能序列化
      // await ticketsPage.click('#query_ticket', { delay: 500 })
      await ticketsPage.evaluate(() => {
        window.saveData();
      });
    } else if (ticketsPage.url() === 'https://www.12306.cn/mormhweb/logFiles/error.html') { // ip 被屏蔽
      await ticketsPage.waitFor(1000);
      await ticketsPage.close();
      await ticketsPage.waitFor(3000);
      await openTicketPage()
    }
  }

  await openTicketPage()

  await page.waitFor(990000);
  await page.close();
  await browser.close();
}

launchApp();
