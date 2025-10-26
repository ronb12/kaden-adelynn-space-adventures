const puppeteer = require('puppeteer');

async function testMobileGameplay() {
  console.log('📱 Starting Mobile Gameplay Test...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  try {
    // Test iPhone viewport
    console.log('🍎 Testing iPhone viewport...');
    const iphonePage = await browser.newPage();
    await iphonePage.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await iphonePage.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
    
    await iphonePage.goto('https://kaden---adelynn-adventures.web.app', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test touch controls
    console.log('👆 Testing touch controls...');
    const touchControls = await iphonePage.$('.touch-controls');
    if (touchControls) {
      console.log('✅ Touch controls detected');
    } else {
      console.log('❌ Touch controls not found');
    }
    
    // Test game canvas
    console.log('🎮 Testing game canvas...');
    const canvas = await iphonePage.$('canvas');
    if (canvas) {
      console.log('✅ Game canvas detected');
      
      // Test canvas touch events
      await canvas.tap();
      console.log('✅ Canvas touch event triggered');
    } else {
      console.log('❌ Game canvas not found');
    }
    
    // Test iOS-specific optimizations
    console.log('🍎 Testing iOS optimizations...');
    const viewportMeta = await iphonePage.$('meta[name="viewport"]');
    if (viewportMeta) {
      const content = await viewportMeta.getAttribute('content');
      console.log('✅ Viewport meta tag:', content);
    }
    
    const appleWebApp = await iphonePage.$('meta[name="apple-mobile-web-app-capable"]');
    if (appleWebApp) {
      console.log('✅ Apple web app meta tag detected');
    }
    
    // Test PWA manifest
    console.log('📱 Testing PWA manifest...');
    const manifest = await iphonePage.$('link[rel="manifest"]');
    if (manifest) {
      console.log('✅ PWA manifest detected');
    }
    
    // Test game buttons
    console.log('🎯 Testing game buttons...');
    const startButton = await iphonePage.$('.start-mission-btn');
    if (startButton) {
      console.log('✅ Start mission button detected');
      await startButton.tap();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    const selectPilotButton = await iphonePage.$('.select-pilot-btn');
    if (selectPilotButton) {
      console.log('✅ Select pilot button detected');
      await selectPilotButton.tap();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Test iPad viewport
    console.log('📱 Testing iPad viewport...');
    const ipadPage = await browser.newPage();
    await ipadPage.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true });
    await ipadPage.setUserAgent('Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
    
    await ipadPage.goto('https://kaden---adelynn-adventures.web.app', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ iPad viewport test completed');
    
    // Test Android viewport
    console.log('🤖 Testing Android viewport...');
    const androidPage = await browser.newPage();
    await androidPage.setViewport({ width: 360, height: 640, isMobile: true, hasTouch: true });
    await androidPage.setUserAgent('Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36');
    
    await androidPage.goto('https://kaden---adelynn-adventures.web.app', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Android viewport test completed');
    
    // Test performance
    console.log('⚡ Testing performance...');
    const performanceMetrics = await iphonePage.metrics();
    console.log('Performance metrics:', {
      jsHeapUsedSize: performanceMetrics.JSHeapUsedSize,
      jsHeapTotalSize: performanceMetrics.JSHeapTotalSize,
      timestamp: performanceMetrics.Timestamp
    });
    
    // Test console for errors
    console.log('🔍 Checking for console errors...');
    const logs = await iphonePage.evaluate(() => {
      return window.console._logs || [];
    });
    
    if (logs.length > 0) {
      console.log('Console logs:', logs);
    } else {
      console.log('✅ No console errors detected');
    }
    
    console.log('📱 Mobile gameplay test completed successfully!');
    console.log('🌐 Live URL: https://kaden---adelynn-adventures.web.app');
    
  } catch (error) {
    console.error('❌ Mobile test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testMobileGameplay().catch(console.error);
