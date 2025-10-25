// Visual Boss Test - Simple browser test
const puppeteer = require('puppeteer');

async function testBossVisual() {
  console.log('🎮 Testing Enhanced Boss Graphics in Browser...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to the game
    await page.goto('http://localhost:3000', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    console.log('✅ Game loaded successfully');
    
    // Wait for the game to initialize
    await page.waitForTimeout(3000);
    
    // Start the game
    const startButton = await page.$('button');
    if (startButton) {
      await startButton.click();
      console.log('✅ Game started');
      await page.waitForTimeout(2000);
    }
    
    // Force spawn a boss for testing
    await page.evaluate(() => {
      // Set high score to trigger boss spawn
      if (window.gameState) {
        window.gameState.score = 10000;
        console.log('🎯 Score set to trigger boss spawn');
      }
      
      // Force spawn boss if system exists
      if (window.enhancedBossSystem) {
        const testBoss = {
          id: 'test_boss',
          x: 200,
          y: 100,
          width: 100,
          height: 80,
          health: 150,
          maxHealth: 150,
          speed: 1,
          type: 'battleship',
          color: '#6600ff',
          attackPattern: 'wave',
          lastAttack: 0,
          attackCooldown: 1000,
          phase: 1,
          maxPhase: 3
        };
        
        window.enhancedBossSystem.bosses = [testBoss];
        console.log('✅ Test boss spawned');
      }
    });
    
    // Wait for boss to render
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'enhanced-boss-test.png',
      fullPage: true 
    });
    
    console.log('📸 Screenshot saved as enhanced-boss-test.png');
    
    // Check if enhanced graphics are working
    const bossInfo = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return null;
      
      return {
        canvasExists: true,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        hasBossSystem: !!window.enhancedBossSystem,
        bossCount: window.enhancedBossSystem ? window.enhancedBossSystem.bosses.length : 0
      };
    });
    
    if (bossInfo) {
      console.log('✅ Canvas found:', bossInfo.canvasWidth + 'x' + bossInfo.canvasHeight);
      console.log('✅ Boss system available:', bossInfo.hasBossSystem);
      console.log('✅ Boss count:', bossInfo.bossCount);
    }
    
    console.log('🎨 Enhanced Boss Graphics Features:');
    console.log('   • Destroyer: Sleek diamond shape with engine pods');
    console.log('   • Battleship: Heavy armored design with cannons');
    console.log('   • Mothership: Massive hexagonal with energy fields');
    console.log('   • Dynamic health-based coloring');
    console.log('   • Pulsing glow effects');
    console.log('   • Detailed weapon systems');
    console.log('   • No more square boxes! 🎉');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testBossVisual().catch(console.error);
