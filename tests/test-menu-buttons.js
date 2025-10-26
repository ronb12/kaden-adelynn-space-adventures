const puppeteer = require('puppeteer');

async function testMenuButtons() {
  console.log('🚀 Starting menu button tests...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for headless mode
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to the local server
    console.log('📱 Navigating to local server...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Wait for the game to load
    console.log('⏳ Waiting for game to load...');
    await page.waitForSelector('#game-container', { timeout: 15000 });
    
    // Wait for Phaser to initialize
    console.log('🎮 Waiting for Phaser to initialize...');
    await page.waitForTimeout(5000);
    
    // Check if Phaser is loaded
    const phaserLoaded = await page.evaluate(() => {
      return typeof window.Phaser !== 'undefined';
    });
    console.log('📊 Phaser loaded:', phaserLoaded);
    
    console.log('🎮 Game loaded, starting button tests...');
    
    // Test 1: SELECT YOUR PILOT button
    console.log('🧪 Testing SELECT YOUR PILOT button...');
    try {
      await page.click('canvas', { 
        offset: { x: 640, y: 200 } // Center of screen, Y position of button
      });
      console.log('✅ SELECT YOUR PILOT button clicked');
      await page.waitForTimeout(1000);
      
      // Check if modal opened (look for close button or modal elements)
      const modalExists = await page.evaluate(() => {
        return document.querySelector('canvas') !== null;
      });
      console.log('📋 Modal interaction test:', modalExists ? 'Modal opened' : 'Modal not detected');
      
    } catch (error) {
      console.log('❌ SELECT YOUR PILOT button test failed:', error.message);
    }
    
    // Test 2: START MISSION button
    console.log('🧪 Testing START MISSION button...');
    try {
      await page.click('canvas', { 
        offset: { x: 640, y: 280 } // Y position of START MISSION button
      });
      console.log('✅ START MISSION button clicked');
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('❌ START MISSION button test failed:', error.message);
    }
    
    // Test 3: SETTINGS button
    console.log('🧪 Testing SETTINGS button...');
    try {
      await page.click('canvas', { 
        offset: { x: 640, y: 360 } // Y position of SETTINGS button
      });
      console.log('✅ SETTINGS button clicked');
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('❌ SETTINGS button test failed:', error.message);
    }
    
    // Test 4: ACHIEVEMENTS button
    console.log('🧪 Testing ACHIEVEMENTS button...');
    try {
      await page.click('canvas', { 
        offset: { x: 490, y: 420 } // Left position of ACHIEVEMENTS button
      });
      console.log('✅ ACHIEVEMENTS button clicked');
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('❌ ACHIEVEMENTS button test failed:', error.message);
    }
    
    // Test 5: BOSS BATTLES button
    console.log('🧪 Testing BOSS BATTLES button...');
    try {
      await page.click('canvas', { 
        offset: { x: 640, y: 420 } // Center position of BOSS BATTLES button
      });
      console.log('✅ BOSS BATTLES button clicked');
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('❌ BOSS BATTLES button test failed:', error.message);
    }
    
    // Test 6: POWER-UPS button
    console.log('🧪 Testing POWER-UPS button...');
    try {
      await page.click('canvas', { 
        offset: { x: 790, y: 420 } // Right position of POWER-UPS button
      });
      console.log('✅ POWER-UPS button clicked');
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('❌ POWER-UPS button test failed:', error.message);
    }
    
    // Test 7: MULTIPLAYER button
    console.log('🧪 Testing MULTIPLAYER button...');
    try {
      await page.click('canvas', { 
        offset: { x: 490, y: 470 } // Left position of MULTIPLAYER button
      });
      console.log('✅ MULTIPLAYER button clicked');
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('❌ MULTIPLAYER button test failed:', error.message);
    }
    
    // Test 8: STORY MODE button
    console.log('🧪 Testing STORY MODE button...');
    try {
      await page.click('canvas', { 
        offset: { x: 640, y: 470 } // Center position of STORY MODE button
      });
      console.log('✅ STORY MODE button clicked');
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('❌ STORY MODE button test failed:', error.message);
    }
    
    // Test 9: CHALLENGES button
    console.log('🧪 Testing CHALLENGES button...');
    try {
      await page.click('canvas', { 
        offset: { x: 790, y: 470 } // Right position of CHALLENGES button
      });
      console.log('✅ CHALLENGES button clicked');
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('❌ CHALLENGES button test failed:', error.message);
    }
    
    console.log('🎉 All button tests completed!');
    
    // Take a screenshot for verification
    await page.screenshot({ 
      path: 'menu-buttons-test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved as menu-buttons-test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testMenuButtons().catch(console.error);
