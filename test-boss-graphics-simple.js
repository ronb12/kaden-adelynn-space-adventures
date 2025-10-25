// Simple Boss Graphics Test
// This script tests the enhanced boss graphics by creating a test canvas

const fs = require('fs');
const { createCanvas } = require('canvas');

// Mock the ShipRenderer for testing
const ShipRenderer = {
  drawBossShip(ctx, x, y, width, height, health, maxHealth, bossType = 'destroyer') {
    ctx.save();
    ctx.translate(x + width/2, y + height/2);
    
    // Health-based color intensity
    const healthRatio = health / maxHealth;
    const time = Date.now() * 0.003; // For pulsing effects
    
    // Draw different boss types with unique designs
    switch (bossType) {
      case 'destroyer':
        this.drawDestroyerBoss(ctx, width, height, healthRatio, time);
        break;
      case 'battleship':
        this.drawBattleshipBoss(ctx, width, height, healthRatio, time);
        break;
      case 'mothership':
        this.drawMothershipBoss(ctx, width, height, healthRatio, time);
        break;
      default:
        this.drawDestroyerBoss(ctx, width, height, healthRatio, time);
    }
    
    ctx.restore();
  },

  // Destroyer Boss - Sleek, fast design
  drawDestroyerBoss(ctx, width, height, healthRatio, time) {
    const pulse = Math.sin(time) * 0.1 + 0.9;
    const glowIntensity = healthRatio * pulse;
    
    // Outer glow effect
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 20 * glowIntensity;
    
    // Main hull - elongated diamond shape
    ctx.fillStyle = `rgba(200, 50, 50, ${0.8 + glowIntensity * 0.2})`;
    ctx.strokeStyle = '#ff6666';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(0, -height/2);
    ctx.lineTo(width/3, -height/4);
    ctx.lineTo(width/2, 0);
    ctx.lineTo(width/3, height/4);
    ctx.lineTo(0, height/2);
    ctx.lineTo(-width/3, height/4);
    ctx.lineTo(-width/2, 0);
    ctx.lineTo(-width/3, -height/4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Engine pods
    ctx.fillStyle = '#ffaa00';
    ctx.strokeStyle = '#ff8800';
    ctx.lineWidth = 2;
    
    // Left engine
    ctx.beginPath();
    ctx.ellipse(-width/2.5, height/3, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Right engine
    ctx.beginPath();
    ctx.ellipse(width/2.5, height/3, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Engine flames
    ctx.fillStyle = `rgba(255, 100, 0, ${glowIntensity})`;
    ctx.beginPath();
    ctx.ellipse(-width/2.5, height/2.5, 8, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width/2.5, height/2.5, 8, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Central core with pulsing effect
    ctx.fillStyle = `rgba(255, 255, 255, ${glowIntensity})`;
    ctx.beginPath();
    ctx.arc(0, 0, width/8, 0, Math.PI * 2);
    ctx.fill();
    
    // Weapon turrets
    ctx.fillStyle = '#666666';
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4;
      const turretX = Math.cos(angle) * (width/3);
      const turretY = Math.sin(angle) * (height/3);
      
      ctx.beginPath();
      ctx.arc(turretX, turretY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  },

  // Battleship Boss - Heavy, armored design
  drawBattleshipBoss(ctx, width, height, healthRatio, time) {
    const pulse = Math.sin(time * 0.5) * 0.1 + 0.9;
    const glowIntensity = healthRatio * pulse;
    
    // Outer glow
    ctx.shadowColor = '#6600ff';
    ctx.shadowBlur = 25 * glowIntensity;
    
    // Main hull - rectangular with rounded corners
    ctx.fillStyle = `rgba(100, 50, 200, ${0.8 + glowIntensity * 0.2})`;
    ctx.strokeStyle = '#aa66ff';
    ctx.lineWidth = 4;
    
    ctx.beginPath();
    ctx.roundRect(-width/2, -height/2, width, height, 15);
    ctx.fill();
    ctx.stroke();
    
    // Armor plating
    ctx.fillStyle = '#444444';
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    
    // Top armor
    ctx.beginPath();
    ctx.roundRect(-width/2 + 10, -height/2 + 10, width - 20, 20, 5);
    ctx.fill();
    ctx.stroke();
    
    // Bottom armor
    ctx.beginPath();
    ctx.roundRect(-width/2 + 10, height/2 - 30, width - 20, 20, 5);
    ctx.fill();
    ctx.stroke();
    
    // Side armor plates
    for (let i = 0; i < 3; i++) {
      const y = -height/3 + (i * height/3);
      ctx.beginPath();
      ctx.roundRect(-width/2 + 5, y - 8, 15, 16, 3);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.roundRect(width/2 - 20, y - 8, 15, 16, 3);
      ctx.fill();
      ctx.stroke();
    }
    
    // Central command center
    ctx.fillStyle = `rgba(255, 255, 255, ${glowIntensity})`;
    ctx.beginPath();
    ctx.arc(0, 0, width/6, 0, Math.PI * 2);
    ctx.fill();
    
    // Heavy weapon mounts
    ctx.fillStyle = '#333333';
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 2;
    
    // Front cannons
    ctx.beginPath();
    ctx.rect(-width/4, -height/2 - 10, width/8, 20);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.rect(width/4 - width/8, -height/2 - 10, width/8, 20);
    ctx.fill();
    ctx.stroke();
    
    // Side turrets
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? -1 : 1;
      ctx.beginPath();
      ctx.arc(side * width/2.5, -height/4 + (i * height/2), 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  },

  // Mothership Boss - Massive, intimidating design
  drawMothershipBoss(ctx, width, height, healthRatio, time) {
    const pulse = Math.sin(time * 0.3) * 0.1 + 0.9;
    const glowIntensity = healthRatio * pulse;
    
    // Massive outer glow
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = 30 * glowIntensity;
    
    // Main body - large hexagonal shape
    ctx.fillStyle = `rgba(200, 100, 0, ${0.8 + glowIntensity * 0.2})`;
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 5;
    
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const x = Math.cos(angle) * (width/2);
      const y = Math.sin(angle) * (height/2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Inner structure
    ctx.fillStyle = '#ff8800';
    ctx.strokeStyle = '#ffaa44';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const x = Math.cos(angle) * (width/3);
      const y = Math.sin(angle) * (height/3);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Central core with energy field
    ctx.fillStyle = `rgba(255, 255, 255, ${glowIntensity})`;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(0, 0, width/8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Energy rings
    ctx.strokeStyle = `rgba(255, 255, 255, ${glowIntensity * 0.5})`;
    ctx.lineWidth = 1;
    
    for (let ring = 1; ring <= 3; ring++) {
      ctx.beginPath();
      ctx.arc(0, 0, width/8 + ring * 8, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Weapon arrays
    ctx.fillStyle = '#666666';
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const weaponX = Math.cos(angle) * (width/2.2);
      const weaponY = Math.sin(angle) * (height/2.2);
      
      ctx.beginPath();
      ctx.arc(weaponX, weaponY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Weapon barrels
      ctx.beginPath();
      ctx.moveTo(weaponX, weaponY);
      ctx.lineTo(weaponX + Math.cos(angle) * 15, weaponY + Math.sin(angle) * 15);
      ctx.stroke();
    }
    
    // Shield generators
    ctx.fillStyle = `rgba(0, 150, 255, ${glowIntensity * 0.7})`;
    ctx.strokeStyle = '#00aaff';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4 + Math.PI/4;
      const genX = Math.cos(angle) * (width/1.8);
      const genY = Math.sin(angle) * (height/1.8);
      
      ctx.beginPath();
      ctx.arc(genX, genY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }
};

async function testBossGraphics() {
  console.log('🎨 Testing Enhanced Boss Graphics...');
  
  try {
    // Create a test canvas
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    
    // Set background
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, 800, 600);
    
    // Test Destroyer Boss
    console.log('🚀 Drawing Destroyer Boss...');
    ShipRenderer.drawBossShip(ctx, 100, 100, 80, 60, 100, 100, 'destroyer');
    
    // Test Battleship Boss
    console.log('⚔️  Drawing Battleship Boss...');
    ShipRenderer.drawBossShip(ctx, 250, 100, 100, 80, 150, 150, 'battleship');
    
    // Test Mothership Boss
    console.log('🛸 Drawing Mothership Boss...');
    ShipRenderer.drawBossShip(ctx, 450, 100, 120, 100, 200, 200, 'mothership');
    
    // Test damaged bosses
    console.log('💥 Drawing damaged bosses...');
    ShipRenderer.drawBossShip(ctx, 100, 300, 80, 60, 30, 100, 'destroyer');
    ShipRenderer.drawBossShip(ctx, 250, 300, 100, 80, 50, 150, 'battleship');
    ShipRenderer.drawBossShip(ctx, 450, 300, 120, 100, 80, 200, 'mothership');
    
    // Add labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    
    ctx.fillText('Destroyer Boss', 140, 200);
    ctx.fillText('Battleship Boss', 300, 220);
    ctx.fillText('Mothership Boss', 510, 240);
    
    ctx.fillText('Damaged Destroyer', 140, 400);
    ctx.fillText('Damaged Battleship', 300, 420);
    ctx.fillText('Damaged Mothership', 510, 440);
    
    // Save the test image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('enhanced-boss-graphics-test.png', buffer);
    
    console.log('✅ Enhanced Boss Graphics Test Complete!');
    console.log('📸 Test image saved as enhanced-boss-graphics-test.png');
    console.log('🎨 Boss designs now feature:');
    console.log('   • Destroyer: Sleek diamond shape with engine pods and weapon turrets');
    console.log('   • Battleship: Heavy armored design with cannon mounts and side turrets');
    console.log('   • Mothership: Massive hexagonal design with energy fields and weapon arrays');
    console.log('   • Dynamic health-based coloring and pulsing effects');
    console.log('   • Glow effects and detailed weapon systems');
    console.log('   • No more square boxes! 🎉');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('💡 Make sure to install canvas: npm install canvas');
  }
}

// Run the test
testBossGraphics();
