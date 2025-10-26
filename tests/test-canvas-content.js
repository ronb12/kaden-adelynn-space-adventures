const puppeteer = require('puppeteer');

async function testCanvasContent() {
  console.log('🎨 Testing Canvas Content...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=800,600'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    
    // Enable console logging
    page.on('console', msg => {
      console.log('🖥️ Console:', msg.text());
    });
    
    await page.goto('https://kaden---adelynn-adventures.web.app', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start the game
    console.log('🚀 Starting game...');
    const startButton = await page.$('.start-mission-btn');
    if (startButton) {
      await startButton.click();
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait longer for game to load
      console.log('✅ Game started');
    }
    
    // Check what's actually on the canvas
    console.log('🎨 Checking canvas content...');
    const canvasContent = await page.evaluate(() => {
      const canvas = document.getElementById('gameCanvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Get image data from canvas
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Check if canvas has any non-black pixels (indicating content)
          let hasContent = false;
          let pixelCount = 0;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            // Check for non-black pixels
            if (r > 0 || g > 0 || b > 0) {
              hasContent = true;
              pixelCount++;
            }
          }
          
          return {
            hasContent,
            pixelCount,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            totalPixels: canvas.width * canvas.height
          };
        }
      }
      return null;
    });
    
    console.log('✅ Canvas content analysis:', canvasContent);
    
    // Check for game objects in React state
    console.log('🔍 Checking React game state...');
    const reactState = await page.evaluate(() => {
      // Try to access React state through the component
      const gameScene = document.querySelector('.game-scene');
      if (gameScene) {
        // Check if there are any game elements visible
        const stats = gameScene.querySelector('.game-stats');
        const canvas = gameScene.querySelector('#gameCanvas');
        
        return {
          hasGameScene: !!gameScene,
          hasStats: !!stats,
          hasCanvas: !!canvas,
          statsContent: stats ? stats.textContent : null
        };
      }
      return null;
    });
    
    console.log('✅ React state:', reactState);
    
    // Test keyboard input and see if anything changes
    console.log('⌨️ Testing keyboard input...');
    await page.keyboard.press('ArrowUp');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check canvas content again after input
    const canvasContentAfterInput = await page.evaluate(() => {
      const canvas = document.getElementById('gameCanvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          let hasContent = false;
          let pixelCount = 0;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            if (r > 0 || g > 0 || b > 0) {
              hasContent = true;
              pixelCount++;
            }
          }
          
          return {
            hasContent,
            pixelCount,
            totalPixels: canvas.width * canvas.height
          };
        }
      }
      return null;
    });
    
    console.log('✅ Canvas content after input:', canvasContentAfterInput);
    
    // Check for any errors in console
    console.log('🔍 Checking for errors...');
    const errors = await page.evaluate(() => {
      return window.console._errors || [];
    });
    
    if (errors.length > 0) {
      console.log('❌ Console errors found:', errors);
    } else {
      console.log('✅ No console errors');
    }
    
    console.log('🎉 Canvas content test completed!');
    console.log('🌐 Live URL: https://kaden---adelynn-adventures.web.app');
    
  } catch (error) {
    console.error('❌ Canvas content test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testCanvasContent().catch(console.error);
