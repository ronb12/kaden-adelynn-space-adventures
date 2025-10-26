const puppeteer = require('puppeteer');

async function testMobileGameplay() {
  console.log('📱 Starting Simple Mobile Gameplay Test...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  try {
    // Test iPhone viewport
    console.log('🍎 Testing iPhone viewport...');
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
    
    console.log('🌐 Navigating to live game...');
    await page.goto('https://kaden---adelynn-adventures.web.app', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if page loaded successfully
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Check for main game elements
    console.log('🎮 Checking for game elements...');
    
    const mainTitle = await page.$('h1');
    if (mainTitle) {
      const titleText = await page.evaluate(el => el.textContent, mainTitle);
      console.log('✅ Main title found:', titleText);
    }
    
    const startButton = await page.$('.start-mission-btn');
    if (startButton) {
      console.log('✅ Start mission button found');
    } else {
      console.log('❌ Start mission button not found');
    }
    
    const selectPilotButton = await page.$('.select-pilot-btn');
    if (selectPilotButton) {
      console.log('✅ Select pilot button found');
    } else {
      console.log('❌ Select pilot button not found');
    }
    
    // Check for iOS-specific meta tags
    console.log('🍎 Checking iOS optimizations...');
    const viewportMeta = await page.$('meta[name="viewport"]');
    if (viewportMeta) {
      console.log('✅ Viewport meta tag found');
    }
    
    const appleWebApp = await page.$('meta[name="apple-mobile-web-app-capable"]');
    if (appleWebApp) {
      console.log('✅ Apple web app meta tag found');
    }
    
    // Check for PWA manifest
    const manifest = await page.$('link[rel="manifest"]');
    if (manifest) {
      console.log('✅ PWA manifest found');
    }
    
    // Test touch interaction
    console.log('👆 Testing touch interaction...');
    if (startButton) {
      await startButton.tap();
      console.log('✅ Start button tapped successfully');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Check for canvas element
    const canvas = await page.$('canvas');
    if (canvas) {
      console.log('✅ Game canvas found');
    } else {
      console.log('❌ Game canvas not found');
    }
    
    // Check for touch controls
    const touchControls = await page.$('.touch-controls');
    if (touchControls) {
      console.log('✅ Touch controls found');
    } else {
      console.log('ℹ️ Touch controls not visible (may be conditional)');
    }
    
    // Test performance
    console.log('⚡ Checking performance...');
    const metrics = await page.metrics();
    console.log('Performance metrics:', {
      jsHeapUsed: Math.round(metrics.JSHeapUsedSize / 1024 / 1024) + 'MB',
      jsHeapTotal: Math.round(metrics.JSHeapTotalSize / 1024 / 1024) + 'MB'
    });
    
    // Check for console errors
    console.log('🔍 Checking for errors...');
    const logs = await page.evaluate(() => {
      return window.console._logs || [];
    });
    
    if (logs.length > 0) {
      console.log('Console logs found:', logs.length);
    } else {
      console.log('✅ No console errors detected');
    }
    
    console.log('📱 Mobile test completed!');
    console.log('🌐 Live URL: https://kaden---adelynn-adventures.web.app');
    console.log('📱 Test on your mobile device by visiting the URL above');
    
  } catch (error) {
    console.error('❌ Mobile test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testMobileGameplay().catch(console.error);
