// Power-Up System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class PowerUpSystem {
  constructor(scene) {
    this.scene = scene;
    this.activePowerUps = new Map();
    this.powerUpTypes = {
      HEALTH: { emoji: '❤️', color: 0xff0000, duration: 0, effect: 'heal' },
      SHIELD: { emoji: '🛡️', color: 0x00aaff, duration: 10000, effect: 'shield' },
      SPEED: { emoji: '⚡', color: 0xffff00, duration: 8000, effect: 'speed' },
      MULTI_SHOT: { emoji: '🔫', color: 0xff8800, duration: 12000, effect: 'multiShot' },
      RAPID_FIRE: { emoji: '💥', color: 0xff4444, duration: 10000, effect: 'rapidFire' },
      SPREAD_SHOT: { emoji: '🌟', color: 0x8800ff, duration: 15000, effect: 'spreadShot' },
      PIERCE_SHOT: { emoji: '⚔️', color: 0x00ff88, duration: 8000, effect: 'pierceShot' },
      HOMING_SHOT: { emoji: '🎯', color: 0xff0088, duration: 10000, effect: 'homingShot' },
      FREEZE: { emoji: '❄️', color: 0x00ffff, duration: 6000, effect: 'freeze' },
      INVINCIBLE: { emoji: '💎', color: 0xffffff, duration: 5000, effect: 'invincible' },
      MAGNET: { emoji: '🧲', color: 0x888888, duration: 8000, effect: 'magnet' },
      EXPLOSIVE: { emoji: '💣', color: 0xff6600, duration: 10000, effect: 'explosive' },
      LASER: { emoji: '🔴', color: 0xff0000, duration: 12000, effect: 'laser' },
      TIME_SLOW: { emoji: '⏰', color: 0x666666, duration: 6000, effect: 'timeSlow' },
      SCORE_BOOST: { emoji: '⭐', color: 0xffdd00, duration: 15000, effect: 'scoreBoost' }
    };
  }

  createPowerUpSprite(type) {
    const config = this.powerUpTypes[type];
    const text = this.scene.add.text(0, 0, config.emoji, {
      fontSize: '32px',
      fill: '#ffffff'
    });
    text.generateTexture(`powerUp_${type}`, 40, 40);
    text.destroy();
  }

  spawnPowerUp(x, y) {
    const types = Object.keys(this.powerUpTypes);
    const randomType = Phaser.Utils.Array.GetRandom(types);
    const config = this.powerUpTypes[randomType];
    
    const powerUp = this.scene.physics.add.sprite(x, y, `powerUp_${randomType}`);
    powerUp.setVelocityY(50);
    powerUp.setTint(config.color);
    powerUp.setScale(1.5);
    powerUp.setData('type', randomType);
    
    // Add floating animation
    this.scene.tweens.add({
      targets: powerUp,
      y: powerUp.y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    return powerUp;
  }

  collectPowerUp(player, powerUp) {
    const type = powerUp.getData('type');
    const config = this.powerUpTypes[type];
    
    // Apply immediate effects
    this.applyPowerUpEffect(player, type);
    
    // Add to active power-ups if it has duration
    if (config.duration > 0) {
      this.activePowerUps.set(type, {
        startTime: this.scene.time.now,
        duration: config.duration,
        config: config
      });
    }
    
    // Create collection effect
    this.createCollectionEffect(powerUp.x, powerUp.y, config.emoji);
    
    powerUp.destroy();
  }

  applyPowerUpEffect(player, type) {
    switch (type) {
      case 'HEALTH':
        player.health = Math.min(100, player.health + 25);
        break;
      case 'SHIELD':
        player.shield = 50;
        break;
      case 'SPEED':
        player.speedMultiplier = 1.5;
        break;
      case 'MULTI_SHOT':
        player.multiShot = true;
        break;
      case 'RAPID_FIRE':
        player.rapidFire = true;
        break;
      case 'SPREAD_SHOT':
        player.spreadShot = true;
        break;
      case 'PIERCE_SHOT':
        player.pierceShot = true;
        break;
      case 'HOMING_SHOT':
        player.homingShot = true;
        break;
      case 'FREEZE':
        this.freezeEnemies();
        break;
      case 'INVINCIBLE':
        player.invincible = true;
        break;
      case 'MAGNET':
        player.magnet = true;
        break;
      case 'EXPLOSIVE':
        player.explosive = true;
        break;
      case 'LASER':
        player.laser = true;
        break;
      case 'TIME_SLOW':
        this.scene.time.timeScale = 0.5;
        break;
      case 'SCORE_BOOST':
        player.scoreMultiplier = 2;
        break;
    }
  }

  updatePowerUps() {
    const currentTime = this.scene.time.now;
    
    for (const [type, powerUp] of this.activePowerUps.entries()) {
      if (currentTime - powerUp.startTime >= powerUp.duration) {
        this.removePowerUpEffect(this.scene.player, type);
        this.activePowerUps.delete(type);
      }
    }
  }

  removePowerUpEffect(player, type) {
    switch (type) {
      case 'SHIELD':
        player.shield = 0;
        break;
      case 'SPEED':
        player.speedMultiplier = 1;
        break;
      case 'MULTI_SHOT':
        player.multiShot = false;
        break;
      case 'RAPID_FIRE':
        player.rapidFire = false;
        break;
      case 'SPREAD_SHOT':
        player.spreadShot = false;
        break;
      case 'PIERCE_SHOT':
        player.pierceShot = false;
        break;
      case 'HOMING_SHOT':
        player.homingShot = false;
        break;
      case 'INVINCIBLE':
        player.invincible = false;
        break;
      case 'MAGNET':
        player.magnet = false;
        break;
      case 'EXPLOSIVE':
        player.explosive = false;
        break;
      case 'LASER':
        player.laser = false;
        break;
      case 'TIME_SLOW':
        this.scene.time.timeScale = 1;
        break;
      case 'SCORE_BOOST':
        player.scoreMultiplier = 1;
        break;
    }
  }

  createCollectionEffect(x, y, emoji) {
    const effect = this.scene.add.text(x, y, emoji, {
      fontSize: '24px',
      fill: '#ffffff'
    });
    effect.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: effect,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => effect.destroy()
    });
  }

  freezeEnemies() {
    this.scene.enemies.children.entries.forEach(enemy => {
      enemy.setVelocity(0);
      enemy.setTint(0x00ffff);
      
      this.scene.time.delayedCall(3000, () => {
        if (enemy.active) {
          enemy.setTint(0xffffff);
          enemy.setVelocityY(100);
        }
      });
    });
  }

  getActivePowerUps() {
    return Array.from(this.activePowerUps.keys());
  }
}
