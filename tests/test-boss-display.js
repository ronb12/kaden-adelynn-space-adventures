#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testBossDisplay() {
  console.log('🔍 Testing Boss Display in Modal...\n');
  
  let browser = null;
  
  try {
    browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Monitor console
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    console.log('🌐 Loading game...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    
    await page.waitForSelector('.main-menu', { timeout: 10000 });
    console.log('✅ Game loaded');
    
    // Open boss modal
    console.log('👹 Opening boss modal...');
    await page.click('.feature-btn.boss');
    await page.waitForTimeout(2000);
    
    // Check if modal is visible
    const modal = await page.$('.boss-modal');
    if (modal) {
      console.log('✅ Boss modal is visible');
      
      // Count boss cards
      const bossCards = await page.$$('.boss-card');
      console.log(`📊 Found ${bossCards.length} boss cards`);
      
      // Get all boss names
      const bossNames = await page.evaluate(() => {
        const cards = document.querySelectorAll('.boss-card');
        return Array.from(cards).map(card => {
          const nameEl = card.querySelector('h4');
          return nameEl ? nameEl.textContent : 'Unknown';
        });
      });
      
      console.log('\n🎮 Boss Names Found:');
      bossNames.forEach((name, index) => {
        console.log(`${index + 1}. ${name}`);
      });
      
      // Check modal dimensions
      const modalInfo = await page.evaluate(() => {
        const modal = document.querySelector('.boss-modal');
        const grid = document.querySelector('.boss-grid');
        return {
          modalHeight: modal ? modal.offsetHeight : 0,
          modalScrollHeight: modal ? modal.scrollHeight : 0,
          gridHeight: grid ? grid.offsetHeight : 0,
          gridScrollHeight: grid ? grid.scrollHeight : 0,
          gridClientHeight: grid ? grid.clientHeight : 0
        };
      });
      
      console.log('\n📏 Modal Dimensions:');
      console.log(`Modal Height: ${modalInfo.modalHeight}px`);
      console.log(`Modal Scroll Height: ${modalInfo.modalScrollHeight}px`);
      console.log(`Grid Height: ${modalInfo.gridHeight}px`);
      console.log(`Grid Scroll Height: ${modalInfo.gridScrollHeight}px`);
      console.log(`Grid Client Height: ${modalInfo.gridClientHeight}px`);
      
      // Test scrolling
      if (modalInfo.gridScrollHeight > modalInfo.gridClientHeight) {
        console.log('📜 Grid is scrollable');
        await page.evaluate(() => {
          const grid = document.querySelector('.boss-grid');
          if (grid) {
            grid.scrollTop = grid.scrollHeight;
          }
        });
        await page.waitForTimeout(1000);
        
        // Count visible cards after scrolling
        const visibleCards = await page.$$('.boss-card');
        console.log(`📊 After scrolling: ${visibleCards.length} cards visible`);
      } else {
        console.log('⚠️ Grid is not scrollable - all bosses should be visible');
      }
      
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

testBossDisplay().catch(console.error);
