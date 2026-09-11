const puppeteer = require('puppeteer');
const fs = require('fs');

async function generateThumbnail(title, outputPath) {
  // 注意：在 CI/GitHub Actions 环境中运行 Puppeteer 必须加上 args 参数
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

  // 读取 HTML 模板
  let html = fs.readFileSync('./template.html', 'utf8');
  html = html.replace('{{TITLE}}', title);

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: outputPath, type: 'png' });

  await browser.close();
}

// 模拟从命令行输入参数或抓取标题
const title = process.argv[2] || 'GeekNums 默认博客标题示例';
generateThumbnail(title, './thumbnail.png');
