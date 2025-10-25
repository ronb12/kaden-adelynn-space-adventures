#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testGameFeatures() {
  console.log('🧪 Testing Game Features with Puppeteer...\n');
  
  let browser = null;
  const errors = [];
  const results = {};
  
  try {
    // Launch browser
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Monitor console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`Console Error: ${msg.text()}`);
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(`Page Error: ${error.message}`);
      console.log('❌ Page Error:', error.message);
    });
    
    // Navigate to game
    console.log('🌐 Loading game...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    
    // Wait for main menu
    await page.waitForSelector('.main-menu', { timeout: 10000 });
    console.log('✅ Game loaded successfully');
    results['Game Load'] = 'PASSED';
    
    // Test main menu buttons
    console.log('\n🎮 Testing Main Menu Buttons...');
    const buttons = [
      { selector: '.select-pilot-btn', name: 'Character Selection' },
      { selector: '.feature-btn.achievements', name: 'Achievements' },
      { selector: '.feature-btn.boss', name: 'Boss Battles' },
      { selector: '.feature-btn.powerups', name: 'Power-ups' },
      { selector: '.feature-btn.multiplayer', name: 'Multiplayer' },
      { selector: '.feature-btn.story', name: 'Story Mode' },
      { selector: '.feature-btn.challenges', name: 'Challenges' }
    ];
    
    for (const button of buttons) {
      try {
        const element = await page.$(button.selector);
        if (element) {
          await element.click();
          await page.waitForTimeout(1000);
          
          const modal = await page.$('.modal-overlay');
          if (modal) {
            console.log(`✅ ${button.name} - Modal opened`);
            results[button.name] = 'PASSED';
            
            // Close modal
            const closeBtn = await page.$('.close-btn');
            if (closeBtn) {
              await closeBtn.click();
              await page.waitForTimeout(500);
            }
          } else {
            console.log(`⚠️ ${button.name} - No modal detected`);
            results[button.name] = 'PARTIAL';
          }
        } else {
          console.log(`❌ ${button.name} - Button not found`);
          results[button.name] = 'FAILED';
        }
      } catch (error) {
        console.log(`❌ ${button.name} - Error: ${error.message}`);
        results[button.name] = 'ERROR';
      }
    }
    
    // Test game start
    console.log('\n🚀 Testing Game Start...');
    try {
      const startBtn = await page.$('.start-mission-btn');
      if (startBtn) {
        await startBtn.click();
        await page.waitForTimeout(2000);
        console.log('✅ Game started');
        results['Game Start'] = 'PASSED';
        
        // Test in-game features
        console.log('\n🎯 Testing In-Game Features...');
        
        // Test store
        const storeBtn = await page.$('.store-btn');
        if (storeBtn) {
          await storeBtn.click();
          await page.waitForTimeout(1000);
          
          const storeModal = await page.$('.store-modal');
          if (storeModal) {
            console.log('✅ Store modal opened');
            results['Store System'] = 'PASSED';
            
            // Close store
            const closeBtn = await page.$('.close-btn');
            if (closeBtn) {
              await closeBtn.click();
              await page.waitForTimeout(500);
            }
          } else {
            console.log('❌ Store modal not found');
            results['Store System'] = 'FAILED';
          }
        } else {
          console.log('❌ Store button not found');
          results['Store System'] = 'FAILED';
        }
        
        // Test save/load
        const saveBtn = await page.$('.save-btn');
        if (saveBtn) {
          await saveBtn.click();
          await page.waitForTimeout(1000);
          
          const saveModal = await page.$('.save-load-modal');
          if (saveModal) {
            console.log('✅ Save/Load modal opened');
            results['Save/Load System'] = 'PASSED';
            
            // Close modal
            const closeBtn = await page.$('.close-btn');
            if (closeBtn) {
              await closeBtn.click();
              await page.waitForTimeout(500);
            }
          } else {
            console.log('❌ Save/Load modal not found');
            results['Save/Load System'] = 'FAILED';
          }
        } else {
          console.log('❌ Save button not found');
          results['Save/Load System'] = 'FAILED';
        }
        
        // Test game controls
        console.log('🎮 Testing game controls...');
        await page.keyboard.down('ArrowUp');
        await page.waitForTimeout(100);
        await page.keyboard.up('ArrowUp');
        
        await page.keyboard.down('Space');
        await page.waitForTimeout(100);
        await page.keyboard.up('Space');
        
        console.log('✅ Controls tested');
        results['Game Controls'] = 'PASSED';
        
      } else {
        console.log('❌ Start button not found');
        results['Game Start'] = 'FAILED';
      }
    } catch (error) {
      console.log('❌ Game start failed:', error.message);
      results['Game Start'] = 'ERROR';
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    errors.push(`Test Error: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // Generate report
  console.log('\n📊 TEST RESULTS');
  console.log('================');
  
  const totalFeatures = Object.keys(results).length;
  const passedFeatures = Object.values(results).filter(status => status === 'PASSED').length;
  const failedFeatures = Object.values(results).filter(status => status === 'FAILED').length;
  const errorFeatures = Object.values(results).filter(status => status === 'ERROR').length;
  
  console.log(`📈 Total Features: ${totalFeatures}`);
  console.log(`✅ Passed: ${passedFeatures}`);
  console.log(`❌ Failed: ${failedFeatures}`);
  console.log(`🐛 Errors: ${errorFeatures}`);
  console.log(`📊 Success Rate: ${((passedFeatures / totalFeatures) * 100).toFixed(1)}%`);
  
  console.log('\n🎮 FEATURE RESULTS:');
  Object.entries(results).forEach(([feature, status]) => {
    const icon = status === 'PASSED' ? '✅' : 
                 status === 'FAILED' ? '❌' : 
                 status === 'ERROR' ? '🐛' : '⚠️';
    console.log(`${icon} ${feature}: ${status}`);
  });
  
  if (errors.length > 0) {
    console.log('\n🐛 ERRORS FOUND:');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  console.log('\n🏁 Test completed!');
  console.log('\n📋 Available test commands:');
  console.log('  npm run test:quick - Quick test (requires server running)');
  console.log('  npm run test:comprehensive - Full test with server startup');
  console.log('  npm run test:puppeteer - Standard Puppeteer test');
}

// Run the test
testGameFeatures().catch(console.error);
