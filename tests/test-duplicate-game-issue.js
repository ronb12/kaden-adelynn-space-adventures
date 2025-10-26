const puppeteer = require('puppeteer');

async function testDuplicateGameIssue() {
  console.log('🔍 Testing for Duplicate Game Issue...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1200,800'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    // Enable console logging
    page.on('console', msg => {
      console.log('🖥️ Console:', msg.text());
    });
    
    await page.goto('https://kaden---adelynn-adventures.web.app', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🔍 Checking for duplicate elements...');
    
    // Check for duplicate canvas elements
    const canvasTest = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      const gameContainers = document.querySelectorAll('.game-container');
      const mainMenus = document.querySelectorAll('.main-menu');
      const characterSelections = document.querySelectorAll('.character-selection');
      
      return {
        canvasCount: canvases.length,
        gameContainerCount: gameContainers.length,
        mainMenuCount: mainMenus.length,
        characterSelectionCount: characterSelections.length,
        canvasIds: Array.from(canvases).map(c => c.id || c.className),
        containerIds: Array.from(gameContainers).map(c => c.id || c.className)
      };
    });
    console.log('✅ Canvas and container test:', canvasTest);
    
    // Check for duplicate React components
    const reactTest = await page.evaluate(() => {
      const reactRoots = document.querySelectorAll('#root');
      const appElements = document.querySelectorAll('[data-reactroot]');
      
      return {
        reactRootCount: reactRoots.length,
        appElementCount: appElements.length,
        rootContent: reactRoots.length > 0 ? reactRoots[0].innerHTML.length : 0
      };
    });
    console.log('✅ React component test:', reactTest);
    
    // Check for duplicate CSS classes
    const cssTest = await page.evaluate(() => {
      const gameTitles = document.querySelectorAll('.game-title');
      const gameBtns = document.querySelectorAll('.game-btn');
      const characterOptions = document.querySelectorAll('.character-option');
      
      return {
        gameTitleCount: gameTitles.length,
        gameBtnCount: gameBtns.length,
        characterOptionCount: characterOptions.length,
        titleTexts: Array.from(gameTitles).map(t => t.textContent)
      };
    });
    console.log('✅ CSS class test:', cssTest);
    
    // Check for duplicate game logic
    const gameLogicTest = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script');
      const hasMultipleGameScripts = scripts.length > 1;
      
      // Check if there are multiple game instances running
      const gameInstances = window.gameInstances || 0;
      
      return {
        scriptCount: scripts.length,
        hasMultipleGameScripts,
        gameInstances,
        windowKeys: Object.keys(window).filter(key => key.includes('game') || key.includes('Game'))
      };
    });
    console.log('✅ Game logic test:', gameLogicTest);
    
    // Test main menu functionality
    console.log('📋 Testing main menu...');
    const menuTest = await page.evaluate(() => {
      const title = document.querySelector('.game-title');
      const startBtn = document.querySelector('.start-game-btn');
      const characterBtn = document.querySelector('.character-select-btn');
      
      return {
        hasTitle: !!title,
        hasStartButton: !!startBtn,
        hasCharacterButton: !!characterBtn,
        titleText: title ? title.textContent : null,
        titleVisible: title ? title.offsetHeight > 0 : false
      };
    });
    console.log('✅ Main menu test:', menuTest);
    
    // Test character selection
    console.log('👦👧 Testing character selection...');
    await page.click('.character-select-btn');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const characterTest = await page.evaluate(() => {
      const options = document.querySelectorAll('.character-option');
      const kadenOption = document.querySelector('.character-option[data-character="kaden"]');
      const adelynnOption = document.querySelector('.character-option[data-character="adelynn"]');
      
      return {
        hasOptions: options.length > 0,
        hasKadenOption: !!kadenOption,
        hasAdelynnOption: !!adelynnOption,
        optionCount: options.length
      };
    });
    console.log('✅ Character selection test:', characterTest);
    
    // Go back and start game
    await page.click('.back-btn');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.click('.start-game-btn');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test game functionality
    console.log('🎮 Testing game functionality...');
    const gameTest = await page.evaluate(() => {
      const canvas = document.querySelector('.game-canvas');
      const pauseBtn = document.querySelector('.pause-btn');
      
      return {
        hasCanvas: !!canvas,
        hasPauseButton: !!pauseBtn,
        canvasWidth: canvas ? canvas.width : 0,
        canvasHeight: canvas ? canvas.height : 0,
        canvasVisible: canvas ? canvas.offsetHeight > 0 : false
      };
    });
    console.log('✅ Game functionality test:', gameTest);
    
    // Check for visual duplicates
    console.log('👁️ Checking for visual duplicates...');
    const visualTest = await page.evaluate(() => {
      const canvas = document.querySelector('.game-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Get image data to check for duplicate rendering
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          let pixelCount = 0;
          let hasContent = false;
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            if (a > 0) {
              pixelCount++;
              hasContent = true;
            }
          }
          
          return {
            hasContent,
            pixelCount,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height
          };
        }
      }
      return null;
    });
    console.log('✅ Visual test:', visualTest);
    
    console.log('🎉 Duplicate game issue test completed!');
    console.log('🌐 Live URL: https://kaden---adelynn-adventures.web.app');
    
    if (canvasTest.canvasCount > 1 || canvasTest.gameContainerCount > 1) {
      console.log('❌ ISSUE FOUND: Multiple canvas/container elements detected!');
      console.log('🔧 This could cause the old and new game to show simultaneously.');
    } else {
      console.log('✅ No duplicate elements detected - game should be working correctly.');
    }
    
  } catch (error) {
    console.error('❌ Duplicate game test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testDuplicateGameIssue().catch(console.error);
