// Power-Up System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class PowerUpSystem {
  constructor(scene) {
    this.scene = scene;
    this.activePowerUps = new Map();
    this.powerUpTypes = {
      // Original 15 power-ups
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
      SCORE_BOOST: { emoji: '⭐', color: 0xffdd00, duration: 15000, effect: 'scoreBoost' },
      
      // 50 New Power-ups
      DOUBLE_HEALTH: { emoji: '💖', color: 0xff69b4, duration: 0, effect: 'doubleHeal' },
      MEGA_SHIELD: { emoji: '🛡️', color: 0x00ffff, duration: 15000, effect: 'megaShield' },
      SUPER_SPEED: { emoji: '💨', color: 0xffff00, duration: 12000, effect: 'superSpeed' },
      TRIPLE_SHOT: { emoji: '🔫', color: 0xff8800, duration: 15000, effect: 'tripleShot' },
      MEGA_RAPID: { emoji: '💥', color: 0xff0000, duration: 15000, effect: 'megaRapid' },
      ULTRA_SPREAD: { emoji: '🌟', color: 0x8800ff, duration: 20000, effect: 'ultraSpread' },
      MEGA_PIERCE: { emoji: '⚔️', color: 0x00ff88, duration: 12000, effect: 'megaPierce' },
      ULTRA_HOMING: { emoji: '🎯', color: 0xff0088, duration: 15000, effect: 'ultraHoming' },
      MEGA_FREEZE: { emoji: '❄️', color: 0x00ffff, duration: 10000, effect: 'megaFreeze' },
      ULTRA_INVINCIBLE: { emoji: '💎', color: 0xffffff, duration: 8000, effect: 'ultraInvincible' },
      SUPER_MAGNET: { emoji: '🧲', color: 0x888888, duration: 12000, effect: 'superMagnet' },
      MEGA_EXPLOSIVE: { emoji: '💣', color: 0xff6600, duration: 15000, effect: 'megaExplosive' },
      ULTRA_LASER: { emoji: '🔴', color: 0xff0000, duration: 18000, effect: 'ultraLaser' },
      SUPER_TIME_SLOW: { emoji: '⏰', color: 0x666666, duration: 10000, effect: 'superTimeSlow' },
      MEGA_SCORE_BOOST: { emoji: '⭐', color: 0xffdd00, duration: 20000, effect: 'megaScoreBoost' },
      
      // Elemental Power-ups
      FIRE_POWER: { emoji: '🔥', color: 0xff4400, duration: 12000, effect: 'firePower' },
      ICE_POWER: { emoji: '🧊', color: 0x00ffff, duration: 12000, effect: 'icePower' },
      LIGHTNING_POWER: { emoji: '⚡', color: 0xffff00, duration: 12000, effect: 'lightningPower' },
      EARTH_POWER: { emoji: '🌍', color: 0x8b4513, duration: 12000, effect: 'earthPower' },
      WIND_POWER: { emoji: '💨', color: 0x87ceeb, duration: 12000, effect: 'windPower' },
      WATER_POWER: { emoji: '🌊', color: 0x0066cc, duration: 12000, effect: 'waterPower' },
      DARK_POWER: { emoji: '🌑', color: 0x330066, duration: 12000, effect: 'darkPower' },
      LIGHT_POWER: { emoji: '☀️', color: 0xffff00, duration: 12000, effect: 'lightPower' },
      
      // Special Abilities
      TELEPORT: { emoji: '✨', color: 0xff00ff, duration: 8000, effect: 'teleport' },
      INVISIBILITY: { emoji: '👻', color: 0x888888, duration: 10000, effect: 'invisibility' },
      PHASE_SHIFT: { emoji: '🌀', color: 0x00ff88, duration: 8000, effect: 'phaseShift' },
      TIME_REVERSE: { emoji: '⏪', color: 0x666666, duration: 6000, effect: 'timeReverse' },
      GRAVITY_WELL: { emoji: '🌌', color: 0x330066, duration: 10000, effect: 'gravityWell' },
      SPACE_WARP: { emoji: '🌠', color: 0x8800ff, duration: 8000, effect: 'spaceWarp' },
      DIMENSION_SHIFT: { emoji: '🔮', color: 0xff0088, duration: 10000, effect: 'dimensionShift' },
      QUANTUM_LEAP: { emoji: '⚛️', color: 0x00ffff, duration: 6000, effect: 'quantumLeap' },
      
      // Weapon Modifiers
      BURST_FIRE: { emoji: '💥', color: 0xff4444, duration: 15000, effect: 'burstFire' },
      CHAIN_LIGHTNING: { emoji: '⚡', color: 0xffff00, duration: 12000, effect: 'chainLightning' },
      BOUNCE_SHOT: { emoji: '🏀', color: 0xff8800, duration: 10000, effect: 'bounceShot' },
      SPIRAL_SHOT: { emoji: '🌀', color: 0x8800ff, duration: 12000, effect: 'spiralShot' },
      WAVE_SHOT: { emoji: '🌊', color: 0x0066cc, duration: 10000, effect: 'waveShot' },
      ORBIT_SHOT: { emoji: '🪐', color: 0x8b4513, duration: 15000, effect: 'orbitShot' },
      SEEKER_MINE: { emoji: '💣', color: 0xff6600, duration: 12000, effect: 'seekerMine' },
      PLASMA_BEAM: { emoji: '🔴', color: 0xff0000, duration: 15000, effect: 'plasmaBeam' },
      
      // Defensive Power-ups
      REFLECT_SHIELD: { emoji: '🪞', color: 0x00aaff, duration: 10000, effect: 'reflectShield' },
      ABSORB_SHIELD: { emoji: '🛡️', color: 0x00ff88, duration: 12000, effect: 'absorbShield' },
      REGENERATION: { emoji: '🔄', color: 0x00ff00, duration: 15000, effect: 'regeneration' },
      DAMAGE_REDUCTION: { emoji: '🛡️', color: 0x888888, duration: 10000, effect: 'damageReduction' },
      AUTO_DODGE: { emoji: '💨', color: 0x87ceeb, duration: 12000, effect: 'autoDodge' },
      PHASE_DODGE: { emoji: '👻', color: 0x888888, duration: 8000, effect: 'phaseDodge' },
      COUNTER_ATTACK: { emoji: '⚔️', color: 0xff0088, duration: 10000, effect: 'counterAttack' },
      RETALIATION: { emoji: '💥', color: 0xff4444, duration: 12000, effect: 'retaliation' },
      
      // Utility Power-ups
      SCORE_MULTIPLIER: { emoji: '⭐', color: 0xffdd00, duration: 20000, effect: 'scoreMultiplier' },
      EXPERIENCE_BOOST: { emoji: '📈', color: 0x00ff88, duration: 0, effect: 'experienceBoost' },
      CURRENCY_BONUS: { emoji: '💰', color: 0xffdd00, duration: 0, effect: 'currencyBonus' },
      LUCK_BOOST: { emoji: '🍀', color: 0x00ff00, duration: 15000, effect: 'luckBoost' },
      CRITICAL_HIT: { emoji: '💥', color: 0xff0000, duration: 10000, effect: 'criticalHit' },
      PERFECT_SHOT: { emoji: '🎯', color: 0xff0088, duration: 8000, effect: 'perfectShot' },
      COMBO_MULTIPLIER: { emoji: '🔥', color: 0xff4400, duration: 12000, effect: 'comboMultiplier' },
      STREAK_BONUS: { emoji: '⚡', color: 0xffff00, duration: 15000, effect: 'streakBonus' }
    };
  }

  createPowerUpSprite(type) {
    const config = this.powerUpTypes[type];
    const canvas = this.scene.textures.createCanvas(`powerUp_${type}`, 40, 40);
    const context = canvas.getContext();
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(config.emoji, 20, 20);
    canvas.refresh();
  }

  createPowerUpSprites() {
    // Create sprites for all power-up types
    Object.keys(this.powerUpTypes).forEach(type => {
      this.createPowerUpSprite(type);
    });
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
