const crackCode = require('./crackCode.js')
const sendMail = require('./sendEmail')
const { account } = require("../config.js")

async function buyTicket(page, trainNum, index) {
  await page.waitFor(3000)
  const allBtn = await page.$$('#queryLeftTable .no-br')
  await allBtn[index].click()
  await page.waitForSelector('.modal-login', { visible: true })
  await page.waitForSelector('.login-hd-account', { visible: true })
  await page.click('.login-hd-account', { delay: 300 })
  await page.waitForSelector('#J-loginImg', { visible: true }) //  必须 npm start false 否则timeout
  await page.type('#J-userName', account.user, { delay: 350 })
  await page.type('#J-password', account.password, { delay: 400 })
  let imgsrc = await page.$eval('#J-loginImg', el => el.src)
  imgsrc = imgsrc.split(',')[1]
  // console.log('验证码地址', imgsrc)
  const verResult = await crackCode(imgsrc)
  console.log('识别结果', verResult)
  const validImg = await page.$("#J-loginImg");
  const validImgPos = await validImg.boundingBox();
  const x = validImgPos.x;
  const y = validImgPos.y;
  if (Array.isArray(verResult) && verResult.length) {
    if (validImg && validImgPos) {
      verResult.forEach(async (item) => {
        pos = circle(item, x, y)
        await page.mouse.click(pos[0], pos[1]);
      })
    }
  } else {
    console.log('识别出错,自己扫码登录')
    await page.waitFor(5000)
  }
  await page.click('#J-login', { delay: 300 })
  await page.waitForNavigation({ waitUntil: 'networkidle0' })
  await page.click('#normalPassenger_3', { delay: 300 })
  await page.click('#dialog_xsertcj_cancel')
  await page.click('#submitOrder_id')
  sendMail(`您已抢到票${trainNum}`)
  // await page.click('#qr_submit_id') // 提交订单
  await page.waitFor(2000);
  await page.close();
}

const circle = (num, x, y) => { // 算出来点击位置
  let x1, y1;
  if (num < 4) { x1 = x + num * 75 + 40; y1 = y + 28 + 40 } else {
    x1 = x + (num - 4) * 75 + 40
    y1 = y + 28 + 70 + 40
  }
  return [x1, y1]
}

module.exports = buyTicket