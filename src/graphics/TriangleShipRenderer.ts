// Triangle Ship Renderer for Enhanced Gameplay
export const TriangleShipRenderer = {
  // Draw Player Triangle Ship
  drawPlayerShip(ctx: CanvasRenderingContext2D, player: any, character: string) {
    ctx.save();
    ctx.translate(player.x + player.width/2, player.y + player.height/2);
    
    const time = Date.now() * 0.003;
    const pulse = Math.sin(time) * 0.1 + 0.9;
    
    if (character === 'kaden') {
      // Kaden's Triangle Ship - Blue Fighter
      ctx.fillStyle = `rgba(74, 144, 226, ${0.8 + pulse * 0.2})`;
      ctx.strokeStyle = '#4A90E2';
      ctx.lineWidth = 2;
      
      // Main triangle body
      ctx.beginPath();
      ctx.moveTo(0, -player.height/2); // Top point
      ctx.lineTo(-player.width/2, player.height/2); // Bottom left
      ctx.lineTo(player.width/2, player.height/2); // Bottom right
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Cockpit
      ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + pulse * 0.2})`;
      ctx.beginPath();
      ctx.moveTo(0, -player.height/4);
      ctx.lineTo(-player.width/4, player.height/4);
      ctx.lineTo(player.width/4, player.height/4);
      ctx.closePath();
      ctx.fill();
      
      // Engine glow
      ctx.fillStyle = `rgba(0, 200, 255, ${0.7 + pulse * 0.3})`;
      ctx.shadowColor = '#00C8FF';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(-player.width/3, player.height/2);
      ctx.lineTo(-player.width/6, player.height/2 + 10);
      ctx.lineTo(player.width/6, player.height/2 + 10);
      ctx.lineTo(player.width/3, player.height/2);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      
    } else {
      // Adelynn's Triangle Ship - Pink Fighter
      ctx.fillStyle = `rgba(226, 74, 144, ${0.8 + pulse * 0.2})`;
      ctx.strokeStyle = '#E24A90';
      ctx.lineWidth = 2;
      
      // Main triangle body
      ctx.beginPath();
      ctx.moveTo(0, -player.height/2); // Top point
      ctx.lineTo(-player.width/2, player.height/2); // Bottom left
      ctx.lineTo(player.width/2, player.height/2); // Bottom right
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Cockpit
      ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + pulse * 0.2})`;
      ctx.beginPath();
      ctx.moveTo(0, -player.height/4);
      ctx.lineTo(-player.width/4, player.height/4);
      ctx.lineTo(player.width/4, player.height/4);
      ctx.closePath();
      ctx.fill();
      
      // Engine glow
      ctx.fillStyle = `rgba(255, 100, 200, ${0.7 + pulse * 0.3})`;
      ctx.shadowColor = '#FF64C8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(-player.width/3, player.height/2);
      ctx.lineTo(-player.width/6, player.height/2 + 10);
      ctx.lineTo(player.width/6, player.height/2 + 10);
      ctx.lineTo(player.width/3, player.height/2);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    ctx.restore();
  },

  // Draw Enemy Triangle Ship
  drawEnemyShip(ctx: CanvasRenderingContext2D, enemy: any) {
    ctx.save();
    ctx.translate(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
    
    const time = Date.now() * 0.002;
    const pulse = Math.sin(time) * 0.1 + 0.9;
    
    switch (enemy.type) {
      case 'basic':
        // Basic Enemy - Red Triangle
        ctx.fillStyle = `rgba(255, 68, 68, ${0.8 + pulse * 0.2})`;
        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 2;
        
        // Main triangle body (inverted)
        ctx.beginPath();
        ctx.moveTo(0, enemy.height/2); // Bottom point
        ctx.lineTo(-enemy.width/2, -enemy.height/2); // Top left
        ctx.lineTo(enemy.width/2, -enemy.height/2); // Top right
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Enemy eye
        ctx.fillStyle = `rgba(255, 0, 0, ${0.9 + pulse * 0.1})`;
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.width/8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
        
      case 'fast':
        // Fast Enemy - Orange Triangle
        ctx.fillStyle = `rgba(255, 136, 0, ${0.8 + pulse * 0.2})`;
        ctx.strokeStyle = '#FF8800';
        ctx.lineWidth = 1.5;
        
        // Sleek triangle body
        ctx.beginPath();
        ctx.moveTo(0, enemy.height/2);
        ctx.lineTo(-enemy.width/3, -enemy.height/2);
        ctx.lineTo(enemy.width/3, -enemy.height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Speed lines
        ctx.strokeStyle = `rgba(255, 200, 0, ${0.6 + pulse * 0.2})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(-enemy.width/4 + i * enemy.width/6, enemy.height/3);
          ctx.lineTo(-enemy.width/6 + i * enemy.width/6, enemy.height/2);
          ctx.stroke();
        }
        break;
        
      case 'heavy':
        // Heavy Enemy - Purple Triangle
        ctx.fillStyle = `rgba(136, 0, 255, ${0.8 + pulse * 0.2})`;
        ctx.strokeStyle = '#8800FF';
        ctx.lineWidth = 3;
        
        // Large triangle body
        ctx.beginPath();
        ctx.moveTo(0, enemy.height/2);
        ctx.lineTo(-enemy.width/2, -enemy.height/2);
        ctx.lineTo(enemy.width/2, -enemy.height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Armor plating
        ctx.fillStyle = `rgba(170, 68, 255, ${0.6 + pulse * 0.2})`;
        ctx.beginPath();
        ctx.moveTo(0, enemy.height/4);
        ctx.lineTo(-enemy.width/4, -enemy.height/4);
        ctx.lineTo(enemy.width/4, -enemy.height/4);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'zigzag':
        // Zigzag Enemy - Green Triangle
        ctx.fillStyle = `rgba(0, 255, 136, ${0.8 + pulse * 0.2})`;
        ctx.strokeStyle = '#00FF88';
        ctx.lineWidth = 2;
        
        // Irregular triangle body
        ctx.beginPath();
        ctx.moveTo(0, enemy.height/2);
        ctx.lineTo(-enemy.width/2.5, -enemy.height/2);
        ctx.lineTo(enemy.width/2.5, -enemy.height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Zigzag pattern
        ctx.strokeStyle = `rgba(68, 255, 170, ${0.7 + pulse * 0.2})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-enemy.width/4, -enemy.height/4);
        ctx.lineTo(0, enemy.height/4);
        ctx.lineTo(enemy.width/4, -enemy.height/4);
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  },

  // Draw Boss Triangle Ship
  drawBossShip(ctx: CanvasRenderingContext2D, boss: any) {
    ctx.save();
    ctx.translate(boss.x + boss.width/2, boss.y + boss.height/2);
    
    const time = Date.now() * 0.001;
    const pulse = Math.sin(time) * 0.2 + 0.8;
    const healthRatio = boss.health / boss.maxHealth;
    
    switch (boss.type) {
      case 'destroyer':
        // Destroyer Boss - Massive Red Triangle
        ctx.fillStyle = `rgba(255, 0, 0, ${0.7 + healthRatio * 0.3})`;
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 15;
        
        // Main boss body
        ctx.beginPath();
        ctx.moveTo(0, boss.height/2);
        ctx.lineTo(-boss.width/2, -boss.height/2);
        ctx.lineTo(boss.width/2, -boss.height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Boss details
        ctx.fillStyle = `rgba(255, 100, 100, ${0.8 + pulse * 0.2})`;
        ctx.beginPath();
        ctx.moveTo(0, boss.height/4);
        ctx.lineTo(-boss.width/4, -boss.height/4);
        ctx.lineTo(boss.width/4, -boss.height/4);
        ctx.closePath();
        ctx.fill();
        
        // Boss eye
        ctx.fillStyle = `rgba(255, 255, 0, ${0.9 + pulse * 0.1})`;
        ctx.shadowColor = '#FFFF00';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, -boss.height/8, boss.width/6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
        
      case 'battleship':
        // Battleship Boss - Large Blue Triangle
        ctx.fillStyle = `rgba(0, 0, 255, ${0.7 + healthRatio * 0.3})`;
        ctx.strokeStyle = '#0000FF';
        ctx.lineWidth = 5;
        ctx.shadowColor = '#0000FF';
        ctx.shadowBlur = 20;
        
        // Main boss body
        ctx.beginPath();
        ctx.moveTo(0, boss.height/2);
        ctx.lineTo(-boss.width/2, -boss.height/2);
        ctx.lineTo(boss.width/2, -boss.height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Multiple weapon mounts
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = `rgba(100, 100, 255, ${0.8 + pulse * 0.2})`;
          ctx.beginPath();
          ctx.moveTo(-boss.width/3 + i * boss.width/3, boss.height/3);
          ctx.lineTo(-boss.width/6 + i * boss.width/3, boss.height/2);
          ctx.lineTo(boss.width/6 + i * boss.width/3, boss.height/2);
          ctx.closePath();
          ctx.fill();
        }
        break;
    }
    
    ctx.restore();
  }
};