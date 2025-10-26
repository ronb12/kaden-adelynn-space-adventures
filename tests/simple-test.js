const puppeteer = require('puppeteer');

async function simpleTest() {
  console.log('🚀 Starting simple menu test...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Keep browser visible
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set a longer timeout
    page.setDefaultTimeout(60000);
    
    console.log('📱 Navigating to local server...');
    await page.goto('http://localhost:3000');
    
    console.log('⏳ Waiting for page to load...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Take a screenshot to see what's loaded
    await page.screenshot({ 
      path: 'initial-load.png',
      fullPage: true 
    });
    console.log('📸 Initial screenshot saved as initial-load.png');
    
    // Check if we can find the game container
    const gameContainer = await page.$('#game-container');
    if (gameContainer) {
      console.log('✅ Game container found');
    } else {
      console.log('❌ Game container not found');
    }
    
    // Check for canvas element
    const canvas = await page.$('canvas');
    if (canvas) {
      console.log('✅ Canvas element found');
      
      // Try clicking on the canvas at different positions
      console.log('🧪 Testing canvas clicks...');
      
      // Click in the center of the canvas
      await page.click('canvas');
      console.log('✅ Canvas clicked');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take another screenshot
      await page.screenshot({ 
        path: 'after-click.png',
        fullPage: true 
      });
      console.log('📸 After-click screenshot saved as after-click.png');
      
    } else {
      console.log('❌ Canvas element not found');
    }
    
    // Check console logs
    page.on('console', msg => {
      console.log('🔍 Browser console:', msg.text());
    });
    
    // Wait a bit more to see any console output
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('🎉 Simple test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Keep browser open for manual inspection
    console.log('🔍 Browser will stay open for manual inspection. Close it when done.');
    // await browser.close();
  }
}

// Run the test
simpleTest().catch(console.error);
