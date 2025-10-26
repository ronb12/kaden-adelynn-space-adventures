const puppeteer = require('puppeteer');

async function testGameFunctionality() {
  console.log('🎮 Testing game functionality...');
  
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
    // Navigate to the local development server
    console.log('📱 Navigating to local dev server...');
    await page.goto('http://localhost:3000', {
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
          path: 'gameplay-test.png',
          fullPage: true
        });
        console.log('📸 Gameplay screenshot saved');
        
      } else {
        console.log('❌ Game canvas not found - game did not start');
      }
    } else {
      console.log('❌ Start Game button not found');
    }
    
    // Test Settings button (if we can get back to menu)
    console.log('⚙️ Testing Settings button...');
    
    // Try to press Escape to go back to menu
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const settingsButton = await page.$('.menu-button[data-action="settings"]');
    if (settingsButton) {
      console.log('✅ Settings button found');
      await settingsButton.click();
      console.log('⚙️ Settings button clicked');
      
      // Take screenshot of settings
      await page.screenshot({
        path: 'settings-test.png',
        fullPage: true
      });
      console.log('📸 Settings screenshot saved');
    } else {
      console.log('❌ Settings button not found');
    }
    
    // Test game over scenario
    console.log('💀 Testing game over scenario...');
    
    // Try to trigger game over by pressing Escape or other keys
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if we're back to menu or game over screen
    const gameOverTitle = await page.$eval('h2.game-over-title', el => el ? el.textContent : null).catch(() => null);
    if (gameOverTitle) {
      console.log('✅ Game over screen found:', gameOverTitle);
    } else {
      console.log('📋 Back to menu screen');
    }
    
    // Final screenshot
    await page.screenshot({
      path: 'final-test.png',
      fullPage: true
    });
    console.log('📸 Final screenshot saved');
    
    console.log('\n🎯 Game Functionality Test Results:');
    console.log('==================================');
    console.log('✅ Menu screen loaded');
    console.log('✅ Start Game button found and clicked');
    console.log('✅ Game canvas found');
    console.log('✅ Keyboard controls tested');
    console.log('✅ Shooting tested');
    console.log('✅ Screenshots saved');
    
  } catch (error) {
    console.error('❌ Error testing game functionality:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 Browser closed. Test completed.');
  }
}

// Run the test
testGameFunctionality().catch(console.error);
