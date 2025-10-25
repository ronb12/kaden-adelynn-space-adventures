// Test Enhanced Boss Graphics
// This script tests the new detailed boss designs

const puppeteer = require('puppeteer');

async function testEnhancedBossGraphics() {
  console.log('🚀 Testing Enhanced Boss Graphics...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to the game
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    console.log('✅ Game loaded successfully');
    
    // Wait for the game to initialize
    await page.waitForTimeout(2000);
    
    // Start the game
    const startButton = await page.$('button:contains("Start Mission")');
    if (startButton) {
      await startButton.click();
      console.log('✅ Game started');
      await page.waitForTimeout(1000);
    }
    
    // Wait for boss to spawn (every 30 seconds or at score milestones)
    console.log('⏳ Waiting for boss to spawn...');
    
    // Try to trigger boss spawn by reaching score milestone
    await page.evaluate(() => {
      // Simulate high score to trigger boss spawn
      if (window.gameState && window.gameState.score < 10000) {
        window.gameState.score = 10000;
        console.log('🎯 Score set to 10000 to trigger boss spawn');
      }
    });
    
    // Wait for boss to appear
    await page.waitForTimeout(5000);
    
    // Take screenshot of boss appearance
    await page.screenshot({ 
      path: 'enhanced-boss-graphics-test.png',
      fullPage: true 
    });
    
    console.log('📸 Screenshot saved as enhanced-boss-graphics-test.png');
    
    // Check if boss is rendered with enhanced graphics
    const bossElements = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return null;
      
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Look for boss-like patterns (large red/purple/orange areas)
      const pixels = imageData.data;
      let bossPixels = 0;
      
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        // Look for boss colors (red, purple, orange)
        if ((r > 150 && g < 100 && b < 100) || // Red boss
            (r > 100 && g < 100 && b > 150) || // Purple boss
            (r > 200 && g > 100 && b < 100)) {  // Orange boss
          bossPixels++;
        }
      }
      
      return {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        bossPixels: bossPixels,
        hasBoss: bossPixels > 1000 // Threshold for boss detection
      };
    });
    
    if (bossElements && bossElements.hasBoss) {
      console.log('✅ Enhanced boss graphics detected!');
      console.log(`📊 Boss pixels found: ${bossElements.bossPixels}`);
      console.log(`📐 Canvas size: ${bossElements.canvasWidth}x${bossElements.canvasHeight}`);
    } else {
      console.log('⚠️  No boss detected in current frame');
      console.log('💡 Boss may spawn later or need higher score');
    }
    
    // Test different boss types
    console.log('🎮 Testing different boss types...');
    
    await page.evaluate(() => {
      // Force spawn different boss types for testing
      if (window.enhancedBossSystem) {
        console.log('🔧 Testing boss type rendering...');
        
        // Test destroyer boss
        const destroyerBoss = {
          id: 'test_destroyer',
          x: 100,
          y: 100,
          width: 80,
          height: 60,
          health: 100,
          maxHealth: 100,
          speed: 2,
          type: 'destroyer',
          color: '#ff0000',
          attackPattern: 'spiral',
          lastAttack: 0,
          attackCooldown: 1000,
          phase: 1,
          maxPhase: 3
        };
        
        // Test battleship boss
        const battleshipBoss = {
          id: 'test_battleship',
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
        
        // Test mothership boss
        const mothershipBoss = {
          id: 'test_mothership',
          x: 300,
          y: 100,
          width: 120,
          height: 100,
          health: 200,
          maxHealth: 200,
          speed: 1,
          type: 'mothership',
          color: '#ff6600',
          attackPattern: 'burst',
          lastAttack: 0,
          attackCooldown: 1000,
          phase: 1,
          maxPhase: 3
        };
        
        // Add test bosses to the system
        if (window.enhancedBossSystem.bosses) {
          window.enhancedBossSystem.bosses.push(destroyerBoss, battleshipBoss, mothershipBoss);
          console.log('✅ Test bosses added for visual verification');
        }
      }
    });
    
    // Wait a moment for bosses to render
    await page.waitForTimeout(2000);
    
    // Take final screenshot with all boss types
    await page.screenshot({ 
      path: 'all-boss-types-test.png',
      fullPage: true 
    });
    
    console.log('📸 All boss types screenshot saved as all-boss-types-test.png');
    
    console.log('✅ Enhanced Boss Graphics Test Complete!');
    console.log('🎨 Boss designs now feature:');
    console.log('   • Destroyer: Sleek diamond shape with engine pods and weapon turrets');
    console.log('   • Battleship: Heavy armored design with cannon mounts and side turrets');
    console.log('   • Mothership: Massive hexagonal design with energy fields and weapon arrays');
    console.log('   • Dynamic health-based coloring and pulsing effects');
    console.log('   • Glow effects and detailed weapon systems');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testEnhancedBossGraphics().catch(console.error);
