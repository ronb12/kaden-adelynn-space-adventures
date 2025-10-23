// Advanced Visual Effects System for #1 Space Shooter Game

export class AdvancedVisualEffects {
  constructor() {
    this.particles = [];
    this.explosions = [];
    this.screenEffects = [];
    this.backgroundEffects = [];
    this.lightingEffects = [];
  }

  // Create explosion effect
  createExplosion(x, y, type = 'normal', intensity = 1) {
    const explosion = {
      x: x,
      y: y,
      type: type,
      intensity: intensity,
      particles: [],
      startTime: Date.now(),
      duration: type === 'boss' ? 2000 : 1000
    };

    // Create particles based on explosion type
    const particleCount = type === 'boss' ? 100 : 50;
    const colors = this.getExplosionColors(type);
    
    for (let i = 0; i < particleCount; i++) {
      explosion.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10 * intensity,
        vy: (Math.random() - 0.5) * 10 * intensity,
        red: colors.red,
        green: colors.green,
        blue: colors.blue,
        alpha: 1,
        size: Math.random() * 5 * intensity + 2,
        life: 1000 + Math.random() * 500,
        maxLife: 1000 + Math.random() * 500
      });
    }

    this.explosions.push(explosion);
    
    // Add screen shake effect
    this.addScreenShake(intensity);
  }

  // Get explosion colors based on type
  getExplosionColors(type) {
    switch (type) {
      case 'boss':
        return { red: 255, green: 100, blue: 0 }; // Orange
      case 'player':
        return { red: 0, green: 150, blue: 255 }; // Blue
      case 'enemy':
        return { red: 255, green: 50, blue: 50 }; // Red
      default:
        return { red: 255, green: 200, blue: 0 }; // Yellow
    }
  }

  // Create engine trail
  createEngineTrail(x, y, direction, color = '#00AAFF') {
    this.particles.push({
      x: x,
      y: y,
      vx: Math.cos(direction) * -2,
      vy: Math.sin(direction) * -2,
      red: parseInt(color.slice(1, 3), 16),
      green: parseInt(color.slice(3, 5), 16),
      blue: parseInt(color.slice(5, 7), 16),
      alpha: 0.8,
      size: Math.random() * 3 + 1,
      life: 300,
      maxLife: 300
    });
  }

  // Create power-up collection effect
  createPowerUpEffect(x, y, color = '#FFD700') {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        red: parseInt(color.slice(1, 3), 16),
        green: parseInt(color.slice(3, 5), 16),
        blue: parseInt(color.slice(5, 7), 16),
        alpha: 1,
        size: Math.random() * 4 + 2,
        life: 800,
        maxLife: 800
      });
    }
  }

  // Add screen shake effect
  addScreenShake(intensity = 1) {
    this.screenEffects.push({
      type: 'shake',
      intensity: intensity,
      duration: 200,
      startTime: Date.now()
    });
  }

  // Add screen flash effect
  addScreenFlash(color = '#FFFFFF', duration = 100) {
    this.screenEffects.push({
      type: 'flash',
      color: color,
      alpha: 0.8,
      duration: duration,
      startTime: Date.now()
    });
  }

  // Create lightning effect
  createLightning(x1, y1, x2, y2, color = '#FFFF00') {
    this.lightingEffects.push({
      type: 'lightning',
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      color: color,
      duration: 200,
      startTime: Date.now()
    });
  }

  // Create energy shield effect
  createEnergyShield(x, y, radius, color = '#00FF00') {
    this.lightingEffects.push({
      type: 'shield',
      x: x,
      y: y,
      radius: radius,
      color: color,
      duration: 10000,
      startTime: Date.now()
    });
  }

  // Create background stars
  createBackgroundStars(canvasWidth, canvasHeight, count = 200) {
    for (let i = 0; i < count; i++) {
      this.backgroundEffects.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.1
      });
    }
  }

  // Update all effects
  update(deltaTime, canvasWidth, canvasHeight) {
    const currentTime = Date.now();
    
    // Update particles
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= deltaTime;
      particle.alpha = particle.life / particle.maxLife;
      
      // Apply gravity
      particle.vy += 0.1;
      
      return particle.life > 0 && particle.x > -50 && particle.x < canvasWidth + 50 && 
             particle.y > -50 && particle.y < canvasHeight + 50;
    });
    
    // Update explosions
    this.explosions = this.explosions.filter(explosion => {
      const elapsed = currentTime - explosion.startTime;
      if (elapsed >= explosion.duration) return false;
      
      explosion.particles = explosion.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.life -= deltaTime;
        particle.alpha = particle.life / particle.maxLife;
        
        return particle.life > 0;
      });
      
      return true;
    });
    
    // Update screen effects
    this.screenEffects = this.screenEffects.filter(effect => {
      const elapsed = currentTime - effect.startTime;
      return elapsed < effect.duration;
    });
    
    // Update lighting effects
    this.lightingEffects = this.lightingEffects.filter(effect => {
      const elapsed = currentTime - effect.startTime;
      return elapsed < effect.duration;
    });
    
    // Update background effects
    for (const star of this.backgroundEffects) {
      star.twinkle += deltaTime * 0.002;
      star.y += star.speed;
      if (star.y > canvasHeight) {
        star.y = -10;
        star.x = Math.random() * canvasWidth;
      }
    }
  }

  // Render all effects
  render(ctx, canvasWidth, canvasHeight) {
    // Render background effects
    this.renderBackgroundEffects(ctx, canvasWidth, canvasHeight);
    
    // Render particles
    this.renderParticles(ctx);
    
    // Render explosions
    this.renderExplosions(ctx);
    
    // Render lighting effects
    this.renderLightingEffects(ctx);
    
    // Render screen effects
    this.renderScreenEffects(ctx, canvasWidth, canvasHeight);
  }

  // Render background effects
  renderBackgroundEffects(ctx, canvasWidth, canvasHeight) {
    ctx.save();
    
    for (const star of this.backgroundEffects) {
      const brightness = star.brightness + Math.sin(star.twinkle) * 0.3;
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  // Render particles
  renderParticles(ctx) {
    ctx.save();
    
    for (const particle of this.particles) {
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = `rgb(${particle.red}, ${particle.green}, ${particle.blue})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  // Render explosions
  renderExplosions(ctx) {
    ctx.save();
    
    for (const explosion of this.explosions) {
      for (const particle of explosion.particles) {
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = `rgb(${particle.red}, ${particle.green}, ${particle.blue})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  // Render lighting effects
  renderLightingEffects(ctx) {
    ctx.save();
    
    for (const effect of this.lightingEffects) {
      if (effect.type === 'lightning') {
        ctx.strokeStyle = effect.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(effect.x1, effect.y1);
        ctx.lineTo(effect.x2, effect.y2);
        ctx.stroke();
      } else if (effect.type === 'shield') {
        ctx.strokeStyle = effect.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  // Render screen effects
  renderScreenEffects(ctx, canvasWidth, canvasHeight) {
    ctx.save();
    
    for (const effect of this.screenEffects) {
      const elapsed = Date.now() - effect.startTime;
      const progress = elapsed / effect.duration;
      
      if (effect.type === 'flash') {
        ctx.fillStyle = effect.color;
        ctx.globalAlpha = effect.alpha * (1 - progress);
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    }
    
    ctx.restore();
  }

  // Get screen shake offset
  getScreenShakeOffset() {
    for (const effect of this.screenEffects) {
      if (effect.type === 'shake') {
        const elapsed = Date.now() - effect.startTime;
        const progress = elapsed / effect.duration;
        if (progress < 1) {
          return {
            x: (Math.random() - 0.5) * effect.intensity * (1 - progress),
            y: (Math.random() - 0.5) * effect.intensity * (1 - progress)
          };
        }
      }
    }
    return { x: 0, y: 0 };
  }

  // Clear all effects
  clear() {
    this.particles = [];
    this.explosions = [];
    this.screenEffects = [];
    this.backgroundEffects = [];
    this.lightingEffects = [];
  }
}

export default AdvancedVisualEffects;
