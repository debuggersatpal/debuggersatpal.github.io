const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('file://' + __dirname + '/portfolio-ui-reference/portfolio-reference.png');
  
  const colors = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    function getHex(x, y) {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return "#" + ("000000" + ((p[0] << 16) | (p[1] << 8) | p[2]).toString(16)).slice(-6);
    }
    
    return {
      bgMain: getHex(10, 200), // Far left edge
      bgProfile: getHex(100, 300), // Under profile name
      bgMainContentTopRight: getHex(img.width - 20, 200), // Top right edge
      bgCard: getHex(300, 200), // On "Web Development" card
      borderRightProfile: getHex(250, 400), // Around the border line between profile and main
      headerPill: getHex(img.width / 2, 30), // Inside the "About" button
      activePill: getHex(img.width / 2 - 50, 30), // Inside the "Home" active pill
      accentPurple: getHex(img.width / 2 - 50, 30),
      textWhite: getHex(img.width / 2, 30) // Just sample logic, we'll see
    };
  });
  
  console.log(colors);
  await browser.close();
})();
