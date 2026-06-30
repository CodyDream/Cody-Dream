const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  let browser;
  try {
    console.log('Launching Microsoft Edge...');
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    
    console.log('Connecting to local development server...');
    await page.goto('http://localhost:5500/Content/tutoreals/tutorial main.html', { 
      waitUntil: 'networkidle0' 
    });
    
    console.log('Waiting 2 seconds for JavaScript rendering components...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // --- PRECISION COOKIEHUB REMOVAL STEP ---
    console.log('Nuking CookieHub popups and active styles...');
    await page.evaluate(() => {
      // 1. Find and completely remove the dynamic CookieHub HTML element block
      const cookieHubWrapper = document.querySelector('.ch2');
      if (cookieHubWrapper) {
        cookieHubWrapper.remove();
        console.log('Target destroyed: CookieHub markup removed.');
      }

      // 2. Clear out any inline styling injected on the <body> that locks scrolling
      document.body.removeAttribute('style');
    });
    // ----------------------------------------

    const hasCards = await page.evaluate(() => {
      const container = document.getElementById('assets-container');
      return container && container.children.length > 0;
    });
    
    if (!hasCards) {
      throw new Error('The assets-container is still empty.');
    }
    
    const processedHtml = await page.content();
    const outputPath = path.join(__dirname, 'Content', 'tutoreals', 'tutorial main.html');
    fs.writeFileSync(outputPath, processedHtml);
    
    console.log('🚀 Success! Pristine static snapshot saved to Content/tutoreals/tutorial-static.html');
    
  } catch (error) {
    console.error('❌ Prerender Error:', error.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();