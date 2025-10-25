#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testBossModal() {
  console.log('🧪 Testing Boss Modal - All 15 Bosses...\n');
  
  let browser = null;
  const errors = [];
  
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
    
    // Open boss battles modal
    console.log('\n👹 Opening Boss Battles Modal...');
    const bossBtn = await page.$('.feature-btn.boss');
    if (bossBtn) {
      await bossBtn.click();
      await page.waitForTimeout(2000);
      
      // Check if modal opened
      const modal = await page.$('.boss-modal');
      if (modal) {
        console.log('✅ Boss modal opened');
        
        // Count boss cards
        const bossCards = await page.$$('.boss-card');
        console.log(`📊 Found ${bossCards.length} boss cards`);
        
        if (bossCards.length === 15) {
          console.log('✅ All 15 bosses are displayed!');
        } else if (bossCards.length > 3) {
          console.log(`⚠️ Found ${bossCards.length} bosses (expected 15)`);
        } else {
          console.log(`❌ Only found ${bossCards.length} bosses (expected 15)`);
        }
        
        // List all boss names
        console.log('\n🎮 Boss List:');
        for (let i = 0; i < bossCards.length; i++) {
          const bossName = await page.evaluate((card) => {
            const nameElement = card.querySelector('h4');
            return nameElement ? nameElement.textContent : 'Unknown';
          }, bossCards[i]);
          console.log(`${i + 1}. ${bossName}`);
        }
        
        // Test scrolling in the modal
        console.log('\n📜 Testing modal scrolling...');
        await page.evaluate(() => {
          const bossGrid = document.querySelector('.boss-grid');
          if (bossGrid) {
            bossGrid.scrollTop = bossGrid.scrollHeight;
          }
        });
        await page.waitForTimeout(1000);
        
        // Check if we can see more bosses after scrolling
        const visibleBossCards = await page.$$('.boss-card');
        console.log(`📊 After scrolling: ${visibleBossCards.length} boss cards visible`);
        
        // Test boss selection
        console.log('\n🎯 Testing boss selection...');
        if (bossCards.length > 0) {
          await bossCards[0].click();
          await page.waitForTimeout(500);
          console.log('✅ First boss selected');
          
          if (bossCards.length > 5) {
            await bossCards[5].click();
            await page.waitForTimeout(500);
            console.log('✅ Sixth boss selected');
          }
          
          if (bossCards.length > 10) {
            await bossCards[10].click();
            await page.waitForTimeout(500);
            console.log('✅ Eleventh boss selected');
          }
        }
        
        // Close modal
        const closeBtn = await page.$('.close-btn');
        if (closeBtn) {
          await closeBtn.click();
          await page.waitForTimeout(500);
          console.log('✅ Modal closed');
        }
        
      } else {
        console.log('❌ Boss modal not found');
      }
    } else {
      console.log('❌ Boss button not found');
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
  console.log('\n📊 BOSS MODAL TEST RESULTS');
  console.log('===========================');
  
  if (errors.length > 0) {
    console.log('\n🐛 ERRORS FOUND:');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  } else {
    console.log('✅ No errors found');
  }
  
  console.log('\n🏁 Boss modal test completed!');
}

// Run the test
testBossModal().catch(console.error);
