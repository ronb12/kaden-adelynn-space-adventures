const puppeteer = require('puppeteer');

async function testEnhancedFeatures() {
  console.log('🚀 Testing Enhanced Game Features...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('📱 Navigating to live site...');
    await page.goto('https://kaden---adelynn-adventures.web.app', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    console.log('🎯 Testing enhanced character designs...');
    
    // Check if character selection shows enhanced sprites
    const characterSelectionButton = await page.$('button:contains("Character Selection")');
    if (characterSelectionButton) {
      await characterSelectionButton.click();
      await page.waitForTimeout(2000);
      
      // Check for enhanced character sprites
      const characterCanvas = await page.$('.character-sprite-canvas');
      if (characterCanvas) {
        console.log('✅ Enhanced character sprites found');
      } else {
        console.log('❌ Enhanced character sprites not found');
      }
      
      // Close character selection
      const backButton = await page.$('button:contains("Back to Menu")');
      if (backButton) {
        await backButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    console.log('🚀 Testing enhanced ship designs...');
    
    // Start the game
    const startButton = await page.$('button:contains("Start Game")');
    if (startButton) {
      await startButton.click();
      await page.waitForTimeout(2000);
      
      // Check if game canvas is visible
      const gameCanvas = await page.$('.game-canvas');
      if (gameCanvas) {
        console.log('✅ Game canvas found - testing enhanced ships...');
        
        // Take screenshot to verify enhanced ship designs
        await page.screenshot({ 
          path: 'enhanced-ships-test.png',
          fullPage: true 
        });
        console.log('📸 Enhanced ships screenshot saved');
        
        // Test shooting to see enhanced bullets
        await page.keyboard.press('Space');
        await page.waitForTimeout(500);
        await page.keyboard.press('Space');
        await page.waitForTimeout(500);
        
        // Test movement to see enhanced player ship
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(200);
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(200);
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(200);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(200);
        
        console.log('✅ Enhanced ship movement and shooting tested');
        
        // Wait for enemies to spawn and test enhanced enemy ships
        await page.waitForTimeout(3000);
        
        // Test settings panel for enhanced character icons
        await page.keyboard.press('Escape'); // Pause game
        await page.waitForTimeout(1000);
        
        const settingsButton = await page.$('button:contains("Settings")');
        if (settingsButton) {
          await settingsButton.click();
          await page.waitForTimeout(2000);
          
          // Check for enhanced character icons in settings
          const settingsCharacterCanvas = await page.$('.character-mini-sprite');
          if (settingsCharacterCanvas) {
            console.log('✅ Enhanced character icons in settings found');
          } else {
            console.log('❌ Enhanced character icons in settings not found');
          }
          
          // Close settings
          const closeButton = await page.$('button:contains("Close")');
          if (closeButton) {
            await closeButton.click();
            await page.waitForTimeout(1000);
          }
        }
        
      } else {
        console.log('❌ Game canvas not found');
      }
    } else {
      console.log('❌ Start Game button not found');
    }
    
    // Final screenshot
    await page.screenshot({ 
      path: 'enhanced-features-final.png',
      fullPage: true 
    });
    console.log('📸 Final enhanced features screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 Browser closed. Enhanced features test completed.');
  }
}

testEnhancedFeatures().catch(console.error);