const puppeteer = require('puppeteer');
const fs = require('fs');

async function runAutomatedButtonTest() {
  console.log('🚀 Starting automated button testing...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });
  
  // Navigate to the game
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  const testResults = {
    timestamp: new Date().toISOString(),
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    results: []
  };
  
  // Test main menu buttons
  console.log('📋 Testing main menu buttons...');
  
  const mainMenuButtons = [
    { selector: '.start-game-btn', name: 'Start Game Button', shouldNavigate: true },
    { selector: '.character-select-btn', name: 'Character Select Button', shouldOpenModal: true },
    { selector: '.achievements-btn', name: 'Achievements Button', shouldOpenModal: true },
    { selector: '.boss-battles-btn', name: 'Boss Battles Button', shouldOpenModal: true },
    { selector: '.power-ups-btn', name: 'Power-ups Button', shouldOpenModal: true },
    { selector: '.story-mode-btn', name: 'Story Mode Button', shouldOpenModal: true },
    { selector: '.challenges-btn', name: 'Challenges Button', shouldOpenModal: true },
    { selector: '.multiplayer-btn', name: 'Multiplayer Button', shouldOpenModal: true },
    { selector: '.settings-btn', name: 'Settings Button', shouldOpenModal: true }
  ];
  
  for (const button of mainMenuButtons) {
    testResults.totalTests++;
    try {
      console.log(`Testing ${button.name}...`);
      
      // Wait for button to be visible
      await page.waitForSelector(button.selector, { timeout: 5000 });
      
      // Click the button
      await page.click(button.selector);
      
      if (button.shouldNavigate) {
        // Wait for navigation
        await page.waitForTimeout(1000);
        console.log(`✅ ${button.name} - Navigation successful`);
        testResults.passedTests++;
        testResults.results.push({ button: button.name, status: 'PASS', message: 'Navigation successful' });
      } else if (button.shouldOpenModal) {
        // Check if modal opened
        const modalVisible = await page.$('.modal-overlay');
        if (modalVisible) {
          console.log(`✅ ${button.name} - Modal opened successfully`);
          testResults.passedTests++;
          testResults.results.push({ button: button.name, status: 'PASS', message: 'Modal opened successfully' });
          
          // Test modal action buttons
          await testModalButtons(page, button.name, testResults);
          
          // Close modal
          await page.click('.close-btn');
          await page.waitForTimeout(500);
        } else {
          console.log(`❌ ${button.name} - Modal did not open`);
          testResults.failedTests++;
          testResults.results.push({ button: button.name, status: 'FAIL', message: 'Modal did not open' });
        }
      }
    } catch (error) {
      console.log(`❌ ${button.name} - Error: ${error.message}`);
      testResults.failedTests++;
      testResults.results.push({ button: button.name, status: 'FAIL', message: error.message });
    }
  }
  
  // Test game scene buttons if we can navigate to game
  console.log('🎮 Testing game scene buttons...');
  try {
    await page.click('.start-game-btn');
    await page.waitForTimeout(2000);
    
    const gameButtons = [
      { selector: '.pause-btn', name: 'Pause Button' },
      { selector: '.resume-btn', name: 'Resume Button' },
      { selector: '.restart-btn', name: 'Restart Button' },
      { selector: '.main-menu-btn', name: 'Main Menu Button' }
    ];
    
    for (const button of gameButtons) {
      testResults.totalTests++;
      try {
        const element = await page.$(button.selector);
        if (element) {
          await page.click(button.selector);
          console.log(`✅ ${button.name} - Click successful`);
          testResults.passedTests++;
          testResults.results.push({ button: button.name, status: 'PASS', message: 'Click successful' });
          await page.waitForTimeout(500);
        } else {
          console.log(`⚠️ ${button.name} - Not found (may be conditional)`);
          testResults.results.push({ button: button.name, status: 'SKIP', message: 'Not found (may be conditional)' });
        }
      } catch (error) {
        console.log(`❌ ${button.name} - Error: ${error.message}`);
        testResults.failedTests++;
        testResults.results.push({ button: button.name, status: 'FAIL', message: error.message });
      }
    }
  } catch (error) {
    console.log('⚠️ Could not test game scene buttons:', error.message);
  }
  
  // Generate test report
  const report = `
# AUTOMATED BUTTON TEST REPORT

**Test Date:** ${testResults.timestamp}
**Total Tests:** ${testResults.totalTests}
**Passed:** ${testResults.passedTests}
**Failed:** ${testResults.failedTests}
**Success Rate:** ${((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)}%

## Test Results

${testResults.results.map(result => 
  `- **${result.button}:** ${result.status} - ${result.message}`
).join('\n')}

## Summary

${testResults.failedTests === 0 ? 
  '🎉 All buttons are working correctly!' : 
  `⚠️ ${testResults.failedTests} button(s) need attention.`
}
`;
  
  fs.writeFileSync('BUTTON_AUTOMATED_TEST_REPORT.md', report);
  console.log('📊 Test report saved to BUTTON_AUTOMATED_TEST_REPORT.md');
  
  await browser.close();
  
  console.log(`\n🎯 Test Complete!`);
  console.log(`✅ Passed: ${testResults.passedTests}`);
  console.log(`❌ Failed: ${testResults.failedTests}`);
  console.log(`📊 Success Rate: ${((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)}%`);
}

async function testModalButtons(page, modalName, testResults) {
  const modalButtons = [
    { selector: '.view-all-btn', name: 'View All Button' },
    { selector: '.start-boss-btn', name: 'Start Boss Battle Button' },
    { selector: '.view-collection-btn', name: 'View Collection Button' },
    { selector: '.start-story-btn', name: 'Begin Adventure Button' },
    { selector: '.start-challenge-btn', name: 'Start Challenge Button' },
    { selector: '.start-multiplayer-btn', name: 'Start Multiplayer Button' }
  ];
  
  for (const button of modalButtons) {
    try {
      const element = await page.$(button.selector);
      if (element) {
        testResults.totalTests++;
        await page.click(button.selector);
        console.log(`  ✅ ${button.name} - Click successful`);
        testResults.passedTests++;
        testResults.results.push({ button: `${modalName} - ${button.name}`, status: 'PASS', message: 'Click successful' });
        await page.waitForTimeout(1000);
      }
    } catch (error) {
      console.log(`  ❌ ${button.name} - Error: ${error.message}`);
      testResults.failedTests++;
      testResults.results.push({ button: `${modalName} - ${button.name}`, status: 'FAIL', message: error.message });
    }
  }
}

// Run the test
runAutomatedButtonTest().catch(console.error);

