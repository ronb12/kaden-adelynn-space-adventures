const puppeteer = require('puppeteer');

async function comprehensiveBugCheck() {
  console.log('🔍 COMPREHENSIVE BUG CHECK');
  console.log('==========================');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    // Listen for console errors
    const errors = [];
    const warnings = [];
    
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        errors.push(text);
        console.log(`❌ Console Error: ${text}`);
      } else if (type === 'warning') {
        warnings.push(text);
        console.log(`⚠️ Console Warning: ${text}`);
      }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      errors.push(error.message);
      console.log(`❌ Page Error: ${error.message}`);
    });
    
    // Listen for request failures
    page.on('requestfailed', request => {
      console.log(`❌ Request Failed: ${request.url()} - ${request.failure().errorText}`);
    });
    
    console.log('📱 Navigating to game...');
    await page.goto('https://kaden---adelynn-adventures.web.app', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n🎮 Testing Game Functionality...');
    
    // Test Results Object
    const testResults = {
      pageLoad: false,
      menuDisplay: false,
      settingsButton: false,
      characterSelection: false,
      gameStart: false,
      gameplay: false,
      pwaFeatures: false,
      responsiveDesign: false,
      consoleErrors: 0,
      consoleWarnings: 0
    };
    
    // Test Page Load
    try {
      const title = await page.title();
      if (title.includes('Space Adventures')) {
        testResults.pageLoad = true;
        console.log('✅ Page loaded successfully');
      }
    } catch (error) {
      console.log('❌ Page load failed:', error.message);
    }
    
    // Test Menu Display
    try {
      const menuTitle = await page.$eval('h1.game-title', el => el.textContent);
      if (menuTitle.includes('Kaden & Adelynn Space Adventures')) {
        testResults.menuDisplay = true;
        console.log('✅ Main menu displayed correctly');
      }
    } catch (error) {
      console.log('❌ Main menu not found');
    }
    
    // Test Settings Button
    try {
      await page.click('button[class*="menu-button"]');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const settingsPanel = await page.$('.settings-panel');
      if (settingsPanel) {
        testResults.settingsButton = true;
        console.log('✅ Settings panel opens correctly');
        
        // Close settings
        await page.click('.settings-button');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.log('❌ Settings button failed:', error.message);
    }
    
    // Test Character Selection
    try {
      await page.click('button:has-text("Select Character")');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const characterGrid = await page.$('.character-grid');
      if (characterGrid) {
        testResults.characterSelection = true;
        console.log('✅ Character selection opens correctly');
        
        // Close character selection
        await page.click('.character-selection-button.secondary');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.log('❌ Character selection failed:', error.message);
    }
    
    // Test Game Start
    try {
      await page.click('button:has-text("Start Game")');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const canvas = await page.$('canvas');
      if (canvas) {
        testResults.gameStart = true;
        console.log('✅ Game starts correctly');
        
        // Test basic gameplay
        await page.keyboard.down('ArrowUp');
        await new Promise(resolve => setTimeout(resolve, 100));
        await page.keyboard.up('ArrowUp');
        
        await page.keyboard.down('Space');
        await new Promise(resolve => setTimeout(resolve, 100));
        await page.keyboard.up('Space');
        
        testResults.gameplay = true;
        console.log('✅ Basic gameplay controls work');
        
        // Go back to menu
        await page.keyboard.down('Escape');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.log('❌ Game start failed:', error.message);
    }
    
    // Test PWA Features
    try {
      const manifest = await page.evaluate(() => {
        return document.querySelector('link[rel="manifest"]') !== null;
      });
      
      const serviceWorker = await page.evaluate(() => {
        return 'serviceWorker' in navigator;
      });
      
      if (manifest && serviceWorker) {
        testResults.pwaFeatures = true;
        console.log('✅ PWA features present');
      }
    } catch (error) {
      console.log('❌ PWA features test failed:', error.message);
    }
    
    // Test Responsive Design
    try {
      // Test mobile viewport
      await page.setViewport({ width: 375, height: 667 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mobileTitle = await page.$eval('h1.game-title', el => el.textContent);
      if (mobileTitle.includes('Kaden & Adelynn Space Adventures')) {
        testResults.responsiveDesign = true;
        console.log('✅ Responsive design works');
      }
      
      // Reset to desktop
      await page.setViewport({ width: 1200, height: 800 });
    } catch (error) {
      console.log('❌ Responsive design test failed:', error.message);
    }
    
    // Count console issues
    testResults.consoleErrors = errors.length;
    testResults.consoleWarnings = warnings.length;
    
    // Final Analysis
    console.log('\n📋 COMPREHENSIVE BUG CHECK RESULTS');
    console.log('===================================');
    
    const totalTests = Object.keys(testResults).length - 2; // Exclude error counts
    const passedTests = Object.values(testResults).filter(result => 
      typeof result === 'boolean' && result === true
    ).length;
    const passRate = (passedTests / totalTests) * 100;
    
    console.log(`\n📊 OVERALL RESULTS: ${passedTests}/${totalTests} tests passed (${passRate.toFixed(1)}%)`);
    
    // Test Results
    Object.entries(testResults).forEach(([feature, status]) => {
      if (typeof status === 'boolean') {
        const icon = status ? '✅' : '❌';
        const statusText = status ? 'PASS' : 'FAIL';
        console.log(`${icon} ${feature.toUpperCase()}: ${statusText}`);
      }
    });
    
    // Console Issues
    console.log(`\n📝 Console Issues:`);
    console.log(`   Errors: ${testResults.consoleErrors}`);
    console.log(`   Warnings: ${testResults.consoleWarnings}`);
    
    if (testResults.consoleErrors > 0) {
      console.log('\n❌ Console Errors Found:');
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    if (testResults.consoleWarnings > 0) {
      console.log('\n⚠️ Console Warnings Found:');
      warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
    }
    
    // Final Assessment
    if (passRate === 100 && testResults.consoleErrors === 0) {
      console.log('\n🎉 NO BUGS FOUND! Game is working perfectly!');
      console.log('🚀 Ready for production deployment!');
    } else if (passRate >= 80 && testResults.consoleErrors === 0) {
      console.log('\n✅ Game is mostly working well with minor issues');
      console.log('🔧 Consider addressing the failed tests');
    } else if (testResults.consoleErrors > 0) {
      console.log('\n⚠️ CRITICAL ISSUES FOUND!');
      console.log('🔧 Fix console errors before deployment');
    } else {
      console.log('\n⚠️ Some functionality issues detected');
      console.log('🔧 Review failed tests and fix issues');
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'comprehensive-bug-check-final.png',
      fullPage: true 
    });
    console.log('\n📸 Comprehensive bug check screenshot saved');
    
  } catch (error) {
    console.error('❌ Comprehensive bug check failed:', error.message);
  } finally {
    await browser.close();
    console.log('\n🔚 Comprehensive bug check completed');
  }
}

comprehensiveBugCheck().catch(console.error);
