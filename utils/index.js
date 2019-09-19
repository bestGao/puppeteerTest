const puppeteer = require("puppeteer");

const processArgv = process.argv;

module.exports = {
  fetchDeviceName: () => {
    // 设备列表: https://github.com/GoogleChrome/puppeteer/blob/master/lib/DeviceDescriptors.js
    let deviceName;
    if (processArgv.length >= 3) {
      deviceName = processArgv.slice(2).join(" ");
      deviceName = puppeteer.devices[`${deviceName}`];
    }
    return deviceName;
  }
};
