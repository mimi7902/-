const puppeteer = require('puppeteer');
const fs = require('fs');

async function generateThumbnail(title, outputPath) {
  // GitHub Actions 环境必须加上 --no-sandbox 参数
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

  // 读取模板文件
  let html = fs.readFileSync('./template.html', 'utf8');
  html = html.replace('{{TITLE}}', title);

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: outputPath, type: 'png' });

  await browser.close();
}

const title = process.argv[2] || 'GeekNums 默认博客文章标题';
generateThumbnail(title, './thumbnail.png').catch(err => {
  console.error(err);
  process.exit(1);
});
