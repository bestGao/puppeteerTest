const fs = require("fs");
const path = require('path')
const request = require('request');

const dir = path.join(__dirname, "../files/verifiCode.png")

// 将base64编码转换为图片
async function base64_decode(imgStr, dir) {
  var bitmap = new Buffer.from(imgStr, 'base64');
  fs.writeFileSync(dir, bitmap);
}

async function crackCode(imgStr) {
  await base64_decode(imgStr, dir)
  return new Promise((resolve, reject) => {
    request.post('http://shell.teachx.cn:12306/predict', {
      formData: {
        file: fs.createReadStream(dir)
      },
      json: true
    }, (err, res, body) => {
      if (err) { console.log('识别失败: ', err); return } else {
        let result = body.replace(/\n/g, '').replace(/\s+/g, "") // 去换行空格
        result = result.split(',images:')  // eg: ["text:订书机", "沙包,订书机,沙包,订书机,沙包,红豆,辣椒酱,雨靴"]
        const allImages = result[1].split(',')
        const text = result[0].replace('text:', "");
        const dirArr = getAllIndexes(allImages, text)
        // console.log('allImages', typeof allImages, 'text', text)
        resolve(dirArr)
      };
    })
  })
}

function getAllIndexes(arr, val) {
  var indexes = [], i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

module.exports = crackCode