export interface GraphicsSettings {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  shadows: boolean;
  particles: boolean;
  lighting: boolean;
  reflections: boolean;
  postProcessing: boolean;
  antiAliasing: boolean;
  textureQuality: 'low' | 'medium' | 'high' | 'ultra';
  renderDistance: number;
}

export interface ParticleEffect {
  id: string;
  type: 'explosion' | 'engine' | 'trail' | 'spark' | 'smoke' | 'energy' | 'plasma' | 'laser';
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  scaleSpeed: number;
}

export interface LightingEffect {
  id: string;
  type: 'point' | 'directional' | 'ambient' | 'spot';
  position: { x: number; y: number };
  color: string;
  intensity: number;
  radius: number;
  direction?: { x: number; y: number };
  angle?: number;
  falloff: number;
}

export interface VisualEffect {
  id: string;
  type: 'screen_shake' | 'flash' | 'fade' | 'zoom' | 'distortion' | 'glow' | 'outline';
  duration: number;
  intensity: number;
  color: string;
  position?: { x: number; y: number };
  size?: number;
}

export class Enhanced3DGraphics {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private graphicsSettings: GraphicsSettings;
  private particles: ParticleEffect[] = [];
  private lights: LightingEffect[] = [];
  private effects: VisualEffect[] = [];
  private animationFrame: number = 0;
  private lastTime: number = 0;
  private fps: number = 60;
  private targetFPS: number = 60;

  constructor(canvas: HTMLCanvasElement, settings: GraphicsSettings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.graphicsSettings = settings;
    this.setupCanvas();
  }

  private setupCanvas() {
    // Enable high DPI rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    // Enable anti-aliasing
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  updateSettings(settings: GraphicsSettings) {
    this.graphicsSettings = settings;
  }

  // Enhanced ship rendering with 3D effects
  renderShip3D(x: number, y: number, width: number, height: number, color: string, rotation: number = 0) {
    this.ctx.save();
    this.ctx.translate(x + width / 2, y + height / 2);
    this.ctx.rotate(rotation);

    // Ship body with gradient
    const gradient = this.ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
    gradient.addColorStop(0, this.lightenColor(color, 0.3));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, this.darkenColor(color, 0.3));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -height / 2);
    this.ctx.lineTo(-width / 2, height / 2);
    this.ctx.lineTo(0, height / 2 - 10);
    this.ctx.lineTo(width / 2, height / 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Ship outline
    this.ctx.strokeStyle = this.lightenColor(color, 0.5);
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Ship details
    this.renderShipDetails(width, height, color);

    // Engine glow
    if (this.graphicsSettings.particles) {
      this.renderEngineGlow(width, height, color);
    }

    this.ctx.restore();
  }

  private renderShipDetails(width: number, height: number, color: string) {
    // Cockpit
    this.ctx.fillStyle = this.lightenColor(color, 0.8);
    this.ctx.beginPath();
    this.ctx.arc(0, -height / 4, width / 8, 0, Math.PI * 2);
    this.ctx.fill();

    // Wing details
    this.ctx.strokeStyle = this.lightenColor(color, 0.4);
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(-width / 3, height / 4);
    this.ctx.lineTo(-width / 2, height / 2);
    this.ctx.moveTo(width / 3, height / 4);
    this.ctx.lineTo(width / 2, height / 2);
    this.ctx.stroke();

    // Engine details
    this.ctx.fillStyle = this.darkenColor(color, 0.2);
    this.ctx.fillRect(-width / 6, height / 2 - 5, width / 3, 5);
  }

  private renderEngineGlow(width: number, height: number, color: string) {
    const glowGradient = this.ctx.createRadialGradient(0, height / 2, 0, 0, height / 2, width / 2);
    glowGradient.addColorStop(0, this.lightenColor(color, 0.8));
    glowGradient.addColorStop(0.5, this.lightenColor(color, 0.4));
    glowGradient.addColorStop(1, 'transparent');

    this.ctx.fillStyle = glowGradient;
    this.ctx.beginPath();
    this.ctx.arc(0, height / 2, width / 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Enhanced bullet rendering with 3D effects
  renderBullet3D(x: number, y: number, width: number, height: number, color: string, type: string = 'basic') {
    this.ctx.save();
    this.ctx.translate(x + width / 2, y + height / 2);

    switch (type) {
      case 'plasma':
        this.renderPlasmaBullet(width, height, color);
        break;
      case 'laser':
        this.renderLaserBullet(width, height, color);
        break;
      case 'explosive':
        this.renderExplosiveBullet(width, height, color);
        break;
      case 'homing':
        this.renderHomingBullet(width, height, color);
        break;
      default:
        this.renderBasicBullet(width, height, color);
    }

    this.ctx.restore();
  }

  private renderPlasmaBullet(width: number, height: number, color: string) {
    const gradient = this.ctx.createLinearGradient(0, -height / 2, 0, height / 2);
    gradient.addColorStop(0, this.lightenColor(color, 0.5));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, this.darkenColor(color, 0.3));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Plasma glow
    const glowGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, width);
    glowGradient.addColorStop(0, this.lightenColor(color, 0.8));
    glowGradient.addColorStop(1, 'transparent');

    this.ctx.fillStyle = glowGradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, width, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderLaserBullet(width: number, height: number, color: string) {
    const gradient = this.ctx.createLinearGradient(0, -height / 2, 0, height / 2);
    gradient.addColorStop(0, this.lightenColor(color, 0.8));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, this.darkenColor(color, 0.2));

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(-width / 2, -height / 2, width, height);

    // Laser core
    this.ctx.fillStyle = this.lightenColor(color, 0.9);
    this.ctx.fillRect(-width / 4, -height / 2, width / 2, height);
  }

  private renderExplosiveBullet(width: number, height: number, color: string) {
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, width / 2);
    gradient.addColorStop(0, this.lightenColor(color, 0.6));
    gradient.addColorStop(0.7, color);
    gradient.addColorStop(1, this.darkenColor(color, 0.4));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, width / 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Explosive sparks
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const sparkX = Math.cos(angle) * width / 4;
      const sparkY = Math.sin(angle) * width / 4;
      
      this.ctx.fillStyle = this.lightenColor(color, 0.8);
      this.ctx.beginPath();
      this.ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private renderHomingBullet(width: number, height: number, color: string) {
    const gradient = this.ctx.createLinearGradient(0, -height / 2, 0, height / 2);
    gradient.addColorStop(0, this.lightenColor(color, 0.7));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, this.darkenColor(color, 0.3));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -height / 2);
    this.ctx.lineTo(-width / 2, height / 2);
    this.ctx.lineTo(0, height / 2 - 5);
    this.ctx.lineTo(width / 2, height / 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Homing trail
    this.ctx.strokeStyle = this.lightenColor(color, 0.5);
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, height / 2);
    this.ctx.lineTo(0, height / 2 + 10);
    this.ctx.stroke();
  }

  private renderBasicBullet(width: number, height: number, color: string) {
    const gradient = this.ctx.createLinearGradient(0, -height / 2, 0, height / 2);
    gradient.addColorStop(0, this.lightenColor(color, 0.5));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, this.darkenColor(color, 0.3));

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(-width / 2, -height / 2, width, height);
  }

  // Enhanced enemy rendering with 3D effects
  renderEnemy3D(x: number, y: number, width: number, height: number, color: string, type: string = 'basic') {
    this.ctx.save();
    this.ctx.translate(x + width / 2, y + height / 2);

    switch (type) {
      case 'heavy':
        this.renderHeavyEnemy(width, height, color);
        break;
      case 'fast':
        this.renderFastEnemy(width, height, color);
        break;
      case 'bomber':
        this.renderBomberEnemy(width, height, color);
        break;
      default:
        this.renderBasicEnemy(width, height, color);
    }

    this.ctx.restore();
  }

  private renderHeavyEnemy(width: number, height: number, color: string) {
    const gradient = this.ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
    gradient.addColorStop(0, this.lightenColor(color, 0.3));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, this.darkenColor(color, 0.3));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -height / 2);
    this.ctx.lineTo(-width / 2, height / 2);
    this.ctx.lineTo(0, height / 2 - 10);
    this.ctx.lineTo(width / 2, height / 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Heavy armor details
    this.ctx.strokeStyle = this.darkenColor(color, 0.5);
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  }

  private renderFastEnemy(width: number, height: number, color: string) {
    const gradient = this.ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
    gradient.addColorStop(0, this.lightenColor(color, 0.4));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, this.darkenColor(color, 0.2));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -height / 2);
    this.ctx.lineTo(-width / 2, height / 2);
    this.ctx.lineTo(0, height / 2 - 5);
    this.ctx.lineTo(width / 2, height / 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Speed lines
    this.ctx.strokeStyle = this.lightenColor(color, 0.6);
    this.ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(-width / 2 - 10, -height / 2 + i * 5);
      this.ctx.lineTo(-width / 2 - 5, -height / 2 + i * 5);
      this.ctx.stroke();
    }
  }

  private renderBomberEnemy(width: number, height: number, color: string) {
    const gradient = this.ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
    gradient.addColorStop(0, this.lightenColor(color, 0.2));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, this.darkenColor(color, 0.4));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -height / 2);
    this.ctx.lineTo(-width / 2, height / 2);
    this.ctx.lineTo(0, height / 2 - 15);
    this.ctx.lineTo(width / 2, height / 2);
    this.ctx.closePath();
    this.ctx.fill();

    // Bomber details
    this.ctx.fillStyle = this.darkenColor(color, 0.6);
    this.ctx.fillRect(-width / 4, height / 2 - 10, width / 2, 5);
  }

  private renderBasicEnemy(width: number, height: number, color: string) {
    const gradient = this.ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
    gradient.addColorStop(0, this.lightenColor(color, 0.3));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, this.darkenColor(color, 0.3));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -height / 2);
    this.ctx.lineTo(-width / 2, height / 2);
    this.ctx.lineTo(0, height / 2 - 5);
    this.ctx.lineTo(width / 2, height / 2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // Particle system
  addParticle(particle: ParticleEffect) {
    this.particles.push(particle);
  }

  updateParticles(deltaTime: number) {
    this.particles = this.particles.filter(particle => {
      particle.life -= deltaTime;
      particle.position.x += particle.velocity.x * deltaTime;
      particle.position.y += particle.velocity.y * deltaTime;
      particle.rotation += particle.rotationSpeed * deltaTime;
      particle.scale += particle.scaleSpeed * deltaTime;
      particle.alpha = particle.life / particle.maxLife;

      return particle.life > 0;
    });
  }

  renderParticles() {
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.translate(particle.position.x, particle.position.y);
      this.ctx.rotate(particle.rotation);
      this.ctx.scale(particle.scale, particle.scale);
      this.ctx.globalAlpha = particle.alpha;

      this.renderParticleEffect(particle);

      this.ctx.restore();
    });
  }

  private renderParticleEffect(particle: ParticleEffect) {
    switch (particle.type) {
      case 'explosion':
        this.renderExplosionParticle(particle);
        break;
      case 'engine':
        this.renderEngineParticle(particle);
        break;
      case 'trail':
        this.renderTrailParticle(particle);
        break;
      case 'spark':
        this.renderSparkParticle(particle);
        break;
      case 'smoke':
        this.renderSmokeParticle(particle);
        break;
      case 'energy':
        this.renderEnergyParticle(particle);
        break;
      case 'plasma':
        this.renderPlasmaParticle(particle);
        break;
      case 'laser':
        this.renderLaserParticle(particle);
        break;
    }
  }

  private renderExplosionParticle(particle: ParticleEffect) {
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
    gradient.addColorStop(0, this.lightenColor(particle.color, 0.8));
    gradient.addColorStop(0.5, particle.color);
    gradient.addColorStop(1, 'transparent');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderEngineParticle(particle: ParticleEffect) {
    const gradient = this.ctx.createLinearGradient(0, -particle.size, 0, particle.size);
    gradient.addColorStop(0, this.lightenColor(particle.color, 0.6));
    gradient.addColorStop(1, 'transparent');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderTrailParticle(particle: ParticleEffect) {
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderSparkParticle(particle: ParticleEffect) {
    this.ctx.fillStyle = this.lightenColor(particle.color, 0.8);
    this.ctx.beginPath();
    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderSmokeParticle(particle: ParticleEffect) {
    this.ctx.fillStyle = this.darkenColor(particle.color, 0.3);
    this.ctx.beginPath();
    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderEnergyParticle(particle: ParticleEffect) {
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
    gradient.addColorStop(0, this.lightenColor(particle.color, 0.9));
    gradient.addColorStop(0.5, particle.color);
    gradient.addColorStop(1, 'transparent');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderPlasmaParticle(particle: ParticleEffect) {
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
    gradient.addColorStop(0, this.lightenColor(particle.color, 0.7));
    gradient.addColorStop(0.5, particle.color);
    gradient.addColorStop(1, 'transparent');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderLaserParticle(particle: ParticleEffect) {
    this.ctx.fillStyle = this.lightenColor(particle.color, 0.8);
    this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
  }

  // Lighting system
  addLight(light: LightingEffect) {
    this.lights.push(light);
  }

  updateLights(deltaTime: number) {
    this.lights = this.lights.filter(light => {
      // Update light properties if needed
      return true;
    });
  }

  renderLights() {
    if (!this.graphicsSettings.lighting) return;

    this.lights.forEach(light => {
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'screen';
      
      const gradient = this.ctx.createRadialGradient(
        light.position.x, light.position.y, 0,
        light.position.x, light.position.y, light.radius
      );
      gradient.addColorStop(0, light.color);
      gradient.addColorStop(1, 'transparent');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(light.position.x, light.position.y, light.radius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  // Visual effects
  addEffect(effect: VisualEffect) {
    this.effects.push(effect);
  }

  updateEffects(deltaTime: number) {
    this.effects = this.effects.filter(effect => {
      effect.duration -= deltaTime;
      return effect.duration > 0;
    });
  }

  renderEffects() {
    this.effects.forEach(effect => {
      switch (effect.type) {
        case 'screen_shake':
          this.renderScreenShake(effect);
          break;
        case 'flash':
          this.renderFlash(effect);
          break;
        case 'fade':
          this.renderFade(effect);
          break;
        case 'zoom':
          this.renderZoom(effect);
          break;
        case 'distortion':
          this.renderDistortion(effect);
          break;
        case 'glow':
          this.renderGlow(effect);
          break;
        case 'outline':
          this.renderOutline(effect);
          break;
      }
    });
  }

  private renderScreenShake(effect: VisualEffect) {
    const shakeX = (Math.random() - 0.5) * effect.intensity;
    const shakeY = (Math.random() - 0.5) * effect.intensity;
    this.ctx.translate(shakeX, shakeY);
  }

  private renderFlash(effect: VisualEffect) {
    this.ctx.fillStyle = effect.color;
    this.ctx.globalAlpha = effect.intensity;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
  }

  private renderFade(effect: VisualEffect) {
    this.ctx.fillStyle = effect.color;
    this.ctx.globalAlpha = effect.intensity;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
  }

  private renderZoom(effect: VisualEffect) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    this.ctx.translate(centerX, centerY);
    this.ctx.scale(effect.intensity, effect.intensity);
    this.ctx.translate(-centerX, -centerY);
  }

  private renderDistortion(effect: VisualEffect) {
    // Implement distortion effect
    this.ctx.filter = `blur(${effect.intensity}px)`;
  }

  private renderGlow(effect: VisualEffect) {
    this.ctx.shadowColor = effect.color;
    this.ctx.shadowBlur = effect.intensity;
  }

  private renderOutline(effect: VisualEffect) {
    this.ctx.strokeStyle = effect.color;
    this.ctx.lineWidth = effect.intensity;
  }

  // Utility functions
  private lightenColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount * 255);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount * 255);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount * 255);
    return `#${Math.floor(r).toString(16).padStart(2, '0')}${Math.floor(g).toString(16).padStart(2, '0')}${Math.floor(b).toString(16).padStart(2, '0')}`;
  }

  private darkenColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount * 255);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount * 255);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount * 255);
    return `#${Math.floor(r).toString(16).padStart(2, '0')}${Math.floor(g).toString(16).padStart(2, '0')}${Math.floor(b).toString(16).padStart(2, '0')}`;
  }

  // Main render loop
  render(deltaTime: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.updateParticles(deltaTime);
    this.updateLights(deltaTime);
    this.updateEffects(deltaTime);
    
    this.renderLights();
    this.renderParticles();
    this.renderEffects();
  }

  // Performance monitoring
  getFPS(): number {
    return this.fps;
  }

  getParticleCount(): number {
    return this.particles.length;
  }

  getLightCount(): number {
    return this.lights.length;
  }

  getEffectCount(): number {
    return this.effects.length;
  }
}
