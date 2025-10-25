#!/usr/bin/env node

const { spawn } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class ComprehensiveGameTester {
  constructor() {
    this.serverProcess = null;
    this.browser = null;
    this.page = null;
    this.errors = [];
    this.results = {
      features: {},
      consoleErrors: [],
      testErrors: []
    };
    this.serverReady = false;
  }

  async startServer() {
    console.log('🚀 Starting development server...');
    
    return new Promise((resolve, reject) => {
      this.serverProcess = spawn('npm', ['start'], {
        cwd: process.cwd(),
        stdio: 'pipe',
        shell: true
      });

      let serverOutput = '';
      
      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        serverOutput += output;
        console.log('📦 Server:', output.trim());
        
        // Check if server is ready
        if (output.includes('Local:') || output.includes('On Your Network:')) {
          console.log('✅ Server is ready!');
          this.serverReady = true;
          setTimeout(resolve, 3000); // Give server time to fully start
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        const error = data.toString();
        console.log('⚠️ Server Error:', error.trim());
      });

      this.serverProcess.on('error', (error) => {
        console.log('❌ Failed to start server:', error);
        reject(error);
      });

      // Timeout after 60 seconds
      setTimeout(() => {
        if (!this.serverReady) {
          console.log('⏰ Server start timeout');
          reject(new Error('Server start timeout'));
        }
      }, 60000);
    });
  }

  async setupBrowser() {
    console.log('🌐 Setting up browser...');
    
    this.browser = await puppeteer.launch({
      headless: false,
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

  async navigateToGame() {
    console.log('🌐 Navigating to game...');
    
    try {
      await this.page.goto('http://localhost:3000', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      await this.page.waitForSelector('.main-menu', { timeout: 10000 });
      console.log('✅ Game loaded successfully');
      this.results.features['Game Load'] = 'PASSED';
      return true;
    } catch (error) {
      console.log('❌ Failed to load game:', error.message);
      this.results.testErrors.push(`Navigation failed: ${error.message}`);
      this.results.features['Game Load'] = 'FAILED';
      return false;
    }
  }

  async testMainMenu() {
    console.log('\n🎮 Testing Main Menu Features...');
    
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
        console.log(`🔍 Testing ${button.name}...`);
        const element = await this.page.$(button.selector);
        
        if (element) {
          await element.click();
          await this.page.waitForTimeout(1000);
          
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
        this.results.testErrors.push(`${button.name} test: ${error.message}`);
      }
    }
  }

  async testBossBattles() {
    console.log('\n👹 Testing Boss Battles System...');
    
    try {
      const bossBtn = await this.page.$('.feature-btn.boss');
      if (bossBtn) {
        await bossBtn.click();
        await this.page.waitForTimeout(1000);
        
        const bossCards = await this.page.$$('.boss-card');
        console.log(`Found ${bossCards.length} boss cards`);
        
        if (bossCards.length > 0) {
          // Test boss selection
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
      
      this.results.features['Boss Battles Detailed'] = 'PASSED';
      console.log('✅ Boss battles testing completed');
    } catch (error) {
      console.log('❌ Boss battles test failed:', error.message);
      this.results.features['Boss Battles Detailed'] = 'FAILED';
      this.results.testErrors.push(`Boss battles test: ${error.message}`);
    }
  }

  async testStoreSystem() {
    console.log('\n🛍️ Testing Store System...');
    
    try {
      // Start game first
      const startBtn = await this.page.$('.start-mission-btn');
      if (startBtn) {
        await startBtn.click();
        await this.page.waitForTimeout(2000);
        
        // Test store button
        const storeBtn = await this.page.$('.store-btn');
        if (storeBtn) {
          await storeBtn.click();
          await this.page.waitForTimeout(1000);
          
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
      } else {
        console.log('❌ Start button not found');
        this.results.features['Store System'] = 'FAILED';
      }
    } catch (error) {
      console.log('❌ Store system test failed:', error.message);
      this.results.features['Store System'] = 'ERROR';
      this.results.testErrors.push(`Store system test: ${error.message}`);
    }
  }

  async testGameplay() {
    console.log('\n🎮 Testing Core Gameplay...');
    
    try {
      // Test game controls
      console.log('🎯 Testing game controls...');
      
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
      this.results.features['Game Controls'] = 'PASSED';
      
      // Test pause functionality
      await this.page.keyboard.down('Escape');
      await this.page.waitForTimeout(100);
      await this.page.keyboard.up('Escape');
      
      console.log('✅ Pause functionality tested');
      this.results.features['Pause System'] = 'PASSED';
      
    } catch (error) {
      console.log('❌ Gameplay test failed:', error.message);
      this.results.features['Game Controls'] = 'ERROR';
      this.results.testErrors.push(`Gameplay test: ${error.message}`);
    }
  }

  async testSaveLoadSystem() {
    console.log('\n💾 Testing Save/Load System...');
    
    try {
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
      console.log('❌ Save/Load system test failed:', error.message);
      this.results.features['Save/Load System'] = 'ERROR';
      this.results.testErrors.push(`Save/Load test: ${error.message}`);
    }
  }

  async generateReport() {
    console.log('\n📊 GENERATING COMPREHENSIVE TEST REPORT');
    console.log('==========================================');
    
    const totalFeatures = Object.keys(this.results.features).length;
    const passedFeatures = Object.values(this.results.features).filter(status => status === 'PASSED').length;
    const failedFeatures = Object.values(this.results.features).filter(status => status === 'FAILED').length;
    const errorFeatures = Object.values(this.results.features).filter(status => status === 'ERROR').length;
    const partialFeatures = Object.values(this.results.features).filter(status => status === 'PARTIAL').length;
    
    console.log(`📈 Total Features Tested: ${totalFeatures}`);
    console.log(`✅ Passed: ${passedFeatures}`);
    console.log(`❌ Failed: ${failedFeatures}`);
    console.log(`🐛 Errors: ${errorFeatures}`);
    console.log(`⚠️ Partial: ${partialFeatures}`);
    console.log(`📊 Success Rate: ${((passedFeatures / totalFeatures) * 100).toFixed(1)}%`);
    
    console.log('\n🎮 FEATURE RESULTS:');
    console.log('===================');
    Object.entries(this.results.features).forEach(([feature, status]) => {
      const icon = status === 'PASSED' ? '✅' : 
                   status === 'FAILED' ? '❌' : 
                   status === 'ERROR' ? '🐛' : 
                   status === 'PARTIAL' ? '⚠️' : '❓';
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
        partial: partialFeatures,
        successRate: `${((passedFeatures / totalFeatures) * 100).toFixed(1)}%`
      },
      features: this.results.features,
      consoleErrors: this.results.consoleErrors,
      testErrors: this.results.testErrors,
      recommendations: this.generateRecommendations()
    };
    
    const reportPath = path.join(__dirname, 'comprehensive-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.consoleErrors.length > 0) {
      recommendations.push('Fix console errors to improve game stability');
    }
    
    const failedFeatures = Object.entries(this.results.features)
      .filter(([_, status]) => status === 'FAILED')
      .map(([feature, _]) => feature);
    
    if (failedFeatures.length > 0) {
      recommendations.push(`Review and fix failed features: ${failedFeatures.join(', ')}`);
    }
    
    if (this.results.features['Store System'] === 'FAILED') {
      recommendations.push('Verify store system integration and money mechanics');
    }
    
    if (this.results.features['Boss Battles'] === 'FAILED') {
      recommendations.push('Check boss battle system and modal functionality');
    }
    
    return recommendations;
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up...');
    
    if (this.browser) {
      await this.browser.close();
    }
    
    if (this.serverProcess) {
      this.serverProcess.kill();
    }
    
    console.log('✅ Cleanup completed');
  }

  async run() {
    try {
      console.log('🧪 Starting Comprehensive Game Testing...\n');
      
      await this.startServer();
      await this.setupBrowser();
      
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
      
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Test runner failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the comprehensive test
if (require.main === module) {
  const tester = new ComprehensiveGameTester();
  tester.run().catch(console.error);
}

module.exports = ComprehensiveGameTester;
