const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });
  await page.goto('http://127.0.0.1:8080');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'current-ui.png', fullPage: true });
  await browser.close();
})();
