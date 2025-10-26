const puppeteer = require('puppeteer');

async function testMenuButtons() {
  console.log('🚀 Starting comprehensive menu button tests...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Keep browser visible for debugging
    defaultViewport: { width: 1280, height: 720 },
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });
  
  try {
    const page = await browser.newPage();
    
    // Set longer timeouts
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);
    
    // Listen to console logs
    page.on('console', msg => {
      console.log('🔍 Browser console:', msg.text());
    });
    
    // Listen to page errors
    page.on('pageerror', error => {
      console.log('❌ Page error:', error.message);
    });
    
    console.log('📱 Navigating to local server...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    
    console.log('⏳ Waiting for game to initialize...');
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'test-initial.png',
      fullPage: true 
    });
    console.log('📸 Initial screenshot saved');
    
    // Check if game container exists
    const gameContainer = await page.$('#game-container');
    if (!gameContainer) {
      console.log('❌ Game container not found');
      return;
    }
    console.log('✅ Game container found');
    
    // Check if canvas exists
    const canvas = await page.$('canvas');
    if (!canvas) {
      console.log('❌ Canvas not found');
      return;
    }
    console.log('✅ Canvas found');
    
    // Test button clicks with specific coordinates
    const buttonTests = [
      { name: 'SELECT YOUR PILOT', x: 640, y: 200 },
      { name: 'START MISSION', x: 640, y: 280 },
      { name: 'SETTINGS', x: 640, y: 360 },
      { name: 'ACHIEVEMENTS', x: 490, y: 420 },
      { name: 'BOSS BATTLES', x: 640, y: 420 },
      { name: 'POWER-UPS', x: 790, y: 420 },
      { name: 'MULTIPLAYER', x: 490, y: 470 },
      { name: 'STORY MODE', x: 640, y: 470 },
      { name: 'CHALLENGES', x: 790, y: 470 }
    ];
    
    console.log('🧪 Testing all menu buttons...');
    
    for (let i = 0; i < buttonTests.length; i++) {
      const test = buttonTests[i];
      console.log(`\n🎯 Testing ${test.name} button (${i + 1}/${buttonTests.length})...`);
      
      try {
        // Click on the canvas at the specified coordinates
        await page.mouse.click(test.x, test.y);
        console.log(`✅ ${test.name} button clicked successfully`);
        
        // Wait a moment to see any visual feedback
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Take screenshot after each click
        await page.screenshot({ 
          path: `test-${test.name.toLowerCase().replace(/\s+/g, '-')}.png`,
          fullPage: true 
        });
        console.log(`📸 Screenshot saved for ${test.name}`);
        
      } catch (error) {
        console.log(`❌ ${test.name} button test failed:`, error.message);
      }
    }
    
    // Test modal functionality specifically
    console.log('\n🎭 Testing modal functionality...');
    try {
      // Click SELECT YOUR PILOT to open modal
      await page.mouse.click(640, 200);
      console.log('✅ SELECT YOUR PILOT clicked - modal should open');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take screenshot of modal
      await page.screenshot({ 
        path: 'test-modal-open.png',
        fullPage: true 
      });
      console.log('📸 Modal screenshot saved');
      
      // Try to close modal by clicking outside (if it opened)
      await page.mouse.click(100, 100);
      console.log('✅ Attempted to close modal');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log('❌ Modal test failed:', error.message);
    }
    
    // Final screenshot
    await page.screenshot({ 
      path: 'test-final.png',
      fullPage: true 
    });
    console.log('📸 Final screenshot saved');
    
    console.log('\n🎉 All button tests completed!');
    console.log('📁 Check the generated PNG files to see the results');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.log('🔍 Browser will stay open for manual inspection...');
    console.log('Close the browser window when you\'re done checking the results.');
    // Keep browser open for manual inspection
    // await browser.close();
  }
}

// Run the test
testMenuButtons().catch(console.error);
