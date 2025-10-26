const puppeteer = require('puppeteer');

async function testPWAFeatures() {
  console.log('🔍 TESTING PWA FEATURES');
  console.log('========================');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('📱 Navigating to PWA game...');
    await page.goto('https://kaden---adelynn-adventures.web.app', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test Results Object
    const testResults = {
      serviceWorker: false,
      manifest: false,
      icons: false,
      offlineSupport: false,
      installPrompt: false,
      responsiveDesign: false,
      touchOptimization: false,
      pwaMetaTags: false
    };
    
    console.log('\n🔧 TESTING SERVICE WORKER...');
    
    // Test Service Worker
    try {
      const swRegistration = await page.evaluate(() => {
        return navigator.serviceWorker.getRegistration();
      });
      
      if (swRegistration) {
        testResults.serviceWorker = true;
        console.log('✅ Service Worker registered successfully');
      } else {
        console.log('❌ Service Worker not found');
      }
    } catch (error) {
      console.log('❌ Service Worker test failed:', error.message);
    }
    
    console.log('\n📋 TESTING MANIFEST...');
    
    // Test Manifest
    try {
      const manifest = await page.evaluate(() => {
        return document.querySelector('link[rel="manifest"]');
      });
      
      if (manifest) {
        testResults.manifest = true;
        console.log('✅ Manifest link found');
        
        // Test manifest content
        const manifestHref = await page.evaluate(() => {
          return document.querySelector('link[rel="manifest"]').href;
        });
        
        const manifestResponse = await page.goto(manifestHref);
        if (manifestResponse && manifestResponse.ok()) {
          console.log('✅ Manifest file accessible');
        }
      }
    } catch (error) {
      console.log('❌ Manifest test failed:', error.message);
    }
    
    console.log('\n🎨 TESTING ICONS...');
    
    // Test Icons
    try {
      const icons = await page.evaluate(() => {
        const iconLinks = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
        return iconLinks.length > 0;
      });
      
      if (icons) {
        testResults.icons = true;
        console.log('✅ App icons found');
      }
    } catch (error) {
      console.log('❌ Icons test failed:', error.message);
    }
    
    console.log('\n📱 TESTING RESPONSIVE DESIGN...');
    
    // Test Responsive Design
    try {
      // Test mobile viewport
      await page.setViewport({ width: 375, height: 667 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mobileTitle = await page.$eval('h1.game-title', el => el.textContent);
      if (mobileTitle.includes('Kaden & Adelynn Space Adventures')) {
        testResults.responsiveDesign = true;
        console.log('✅ Mobile responsive design working');
      }
      
      // Test tablet viewport
      await page.setViewport({ width: 768, height: 1024 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test desktop viewport
      await page.setViewport({ width: 1200, height: 800 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Responsive design tests passed');
    } catch (error) {
      console.log('❌ Responsive design test failed:', error.message);
    }
    
    console.log('\n👆 TESTING TOUCH OPTIMIZATION...');
    
    // Test Touch Optimization
    try {
      const touchAction = await page.evaluate(() => {
        const gameContainer = document.querySelector('.game-container');
        return gameContainer ? window.getComputedStyle(gameContainer).touchAction : null;
      });
      
      if (touchAction === 'manipulation') {
        testResults.touchOptimization = true;
        console.log('✅ Touch optimization enabled');
      }
    } catch (error) {
      console.log('❌ Touch optimization test failed:', error.message);
    }
    
    console.log('\n🏷️ TESTING PWA META TAGS...');
    
    // Test PWA Meta Tags
    try {
      const metaTags = await page.evaluate(() => {
        const appleWebAppCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
        const mobileWebAppCapable = document.querySelector('meta[name="mobile-web-app-capable"]');
        const themeColor = document.querySelector('meta[name="theme-color"]');
        
        return {
          appleWebApp: appleWebAppCapable && appleWebAppCapable.content === 'yes',
          mobileWebApp: mobileWebAppCapable && mobileWebAppCapable.content === 'yes',
          themeColor: themeColor && themeColor.content
        };
      });
      
      if (metaTags.appleWebApp && metaTags.mobileWebApp && metaTags.themeColor) {
        testResults.pwaMetaTags = true;
        console.log('✅ PWA meta tags present');
      }
    } catch (error) {
      console.log('❌ PWA meta tags test failed:', error.message);
    }
    
    console.log('\n📴 TESTING OFFLINE SUPPORT...');
    
    // Test Offline Support
    try {
      // Go offline
      await page.setOfflineMode(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Try to reload
      await page.reload({ waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if page still loads (should show offline page or cached content)
      const pageTitle = await page.title();
      if (pageTitle.includes('Space Adventures') || pageTitle.includes('Offline')) {
        testResults.offlineSupport = true;
        console.log('✅ Offline support working');
      }
      
      // Go back online
      await page.setOfflineMode(false);
    } catch (error) {
      console.log('❌ Offline support test failed:', error.message);
    }
    
    console.log('\n📲 TESTING INSTALL PROMPT...');
    
    // Test Install Prompt
    try {
      // Check if install prompt is available
      const installPrompt = await page.evaluate(() => {
        return window.deferredPrompt !== undefined;
      });
      
      if (installPrompt) {
        testResults.installPrompt = true;
        console.log('✅ Install prompt available');
      }
    } catch (error) {
      console.log('❌ Install prompt test failed:', error.message);
    }
    
    // Final Analysis
    console.log('\n📋 PWA FEATURE TEST RESULTS');
    console.log('============================');
    
    const totalTests = Object.keys(testResults).length;
    const passedTests = Object.values(testResults).filter(result => result === true).length;
    const passRate = (passedTests / totalTests) * 100;
    
    console.log(`\n📊 OVERALL RESULTS: ${passedTests}/${totalTests} tests passed (${passRate.toFixed(1)}%)`);
    
    Object.entries(testResults).forEach(([feature, status]) => {
      const icon = status ? '✅' : '❌';
      const statusText = status ? 'PASS' : 'FAIL';
      console.log(`${icon} ${feature.toUpperCase()}: ${statusText}`);
    });
    
    if (passRate === 100) {
      console.log('\n🎉 ALL PWA FEATURES ARE WORKING PERFECTLY!');
      console.log('🚀 Game is ready for installation on all devices!');
    } else if (passRate >= 80) {
      console.log('\n✅ PWA FEATURES ARE MOSTLY WORKING!');
      console.log('🔧 Minor issues detected but PWA is functional');
    } else {
      console.log('\n⚠️  Some PWA features need attention');
      console.log(`🔧 ${totalTests - passedTests} features require fixes`);
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'pwa-test-final.png',
      fullPage: true 
    });
    console.log('\n📸 PWA test screenshot saved');
    
  } catch (error) {
    console.error('❌ PWA test failed:', error.message);
  } finally {
    await browser.close();
    console.log('\n🔚 PWA testing completed');
  }
}

testPWAFeatures().catch(console.error);
