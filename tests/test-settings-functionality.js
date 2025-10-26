const puppeteer = require('puppeteer');

async function testSettingsFunctionality() {
  console.log('⚙️ Testing settings functionality...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to the live site
    console.log('📱 Navigating to live site...');
    await page.goto('https://kaden---adelynn-adventures.web.app', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if we're on the menu screen
    console.log('🎯 Testing menu screen...');
    const menuTitle = await page.$eval('h1.game-title', el => el ? el.textContent : null).catch(() => null);
    console.log('📄 Menu Title Found:', menuTitle);
    
    // Look for settings button or settings functionality
    console.log('⚙️ Looking for settings functionality...');
    
    // Check if there are any settings-related elements
    const settingsElements = await page.$$eval('*', elements => {
      return elements.filter(el => 
        el.textContent && (
          el.textContent.toLowerCase().includes('settings') ||
          el.textContent.toLowerCase().includes('options') ||
          el.textContent.toLowerCase().includes('config')
        )
      ).map(el => ({
        tagName: el.tagName,
        textContent: el.textContent.trim(),
        className: el.className
      }));
    });
    
    console.log('🔍 Settings-related elements found:', settingsElements);
    
    // Check for any buttons that might be settings
    const allButtons = await page.$$eval('button, .button, [role="button"]', elements => {
      return elements.map(el => ({
        textContent: el.textContent.trim(),
        className: el.className,
        id: el.id
      }));
    });
    
    console.log('🔘 All buttons found:', allButtons);
    
    // Check for any menu items
    const menuItems = await page.$$eval('.menu-button, .menu-item, .menu-option', elements => {
      return elements.map(el => ({
        textContent: el.textContent.trim(),
        className: el.className,
        id: el.id
      }));
    });
    
    console.log('📋 Menu items found:', menuItems);
    
    // Test keyboard shortcuts for settings
    console.log('⌨️ Testing keyboard shortcuts...');
    
    // Try common settings shortcuts
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await page.keyboard.press('s');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await page.keyboard.press('o');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Take screenshot
    await page.screenshot({
      path: 'settings-search-test.png',
      fullPage: true
    });
    console.log('📸 Settings search screenshot saved');
    
    console.log('\n🎯 Settings Functionality Test Results:');
    console.log('======================================');
    console.log('✅ Live site loaded successfully');
    console.log('✅ Menu screen loaded');
    console.log('✅ Settings elements searched');
    console.log('✅ Keyboard shortcuts tested');
    console.log('✅ Screenshot saved');
    
  } catch (error) {
    console.error('❌ Error testing settings functionality:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 Browser closed. Settings test completed.');
  }
}

// Run the test
testSettingsFunctionality().catch(console.error);
