const fs = require("fs");
const cheerio = require("cheerio");
const path = require("path");
const buyTicket = require('./buyTicket');
const { trainsInfo: { favorite_nums } } = require("../config.js");
const scheduleTask = require('./scheduleTask')

const resultDir = path.join(__dirname, "../files/result.json");
let allNums = [];
let noneWanted = true;

function isValid($, index) {
  return $('.number', '#queryLeftTable').parents('tr').eq(index).find('td').last().children('a').length // 分析dom结构 判断是否可预订
}

async function reloadPage(page) {
  await page.click('#query_ticket')
  await saveData(page)
}

async function saveData(page) {
  await page.waitFor(3000)
  const html = await page.content();
  const $ = cheerio.load(html);
  let obj = {}
  const allLength = $('.number', '#queryLeftTable').length
  $('.number', '#queryLeftTable').each(function (index, item) {
    const trainNum = $(this).text()
    const canBuy = !!isValid($, allLength - 1 - index) // each顺序是反的
    obj = { trainNum, canBuy }
    allNums.push(obj)
    obj = {}
    if (favorite_nums.includes(trainNum) && canBuy) {
      noneWanted = false;
      buyTicket(page, trainNum, index) // 直接买
      return false;
    }
  })
  if (noneWanted) {
    console.log('没有想买的');
    scheduleTask(() => reloadPage(page), 200)
  }
  await writeFile(resultDir, allNums);
  // await page.waitFor(80000);
  // await page.close();
}

function removeFile(fileDir) {
  return new Promise((resolve, reject) => {
    fs.unlink(fileDir, err => {
      if (err) return reject(console.log(err));
      return resolve(console.log(path.resolve(fileDir), "文件删除成功"));
    });
  }).catch((error) => { console.log('removeFile: ', error) });
}

async function writeFile(fileDir, data) {
  await removeFile(fileDir);
  let writerStream = fs.createWriteStream(fileDir);
  writerStream.write(JSON.stringify(data, undefined, 2), "UTF8");
  writerStream.end();
  writerStream.on("finish", function () {
    console.log(fileDir, "写入成功!");
  });

  writerStream.on("error", function (err) {
    console.log(fileDir, "写入失败: ", err.stack);
  });
}

module.exports = saveData