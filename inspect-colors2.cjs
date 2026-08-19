const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport large enough
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(`<img src="file://${__dirname}/portfolio-ui-reference/portfolio-reference.png" style="margin:0; padding:0; display:block;" id="img" />`);
  
  const colors = await page.evaluate(() => {
    const img = document.getElementById('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    function getHex(x, y) {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return "#" + ("000000" + ((p[0] << 16) | (p[1] << 8) | p[2]).toString(16)).slice(-6);
    }
    
    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
      bgLeft: getHex(100, 200),
      bgRight: getHex(1200, 200),
      cardBg: getHex(400, 200), // Approx focus area card
      pillBg: getHex(img.naturalWidth / 2 + 100, 40),
      activePill: getHex(img.naturalWidth / 2 - 40, 40),
      borderLine: getHex(320, 200) // The line separating sidebar
    };
  });
  
  console.log(colors);
  await browser.close();
})();
