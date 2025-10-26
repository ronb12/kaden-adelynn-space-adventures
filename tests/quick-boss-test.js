#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function quickBossTest() {
  console.log('🔍 Quick Boss Modal Test...\n');
  
  let browser = null;
  
  try {
    browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Monitor all console messages
    page.on('console', msg => {
      console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    });
    
    console.log('🌐 Loading game...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    
    await page.waitForSelector('.main-menu', { timeout: 10000 });
    console.log('✅ Game loaded');
    
    // Open boss modal
    console.log('👹 Clicking boss button...');
    await page.click('.feature-btn.boss');
    await page.waitForTimeout(3000);
    
    // Check modal
    const modalVisible = await page.$('.boss-modal');
    if (modalVisible) {
      console.log('✅ Boss modal is visible');
      
      // Count boss cards
      const bossCount = await page.$$eval('.boss-card', cards => cards.length);
      console.log(`📊 Boss cards found: ${bossCount}`);
      
      if (bossCount === 15) {
        console.log('✅ All 15 bosses are displayed!');
      } else if (bossCount > 3) {
        console.log(`⚠️ Found ${bossCount} bosses (expected 15)`);
      } else {
        console.log(`❌ Only ${bossCount} bosses found (expected 15)`);
      }
      
      // Get boss names
      const bossNames = await page.$$eval('.boss-card h4', names => 
        names.map(name => name.textContent)
      );
      
      console.log('\n🎮 Boss Names:');
      bossNames.forEach((name, i) => {
        console.log(`${i + 1}. ${name}`);
      });
      
      // Test scrolling
      console.log('\n📜 Testing scroll...');
      await page.evaluate(() => {
        const grid = document.querySelector('.boss-grid');
        if (grid) {
          grid.scrollTop = grid.scrollHeight;
        }
      });
      await page.waitForTimeout(1000);
      
      const afterScrollCount = await page.$$eval('.boss-card', cards => cards.length);
      console.log(`📊 After scroll: ${afterScrollCount} cards visible`);
      
    } else {
      console.log('❌ Boss modal not found');
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

quickBossTest().catch(console.error);
