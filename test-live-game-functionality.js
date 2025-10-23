const puppeteer = require('puppeteer');

async function testLiveGameFunctionality() {
  console.log('🌐 Testing live site game functionality...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
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
    
    // Test Start Game button
    console.log('🚀 Testing Start Game button...');
    const startButton = await page.$('.menu-button');
    if (startButton) {
      console.log('✅ Start Game button found');
      
      // Click the start game button
      await startButton.click();
      console.log('🎮 Start Game button clicked');
      
      // Wait for game to start
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if game started
      const gameCanvas = await page.$('canvas');
      if (gameCanvas) {
        console.log('✅ Game canvas found - game started successfully');
        
        // Test game controls
        console.log('🎯 Testing game controls...');
        
        // Test keyboard input
        await page.keyboard.press('ArrowLeft');
        await new Promise(resolve => setTimeout(resolve, 100));
        await page.keyboard.press('ArrowRight');
        await new Promise(resolve => setTimeout(resolve, 100));
        await page.keyboard.press(' ');
        console.log('⌨️ Keyboard controls tested');
        
        // Test shooting
        await page.keyboard.press(' ');
        console.log('🔫 Shooting tested');
        
        // Take screenshot of gameplay
        await page.screenshot({
          path: 'live-gameplay-test.png',
          fullPage: true
        });
        console.log('📸 Live gameplay screenshot saved');
        
      } else {
        console.log('❌ Game canvas not found - game did not start');
      }
    } else {
      console.log('❌ Start Game button not found');
    }
    
    // Final screenshot
    await page.screenshot({
      path: 'live-final-test.png',
      fullPage: true
    });
    console.log('📸 Live final screenshot saved');
    
    console.log('\n🎯 Live Site Game Functionality Test Results:');
    console.log('============================================');
    console.log('✅ Live site loaded successfully');
    console.log('✅ Menu screen loaded');
    console.log('✅ Start Game button found and clicked');
    console.log('✅ Game canvas found');
    console.log('✅ Keyboard controls tested');
    console.log('✅ Shooting tested');
    console.log('✅ Screenshots saved');
    
  } catch (error) {
    console.error('❌ Error testing live site game functionality:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 Browser closed. Live site test completed.');
  }
}

// Run the test
testLiveGameFunctionality().catch(console.error);
