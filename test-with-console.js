const puppeteer = require('puppeteer');

async function testWithConsole() {
  console.log('🔍 Testing with console logging...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log('🖥️ Browser Console:', msg.text());
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
  });
  
  try {
    // Navigate to the local development server
    console.log('📱 Navigating to local dev server...');
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check the page title
    const title = await page.title();
    console.log('📄 Page Title:', title);
    
    // Check if there's any content in the root div
    const rootContent = await page.$eval('#root', el => el.innerHTML).catch(() => 'No root content');
    console.log('🏠 Root Content:', rootContent.substring(0, 200) + '...');
    
    // Check for any React errors
    const reactErrors = await page.evaluate(() => {
      const errors = [];
      const errorElements = document.querySelectorAll('[data-react-error]');
      errorElements.forEach(el => errors.push(el.textContent));
      return errors;
    });
    
    if (reactErrors.length > 0) {
      console.log('⚠️ React Errors Found:', reactErrors);
    }
    
    // Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({
      path: 'console-test.png',
      fullPage: true
    });
    
  } catch (error) {
    console.error('❌ Error testing with console:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 Browser closed. Screenshot saved as console-test.png');
  }
}

// Run the test
testWithConsole().catch(console.error);
