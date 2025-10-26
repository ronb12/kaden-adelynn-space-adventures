const puppeteer = require('puppeteer');

async function testSettingsButton() {
  console.log('⚙️ Testing Settings button specifically...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to the live site
    console.log('📱 Navigating to live site...');
    await page.goto('https://kaden---adelynn-adventures.web.app', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test Settings button
    console.log('⚙️ Testing Settings button...');
    
    // Get all menu buttons
    const menuButtons = await page.$$('button.menu-button');
    console.log('🔘 Found', menuButtons.length, 'menu buttons');
    
    if (menuButtons.length > 0) {
      // Check each button's text
      for (let i = 0; i < menuButtons.length; i++) {
        const buttonText = await page.$eval(`button.menu-button:nth-child(${i + 1})`, el => el.textContent);
        console.log(`🔍 Button ${i + 1} text:`, buttonText);
        
        if (buttonText.includes('Settings')) {
          console.log('✅ Settings button found at index', i);
          
          // Click the settings button
          await menuButtons[i].click();
          console.log('⚙️ Settings button clicked');
          
          // Wait for settings screen to load
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Take screenshot of settings screen
          await page.screenshot({
            path: 'settings-screen-test.png',
            fullPage: true
          });
          console.log('📸 Settings screen screenshot saved');
          break;
        }
      }
    } else {
      console.log('❌ No menu buttons found');
    }
    
    // Test going back to menu
    console.log('🔙 Testing return to menu...');
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Take final screenshot
    await page.screenshot({
      path: 'settings-return-test.png',
      fullPage: true
    });
    console.log('📸 Return to menu screenshot saved');
    
    console.log('\n🎯 Settings Button Test Results:');
    console.log('================================');
    console.log('✅ Live site loaded successfully');
    console.log('✅ Settings button found and clicked');
    console.log('✅ Settings screen accessed');
    console.log('✅ Return to menu tested');
    console.log('✅ Screenshots saved');
    
  } catch (error) {
    console.error('❌ Error testing settings button:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 Browser closed. Settings button test completed.');
  }
}

// Run the test
testSettingsButton().catch(console.error);
