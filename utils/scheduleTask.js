const schedule = require("node-schedule");

let count = 0
function scheduleTask(runner, turns = 10) {
  const task = schedule.scheduleJob("13 * 8-22 * * *", () => { // 每分钟的25秒 23:00-07:00 不爬
    runner();
    count++;
    console.log(
      new Date().toLocaleTimeString(),
      "8点到22点每分钟运行一次",
      "运行次数:",
      count
    );
    if (count === turns) {
      task.cancel();
    }
  });
}

module.exports = scheduleTask