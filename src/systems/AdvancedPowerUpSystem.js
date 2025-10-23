// Advanced Power-Up System for #1 Space Shooter Game

export class AdvancedPowerUpSystem {
  constructor() {
    this.activePowerUps = new Map();
    this.powerUpQueue = [];
    this.visualEffects = [];
  }

  // Power-up types with enhanced effects
  powerUpTypes = {
    rapidFire: {
      name: 'Rapid Fire',
      icon: '⚡',
      color: '#FFFF00',
      duration: 8000,
      effect: (player) => {
        player.fireRate = player.baseFireRate * 0.3;
        player.bulletSpeed = player.baseBulletSpeed * 1.5;
      },
      visualEffect: 'lightningTrail'
    },
    
    multiShot: {
      name: 'Multi Shot',
      icon: '💥',
      color: '#FF00FF',
      duration: 6000,
      effect: (player) => {
        player.shotCount = 3;
        player.shotSpread = 0.3;
      },
      visualEffect: 'sparkleBurst'
    },
    
    shield: {
      name: 'Energy Shield',
      icon: '🛡️',
      color: '#00FF00',
      duration: 10000,
      effect: (player) => {
        player.shield = player.maxShield;
        player.invulnerable = true;
      },
      visualEffect: 'energyBubble'
    },
    
    speedBoost: {
      name: 'Speed Boost',
      icon: '🚀',
      color: '#00FFFF',
      duration: 5000,
      effect: (player) => {
        player.speed = player.baseSpeed * 2;
      },
      visualEffect: 'speedTrail'
    },
    
    healthBoost: {
      name: 'Health Boost',
      icon: '❤️',
      color: '#FF0000',
      duration: 0,
      effect: (player) => {
        player.health = Math.min(player.maxHealth, player.health + 50);
      },
      visualEffect: 'healingGlow'
    },
    
    scoreMultiplier: {
      name: 'Score Multiplier',
      icon: '⭐',
      color: '#FFD700',
      duration: 15000,
      effect: (player) => {
        player.scoreMultiplier = 3;
      },
      visualEffect: 'goldenAura'
    },
    
    timeSlow: {
      name: 'Time Slow',
      icon: '⏰',
      color: '#9370DB',
      duration: 3000,
      effect: (player) => {
        player.timeSlow = 0.3;
      },
      visualEffect: 'timeDistortion'
    },
    
    homingMissiles: {
      name: 'Homing Missiles',
      icon: '🎯',
      color: '#FF4500',
      duration: 8000,
      effect: (player) => {
        player.homingMissiles = true;
      },
      visualEffect: 'targetingLines'
    }
  };

  // Spawn power-up
  spawnPowerUp(x, y, type = null) {
    const powerUpTypes = Object.keys(this.powerUpTypes);
    const selectedType = type || powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    const powerUp = {
      id: Date.now() + Math.random(),
      type: selectedType,
      x: x,
      y: y,
      width: 20,
      height: 20,
      collected: false,
      spawnTime: Date.now(),
      bobOffset: Math.random() * Math.PI * 2,
      rotation: 0
    };
    
    this.powerUpQueue.push(powerUp);
    return powerUp;
  }

  // Update power-ups
  update(deltaTime, player, enemies) {
    // Update active power-ups
    for (const [type, powerUp] of this.activePowerUps) {
      powerUp.remainingTime -= deltaTime;
      
      if (powerUp.remainingTime <= 0) {
        this.removePowerUp(type, player);
      }
    }
    
    // Update power-up queue
    this.powerUpQueue = this.powerUpQueue.filter(powerUp => {
      if (powerUp.collected) return false;
      
      // Animate power-up
      powerUp.bobOffset += deltaTime * 0.003;
      powerUp.rotation += deltaTime * 0.002;
      
      // Check collision with player
      if (this.checkCollision(powerUp, player)) {
        this.collectPowerUp(powerUp, player);
        return false;
      }
      
      return true;
    });
    
    // Spawn new power-ups based on game state
    this.spawnPowerUpsBasedOnGameState(enemies);
  }

  // Check collision between power-up and player
  checkCollision(powerUp, player) {
    return (
      powerUp.x < player.x + player.width &&
      powerUp.x + powerUp.width > player.x &&
      powerUp.y < player.y + player.height &&
      powerUp.y + powerUp.height > player.y
    );
  }

  // Collect power-up
  collectPowerUp(powerUp, player) {
    powerUp.collected = true;
    const powerUpType = this.powerUpTypes[powerUp.type];
    
    if (powerUpType) {
      // Apply effect
      powerUpType.effect(player);
      
      // Add to active power-ups
      this.activePowerUps.set(powerUp.type, {
        startTime: Date.now(),
        duration: powerUpType.duration,
        remainingTime: powerUpType.duration,
        visualEffect: powerUpType.visualEffect
      });
      
      // Create visual effect
      this.createCollectionEffect(powerUp.x, powerUp.y, powerUpType);
    }
  }

  // Remove power-up effect
  removePowerUp(type, player) {
    this.activePowerUps.delete(type);
    
    // Reset player properties
    switch (type) {
      case 'rapidFire':
        player.fireRate = player.baseFireRate;
        player.bulletSpeed = player.baseBulletSpeed;
        break;
      case 'multiShot':
        player.shotCount = 1;
        player.shotSpread = 0;
        break;
      case 'shield':
        player.invulnerable = false;
        break;
      case 'speedBoost':
        player.speed = player.baseSpeed;
        break;
      case 'scoreMultiplier':
        player.scoreMultiplier = 1;
        break;
      case 'timeSlow':
        player.timeSlow = 1;
        break;
      case 'homingMissiles':
        player.homingMissiles = false;
        break;
    }
  }

  // Create collection effect
  createCollectionEffect(x, y, powerUpType) {
    this.visualEffects.push({
      type: 'frame',
      x: x,
      y: y,
      color: powerUpType.color,
      size: 40,
      duration: 500,
      startTime: Date.now()
    });
  }

  // Spawn power-ups based on game state
  spawnPowerUpsBasedOnGameState(enemies) {
    // Spawn power-ups when enemies are defeated
    const defeatedEnemies = enemies.filter(enemy => enemy.defeated);
    
    for (const enemy of defeatedEnemies) {
      if (Math.random() < 0.15) { // 15% chance
        this.spawnPowerUp(enemy.x, enemy.y);
      }
    }
  }

  // Render power-ups
  render(ctx) {
    // Render power-up queue
    for (const powerUp of this.powerUpQueue) {
      const powerUpType = this.powerUpTypes[powerUp.type];
      if (!powerUpType) continue;
      
      ctx.save();
      ctx.translate(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2);
      ctx.rotate(powerUp.rotation);
      
      // Draw power-up background
      ctx.fillStyle = powerUpType.color;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(-powerUp.width / 2, -powerUp.height / 2, powerUp.width, powerUp.height);
      
      // Draw power-up icon
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(powerUpType.icon, 0, 0);
      
      // Draw bob animation
      const bobY = Math.sin(powerUp.bobOffset) * 3;
      ctx.translate(0, bobY);
      
      ctx.restore();
    }
    
    // Render visual effects
    this.renderVisualEffects(ctx);
  }

  // Render visual effects
  renderVisualEffects(ctx) {
    const currentTime = Date.now();
    
    this.visualEffects = this.visualEffects.filter(effect => {
      const elapsed = currentTime - effect.startTime;
      const progress = elapsed / effect.duration;
      
      if (progress >= 1) return false;
      
      ctx.save();
      ctx.globalAlpha = 1 - progress;
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 3;
      
      if (effect.type === 'frame') {
        ctx.strokeRect(effect.x - effect.size / 2, effect.y - effect.size / 2, effect.size, effect.size);
      }
      
      ctx.restore();
      return true;
    });
  }

  // Get active power-ups info
  getActivePowerUps() {
    const activePowerUps = [];
    for (const [type, powerUp] of this.activePowerUps) {
      activePowerUps.push({
        type: type,
        name: this.powerUpTypes[type].name,
        icon: this.powerUpTypes[type].icon,
        remainingTime: powerUp.remainingTime,
        duration: powerUp.duration
      });
    }
    return activePowerUps;
  }
}

export default AdvancedPowerUpSystem;
