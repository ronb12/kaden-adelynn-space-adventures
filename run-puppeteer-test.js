#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class QuickGameTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.errors = [];
    this.results = {
      features: {},
      consoleErrors: [],
      testErrors: []
    };
  }

  async setup() {
    console.log('🚀 Starting Puppeteer Test...');
    
    this.browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

    this.page = await this.browser.newPage();
    
    // Monitor all console messages
    this.page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        this.results.consoleErrors.push({
          type: 'console',
          message: text,
          timestamp: new Date().toISOString()
        });
        console.log('❌ Console Error:', text);
      } else if (type === 'warning') {
        console.log('⚠️ Console Warning:', text);
      }
    });

    this.page.on('pageerror', error => {
      this.results.consoleErrors.push({
        type: 'page',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.log('❌ Page Error:', error.message);
    });

    this.page.on('requestfailed', request => {
      this.results.consoleErrors.push({
        type: 'request',
        message: `Request failed: ${request.url()}`,
        timestamp: new Date().toISOString()
      });
      console.log('❌ Request Failed:', request.url());
    });
  }

  async testGame() {
    try {
      console.log('🌐 Loading game...');
      await this.page.goto('http://localhost:3000', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for main menu
      await this.page.waitForSelector('.main-menu', { timeout: 10000 });
      console.log('✅ Game loaded successfully');

      // Test main menu buttons
      await this.testMainMenu();
      
      // Test game start
      await this.testGameStart();
      
      // Test in-game features
      await this.testInGameFeatures();

    } catch (error) {
      console.log('❌ Test failed:', error.message);
      this.results.testErrors.push(error.message);
    }
  }

  async testMainMenu() {
    console.log('\n🎮 Testing Main Menu...');
    
    const buttons = [
      { selector: '.select-pilot-btn', name: 'Character Selection' },
      { selector: '.feature-btn.achievements', name: 'Achievements' },
      { selector: '.feature-btn.boss', name: 'Boss Battles' },
      { selector: '.feature-btn.powerups', name: 'Power-ups' },
      { selector: '.feature-btn.multiplayer', name: 'Multiplayer' },
      { selector: '.feature-btn.story', name: 'Story Mode' },
      { selector: '.feature-btn.challenges', name: 'Challenges' }
    ];

    for (const button of buttons) {
      try {
        const element = await this.page.$(button.selector);
        if (element) {
          await element.click();
          await this.page.waitForTimeout(1000);
          
          // Check if modal opened
          const modal = await this.page.$('.modal-overlay');
          if (modal) {
            console.log(`✅ ${button.name} - Modal opened`);
            this.results.features[button.name] = 'PASSED';
            
            // Close modal
            const closeBtn = await this.page.$('.close-btn');
            if (closeBtn) {
              await closeBtn.click();
              await this.page.waitForTimeout(500);
            }
          } else {
            console.log(`⚠️ ${button.name} - No modal detected`);
            this.results.features[button.name] = 'PARTIAL';
          }
        } else {
          console.log(`❌ ${button.name} - Button not found`);
          this.results.features[button.name] = 'FAILED';
        }
      } catch (error) {
        console.log(`❌ ${button.name} - Error: ${error.message}`);
        this.results.features[button.name] = 'ERROR';
      }
    }
  }

  async testGameStart() {
    console.log('\n🚀 Testing Game Start...');
    
    try {
      const startBtn = await this.page.$('.start-mission-btn');
      if (startBtn) {
        await startBtn.click();
        await this.page.waitForTimeout(2000);
        console.log('✅ Game started');
        this.results.features['Game Start'] = 'PASSED';
      } else {
        console.log('❌ Start button not found');
        this.results.features['Game Start'] = 'FAILED';
      }
    } catch (error) {
      console.log('❌ Game start failed:', error.message);
      this.results.features['Game Start'] = 'ERROR';
    }
  }

  async testInGameFeatures() {
    console.log('\n🎯 Testing In-Game Features...');
    
    // Test game controls
    try {
      console.log('🎮 Testing controls...');
      await this.page.keyboard.down('ArrowUp');
      await this.page.waitForTimeout(100);
      await this.page.keyboard.up('ArrowUp');
      
      await this.page.keyboard.down('Space');
      await this.page.waitForTimeout(100);
      await this.page.keyboard.up('Space');
      
      console.log('✅ Controls tested');
      this.results.features['Game Controls'] = 'PASSED';
    } catch (error) {
      console.log('❌ Controls test failed:', error.message);
      this.results.features['Game Controls'] = 'ERROR';
    }

    // Test store system
    try {
      console.log('🛍️ Testing store...');
      const storeBtn = await this.page.$('.store-btn');
      if (storeBtn) {
        await storeBtn.click();
        await this.page.waitForTimeout(1000);
        
        const storeModal = await this.page.$('.store-modal');
        if (storeModal) {
          console.log('✅ Store modal opened');
          this.results.features['Store System'] = 'PASSED';
          
          // Close store
          const closeBtn = await this.page.$('.close-btn');
          if (closeBtn) {
            await closeBtn.click();
            await this.page.waitForTimeout(500);
          }
        } else {
          console.log('❌ Store modal not found');
          this.results.features['Store System'] = 'FAILED';
        }
      } else {
        console.log('❌ Store button not found');
        this.results.features['Store System'] = 'FAILED';
      }
    } catch (error) {
      console.log('❌ Store test failed:', error.message);
      this.results.features['Store System'] = 'ERROR';
    }

    // Test save/load system
    try {
      console.log('💾 Testing save/load...');
      const saveBtn = await this.page.$('.save-btn');
      if (saveBtn) {
        await saveBtn.click();
        await this.page.waitForTimeout(1000);
        
        const saveModal = await this.page.$('.save-load-modal');
        if (saveModal) {
          console.log('✅ Save/Load modal opened');
          this.results.features['Save/Load System'] = 'PASSED';
          
          // Close modal
          const closeBtn = await this.page.$('.close-btn');
          if (closeBtn) {
            await closeBtn.click();
            await this.page.waitForTimeout(500);
          }
        } else {
          console.log('❌ Save/Load modal not found');
          this.results.features['Save/Load System'] = 'FAILED';
        }
      } else {
        console.log('❌ Save button not found');
        this.results.features['Save/Load System'] = 'FAILED';
      }
    } catch (error) {
      console.log('❌ Save/Load test failed:', error.message);
      this.results.features['Save/Load System'] = 'ERROR';
    }
  }

  async generateReport() {
    console.log('\n📊 GENERATING TEST REPORT');
    console.log('==========================');
    
    const totalFeatures = Object.keys(this.results.features).length;
    const passedFeatures = Object.values(this.results.features).filter(status => status === 'PASSED').length;
    const failedFeatures = Object.values(this.results.features).filter(status => status === 'FAILED').length;
    const errorFeatures = Object.values(this.results.features).filter(status => status === 'ERROR').length;
    
    console.log(`📈 Total Features Tested: ${totalFeatures}`);
    console.log(`✅ Passed: ${passedFeatures}`);
    console.log(`❌ Failed: ${failedFeatures}`);
    console.log(`🐛 Errors: ${errorFeatures}`);
    console.log(`📊 Success Rate: ${((passedFeatures / totalFeatures) * 100).toFixed(1)}%`);
    
    console.log('\n🎮 FEATURE RESULTS:');
    console.log('===================');
    Object.entries(this.results.features).forEach(([feature, status]) => {
      const icon = status === 'PASSED' ? '✅' : 
                   status === 'FAILED' ? '❌' : 
                   status === 'ERROR' ? '🐛' : '⚠️';
      console.log(`${icon} ${feature}: ${status}`);
    });
    
    if (this.results.consoleErrors.length > 0) {
      console.log('\n🐛 CONSOLE ERRORS:');
      console.log('==================');
      this.results.consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.type.toUpperCase()}] ${error.message}`);
      });
    }
    
    if (this.results.testErrors.length > 0) {
      console.log('\n❌ TEST ERRORS:');
      console.log('===============');
      this.results.testErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFeatures,
        passed: passedFeatures,
        failed: failedFeatures,
        errors: errorFeatures,
        successRate: `${((passedFeatures / totalFeatures) * 100).toFixed(1)}%`
      },
      features: this.results.features,
      consoleErrors: this.results.consoleErrors,
      testErrors: this.results.testErrors
    };
    
    const reportPath = path.join(__dirname, 'puppeteer-test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Test cleanup completed');
  }

  async run() {
    try {
      await this.setup();
      await this.testGame();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Test runner failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the test
if (require.main === module) {
  const tester = new QuickGameTester();
  tester.run().catch(console.error);
}

module.exports = QuickGameTester;
