const path = require('path')
const emailInfo = require("../config.js").emailInfo;
const nodemailer = require("nodemailer");
const fs = require("fs");

const imageDir = path.join(__dirname, "../files/tickets.png")
const resultDir = path.join(__dirname, "../files/result.json")
const transporter = nodemailer.createTransport({
  host: emailInfo.host,
  // secure: true, // use SSL
  // port: emailInfo.port, // SMTP 端口
  auth: {
    user: emailInfo.user,
    pass: emailInfo.password
  }
});

/**
 * 发送邮件
 * @param contents
 */

function sendMail(htmlTxt = "发送到几个邮箱") {
  let imgPart1 = fs.readFileSync(imageDir); // 保存的截屏图
  transporter.sendMail(
    {
      from: emailInfo.user,
      to: emailInfo.toUser,
      subject: "查询到的票", // 标题
      html: htmlTxt,
      attachments: [
        // 附件
        {
          filename: "tickets.json",
          content: fs.readFileSync(resultDir),
          contentType: "text/plain"
        },
        {
          filename: "tickets.png",
          content: imgPart1, // 图片地址【得到的是一个buffer】
          cid: "allticktes" // 图片ID
        }
      ]
    },
    function (error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log("Message sent: " + response.response);
      }
      transporter.close(); // 如果没用，关闭连接池
    }
  );
}

module.exports = sendMail
