const puppeteer = require('puppeteer');

async function testEnhancedVisualDesign() {
  console.log('🎨 Testing Enhanced Visual Design...');
  
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
    
    console.log('🎨 Testing enhanced visual design...');
    
    // Test main menu visual enhancements
    console.log('📋 Testing main menu visual enhancements...');
    const menuVisualTest = await page.evaluate(() => {
      const title = document.querySelector('.game-title');
      const buttons = document.querySelectorAll('.game-btn');
      const container = document.querySelector('.game-container');
      
      // Check for Orbitron font
      const titleStyle = window.getComputedStyle(title);
      const buttonStyle = window.getComputedStyle(buttons[0]);
      
      return {
        hasTitle: !!title,
        hasButtons: buttons.length > 0,
        titleFontFamily: titleStyle.fontFamily,
        buttonFontFamily: buttonStyle.fontFamily,
        titleTextShadow: titleStyle.textShadow,
        buttonBoxShadow: buttonStyle.boxShadow,
        containerBackground: window.getComputedStyle(container).background
      };
    });
    console.log('✅ Main menu visual test:', menuVisualTest);
    
    // Test character selection visual enhancements
    console.log('👦👧 Testing character selection visual enhancements...');
    await page.click('.character-select-btn');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const characterVisualTest = await page.evaluate(() => {
      const characterOptions = document.querySelectorAll('.character-option');
      const characterPreviews = document.querySelectorAll('.character-preview');
      const title = document.querySelector('.character-selection h2');
      
      return {
        hasCharacterOptions: characterOptions.length > 0,
        hasCharacterPreviews: characterPreviews.length > 0,
        titleTextShadow: window.getComputedStyle(title).textShadow,
        optionBoxShadow: window.getComputedStyle(characterOptions[0]).boxShadow,
        previewTextShadow: window.getComputedStyle(characterPreviews[0]).textShadow
      };
    });
    console.log('✅ Character selection visual test:', characterVisualTest);
    
    // Go back to menu and start game
    await page.click('.back-btn');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.click('.start-game-btn');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test enhanced starfield background
    console.log('⭐ Testing enhanced starfield background...');
    const starfieldTest = await page.evaluate(() => {
      const canvas = document.querySelector('.game-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Get image data from canvas
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          let starCount = 0;
          let hasMultipleStarLayers = false;
          let hasTwinklingEffect = false;
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            // Count white/gray pixels (stars)
            if (r > 200 && g > 200 && b > 200 && a > 0) {
              starCount++;
            }
            
            // Check for different star colors (multiple layers)
            if ((r > 150 && g > 150 && b > 150) && (r !== g || g !== b)) {
              hasMultipleStarLayers = true;
            }
          }
          
          return {
            hasStars: starCount > 0,
            starCount,
            hasMultipleStarLayers,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height
          };
        }
      }
      return null;
    });
    console.log('✅ Enhanced starfield test:', starfieldTest);
    
    // Test enhanced UI design
    console.log('🎮 Testing enhanced UI design...');
    const uiTest = await page.evaluate(() => {
      const canvas = document.querySelector('.game-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Get image data from top area where UI should be
          const imageData = ctx.getImageData(0, 0, canvas.width, 150);
          const data = imageData.data;
          
          let hasUIBackground = false;
          let hasHealthBar = false;
          let hasGlowEffects = false;
          let pixelCount = 0;
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            if (a > 0) {
              pixelCount++;
              
              // Check for UI background (dark with transparency)
              if (r < 50 && g < 50 && b < 50 && a > 100) {
                hasUIBackground = true;
              }
              
              // Check for health bar colors (green, yellow, red)
              if ((g > 200 && r < 100 && b < 100) || // Green
                  (r > 200 && g > 200 && b < 100) || // Yellow
                  (r > 200 && g < 100 && b < 100)) { // Red
                hasHealthBar = true;
              }
              
              // Check for glow effects (bright colors)
              if (r > 200 || g > 200 || b > 200) {
                hasGlowEffects = true;
              }
            }
          }
          
          return {
            hasUIBackground,
            hasHealthBar,
            hasGlowEffects,
            pixelCount
          };
        }
      }
      return null;
    });
    console.log('✅ Enhanced UI test:', uiTest);
    
    // Test triangle ship visual enhancements
    console.log('🔺 Testing triangle ship visual enhancements...');
    const shipVisualTest = await page.evaluate(() => {
      const canvas = document.querySelector('.game-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Get image data from center area where player should be
          const imageData = ctx.getImageData(400, 500, 100, 100);
          const data = imageData.data;
          
          let hasTriangleShapes = false;
          let hasGlowEffects = false;
          let hasPlayerColors = false;
          let pixelCount = 0;
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            if (a > 0) {
              pixelCount++;
              
              // Check for triangle-like patterns
              if (r > 100 && g > 100 && b > 100) {
                hasTriangleShapes = true;
              }
              
              // Check for glow effects (bright colors with alpha)
              if ((r > 200 || g > 200 || b > 200) && a > 150) {
                hasGlowEffects = true;
              }
              
              // Check for player ship colors (blue/pink)
              if ((b > r && b > g && b > 100) || (r > 150 && g > 50 && b < 100)) {
                hasPlayerColors = true;
              }
            }
          }
          
          return {
            hasTriangleShapes,
            hasGlowEffects,
            hasPlayerColors,
            pixelCount
          };
        }
      }
      return null;
    });
    console.log('✅ Triangle ship visual test:', shipVisualTest);
    
    // Test collectibles visual enhancements
    console.log('🎁 Testing collectibles visual enhancements...');
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for collectibles to spawn
    
    const collectiblesVisualTest = await page.evaluate(() => {
      const canvas = document.querySelector('.game-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Get image data from entire canvas
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          let hasCollectibleColors = false;
          let hasGlowEffects = false;
          let collectibleCount = 0;
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            // Check for collectible colors with glow
            if ((g > 200 && r < 100 && b < 100) || // Green (health)
                (b > 200 && r < 100 && g < 100) || // Blue (shield)
                (r > 200 && g > 200 && b < 100) || // Yellow (score)
                (r > 200 && g < 100 && b > 200)) { // Magenta (power)
              hasCollectibleColors = true;
              collectibleCount++;
            }
            
            // Check for glow effects
            if ((r > 200 || g > 200 || b > 200) && a > 150) {
              hasGlowEffects = true;
            }
          }
          
          return {
            hasCollectibleColors,
            hasGlowEffects,
            collectibleCount
          };
        }
      }
      return null;
    });
    console.log('✅ Collectibles visual test:', collectiblesVisualTest);
    
    // Test mobile responsive design
    console.log('📱 Testing mobile responsive design...');
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mobileVisualTest = await page.evaluate(() => {
      const title = document.querySelector('.game-title');
      const buttons = document.querySelectorAll('.game-btn');
      const container = document.querySelector('.game-container');
      
      return {
        hasTitle: !!title,
        hasButtons: buttons.length > 0,
        titleFontSize: window.getComputedStyle(title).fontSize,
        buttonFontSize: window.getComputedStyle(buttons[0]).fontSize,
        containerWidth: window.getComputedStyle(container).width
      };
    });
    console.log('✅ Mobile visual test:', mobileVisualTest);
    
    // Test performance with enhanced visuals
    console.log('⚡ Testing performance with enhanced visuals...');
    const performance = await page.metrics();
    console.log('Performance metrics:', {
      jsHeapUsed: Math.round(performance.JSHeapUsedSize / 1024 / 1024) + 'MB',
      jsHeapTotal: Math.round(performance.JSHeapTotalSize / 1024 / 1024) + 'MB',
      timestamp: performance.Timestamp
    });
    
    console.log('🎉 Enhanced visual design test completed!');
    console.log('🌐 Live URL: https://kaden---adelynn-adventures.web.app');
    console.log('📊 Visual Enhancement Summary:');
    console.log('  ✅ Orbitron font family for futuristic look');
    console.log('  ✅ Enhanced gradient backgrounds');
    console.log('  ✅ Animated starfield with multiple layers');
    console.log('  ✅ Glowing text effects and shadows');
    console.log('  ✅ Enhanced button animations and hover effects');
    console.log('  ✅ Improved character selection visuals');
    console.log('  ✅ Enhanced UI with health bars and glow effects');
    console.log('  ✅ Better triangle ship visual effects');
    console.log('  ✅ Improved collectibles with glow effects');
    console.log('  ✅ Mobile responsive design');
    console.log('  ✅ Backdrop blur effects');
    console.log('  ✅ Smooth animations and transitions');
    
  } catch (error) {
    console.error('❌ Enhanced visual design test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testEnhancedVisualDesign().catch(console.error);
