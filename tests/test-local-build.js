const puppeteer = require('puppeteer');
const path = require('path');

async function testLocalBuild() {
  console.log('🏠 Testing local build...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to the local build
    const buildPath = path.join(__dirname, 'build', 'index.html');
    console.log('📁 Loading local build from:', buildPath);
    
    await page.goto(`file://${buildPath}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check the page title
    const title = await page.title();
    console.log('📄 Page Title:', title);
    
    // Check if Bradley Virtual Solutions is in the title
    const hasCompanyBranding = title.includes('Bradley Virtual Solutions');
    console.log('🏢 Company Branding in Title:', hasCompanyBranding);
    
    // Check for enhanced menu elements
    console.log('🎮 Checking for enhanced menu elements...');
    
    // Look for the game title with rocket emoji
    const gameTitle = await page.$eval('h1.game-title', el => el ? el.textContent : null).catch(() => null);
    console.log('🎯 Game Title Found:', gameTitle);
    
    // Look for the subtitle
    const subtitle = await page.$eval('p.game-subtitle', el => el ? el.textContent : null).catch(() => null);
    console.log('📝 Subtitle Found:', subtitle);
    
    // Look for company branding
    const companyBranding = await page.$eval('.company-branding', el => el ? el.textContent : null).catch(() => null);
    console.log('🏢 Company Branding Found:', companyBranding);
    
    // Look for enhanced buttons
    const startButton = await page.$eval('.menu-button', el => el ? el.textContent : null).catch(() => null);
    console.log('🎮 Start Button Found:', startButton);
    
    // Check for enhanced CSS classes
    const hasEnhancedCSS = await page.$eval('.menu-overlay', el => el !== null).catch(() => false);
    console.log('🎨 Enhanced CSS Classes Found:', hasEnhancedCSS);
    
    // Check for build version meta tag
    const buildVersion = await page.$eval('meta[name="build-version"]', el => el ? el.content : null).catch(() => null);
    console.log('🏗️ Build Version:', buildVersion);
    
    // Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({
      path: 'local-build-test.png',
      fullPage: true
    });
    
    // Check if the page has the enhanced features
    const hasEnhancedMenu = gameTitle && gameTitle.includes('🚀');
    const hasCompanyInfo = companyBranding && companyBranding.includes('Bradley Virtual Solutions');
    const hasEnhancedButtons = startButton && startButton.includes('🎮');
    
    console.log('\n📊 Local Build Test Results:');
    console.log('============================');
    console.log('✅ Enhanced Menu:', hasEnhancedMenu);
    console.log('✅ Company Branding:', hasCompanyInfo);
    console.log('✅ Enhanced Buttons:', hasEnhancedButtons);
    console.log('✅ Build Version v4:', buildVersion === '2025-10-23-v4');
    
    const allUpdatesVisible = hasEnhancedMenu && hasCompanyInfo && hasEnhancedButtons && buildVersion === '2025-10-23-v4';
    console.log('\n🎯 All Updates Visible:', allUpdatesVisible);
    
    if (allUpdatesVisible) {
      console.log('🎉 SUCCESS: All updates are working in local build!');
    } else {
      console.log('⚠️ WARNING: Some updates may not be working in local build.');
    }
    
  } catch (error) {
    console.error('❌ Error testing local build:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 Browser closed. Screenshot saved as local-build-test.png');
  }
}

// Run the test
testLocalBuild().catch(console.error);
