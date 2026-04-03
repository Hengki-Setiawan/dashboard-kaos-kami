const puppeteer = require('puppeteer-core');
const fs = require('fs');

const paths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let executablePath = '';
for (const p of paths) {
  if (fs.existsSync(p)) {
    executablePath = p;
    break;
  }
}

if (!executablePath) {
  console.error("No browser found");
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch({ executablePath, headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.toString()));
  // Also catch unhandled rejections or errors logged specifically
  page.on('response', response => {
    if(!response.ok()) console.log("Failed response:", response.url());
  })

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await browser.close();
})();
