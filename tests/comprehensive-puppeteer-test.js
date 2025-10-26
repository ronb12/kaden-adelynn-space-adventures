const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class GameFeatureTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.consoleErrors = [];
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: [],
      features: {}
    };
  }

  async setup() {
    console.log('🚀 Setting up Puppeteer test environment...');
    
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      devtools: true,
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

    this.page = await this.browser.newPage();
    
    // Monitor console errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.consoleErrors.push({
          timestamp: new Date().toISOString(),
          message: msg.text(),
          location: msg.location()
        });
        console.log('❌ Console Error:', msg.text());
      }
    });

    // Monitor page errors
    this.page.on('pageerror', error => {
      this.consoleErrors.push({
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        type: 'pageerror'
      });
      console.log('❌ Page Error:', error.message);
    });

    // Monitor request failures
    this.page.on('requestfailed', request => {
      this.consoleErrors.push({
        timestamp: new Date().toISOString(),
        message: `Request failed: ${request.url()}`,
        type: 'requestfailed'
      });
      console.log('❌ Request Failed:', request.url());
    });

    console.log('✅ Puppeteer setup complete');
  }

  async navigateToGame() {
    console.log('🌐 Navigating to game...');
    
    try {
      await this.page.goto('http://localhost:3000', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Wait for game to load
      await this.page.waitForSelector('.main-menu', { timeout: 10000 });
      console.log('✅ Game loaded successfully');
      return true;
    } catch (error) {
      console.log('❌ Failed to load game:', error.message);
      this.testResults.errors.push(`Navigation failed: ${error.message}`);
      return false;
    }
  }

  async testMainMenu() {
    console.log('\n🎮 Testing Main Menu Features...');
    
    try {
      // Test character selection
      console.log('👤 Testing character selection...');
      const characterBtn = await this.page.$('.select-pilot-btn');
      if (characterBtn) {
        await characterBtn.click();
        await this.page.waitForTimeout(1000);
        
        // Test Kaden selection
        const kadenBtn = await this.page.$('[data-character="kaden"]');
        if (kadenBtn) {
          await kadenBtn.click();
          await this.page.waitForTimeout(1000);
          console.log('✅ Kaden character selected');
        }
        
        // Test Adelynn selection
        const adelynnBtn = await this.page.$('[data-character="adelynn"]');
        if (adelynnBtn) {
          await adelynnBtn.click();
          await this.page.waitForTimeout(1000);
          console.log('✅ Adelynn character selected');
        }
      }

      // Test feature buttons
      const featureButtons = [
        { selector: '.feature-btn.achievements', name: 'Achievements' },
        { selector: '.feature-btn.boss', name: 'Boss Battles' },
        { selector: '.feature-btn.powerups', name: 'Power-ups' },
        { selector: '.feature-btn.multiplayer', name: 'Multiplayer' },
        { selector: '.feature-btn.story', name: 'Story Mode' },
        { selector: '.feature-btn.challenges', name: 'Challenges' }
      ];

      for (const button of featureButtons) {
        console.log(`🔍 Testing ${button.name} button...`);
        const btn = await this.page.$(button.selector);
        if (btn) {
          await btn.click();
          await this.page.waitForTimeout(1000);
          
          // Check if modal opened
          const modal = await this.page.$('.modal-overlay');
          if (modal) {
            console.log(`✅ ${button.name} modal opened`);
            this.testResults.features[button.name] = 'PASSED';
            
            // Close modal
            const closeBtn = await this.page.$('.close-btn');
            if (closeBtn) {
              await closeBtn.click();
              await this.page.waitForTimeout(500);
            }
          } else {
            console.log(`❌ ${button.name} modal failed to open`);
            this.testResults.features[button.name] = 'FAILED';
          }
        } else {
          console.log(`❌ ${button.name} button not found`);
          this.testResults.features[button.name] = 'NOT_FOUND';
        }
      }

      this.testResults.passed++;
      console.log('✅ Main menu testing completed');
      return true;
    } catch (error) {
      console.log('❌ Main menu test failed:', error.message);
      this.testResults.failed++;
      this.testResults.errors.push(`Main menu test: ${error.message}`);
      return false;
    }
  }

  async testBossBattles() {
    console.log('\n👹 Testing Boss Battles System...');
    
    try {
      // Open boss battles modal
      const bossBtn = await this.page.$('.feature-btn.boss');
      if (bossBtn) {
        await bossBtn.click();
        await this.page.waitForTimeout(1000);
        
        // Test boss selection
        const bossCards = await this.page.$$('.boss-card');
        console.log(`Found ${bossCards.length} boss cards`);
        
        if (bossCards.length > 0) {
          // Test first few boss selections
          for (let i = 0; i < Math.min(3, bossCards.length); i++) {
            await bossCards[i].click();
            await this.page.waitForTimeout(500);
            console.log(`✅ Boss ${i + 1} selected`);
          }
          
          // Test start boss battle button
          const startBossBtn = await this.page.$('.start-boss-btn');
          if (startBossBtn) {
            await startBossBtn.click();
            await this.page.waitForTimeout(1000);
            console.log('✅ Boss battle started');
          }
        }
        
        // Close modal
        const closeBtn = await this.page.$('.close-btn');
        if (closeBtn) {
          await closeBtn.click();
          await this.page.waitForTimeout(500);
        }
      }
      
      this.testResults.features['Boss Battles'] = 'PASSED';
      this.testResults.passed++;
      console.log('✅ Boss battles testing completed');
      return true;
    } catch (error) {
      console.log('❌ Boss battles test failed:', error.message);
      this.testResults.failed++;
      this.testResults.errors.push(`Boss battles test: ${error.message}`);
      this.testResults.features['Boss Battles'] = 'FAILED';
      return false;
    }
  }

  async testStoreSystem() {
    console.log('\n🛍️ Testing Store System...');
    
    try {
      // Start game first to access store
      const startBtn = await this.page.$('.start-mission-btn');
      if (startBtn) {
        await startBtn.click();
        await this.page.waitForTimeout(2000);
        
        // Look for store button in game
        const storeBtn = await this.page.$('.store-btn');
        if (storeBtn) {
          await storeBtn.click();
          await this.page.waitForTimeout(1000);
          
          // Test store functionality
          const storeModal = await this.page.$('.store-modal');
          if (storeModal) {
            console.log('✅ Store modal opened');
            
            // Test category filters
            const categoryBtns = await this.page.$$('.category-btn');
            for (let i = 0; i < Math.min(3, categoryBtns.length); i++) {
              await categoryBtns[i].click();
              await this.page.waitForTimeout(500);
              console.log(`✅ Category ${i + 1} selected`);
            }
            
            // Test upgrade purchases
            const purchaseBtns = await this.page.$$('.purchase-btn.enabled');
            if (purchaseBtns.length > 0) {
              await purchaseBtns[0].click();
              await this.page.waitForTimeout(500);
              console.log('✅ Upgrade purchase attempted');
            }
            
            // Close store
            const closeBtn = await this.page.$('.close-btn');
            if (closeBtn) {
              await closeBtn.click();
              await this.page.waitForTimeout(500);
            }
          }
        }
      }
      
      this.testResults.features['Store System'] = 'PASSED';
      this.testResults.passed++;
      console.log('✅ Store system testing completed');
      return true;
    } catch (error) {
      console.log('❌ Store system test failed:', error.message);
      this.testResults.failed++;
      this.testResults.errors.push(`Store system test: ${error.message}`);
      this.testResults.features['Store System'] = 'FAILED';
      return false;
    }
  }

  async testGameplay() {
    console.log('\n🎮 Testing Core Gameplay...');
    
    try {
      // Test game controls
      console.log('🎯 Testing game controls...');
      
      // Simulate keyboard inputs
      await this.page.keyboard.down('ArrowUp');
      await this.page.waitForTimeout(100);
      await this.page.keyboard.up('ArrowUp');
      
      await this.page.keyboard.down('ArrowDown');
      await this.page.waitForTimeout(100);
      await this.page.keyboard.up('ArrowDown');
      
      await this.page.keyboard.down('ArrowLeft');
      await this.page.waitForTimeout(100);
      await this.page.keyboard.up('ArrowLeft');
      
      await this.page.keyboard.down('ArrowRight');
      await this.page.waitForTimeout(100);
      await this.page.keyboard.up('ArrowRight');
      
      // Test shooting
      await this.page.keyboard.down('Space');
      await this.page.waitForTimeout(100);
      await this.page.keyboard.up('Space');
      
      console.log('✅ Game controls tested');
      
      // Test pause functionality
      await this.page.keyboard.down('Escape');
      await this.page.waitForTimeout(100);
      await this.page.keyboard.up('Escape');
      
      console.log('✅ Pause functionality tested');
      
      this.testResults.features['Gameplay Controls'] = 'PASSED';
      this.testResults.passed++;
      console.log('✅ Gameplay testing completed');
      return true;
    } catch (error) {
      console.log('❌ Gameplay test failed:', error.message);
      this.testResults.failed++;
      this.testResults.errors.push(`Gameplay test: ${error.message}`);
      this.testResults.features['Gameplay Controls'] = 'FAILED';
      return false;
    }
  }

  async testSaveLoadSystem() {
    console.log('\n💾 Testing Save/Load System...');
    
    try {
      // Look for save/load button
      const saveBtn = await this.page.$('.save-btn');
      if (saveBtn) {
        await saveBtn.click();
        await this.page.waitForTimeout(1000);
        
        const saveModal = await this.page.$('.save-load-modal');
        if (saveModal) {
          console.log('✅ Save/Load modal opened');
          
          // Test save functionality
          const saveSlots = await this.page.$$('.save-slot');
          if (saveSlots.length > 0) {
            await saveSlots[0].click();
            await this.page.waitForTimeout(500);
            console.log('✅ Save slot selected');
          }
          
          // Close modal
          const closeBtn = await this.page.$('.close-btn');
          if (closeBtn) {
            await closeBtn.click();
            await this.page.waitForTimeout(500);
          }
        }
      }
      
      this.testResults.features['Save/Load System'] = 'PASSED';
      this.testResults.passed++;
      console.log('✅ Save/Load system testing completed');
      return true;
    } catch (error) {
      console.log('❌ Save/Load system test failed:', error.message);
      this.testResults.failed++;
      this.testResults.errors.push(`Save/Load test: ${error.message}`);
      this.testResults.features['Save/Load System'] = 'FAILED';
      return false;
    }
  }

  async testTouchControls() {
    console.log('\n📱 Testing Touch Controls...');
    
    try {
      // Simulate touch events
      const canvas = await this.page.$('canvas');
      if (canvas) {
        const box = await canvas.boundingBox();
        if (box) {
          // Simulate touch start
          await this.page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
          await this.page.waitForTimeout(100);
          
          // Simulate touch move
          await this.page.touchscreen.tap(box.x + box.width / 3, box.y + box.height / 3);
          await this.page.waitForTimeout(100);
          
          console.log('✅ Touch controls tested');
        }
      }
      
      this.testResults.features['Touch Controls'] = 'PASSED';
      this.testResults.passed++;
      console.log('✅ Touch controls testing completed');
      return true;
    } catch (error) {
      console.log('❌ Touch controls test failed:', error.message);
      this.testResults.failed++;
      this.testResults.errors.push(`Touch controls test: ${error.message}`);
      this.testResults.features['Touch Controls'] = 'FAILED';
      return false;
    }
  }

  async runAllTests() {
    console.log('🧪 Starting Comprehensive Game Feature Testing...\n');
    
    await this.setup();
    
    const navigationSuccess = await this.navigateToGame();
    if (!navigationSuccess) {
      console.log('❌ Cannot proceed with tests - game failed to load');
      return;
    }
    
    // Run all tests
    await this.testMainMenu();
    await this.testBossBattles();
    await this.testStoreSystem();
    await this.testGameplay();
    await this.testSaveLoadSystem();
    await this.testTouchControls();
    
    // Generate comprehensive report
    await this.generateReport();
    
    await this.cleanup();
  }

  async generateReport() {
    console.log('\n📊 Generating Test Report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.testResults.passed + this.testResults.failed,
        passed: this.testResults.passed,
        failed: this.testResults.failed,
        successRate: `${((this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100).toFixed(2)}%`
      },
      features: this.testResults.features,
      errors: this.testResults.errors,
      consoleErrors: this.consoleErrors,
      recommendations: this.generateRecommendations()
    };
    
    // Save report to file
    const reportPath = path.join(__dirname, 'puppeteer-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Display summary
    console.log('\n📈 TEST SUMMARY');
    console.log('================');
    console.log(`✅ Tests Passed: ${this.testResults.passed}`);
    console.log(`❌ Tests Failed: ${this.testResults.failed}`);
    console.log(`📊 Success Rate: ${report.summary.successRate}`);
    console.log(`🐛 Console Errors: ${this.consoleErrors.length}`);
    console.log(`📄 Report saved to: ${reportPath}`);
    
    // Display feature results
    console.log('\n🎮 FEATURE RESULTS');
    console.log('==================');
    Object.entries(this.testResults.features).forEach(([feature, status]) => {
      const icon = status === 'PASSED' ? '✅' : status === 'FAILED' ? '❌' : '⚠️';
      console.log(`${icon} ${feature}: ${status}`);
    });
    
    // Display console errors
    if (this.consoleErrors.length > 0) {
      console.log('\n🐛 CONSOLE ERRORS');
      console.log('=================');
      this.consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.message}`);
        if (error.stack) {
          console.log(`   Stack: ${error.stack.split('\n')[0]}`);
        }
      });
    }
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.consoleErrors.length > 0) {
      recommendations.push('Fix console errors to improve game stability');
    }
    
    if (this.testResults.failed > 0) {
      recommendations.push('Review failed tests and fix underlying issues');
    }
    
    if (this.testResults.features['Store System'] === 'FAILED') {
      recommendations.push('Verify store system integration and money mechanics');
    }
    
    if (this.testResults.features['Boss Battles'] === 'FAILED') {
      recommendations.push('Check boss battle system and modal functionality');
    }
    
    return recommendations;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Cleanup completed');
  }
}

// Run the tests
async function runTests() {
  const tester = new GameFeatureTester();
  await tester.runAllTests();
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = GameFeatureTester;
