// Enhanced UI System for #1 Space Shooter Game

export class EnhancedUISystem {
  constructor() {
    this.animations = [];
    this.notifications = [];
    this.scoreAnimations = [];
    this.healthAnimations = [];
    this.powerUpNotifications = [];
  }

  // Add score animation
  addScoreAnimation(x, y, score, color = '#FFFFFF') {
    this.scoreAnimations.push({
      x: x,
      y: y,
      score: `+${score}`,
      color: color,
      alpha: 1,
      scale: 1,
      life: 1000,
      maxLife: 1000,
      startTime: Date.now()
    });
  }

  // Add health animation
  addHealthAnimation(x, y, amount, type = 'heal') {
    this.healthAnimations.push({
      x: x,
      y: y,
      amount: type === 'heal' ? `+${amount}` : `-${amount}`,
      color: type === 'heal' ? '#00FF00' : '#FF0000',
      alpha: 1,
      scale: 1,
      life: 1500,
      maxLife: 1500,
      startTime: Date.now()
    });
  }

  // Add power-up notification
  addPowerUpNotification(powerUpName, icon, color) {
    this.powerUpNotifications.push({
      name: powerUpName,
      icon: icon,
      color: color,
      alpha: 1,
      scale: 1,
      life: 3000,
      maxLife: 3000,
      startTime: Date.now()
    });
  }

  // Add combo notification
  addComboNotification(combo, multiplier) {
    this.notifications.push({
      type: 'combo',
      text: `COMBO x${multiplier}!`,
      color: '#FFD700',
      alpha: 1,
      scale: 1,
      life: 2000,
      maxLife: 2000,
      startTime: Date.now()
    });
  }

  // Add achievement notification
  addAchievementNotification(achievement) {
    this.notifications.push({
      type: 'achievement',
      text: `ACHIEVEMENT: ${achievement}`,
      color: '#FF69B4',
      alpha: 1,
      scale: 1,
      life: 4000,
      maxLife: 4000,
      startTime: Date.now()
    });
  }

  // Add boss warning
  addBossWarning() {
    this.notifications.push({
      type: 'boss',
      text: 'BOSS INCOMING!',
      color: '#FF0000',
      alpha: 1,
      scale: 1,
      life: 3000,
      maxLife: 3000,
      startTime: Date.now()
    });
  }

  // Update all animations
  update(deltaTime) {
    // Update score animations
    this.scoreAnimations = this.scoreAnimations.filter(animation => {
      animation.life -= deltaTime;
      animation.alpha = animation.life / animation.maxLife;
      animation.scale = 1 + (1 - animation.alpha) * 0.5;
      animation.y -= 1;
      return animation.life > 0;
    });

    // Update health animations
    this.healthAnimations = this.healthAnimations.filter(animation => {
      animation.life -= deltaTime;
      animation.alpha = animation.life / animation.maxLife;
      animation.scale = 1 + (1 - animation.alpha) * 0.3;
      animation.y -= 0.8;
      return animation.life > 0;
    });

    // Update power-up notifications
    this.powerUpNotifications = this.powerUpNotifications.filter(notification => {
      notification.life -= deltaTime;
      notification.alpha = notification.life / notification.maxLife;
      notification.scale = 1 + Math.sin(Date.now() * 0.01) * 0.1;
      return notification.life > 0;
    });

    // Update general notifications
    this.notifications = this.notifications.filter(notification => {
      notification.life -= deltaTime;
      notification.alpha = notification.life / notification.maxLife;
      notification.scale = 1 + (1 - notification.alpha) * 0.2;
      return notification.life > 0;
    });
  }

  // Render all UI elements
  render(ctx, canvas, gameStats) {
    this.renderScoreAnimations(ctx);
    this.renderHealthAnimations(ctx);
    this.renderPowerUpNotifications(ctx, canvas);
    this.renderNotifications(ctx, canvas);
    this.renderEnhancedUI(ctx, canvas, gameStats);
  }

  // Render score animations
  renderScoreAnimations(ctx) {
    ctx.save();
    
    this.scoreAnimations.forEach(animation => {
      ctx.globalAlpha = animation.alpha;
      ctx.fillStyle = animation.color;
      ctx.font = `bold ${20 * animation.scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(animation.score, animation.x, animation.y);
    });
    
    ctx.restore();
  }

  // Render health animations
  renderHealthAnimations(ctx) {
    ctx.save();
    
    this.healthAnimations.forEach(animation => {
      ctx.globalAlpha = animation.alpha;
      ctx.fillStyle = animation.color;
      ctx.font = `bold ${18 * animation.scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(animation.amount, animation.x, animation.y);
    });
    
    ctx.restore();
  }

  // Render power-up notifications
  renderPowerUpNotifications(ctx, canvas) {
    ctx.save();
    
    let yOffset = 50;
    this.powerUpNotifications.forEach(notification => {
      ctx.globalAlpha = notification.alpha;
      ctx.fillStyle = notification.color;
      ctx.font = `bold ${24 * notification.scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(
        `${notification.icon} ${notification.name}`,
        canvas.width / 2,
        yOffset
      );
      yOffset += 40;
    });
    
    ctx.restore();
  }

  // Render general notifications
  renderNotifications(ctx, canvas) {
    ctx.save();
    
    let yOffset = canvas.height - 100;
    this.notifications.forEach(notification => {
      ctx.globalAlpha = notification.alpha;
      ctx.fillStyle = notification.color;
      ctx.font = `bold ${28 * notification.scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeText(notification.text, canvas.width / 2, yOffset);
      ctx.fillText(notification.text, canvas.width / 2, yOffset);
      yOffset -= 50;
    });
    
    ctx.restore();
  }

  // Render enhanced UI
  renderEnhancedUI(ctx, canvas, gameStats) {
    // Enhanced health bar
    this.renderEnhancedHealthBar(ctx, canvas, gameStats);
    
    // Enhanced score display
    this.renderEnhancedScore(ctx, canvas, gameStats);
    
    // Enhanced combo display
    this.renderEnhancedCombo(ctx, canvas, gameStats);
    
    // Enhanced power-up display
    this.renderEnhancedPowerUps(ctx, canvas, gameStats);
  }

  // Render enhanced health bar
  renderEnhancedHealthBar(ctx, canvas, gameStats) {
    const barWidth = 200;
    const barHeight = 20;
    const barX = 20;
    const barY = 20;
    
    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Health fill with gradient
    const healthPercent = gameStats.health / gameStats.maxHealth;
    const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth * healthPercent, barY);
    
    if (healthPercent > 0.6) {
      gradient.addColorStop(0, '#00FF00');
      gradient.addColorStop(1, '#00AA00');
    } else if (healthPercent > 0.3) {
      gradient.addColorStop(0, '#FFFF00');
      gradient.addColorStop(1, '#FFAA00');
    } else {
      gradient.addColorStop(0, '#FF0000');
      gradient.addColorStop(1, '#AA0000');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    // Border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Health text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${Math.ceil(gameStats.health)}/${gameStats.maxHealth}`,
      barX + barWidth / 2,
      barY + barHeight / 2 + 5
    );
  }

  // Render enhanced score display
  renderEnhancedScore(ctx, canvas, gameStats) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${gameStats.score.toLocaleString()}`, canvas.width - 20, 40);
    
    // High score
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`High: ${gameStats.highScore.toLocaleString()}`, canvas.width - 20, 65);
  }

  // Render enhanced combo display
  renderEnhancedCombo(ctx, canvas, gameStats) {
    if (gameStats.combo > 1) {
      const multiplier = Math.min(10, Math.floor(gameStats.combo / 5) + 1);
      
      // Combo background
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.fillRect(canvas.width / 2 - 100, 50, 200, 60);
      
      // Combo text
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(`COMBO x${multiplier}!`, canvas.width / 2, 80);
      ctx.fillText(`COMBO x${multiplier}!`, canvas.width / 2, 80);
      
      // Combo count
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`${gameStats.combo} Kills`, canvas.width / 2, 105);
    }
  }

  // Render enhanced power-ups display
  renderEnhancedPowerUps(ctx, canvas, gameStats) {
    // This would show active power-ups with icons and timers
    // Implementation depends on how power-ups are tracked in gameStats
  }

  // Clear all animations
  clear() {
    this.animations = [];
    this.notifications = [];
    this.scoreAnimations = [];
    this.healthAnimations = [];
    this.powerUpNotifications = [];
  }
}

export default EnhancedUISystem;
