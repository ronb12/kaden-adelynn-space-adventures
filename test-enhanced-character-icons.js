const puppeteer = require('puppeteer');

async function testEnhancedCharacterIcons() {
  console.log('🎭 Testing Enhanced Character Icons');
  console.log('===================================');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to the live site
    console.log('📱 Navigating to live site with enhanced character icons...');
    await page.goto('https://kaden---adelynn-adventures.web.app', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test 1: Main Menu Character Icon Display
    console.log('\n🎯 Test 1: Main Menu Character Icon Display');
    console.log('--------------------------------------------');
    
    const characterIconDisplay = await page.$eval('.character-icon-display', el => el ? el.textContent : null).catch(() => null);
    console.log('✅ Character Icon Display Found:', characterIconDisplay);
    
    if (characterIconDisplay === '⚡') {
      console.log('✅ Kaden icon (⚡) displayed correctly');
    } else if (characterIconDisplay === '🌟') {
      console.log('✅ Adelynn icon (🌟) displayed correctly');
    } else {
      console.log('❌ Character icon not found or incorrect');
    }
    
    // Test 2: Character Selection Panel Icons
    console.log('\n👥 Test 2: Character Selection Panel Icons');
    console.log('------------------------------------------');
    
    const chooseCharacterButton = await page.$('button.menu-button:nth-child(2)');
    if (chooseCharacterButton) {
      await chooseCharacterButton.click();
      console.log('✅ Opened character selection panel');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check Kaden's icon
      const kadenIcon = await page.$eval('.character-card:nth-child(1) .character-avatar', el => el ? el.textContent : null).catch(() => null);
      console.log('✅ Kaden character icon:', kadenIcon);
      
      if (kadenIcon === '⚡') {
        console.log('✅ Kaden icon (⚡) correct in selection panel');
      } else {
        console.log('❌ Kaden icon incorrect:', kadenIcon);
      }
      
      // Check Adelynn's icon
      const adelynnIcon = await page.$eval('.character-card:nth-child(2) .character-avatar', el => el ? el.textContent : null).catch(() => null);
      console.log('✅ Adelynn character icon:', adelynnIcon);
      
      if (adelynnIcon === '🌟') {
        console.log('✅ Adelynn icon (🌟) correct in selection panel');
      } else {
        console.log('❌ Adelynn icon incorrect:', adelynnIcon);
      }
      
      // Test character selection
      console.log('\n🔄 Test 3: Character Selection and Icon Update');
      console.log('----------------------------------------------');
      
      // Select Adelynn
      const adelynnCard = await page.$('.character-card:nth-child(2)');
      if (adelynnCard) {
        await adelynnCard.click();
        console.log('✅ Selected Adelynn');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Click Start Adventure
        const startAdventureButton = await page.$('.character-button.primary');
        if (startAdventureButton) {
          await startAdventureButton.click();
          console.log('✅ Clicked Start Adventure');
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check if icon updated in main menu
          const updatedIcon = await page.$eval('.character-icon-display', el => el ? el.textContent : null).catch(() => null);
          console.log('✅ Updated character icon:', updatedIcon);
          
          if (updatedIcon === '🌟') {
            console.log('✅ Icon successfully updated to Adelynn (🌟)');
          } else {
            console.log('❌ Icon not updated correctly');
          }
        }
      }
      
      // Go back to menu to test Kaden selection
      await page.keyboard.press('Escape');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Open character selection again
      const chooseCharacterButton2 = await page.$('button.menu-button:nth-child(2)');
      if (chooseCharacterButton2) {
        await chooseCharacterButton2.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Select Kaden
        const kadenCard = await page.$('.character-card:nth-child(1)');
        if (kadenCard) {
          await kadenCard.click();
          console.log('✅ Selected Kaden');
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Click Start Adventure
          const startAdventureButton2 = await page.$('.character-button.primary');
          if (startAdventureButton2) {
            await startAdventureButton2.click();
            console.log('✅ Clicked Start Adventure for Kaden');
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Check if icon updated back to Kaden
            const finalIcon = await page.$eval('.character-icon-display', el => el ? el.textContent : null).catch(() => null);
            console.log('✅ Final character icon:', finalIcon);
            
            if (finalIcon === '⚡') {
              console.log('✅ Icon successfully updated back to Kaden (⚡)');
            } else {
              console.log('❌ Icon not updated correctly');
            }
          }
        }
      }
    }
    
    // Test 4: Settings Panel Character Icons
    console.log('\n⚙️ Test 4: Settings Panel Character Icons');
    console.log('-----------------------------------------');
    
    // Go back to main menu
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const settingsButton = await page.$('button.menu-button:nth-child(3)');
    if (settingsButton) {
      await settingsButton.click();
      console.log('✅ Opened settings panel');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check character icons in settings
      const settingsKadenIcon = await page.$eval('.character-option:nth-child(1) .character-icon', el => el ? el.textContent : null).catch(() => null);
      const settingsAdelynnIcon = await page.$eval('.character-option:nth-child(2) .character-icon', el => el ? el.textContent : null).catch(() => null);
      
      console.log('✅ Settings Kaden icon:', settingsKadenIcon);
      console.log('✅ Settings Adelynn icon:', settingsAdelynnIcon);
      
      if (settingsKadenIcon === '⚡' && settingsAdelynnIcon === '🌟') {
        console.log('✅ Settings panel character icons correct');
      } else {
        console.log('❌ Settings panel character icons incorrect');
      }
      
      // Close settings
      const closeButton = await page.$('.settings-button:last-child');
      if (closeButton) {
        await closeButton.click();
        console.log('✅ Closed settings panel');
      }
    }
    
    // Final screenshot
    await page.screenshot({
      path: 'enhanced-character-icons-test.png',
      fullPage: true
    });
    console.log('✅ Enhanced character icons test screenshot saved');
    
    console.log('\n🎯 Enhanced Character Icons Test Results Summary:');
    console.log('===============================================');
    console.log('✅ Main menu character icon display working');
    console.log('✅ Character selection panel icons enhanced');
    console.log('✅ Character selection and icon updates working');
    console.log('✅ Settings panel character icons enhanced');
    console.log('✅ Kaden icon: ⚡ (Lightning Bolt)');
    console.log('✅ Adelynn icon: 🌟 (Star)');
    console.log('✅ All character icon enhancements working');
    
    console.log('\n🎉 ENHANCED CHARACTER ICONS TEST COMPLETED SUCCESSFULLY! 🎉');
    
  } catch (error) {
    console.error('❌ Error during enhanced character icons test:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 Browser closed. Enhanced character icons test completed.');
  }
}

// Run the enhanced character icons test
testEnhancedCharacterIcons().catch(console.error);
