// Enhanced Visual Effects System - Complete Visual Implementation
export class EnhancedVisualEffects {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private effects: VisualEffect[] = [];
  private screenShake: ScreenShakeEffect | null = null;
  private slowMotion: SlowMotionEffect | null = null;
  private flash: FlashEffect | null = null;
  
  // Performance settings
  private maxParticles: number = 500;
  private particlePool: Particle[] = [];
  private effectPool: VisualEffect[] = [];
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.initializeParticlePool();
    this.initializeEffectPool();
  }

  private initializeParticlePool() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.particlePool.push(new Particle());
    }
  }

  private initializeEffectPool() {
    for (let i = 0; i < 50; i++) {
      this.effectPool.push(new VisualEffect());
    }
  }

  // Particle system
  createExplosion(x: number, y: number, type: 'small' | 'medium' | 'large' | 'boss' = 'medium') {
    const particleCount = this.getParticleCount(type);
    const colors = this.getExplosionColors(type);
    
    for (let i = 0; i < particleCount; i++) {
      const particle = this.getParticleFromPool();
      if (!particle) continue;
      
      particle.x = x;
      particle.y = y;
      particle.vx = (Math.random() - 0.5) * 10;
      particle.vy = (Math.random() - 0.5) * 10;
      particle.life = particle.maxLife = this.getParticleLife(type);
      particle.color = colors[Math.floor(Math.random() * colors.length)];
      particle.size = Math.random() * this.getParticleSize(type) + 1;
      particle.type = 'explosion';
      
      this.particles.push(particle);
    }
  }

  createEngineTrail(x: number, y: number, vx: number, vy: number) {
    const particle = this.getParticleFromPool();
    if (!particle) return;
    
    particle.x = x;
    particle.y = y;
    particle.vx = vx * 0.5 + (Math.random() - 0.5) * 2;
    particle.vy = vy * 0.5 + (Math.random() - 0.5) * 2;
    particle.life = particle.maxLife = 200;
    particle.color = '#00AAFF';
    particle.size = Math.random() * 3 + 1;
    particle.type = 'engine';
    
    this.particles.push(particle);
  }

  createPowerUpEffect(x: number, y: number, type: string) {
    const colors = this.getPowerUpColors(type);
    
    for (let i = 0; i < 20; i++) {
      const particle = this.getParticleFromPool();
      if (!particle) continue;
      
      particle.x = x;
      particle.y = y;
      particle.vx = (Math.random() - 0.5) * 4;
      particle.vy = (Math.random() - 0.5) * 4;
      particle.life = particle.maxLife = 1000;
      particle.color = colors[Math.floor(Math.random() * colors.length)];
      particle.size = Math.random() * 2 + 1;
      particle.type = 'powerup';
      
      this.particles.push(particle);
    }
  }

  createBulletTrail(x: number, y: number, vx: number, vy: number, color: string) {
    const particle = this.getParticleFromPool();
    if (!particle) return;
    
    particle.x = x;
    particle.y = y;
    particle.vx = vx * 0.3;
    particle.vy = vy * 0.3;
    particle.life = particle.maxLife = 200;
    particle.color = color;
    particle.size = Math.random() * 2 + 1;
    particle.type = 'bullet';
    
    this.particles.push(particle);
  }

  // Screen effects
  startScreenShake(intensity: number = 5, duration: number = 200) {
    this.screenShake = new ScreenShakeEffect(intensity, duration);
  }

  startSlowMotion(factor: number = 0.3, duration: number = 1000) {
    this.slowMotion = new SlowMotionEffect(factor, duration);
  }

  startFlash(color: string = '#FFFFFF', alpha: number = 0.8, duration: number = 100) {
    this.flash = new FlashEffect(color, alpha, duration);
  }

  // Lighting effects
  createLight(x: number, y: number, radius: number, color: string, intensity: number = 1.0) {
    const effect = this.getEffectFromPool();
    if (!effect) return;
    
    effect.x = x;
    effect.y = y;
    effect.radius = radius;
    effect.color = color;
    effect.intensity = intensity;
    effect.life = effect.maxLife = 1000;
    effect.type = 'light';
    
    this.effects.push(effect);
  }

  createGlow(x: number, y: number, radius: number, color: string, intensity: number = 0.5) {
    const effect = this.getEffectFromPool();
    if (!effect) return;
    
    effect.x = x;
    effect.y = y;
    effect.radius = radius;
    effect.color = color;
    effect.intensity = intensity;
    effect.life = effect.maxLife = 2000;
    effect.type = 'glow';
    
    this.effects.push(effect);
  }

  // Update all effects
  update(deltaTime: number) {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update(deltaTime);
      
      if (particle.life <= 0) {
        this.returnParticleToPool(particle);
        this.particles.splice(i, 1);
      }
    }
    
    // Update visual effects
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];
      effect.update(deltaTime);
      
      if (effect.life <= 0) {
        this.returnEffectToPool(effect);
        this.effects.splice(i, 1);
      }
    }
    
    // Update screen effects
    if (this.screenShake) {
      this.screenShake.update(deltaTime);
      if (this.screenShake.life <= 0) {
        this.screenShake = null;
      }
    }
    
    if (this.slowMotion) {
      this.slowMotion.update(deltaTime);
      if (this.slowMotion.life <= 0) {
        this.slowMotion = null;
      }
    }
    
    if (this.flash) {
      this.flash.update(deltaTime);
      if (this.flash.life <= 0) {
        this.flash = null;
      }
    }
  }

  // Render all effects
  render() {
    this.ctx.save();
    
    // Apply screen effects
    if (this.screenShake) {
      this.ctx.translate(this.screenShake.offsetX, this.screenShake.offsetY);
    }
    
    if (this.slowMotion) {
      this.ctx.globalAlpha = this.slowMotion.alpha;
    }
    
    // Render particles
    this.renderParticles();
    
    // Render visual effects
    this.renderEffects();
    
    this.ctx.restore();
    
    // Render flash effect
    if (this.flash) {
      this.renderFlash();
    }
  }

  private renderParticles() {
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.life / particle.maxLife;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  private renderEffects() {
    this.effects.forEach(effect => {
      this.ctx.save();
      this.ctx.globalAlpha = (effect.life / effect.maxLife) * effect.intensity;
      
      if (effect.type === 'light') {
        this.renderLight(effect);
      } else if (effect.type === 'glow') {
        this.renderGlow(effect);
      }
      
      this.ctx.restore();
    });
  }

  private renderLight(effect: VisualEffect) {
    const gradient = this.ctx.createRadialGradient(
      effect.x, effect.y, 0,
      effect.x, effect.y, effect.radius
    );
    gradient.addColorStop(0, effect.color);
    gradient.addColorStop(1, 'transparent');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(
      effect.x - effect.radius,
      effect.y - effect.radius,
      effect.radius * 2,
      effect.radius * 2
    );
  }

  private renderGlow(effect: VisualEffect) {
    const gradient = this.ctx.createRadialGradient(
      effect.x, effect.y, 0,
      effect.x, effect.y, effect.radius
    );
    gradient.addColorStop(0, effect.color);
    gradient.addColorStop(0.5, effect.color + '80');
    gradient.addColorStop(1, 'transparent');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderFlash() {
    if (!this.flash) return;
    
    this.ctx.save();
    this.ctx.globalAlpha = this.flash.alpha;
    this.ctx.fillStyle = this.flash.color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  // Helper methods
  private getParticleFromPool(): Particle | null {
    return this.particlePool.find(p => !p.active) || null;
  }

  private getEffectFromPool(): VisualEffect | null {
    return this.effectPool.find(e => !e.active) || null;
  }

  private returnParticleToPool(particle: Particle) {
    particle.reset();
  }

  private returnEffectToPool(effect: VisualEffect) {
    effect.reset();
  }

  private getParticleCount(type: string): number {
    switch (type) {
      case 'small': return 10;
      case 'medium': return 25;
      case 'large': return 50;
      case 'boss': return 100;
      default: return 25;
    }
  }

  private getParticleLife(type: string): number {
    switch (type) {
      case 'small': return 500;
      case 'medium': return 1000;
      case 'large': return 1500;
      case 'boss': return 2000;
      default: return 1000;
    }
  }

  private getParticleSize(type: string): number {
    switch (type) {
      case 'small': return 3;
      case 'medium': return 5;
      case 'large': return 8;
      case 'boss': return 12;
      default: return 5;
    }
  }

  private getExplosionColors(type: string): string[] {
    switch (type) {
      case 'small': return ['#FF6B6B', '#FFD93D'];
      case 'medium': return ['#FF6B6B', '#FFD93D', '#6BCF7F'];
      case 'large': return ['#FF6B6B', '#FFD93D', '#6BCF7F', '#4D96FF'];
      case 'boss': return ['#FF0000', '#FF6600', '#FFD700', '#FFFFFF'];
      default: return ['#FF6B6B', '#FFD93D', '#6BCF7F'];
    }
  }

  private getPowerUpColors(type: string): string[] {
    switch (type) {
      case 'health': return ['#FF0000', '#FF6666'];
      case 'speed': return ['#00FF00', '#66FF66'];
      case 'rapid': return ['#FFFF00', '#FFFF66'];
      case 'shield': return ['#0000FF', '#6666FF'];
      case 'multi': return ['#FF00FF', '#FF66FF'];
      case 'pierce': return ['#00FFFF', '#66FFFF'];
      default: return ['#FFD700', '#FF69B4'];
    }
  }

  // Cleanup
  destroy() {
    this.particles = [];
    this.effects = [];
    this.screenShake = null;
    this.slowMotion = null;
    this.flash = null;
  }
}

// Particle class
class Particle {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  life: number = 0;
  maxLife: number = 0;
  color: string = '#FFFFFF';
  size: number = 1;
  type: string = 'default';
  active: boolean = false;

  update(deltaTime: number) {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    this.life -= deltaTime;
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.life = 0;
    this.maxLife = 0;
    this.color = '#FFFFFF';
    this.size = 1;
    this.type = 'default';
    this.active = false;
  }
}

// Visual effect class
class VisualEffect {
  x: number = 0;
  y: number = 0;
  radius: number = 0;
  color: string = '#FFFFFF';
  intensity: number = 1.0;
  life: number = 0;
  maxLife: number = 0;
  type: string = 'default';
  active: boolean = false;

  update(deltaTime: number) {
    this.life -= deltaTime;
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.radius = 0;
    this.color = '#FFFFFF';
    this.intensity = 1.0;
    this.life = 0;
    this.maxLife = 0;
    this.type = 'default';
    this.active = false;
  }
}

// Screen shake effect
class ScreenShakeEffect {
  intensity: number;
  duration: number;
  life: number;
  offsetX: number = 0;
  offsetY: number = 0;

  constructor(intensity: number, duration: number) {
    this.intensity = intensity;
    this.duration = duration;
    this.life = duration;
  }

  update(deltaTime: number) {
    this.life -= deltaTime;
    
    if (this.life > 0) {
      const strength = this.life / this.duration;
      this.offsetX = (Math.random() - 0.5) * this.intensity * strength;
      this.offsetY = (Math.random() - 0.5) * this.intensity * strength;
    }
  }
}

// Slow motion effect
class SlowMotionEffect {
  factor: number;
  duration: number;
  life: number;
  alpha: number = 1.0;

  constructor(factor: number, duration: number) {
    this.factor = factor;
    this.duration = duration;
    this.life = duration;
  }

  update(deltaTime: number) {
    this.life -= deltaTime;
    this.alpha = this.life / this.duration;
  }
}

// Flash effect
class FlashEffect {
  color: string;
  alpha: number;
  duration: number;
  life: number;

  constructor(color: string, alpha: number, duration: number) {
    this.color = color;
    this.alpha = alpha;
    this.duration = duration;
    this.life = duration;
  }

  update(deltaTime: number) {
    this.life -= deltaTime;
    this.alpha = (this.life / this.duration) * 0.8;
  }
}

export default EnhancedVisualEffects;
