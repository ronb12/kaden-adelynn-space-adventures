// Difficulty Modes System - Easy, Medium, Hard with 60fps optimization

export class DifficultyModes {
  constructor() {
    this.currentDifficulty = 'medium';
    this.targetFPS = 60;
    this.frameTime = 1000 / this.targetFPS; // 16.67ms per frame
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.fps = 0;
    
    this.difficulties = {
      easy: {
        name: 'Easy',
        icon: '🟢',
        color: '#00ff00',
        description: 'Perfect for beginners',
        settings: {
          enemySpeed: 0.7,
          enemyHealth: 0.8,
          enemySpawnRate: 0.6,
          enemyDamage: 0.5,
          bossHealth: 0.8,
          bossSpeed: 0.8,
          powerUpRate: 1.5,
          scoreMultiplier: 1.2,
          playerHealth: 1.2,
          playerSpeed: 1.1,
          weaponDamage: 1.2,
          fireRate: 1.2
        }
      },
      medium: {
        name: 'Medium',
        icon: '🟡',
        color: '#ffff00',
        description: 'Balanced challenge',
        settings: {
          enemySpeed: 1.0,
          enemyHealth: 1.0,
          enemySpawnRate: 1.0,
          enemyDamage: 1.0,
          bossHealth: 1.0,
          bossSpeed: 1.0,
          powerUpRate: 1.0,
          scoreMultiplier: 1.0,
          playerHealth: 1.0,
          playerSpeed: 1.0,
          weaponDamage: 1.0,
          fireRate: 1.0
        }
      },
      hard: {
        name: 'Hard',
        icon: '🔴',
        color: '#ff0000',
        description: 'For experienced pilots',
        settings: {
          enemySpeed: 1.3,
          enemyHealth: 1.5,
          enemySpawnRate: 1.5,
          enemyDamage: 1.5,
          bossHealth: 1.5,
          bossSpeed: 1.2,
          powerUpRate: 0.7,
          scoreMultiplier: 1.5,
          playerHealth: 0.8,
          playerSpeed: 0.9,
          weaponDamage: 0.8,
          fireRate: 0.8
        }
      },
      nightmare: {
        name: 'Nightmare',
        icon: '💀',
        color: '#ff00ff',
        description: 'Only for the bravest',
        settings: {
          enemySpeed: 1.8,
          enemyHealth: 2.0,
          enemySpawnRate: 2.0,
          enemyDamage: 2.0,
          bossHealth: 2.0,
          bossSpeed: 1.5,
          powerUpRate: 0.5,
          scoreMultiplier: 2.0,
          playerHealth: 0.6,
          playerSpeed: 0.8,
          weaponDamage: 0.6,
          fireRate: 0.6
        }
      }
    };
  }

  // Set difficulty
  setDifficulty(difficulty) {
    if (this.difficulties[difficulty]) {
      this.currentDifficulty = difficulty;
      localStorage.setItem('gameDifficulty', difficulty);
    }
  }

  // Get current difficulty settings
  getCurrentSettings() {
    return this.difficulties[this.currentDifficulty].settings;
  }

  // Get difficulty info
  getDifficultyInfo() {
    return this.difficulties[this.currentDifficulty];
  }

  // Get all difficulties
  getAllDifficulties() {
    return Object.keys(this.difficulties).map(key => ({
      key,
      ...this.difficulties[key]
    }));
  }

  // 60fps optimization
  shouldUpdate(currentTime) {
    const deltaTime = currentTime - this.lastFrameTime;
    
    if (deltaTime >= this.frameTime) {
      this.lastFrameTime = currentTime;
      this.updateFPS(deltaTime);
      return true;
    }
    return false;
  }

  // Update FPS counter
  updateFPS(deltaTime) {
    this.frameCount++;
    this.fps = Math.round(1000 / deltaTime);
  }

  // Get current FPS
  getFPS() {
    return this.fps;
  }

  // Check if running at target FPS
  isOptimalFPS() {
    return this.fps >= this.targetFPS * 0.9; // 90% of target FPS
  }

  // Performance optimization
  optimizePerformance() {
    const settings = this.getCurrentSettings();
    
    // Reduce effects on lower-end devices
    if (this.fps < 30) {
      return {
        ...settings,
        particleEffects: 0.5,
        screenShake: 0.5,
        visualEffects: 0.5
      };
    }
    
    return settings;
  }

  // Draw difficulty display
  drawDifficultyDisplay(ctx, canvas) {
    const info = this.getDifficultyInfo();
    const x = 20;
    const y = canvas.height - 100;
    
    // Difficulty badge
    ctx.fillStyle = info.color;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${info.icon} ${info.name}`, x, y);
    
    // FPS display
    ctx.fillStyle = this.isOptimalFPS() ? '#00ff00' : '#ff0000';
    ctx.font = '14px Arial';
    ctx.fillText(`FPS: ${this.fps}`, x, y + 20);
    
    // Performance warning
    if (this.fps < 30) {
      ctx.fillStyle = '#ff0000';
      ctx.font = '12px Arial';
      ctx.fillText('⚠️ Low FPS - Reducing effects', x, y + 40);
    }
  }
}

export default DifficultyModes;
