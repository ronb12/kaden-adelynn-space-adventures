#!/usr/bin/env node

/**
 * iOS Compatibility Test - Comprehensive analysis of iOS device support
 * Tests all iOS devices from iPhone SE to iPad Pro
 */

const puppeteer = require('puppeteer');

// iOS Device Configurations
const iOSDevices = [
  // iPhone devices
  { name: 'iPhone SE (1st gen)', width: 320, height: 568, pixelRatio: 2 },
  { name: 'iPhone SE (2nd gen)', width: 375, height: 667, pixelRatio: 2 },
  { name: 'iPhone SE (3rd gen)', width: 375, height: 667, pixelRatio: 2 },
  { name: 'iPhone 8', width: 375, height: 667, pixelRatio: 2 },
  { name: 'iPhone 8 Plus', width: 414, height: 736, pixelRatio: 3 },
  { name: 'iPhone X', width: 375, height: 812, pixelRatio: 3 },
  { name: 'iPhone XR', width: 414, height: 896, pixelRatio: 2 },
  { name: 'iPhone XS', width: 375, height: 812, pixelRatio: 3 },
  { name: 'iPhone XS Max', width: 414, height: 896, pixelRatio: 3 },
  { name: 'iPhone 11', width: 414, height: 896, pixelRatio: 2 },
  { name: 'iPhone 11 Pro', width: 375, height: 812, pixelRatio: 3 },
  { name: 'iPhone 11 Pro Max', width: 414, height: 896, pixelRatio: 3 },
  { name: 'iPhone 12 mini', width: 375, height: 812, pixelRatio: 3 },
  { name: 'iPhone 12', width: 390, height: 844, pixelRatio: 3 },
  { name: 'iPhone 12 Pro', width: 390, height: 844, pixelRatio: 3 },
  { name: 'iPhone 12 Pro Max', width: 428, height: 926, pixelRatio: 3 },
  { name: 'iPhone 13 mini', width: 375, height: 812, pixelRatio: 3 },
  { name: 'iPhone 13', width: 390, height: 844, pixelRatio: 3 },
  { name: 'iPhone 13 Pro', width: 390, height: 844, pixelRatio: 3 },
  { name: 'iPhone 13 Pro Max', width: 428, height: 926, pixelRatio: 3 },
  { name: 'iPhone 14', width: 390, height: 844, pixelRatio: 3 },
  { name: 'iPhone 14 Plus', width: 428, height: 926, pixelRatio: 3 },
  { name: 'iPhone 14 Pro', width: 393, height: 852, pixelRatio: 3 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932, pixelRatio: 3 },
  { name: 'iPhone 15', width: 393, height: 852, pixelRatio: 3 },
  { name: 'iPhone 15 Plus', width: 430, height: 932, pixelRatio: 3 },
  { name: 'iPhone 15 Pro', width: 393, height: 852, pixelRatio: 3 },
  { name: 'iPhone 15 Pro Max', width: 430, height: 932, pixelRatio: 3 },
  
  // iPad devices
  { name: 'iPad (9th gen)', width: 810, height: 1080, pixelRatio: 2 },
  { name: 'iPad (10th gen)', width: 820, height: 1180, pixelRatio: 2 },
  { name: 'iPad Air (4th gen)', width: 820, height: 1180, pixelRatio: 2 },
  { name: 'iPad Air (5th gen)', width: 820, height: 1180, pixelRatio: 2 },
  { name: 'iPad Pro 11" (3rd gen)', width: 834, height: 1194, pixelRatio: 2 },
  { name: 'iPad Pro 11" (4th gen)', width: 834, height: 1194, pixelRatio: 2 },
  { name: 'iPad Pro 12.9" (5th gen)', width: 1024, height: 1366, pixelRatio: 2 },
  { name: 'iPad Pro 12.9" (6th gen)', width: 1024, height: 1366, pixelRatio: 2 }
];

async function testiOSCompatibility() {
  console.log('🍎 iOS Compatibility Test Starting...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = [];
  
  for (const device of iOSDevices) {
    console.log(`📱 Testing ${device.name} (${device.width}x${device.height})...`);
    
    try {
      const page = await browser.newPage();
      
      // Set device viewport
      await page.setViewport({
        width: device.width,
        height: device.height,
        deviceScaleFactor: device.pixelRatio,
        isMobile: device.width < 768,
        hasTouch: true
      });
      
      // Set user agent for iOS Safari
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
      
      // Navigate to the game
      await page.goto('https://kaden---adelynn-adventures.web.app', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait for game to load
      await page.waitForSelector('.app', { timeout: 10000 });
      
      // Test canvas rendering
      const canvasExists = await page.$('canvas') !== null;
      const canvasSize = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return null;
        return {
          width: canvas.width,
          height: canvas.height,
          clientWidth: canvas.clientWidth,
          clientHeight: canvas.clientHeight
        };
      });
      
      // Test touch controls
      const touchControlsVisible = await page.evaluate(() => {
        const touchControls = document.querySelector('.touch-controls');
        return touchControls ? touchControls.style.display !== 'none' : false;
      });
      
      // Test responsive design
      const responsiveTest = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return false;
        
        const container = canvas.parentElement;
        if (!container) return false;
        
        const containerRect = container.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        return {
          canvasFitsContainer: canvasRect.width <= containerRect.width && canvasRect.height <= containerRect.height,
          aspectRatioMaintained: Math.abs((canvasRect.width / canvasRect.height) - (800 / 600)) < 0.1,
          noOverflow: canvasRect.width <= window.innerWidth && canvasRect.height <= window.innerHeight
        };
      });
      
      // Test game functionality
      const gameFunctional = await page.evaluate(() => {
        // Check if game systems are loaded
        const hasGameScene = document.querySelector('.game-scene') !== null;
        const hasMenu = document.querySelector('.main-menu') !== null;
        const hasTouchControls = document.querySelector('.touch-controls') !== null;
        
        return {
          hasGameScene,
          hasMenu,
          hasTouchControls,
          allSystemsLoaded: hasGameScene && hasMenu
        };
      });
      
      const result = {
        device: device.name,
        dimensions: `${device.width}x${device.height}`,
        pixelRatio: device.pixelRatio,
        canvasExists,
        canvasSize,
        touchControlsVisible,
        responsiveTest,
        gameFunctional,
        success: canvasExists && gameFunctional.allSystemsLoaded && responsiveTest.canvasFitsContainer
      };
      
      results.push(result);
      
      if (result.success) {
        console.log(`✅ ${device.name} - PASSED`);
      } else {
        console.log(`❌ ${device.name} - FAILED`);
        if (!canvasExists) console.log('   - Canvas not found');
        if (!gameFunctional.allSystemsLoaded) console.log('   - Game systems not loaded');
        if (!responsiveTest.canvasFitsContainer) console.log('   - Canvas overflow detected');
      }
      
      await page.close();
      
    } catch (error) {
      console.log(`❌ ${device.name} - ERROR: ${error.message}`);
      results.push({
        device: device.name,
        error: error.message,
        success: false
      });
    }
  }
  
  await browser.close();
  
  // Generate report
  console.log('\n📊 iOS Compatibility Report:');
  console.log('============================');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  const passRate = (passed / total * 100).toFixed(1);
  
  console.log(`\n✅ Passed: ${passed}/${total} (${passRate}%)`);
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ Failed Devices:');
    failed.forEach(device => {
      console.log(`   - ${device.device}: ${device.error || 'Compatibility issues detected'}`);
    });
  }
  
  // Recommendations
  console.log('\n🔧 Recommendations:');
  if (passRate < 90) {
    console.log('   - Add more iOS-specific viewport optimizations');
    console.log('   - Improve canvas scaling for smaller devices');
    console.log('   - Add more touch control optimizations');
  }
  
  console.log('\n🎮 iOS Compatibility Test Complete!');
}

// Run the test
testiOSCompatibility().catch(console.error);
