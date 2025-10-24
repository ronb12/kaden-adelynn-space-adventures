// Particle Effects System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particleEffects = new Map();
    this.initializeParticleEffects();
  }

  initializeParticleEffects() {
    // Explosion Effects
    this.particleEffects.set('EXPLOSION', {
      name: 'Explosion',
      emoji: '💥',
      config: {
        speed: { min: 50, max: 200 },
        scale: { start: 1, end: 0 },
        lifespan: 1000,
        quantity: 20,
        color: [0xff0000, 0xff8800, 0xffff00]
      }
    });

    this.particleEffects.set('BIG_EXPLOSION', {
      name: 'Big Explosion',
      emoji: '💥',
      config: {
        speed: { min: 100, max: 400 },
        scale: { start: 2, end: 0 },
        lifespan: 2000,
        quantity: 50,
        color: [0xff0000, 0xff8800, 0xffff00, 0xffffff]
      }
    });

    this.particleEffects.set('BOSS_EXPLOSION', {
      name: 'Boss Explosion',
      emoji: '💥',
      config: {
        speed: { min: 200, max: 600 },
        scale: { start: 3, end: 0 },
        lifespan: 3000,
        quantity: 100,
        color: [0xff0000, 0xff8800, 0xffff00, 0xffffff, 0x00ffff]
      }
    });

    // Fire Effects
    this.particleEffects.set('FIRE', {
      name: 'Fire',
      emoji: '🔥',
      config: {
        speed: { min: 20, max: 80 },
        scale: { start: 0.5, end: 0 },
        lifespan: 1500,
        quantity: 15,
        color: [0xff0000, 0xff4400, 0xff8800],
        gravity: { x: 0, y: -50 }
      }
    });

    this.particleEffects.set('FIRE_TRAIL', {
      name: 'Fire Trail',
      emoji: '🔥',
      config: {
        speed: { min: 10, max: 30 },
        scale: { start: 0.3, end: 0 },
        lifespan: 800,
        quantity: 8,
        color: [0xff0000, 0xff4400],
        gravity: { x: 0, y: -20 }
      }
    });

    // Ice Effects
    this.particleEffects.set('ICE_SHARDS', {
      name: 'Ice Shards',
      emoji: '❄️',
      config: {
        speed: { min: 30, max: 120 },
        scale: { start: 0.8, end: 0 },
        lifespan: 2000,
        quantity: 25,
        color: [0x00ffff, 0x88ffff, 0xffffff],
        rotation: { start: 0, end: 360 }
      }
    });

    this.particleEffects.set('FREEZE_BLAST', {
      name: 'Freeze Blast',
      emoji: '❄️',
      config: {
        speed: { min: 100, max: 300 },
        scale: { start: 1.5, end: 0 },
        lifespan: 1500,
        quantity: 30,
        color: [0x00ffff, 0x88ffff, 0xffffff],
        rotation: { start: 0, end: 720 }
      }
    });

    // Electric Effects
    this.particleEffects.set('LIGHTNING', {
      name: 'Lightning',
      emoji: '⚡',
      config: {
        speed: { min: 200, max: 500 },
        scale: { start: 1, end: 0 },
        lifespan: 500,
        quantity: 10,
        color: [0xffff00, 0xffffff],
        rotation: { start: 0, end: 180 }
      }
    });

    this.particleEffects.set('ELECTRIC_SPARKS', {
      name: 'Electric Sparks',
      emoji: '⚡',
      config: {
        speed: { min: 50, max: 200 },
        scale: { start: 0.5, end: 0 },
        lifespan: 800,
        quantity: 20,
        color: [0xffff00, 0xffffff, 0x00ffff]
      }
    });

    // Magic Effects
    this.particleEffects.set('MAGIC_SPARKLES', {
      name: 'Magic Sparkles',
      emoji: '✨',
      config: {
        speed: { min: 20, max: 100 },
        scale: { start: 0.3, end: 0 },
        lifespan: 2000,
        quantity: 30,
        color: [0xff00ff, 0x8800ff, 0x00ffff, 0xffffff],
        rotation: { start: 0, end: 360 }
      }
    });

    this.particleEffects.set('HEALING_AURA', {
      name: 'Healing Aura',
      emoji: '💚',
      config: {
        speed: { min: 10, max: 40 },
        scale: { start: 0.5, end: 0 },
        lifespan: 3000,
        quantity: 20,
        color: [0x00ff00, 0x88ff88, 0xffffff],
        gravity: { x: 0, y: -30 }
      }
    });

    // Smoke Effects
    this.particleEffects.set('SMOKE', {
      name: 'Smoke',
      emoji: '💨',
      config: {
        speed: { min: 20, max: 60 },
        scale: { start: 0.5, end: 2 },
        lifespan: 3000,
        quantity: 15,
        color: [0x666666, 0x888888, 0xaaaaaa],
        gravity: { x: 0, y: -20 }
      }
    });

    this.particleEffects.set('HEAVY_SMOKE', {
      name: 'Heavy Smoke',
      emoji: '💨',
      config: {
        speed: { min: 30, max: 80 },
        scale: { start: 1, end: 3 },
        lifespan: 4000,
        quantity: 25,
        color: [0x444444, 0x666666, 0x888888],
        gravity: { x: 0, y: -30 }
      }
    });

    // Star Effects
    this.particleEffects.set('STAR_BURST', {
      name: 'Star Burst',
      emoji: '⭐',
      config: {
        speed: { min: 100, max: 300 },
        scale: { start: 0.5, end: 0 },
        lifespan: 1500,
        quantity: 20,
        color: [0xffff00, 0xffffff, 0x00ffff],
        rotation: { start: 0, end: 360 }
      }
    });

    this.particleEffects.set('CONSTELLATION', {
      name: 'Constellation',
      emoji: '✨',
      config: {
        speed: { min: 10, max: 50 },
        scale: { start: 0.2, end: 0 },
        lifespan: 4000,
        quantity: 40,
        color: [0xffffff, 0x00ffff, 0x8800ff],
        rotation: { start: 0, end: 180 }
      }
    });

    // Energy Effects
    this.particleEffects.set('ENERGY_BURST', {
      name: 'Energy Burst',
      emoji: '⚡',
      config: {
        speed: { min: 150, max: 400 },
        scale: { start: 1, end: 0 },
        lifespan: 1000,
        quantity: 25,
        color: [0x00ff00, 0x00ffff, 0xffffff],
        rotation: { start: 0, end: 180 }
      }
    });

    this.particleEffects.set('PLASMA_BLAST', {
      name: 'Plasma Blast',
      emoji: '🟣',
      config: {
        speed: { min: 200, max: 500 },
        scale: { start: 1.5, end: 0 },
        lifespan: 1200,
        quantity: 35,
        color: [0x8800ff, 0xff00ff, 0xffffff],
        rotation: { start: 0, end: 360 }
      }
    });

    // Healing Effects
    this.particleEffects.set('HEALING_WAVE', {
      name: 'Healing Wave',
      emoji: '💚',
      config: {
        speed: { min: 30, max: 80 },
        scale: { start: 0.8, end: 0 },
        lifespan: 2000,
        quantity: 25,
        color: [0x00ff00, 0x88ff88, 0xffffff],
        gravity: { x: 0, y: -40 }
      }
    });

    this.particleEffects.set('POWER_UP_GLOW', {
      name: 'Power Up Glow',
      emoji: '💎',
      config: {
        speed: { min: 5, max: 20 },
        scale: { start: 0.3, end: 0 },
        lifespan: 3000,
        quantity: 15,
        color: [0x00aaff, 0x00ffff, 0xffffff],
        gravity: { x: 0, y: -10 }
      }
    });
  }

  createEffect(effectType, x, y, options = {}) {
    const effect = this.particleEffects.get(effectType);
    if (!effect) return null;

    const config = { ...effect.config, ...options };
    
    // Create particle emitter
    const emitter = this.scene.add.particles(x, y, 'bulletSprite', {
      speed: config.speed,
      scale: config.scale,
      lifespan: config.lifespan,
      quantity: config.quantity,
      tint: config.color,
      rotation: config.rotation,
      gravity: config.gravity,
      alpha: { start: 1, end: 0 }
    });

    // Auto-destroy after effect duration
    this.scene.time.delayedCall(config.lifespan + 1000, () => {
      if (emitter) {
        emitter.destroy();
      }
    });

    return emitter;
  }

  createExplosion(x, y, size = 'normal') {
    const effectType = size === 'big' ? 'BIG_EXPLOSION' : 
                      size === 'boss' ? 'BOSS_EXPLOSION' : 'EXPLOSION';
    return this.createEffect(effectType, x, y);
  }

  createFireEffect(x, y, type = 'normal') {
    const effectType = type === 'trail' ? 'FIRE_TRAIL' : 'FIRE';
    return this.createEffect(effectType, x, y);
  }

  createIceEffect(x, y, type = 'shards') {
    const effectType = type === 'blast' ? 'FREEZE_BLAST' : 'ICE_SHARDS';
    return this.createEffect(effectType, x, y);
  }

  createElectricEffect(x, y, type = 'lightning') {
    const effectType = type === 'sparks' ? 'ELECTRIC_SPARKS' : 'LIGHTNING';
    return this.createEffect(effectType, x, y);
  }

  createMagicEffect(x, y, type = 'sparkles') {
    const effectType = type === 'aura' ? 'HEALING_AURA' : 'MAGIC_SPARKLES';
    return this.createEffect(effectType, x, y);
  }

  createSmokeEffect(x, y, intensity = 'normal') {
    const effectType = intensity === 'heavy' ? 'HEAVY_SMOKE' : 'SMOKE';
    return this.createEffect(effectType, x, y);
  }

  createStarEffect(x, y, type = 'burst') {
    const effectType = type === 'constellation' ? 'CONSTELLATION' : 'STAR_BURST';
    return this.createEffect(effectType, x, y);
  }

  createEnergyEffect(x, y, type = 'burst') {
    const effectType = type === 'plasma' ? 'PLASMA_BLAST' : 'ENERGY_BURST';
    return this.createEffect(effectType, x, y);
  }

  createHealingEffect(x, y, type = 'wave') {
    const effectType = type === 'glow' ? 'POWER_UP_GLOW' : 'HEALING_WAVE';
    return this.createEffect(effectType, x, y);
  }

  createTrailEffect(x, y, color = 0xffffff, duration = 1000) {
    const emitter = this.scene.add.particles(x, y, 'bulletSprite', {
      speed: { min: 10, max: 30 },
      scale: { start: 0.5, end: 0 },
      lifespan: duration,
      quantity: 5,
      tint: color,
      alpha: { start: 0.8, end: 0 }
    });

    this.scene.time.delayedCall(duration + 500, () => {
      if (emitter) {
        emitter.destroy();
      }
    });

    return emitter;
  }

  createScreenShake(intensity = 1, duration = 200) {
    this.scene.cameras.main.shake(duration, intensity * 0.01);
  }

  createScreenFlash(color = 0xffffff, duration = 100) {
    const flash = this.scene.add.rectangle(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2, 
      this.scene.scale.width, 
      this.scene.scale.height, 
      color, 
      0.5
    );
    flash.setDepth(1000);
    
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: duration,
      onComplete: () => flash.destroy()
    });
  }

  createFloatingText(x, y, text, color = 0xffffff, duration = 2000) {
    const textObj = this.scene.add.text(x, y, text, {
      fontSize: '24px',
      fill: `#${color.toString(16).padStart(6, '0')}`,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    });
    textObj.setOrigin(0.5);
    textObj.setDepth(1000);
    
    this.scene.tweens.add({
      targets: textObj,
      y: y - 50,
      alpha: 0,
      duration: duration,
      onComplete: () => textObj.destroy()
    });
  }

  createComboEffect(x, y, combo) {
    this.createFloatingText(x, y, `${combo}x COMBO!`, 0xffff00, 1500);
    this.createStarEffect(x, y, 'burst');
  }

  createScoreEffect(x, y, score) {
    this.createFloatingText(x, y, `+${score}`, 0x00ff00, 1000);
  }

  createPowerUpEffect(x, y, powerUpType) {
    this.createFloatingText(x, y, powerUpType, 0x00aaff, 2000);
    this.createMagicEffect(x, y, 'sparkles');
  }

  getAllEffects() {
    return Array.from(this.particleEffects.values());
  }
}
