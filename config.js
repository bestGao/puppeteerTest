// 查询车次的信息
module.exports = {
  trainsInfo: {
    goDate: "2019-09-27", // 出发时间
    backDate: "2019-09-28", // 返回时间
    fromStation: "SHH", // 出发地车站Id
    fromStationText: "上海", // 出发地
    toStation: "BJP", // 目的地车站Id
    toStationText: "北京", // 目的地
    favorite_nums: ["G120", "G150", "G2"], // 优先车次
    purpose_codes: "ADULT" // ADULT：成人，0X00：学生
  },
  account: {
    user: "1XXXXXXXXXX0",
    password: "XXXXXXXXXX"
  },
  // 邮件账户
  emailInfo: {
    host: "smtp.sina.cn", // 发件服务器
    user: "gao52527737@sina.cn", // 发件邮箱【需要开启pop3/smtp】
    // port: 465, // 新浪服务器没有
    password: "0041401705409cb1", // 139邮箱 腾讯企业邮是登录密码(qq邮箱 新浪邮箱是授权码)
    toUser: "1055652678@qq.com,gao52527737@sina.cn,18368192710@139.com" // 收件邮箱
  }
};
