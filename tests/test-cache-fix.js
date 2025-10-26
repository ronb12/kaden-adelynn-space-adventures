const puppeteer = require('puppeteer');

async function testCacheFix() {
  console.log('🔄 Testing Cache Fix...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1200,800',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    // Clear cache and cookies
    await page.evaluateOnNewDocument(() => {
      // Clear all caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
    });
    
    // Enable console logging
    page.on('console', msg => {
      console.log('🖥️ Console:', msg.text());
    });
    
    // Navigate with cache disabled
    await page.goto('https://kaden---adelynn-adventures.web.app', { 
      waitUntil: 'networkidle0',
      cache: 'no-cache'
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Cache fix verification...');
    
    // Check build version
    const versionTest = await page.evaluate(() => {
      const metaVersion = document.querySelector('meta[name="build-version"]');
      return {
        hasVersionMeta: !!metaVersion,
        version: metaVersion ? metaVersion.content : null
      };
    });
    console.log('✅ Version test:', versionTest);
    
    // Check for single game instance
    const gameInstanceTest = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      const gameContainers = document.querySelectorAll('.game-container');
      const mainMenus = document.querySelectorAll('.main-menu');
      
      return {
        canvasCount: canvases.length,
        gameContainerCount: gameContainers.length,
        mainMenuCount: mainMenus.length,
        isSingleInstance: canvases.length === 1 && gameContainers.length === 1 && mainMenus.length === 1
      };
    });
    console.log('✅ Game instance test:', gameInstanceTest);
    
    // Test main menu
    const menuTest = await page.evaluate(() => {
      const title = document.querySelector('.game-title');
      const buttons = document.querySelectorAll('.game-btn');
      
      return {
        hasTitle: !!title,
        hasButtons: buttons.length > 0,
        titleText: title ? title.textContent : null,
        buttonCount: buttons.length
      };
    });
    console.log('✅ Menu test:', menuTest);
    
    // Test character selection
    await page.click('.character-select-btn');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const characterTest = await page.evaluate(() => {
      const options = document.querySelectorAll('.character-option');
      return {
        hasOptions: options.length > 0,
        optionCount: options.length
      };
    });
    console.log('✅ Character selection test:', characterTest);
    
    // Go back and start game
    await page.click('.back-btn');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.click('.start-game-btn');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test game
    const gameTest = await page.evaluate(() => {
      const canvas = document.querySelector('.game-canvas');
      return {
        hasCanvas: !!canvas,
        canvasWidth: canvas ? canvas.width : 0,
        canvasHeight: canvas ? canvas.height : 0
      };
    });
    console.log('✅ Game test:', gameTest);
    
    console.log('🎉 Cache fix test completed!');
    console.log('🌐 Live URL: https://kaden---adelynn-adventures.web.app');
    
    if (gameInstanceTest.isSingleInstance) {
      console.log('✅ SUCCESS: Only one game instance detected!');
      console.log('🎯 The old and new game issue should be resolved.');
    } else {
      console.log('❌ ISSUE: Multiple game instances still detected!');
      console.log('🔧 Additional troubleshooting may be needed.');
    }
    
    console.log('📋 Instructions for users experiencing the issue:');
    console.log('  1. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)');
    console.log('  2. Clear browser cache and cookies');
    console.log('  3. Open in incognito/private mode');
    console.log('  4. Try a different browser');
    console.log('  5. Wait a few minutes for CDN cache to update');
    
  } catch (error) {
    console.error('❌ Cache fix test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testCacheFix().catch(console.error);
