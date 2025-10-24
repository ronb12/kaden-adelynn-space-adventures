// Advanced Particle System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class AdvancedParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particleEffects = new Map();
    this.activeEffects = new Set();
  }

  // 15 New Particle Effects
  createStellarExplosion(x, y) {
    const particles = this.scene.add.particles(x, y, 'star', {
      speed: { min: 200, max: 500 },
      scale: { start: 1, end: 0 },
      lifespan: 3000,
      quantity: 50,
      tint: [0xffff00, 0xff8800, 0xff4400],
      blendMode: 'ADD'
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 3000,
      onComplete: () => particles.destroy()
    });
  }

  createQuantumRift(x, y) {
    const particles = this.scene.add.particles(x, y, 'energy', {
      speed: { min: 100, max: 300 },
      scale: { start: 0.5, end: 2 },
      lifespan: 4000,
      quantity: 30,
      tint: 0x00ffff,
      blendMode: 'ADD',
      emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 100), quantity: 30 }
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 4000,
      onComplete: () => particles.destroy()
    });
  }

  createDimensionalTear(x, y) {
    const particles = this.scene.add.particles(x, y, 'void', {
      speed: { min: 50, max: 200 },
      scale: { start: 1, end: 0 },
      lifespan: 5000,
      quantity: 40,
      tint: 0x330066,
      blendMode: 'MULTIPLY',
      emitZone: { type: 'edge', source: new Phaser.Geom.Rectangle(-50, -50, 100, 100), quantity: 40 }
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 5000,
      onComplete: () => particles.destroy()
    });
  }

  createCosmicWind(x, y) {
    const particles = this.scene.add.particles(x, y, 'sparkle', {
      speed: { min: 300, max: 600 },
      scale: { start: 0.3, end: 0 },
      lifespan: 2000,
      quantity: 20,
      tint: 0x87ceeb,
      angle: { min: 0, max: 360 },
      blendMode: 'ADD'
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 2000,
      onComplete: () => particles.destroy()
    });
  }

  createGravityWell(x, y) {
    const particles = this.scene.add.particles(x, y, 'energy', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.5, end: 1.5 },
      lifespan: 3000,
      quantity: 25,
      tint: 0x330066,
      blendMode: 'ADD',
      emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 80), quantity: 25 }
    });
    
    // Animate particles spiraling inward
    this.scene.tweens.add({
      targets: particles,
      scaleX: 0.1,
      scaleY: 0.1,
      duration: 3000,
      onComplete: () => particles.destroy()
    });
  }

  createStellarNursery(x, y) {
    const particles = this.scene.add.particles(x, y, 'star', {
      speed: { min: 100, max: 300 },
      scale: { start: 0.2, end: 1 },
      lifespan: 6000,
      quantity: 35,
      tint: [0xffff00, 0xff8800, 0xff4400, 0x8800ff],
      blendMode: 'ADD',
      emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 120), quantity: 35 }
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 6000,
      onComplete: () => particles.destroy()
    });
  }

  createBlackHole(x, y) {
    const particles = this.scene.add.particles(x, y, 'void', {
      speed: { min: 200, max: 400 },
      scale: { start: 1, end: 0 },
      lifespan: 4000,
      quantity: 60,
      tint: 0x000000,
      blendMode: 'MULTIPLY',
      emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 100), quantity: 60 }
    });
    
    this.scene.tweens.add({
      targets: particles,
      scaleX: 0.1,
      scaleY: 0.1,
      duration: 4000,
      onComplete: () => particles.destroy()
    });
  }

  createNebulaGlow(x, y) {
    const particles = this.scene.add.particles(x, y, 'gas', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.5, end: 2 },
      lifespan: 5000,
      quantity: 40,
      tint: [0x8800ff, 0xff0088, 0x00ffff],
      blendMode: 'ADD',
      emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 150), quantity: 40 }
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 5000,
      onComplete: () => particles.destroy()
    });
  }

  createSolarFlare(x, y) {
    const particles = this.scene.add.particles(x, y, 'energy', {
      speed: { min: 400, max: 800 },
      scale: { start: 0.3, end: 0 },
      lifespan: 1500,
      quantity: 30,
      tint: [0xffff00, 0xff8800, 0xff4400],
      blendMode: 'ADD',
      angle: { min: -45, max: 45 }
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 1500,
      onComplete: () => particles.destroy()
    });
  }

  createCrystalFormation(x, y) {
    const particles = this.scene.add.particles(x, y, 'crystal', {
      speed: { min: 100, max: 250 },
      scale: { start: 0.2, end: 1.5 },
      lifespan: 4000,
      quantity: 25,
      tint: [0x00ffff, 0x0080ff, 0x8000ff],
      blendMode: 'ADD',
      emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 80), quantity: 25 }
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 4000,
      onComplete: () => particles.destroy()
    });
  }

  createVoidEnergy(x, y) {
    const particles = this.scene.add.particles(x, y, 'void', {
      speed: { min: 150, max: 350 },
      scale: { start: 0.5, end: 1 },
      lifespan: 3000,
      quantity: 35,
      tint: 0x330066,
      blendMode: 'MULTIPLY',
      emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 100), quantity: 35 }
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 3000,
      onComplete: () => particles.destroy()
    });
  }

  createStellarWind(x, y) {
    const particles = this.scene.add.particles(x, y, 'sparkle', {
      speed: { min: 400, max: 700 },
      scale: { start: 0.2, end: 0 },
      lifespan: 2000,
      quantity: 30,
      tint: 0x87ceeb,
      angle: { min: 0, max: 360 },
      blendMode: 'ADD'
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 2000,
      onComplete: () => particles.destroy()
    });
  }

  createQuantumFoam(x, y) {
    const particles = this.scene.add.particles(x, y, 'energy', {
      speed: { min: 50, max: 200 },
      scale: { start: 0.1, end: 0.5 },
      lifespan: 2000,
      quantity: 50,
      tint: [0x00ffff, 0xff00ff, 0xffff00],
      blendMode: 'ADD',
      emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 60), quantity: 50 }
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 2000,
      onComplete: () => particles.destroy()
    });
  }

  createDimensionalRift(x, y) {
    const particles = this.scene.add.particles(x, y, 'void', {
      speed: { min: 200, max: 500 },
      scale: { start: 0.5, end: 2 },
      lifespan: 4000,
      quantity: 40,
      tint: [0x330066, 0x6600cc, 0x9900ff],
      blendMode: 'MULTIPLY',
      emitZone: { type: 'edge', source: new Phaser.Geom.Rectangle(-75, -75, 150, 150), quantity: 40 }
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 4000,
      onComplete: () => particles.destroy()
    });
  }

  createCosmicDust(x, y) {
    const particles = this.scene.add.particles(x, y, 'dust', {
      speed: { min: 30, max: 100 },
      scale: { start: 0.3, end: 0 },
      lifespan: 5000,
      quantity: 60,
      tint: [0x888888, 0xaaaaaa, 0xcccccc],
      blendMode: 'NORMAL',
      emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 200), quantity: 60 }
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 5000,
      onComplete: () => particles.destroy()
    });
  }

  createRealityFragments(x, y) {
    const particles = this.scene.add.particles(x, y, 'fragment', {
      speed: { min: 100, max: 300 },
      scale: { start: 0.5, end: 0 },
      lifespan: 3000,
      quantity: 25,
      tint: [0xff00ff, 0x00ffff, 0xffff00, 0xff8800],
      blendMode: 'ADD',
      emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 80), quantity: 25 }
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 3000,
      onComplete: () => particles.destroy()
    });
  }

  // Enhanced existing effects
  createEnhancedExplosion(x, y) {
    // Multiple explosion layers
    this.createStellarExplosion(x, y);
    this.scene.time.delayedCall(200, () => {
      this.createQuantumRift(x, y);
    });
    this.scene.time.delayedCall(400, () => {
      this.createDimensionalTear(x, y);
    });
  }

  createEnhancedPowerUpEffect(x, y, powerUpType) {
    switch (powerUpType) {
      case 'FIRE_POWER':
        this.createSolarFlare(x, y);
        break;
      case 'ICE_POWER':
        this.createCrystalFormation(x, y);
        break;
      case 'LIGHTNING_POWER':
        this.createQuantumFoam(x, y);
        break;
      case 'DARK_POWER':
        this.createVoidEnergy(x, y);
        break;
      case 'LIGHT_POWER':
        this.createStellarExplosion(x, y);
        break;
      default:
        this.createNebulaGlow(x, y);
    }
  }

  createBossDefeatEffect(x, y) {
    // Multiple effects for boss defeat
    this.createStellarExplosion(x, y);
    this.scene.time.delayedCall(300, () => {
      this.createDimensionalRift(x, y);
    });
    this.scene.time.delayedCall(600, () => {
      this.createRealityFragments(x, y);
    });
  }

  createLevelTransitionEffect() {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;
    
    // Create full-screen effect
    this.createDimensionalRift(centerX, centerY);
    this.scene.time.delayedCall(500, () => {
      this.createCosmicDust(centerX, centerY);
    });
  }

  createAchievementEffect(x, y, rarity) {
    const colors = {
      common: 0xffffff,
      rare: 0x00ff00,
      epic: 0x0080ff,
      legendary: 0xff8000
    };
    
    const particles = this.scene.add.particles(x, y, 'sparkle', {
      speed: { min: 200, max: 400 },
      scale: { start: 1, end: 0 },
      lifespan: 2000,
      quantity: 30,
      tint: colors[rarity] || 0xffffff,
      blendMode: 'ADD'
    });
    
    this.scene.tweens.add({
      targets: particles,
      alpha: 0,
      duration: 2000,
      onComplete: () => particles.destroy()
    });
  }

  createWeaponEffect(x, y, weaponType) {
    switch (weaponType) {
      case 'LASER':
        this.createSolarFlare(x, y);
        break;
      case 'PLASMA':
        this.createStellarExplosion(x, y);
        break;
      case 'QUANTUM_BLASTER':
        this.createQuantumRift(x, y);
        break;
      case 'VOID_CANNON':
        this.createVoidEnergy(x, y);
        break;
      default:
        this.createNebulaGlow(x, y);
    }
  }

  createEnvironmentEffect(environmentType) {
    switch (environmentType) {
      case 'NEBULA_ZONE':
        this.createNebulaGlow(this.scene.scale.width / 2, this.scene.scale.height / 2);
        break;
      case 'BLACK_HOLE':
        this.createBlackHole(this.scene.scale.width / 2, this.scene.scale.height / 2);
        break;
      case 'STAR_NURSERY':
        this.createStellarNursery(this.scene.scale.width / 2, this.scene.scale.height / 2);
        break;
      case 'DIMENSIONAL_RIFT':
        this.createDimensionalRift(this.scene.scale.width / 2, this.scene.scale.height / 2);
        break;
      default:
        this.createCosmicDust(this.scene.scale.width / 2, this.scene.scale.height / 2);
    }
  }

  // Utility methods
  createParticleTexture(name, emoji, size = 32) {
    const canvas = this.scene.textures.createCanvas(name, size, size);
    const context = canvas.getContext();
    context.font = `${size}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(emoji, size / 2, size / 2);
    canvas.refresh();
  }

  createAllParticleTextures() {
    this.createParticleTexture('star', '⭐', 32);
    this.createParticleTexture('energy', '⚡', 32);
    this.createParticleTexture('void', '🌑', 32);
    this.createParticleTexture('sparkle', '✨', 32);
    this.createParticleTexture('gas', '💨', 32);
    this.createParticleTexture('crystal', '💎', 32);
    this.createParticleTexture('dust', '🌫️', 32);
    this.createParticleTexture('fragment', '🔮', 32);
  }

  cleanup() {
    this.activeEffects.forEach(effect => {
      if (effect.active) {
        effect.destroy();
      }
    });
    this.activeEffects.clear();
  }
}
