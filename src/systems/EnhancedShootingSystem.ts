// Enhanced Shooting System for All Ships
import { Bullet } from '../types/GameTypes';

export class EnhancedShootingSystem {
  private bullets: Bullet[] = [];
  private playerShootTimer: number = 0;
  private enemyShootTimers: Map<string, number> = new Map();
  private bossShootTimers: Map<string, number> = new Map();
  
  // Shooting intervals (in milliseconds)
  private readonly PLAYER_SHOOT_INTERVAL = 200; // 5 shots per second
  private readonly ENEMY_SHOOT_INTERVAL = 1000; // 1 shot per second
  private readonly BOSS_SHOOT_INTERVAL = 500; // 2 shots per second

  update(deltaTime: number, player: any, enemies: any[], bosses: any[]) {
    // Update timers
    this.playerShootTimer += deltaTime;
    
    // Update enemy shoot timers
    enemies.forEach(enemy => {
      const currentTimer = this.enemyShootTimers.get(enemy.id) || 0;
      this.enemyShootTimers.set(enemy.id, currentTimer + deltaTime);
    });
    
    // Update boss shoot timers
    bosses.forEach(boss => {
      const currentTimer = this.bossShootTimers.get(boss.id) || 0;
      this.bossShootTimers.set(boss.id, currentTimer + deltaTime);
    });

    // Update bullets
    this.bullets = this.bullets.filter(bullet => {
      bullet.y += bullet.speed * bullet.direction;
      
      // Remove bullets that are off-screen
      return bullet.y > -50 && bullet.y < 1000;
    });
  }

  // Player shooting
  canPlayerShoot(): boolean {
    return this.playerShootTimer >= this.PLAYER_SHOOT_INTERVAL;
  }

  playerShoot(x: number, y: number): Bullet[] {
    if (!this.canPlayerShoot()) return [];

    this.playerShootTimer = 0;
    const bullets: Bullet[] = [];

    // Create player bullet
    const bullet: Bullet = {
      id: `bullet_${Date.now()}_${Math.random()}`,
      x: x - 2,
      y: y,
      width: 4,
      height: 8,
      speed: 8,
      direction: -1,
      type: 'player',
      damage: 25,
      owner: 'player'
    };

    bullets.push(bullet);
    this.bullets.push(bullet);
    return bullets;
  }

  // Enemy shooting
  canEnemyShoot(enemyId: string): boolean {
    const timer = this.enemyShootTimers.get(enemyId) || 0;
    return timer >= this.ENEMY_SHOOT_INTERVAL;
  }

  enemyShoot(enemy: any): Bullet[] {
    if (!this.canEnemyShoot(enemy.id)) return [];

    this.enemyShootTimers.set(enemy.id, 0);
    const bullets: Bullet[] = [];

    // Different enemy types shoot differently
    switch (enemy.type) {
      case 'basic':
        bullets.push(this.createEnemyBullet(enemy.x + enemy.width/2, enemy.y + enemy.height, enemy.id));
        break;
      case 'fast':
        bullets.push(this.createEnemyBullet(enemy.x + enemy.width/2, enemy.y + enemy.height, enemy.id));
        break;
      case 'heavy':
        // Heavy enemies shoot spread shots
        bullets.push(this.createEnemyBullet(enemy.x + enemy.width/2 - 10, enemy.y + enemy.height, enemy.id));
        bullets.push(this.createEnemyBullet(enemy.x + enemy.width/2, enemy.y + enemy.height, enemy.id));
        bullets.push(this.createEnemyBullet(enemy.x + enemy.width/2 + 10, enemy.y + enemy.height, enemy.id));
        break;
      case 'zigzag':
        bullets.push(this.createEnemyBullet(enemy.x + enemy.width/2, enemy.y + enemy.height, enemy.id));
        break;
    }

    this.bullets.push(...bullets);
    return bullets;
  }

  // Boss shooting
  canBossShoot(bossId: string): boolean {
    const timer = this.bossShootTimers.get(bossId) || 0;
    return timer >= this.BOSS_SHOOT_INTERVAL;
  }

  bossShoot(boss: any): Bullet[] {
    if (!this.canBossShoot(boss.id)) return [];

    this.bossShootTimers.set(boss.id, 0);
    const bullets: Bullet[] = [];

    // Bosses have multiple attack patterns
    switch (boss.type) {
      case 'destroyer':
        // Ring of bullets
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          const bulletX = boss.x + boss.width/2 + Math.cos(angle) * 20;
          const bulletY = boss.y + boss.height/2 + Math.sin(angle) * 20;
          bullets.push(this.createBossBullet(bulletX, bulletY, boss.id));
        }
        break;
      case 'battleship':
        // Multi-directional shots
        bullets.push(this.createBossBullet(boss.x + boss.width/2, boss.y + boss.height, boss.id));
        bullets.push(this.createBossBullet(boss.x + boss.width/2 - 20, boss.y + boss.height, boss.id));
        bullets.push(this.createBossBullet(boss.x + boss.width/2 + 20, boss.y + boss.height, boss.id));
        break;
    }

    this.bullets.push(...bullets);
    return bullets;
  }

  private createEnemyBullet(x: number, y: number, owner: string): Bullet {
    return {
      id: `bullet_${Date.now()}_${Math.random()}`,
      x: x - 2,
      y: y,
      width: 4,
      height: 8,
      speed: 4,
      direction: 1,
      type: 'enemy',
      damage: 15,
      owner
    };
  }

  private createBossBullet(x: number, y: number, owner: string): Bullet {
    return {
      id: `bullet_${Date.now()}_${Math.random()}`,
      x: x - 3,
      y: y,
      width: 6,
      height: 12,
      speed: 6,
      direction: 1,
      type: 'enemy',
      damage: 30,
      owner
    };
  }

  getBullets(): Bullet[] {
    return this.bullets;
  }

  removeBullet(bulletId: string) {
    this.bullets = this.bullets.filter(bullet => bullet.id !== bulletId);
  }

  clearAll() {
    this.bullets = [];
    this.enemyShootTimers.clear();
    this.bossShootTimers.clear();
  }
}

// Bullet Renderer
export const BulletRenderer = {
  drawBullet(ctx: CanvasRenderingContext2D, bullet: Bullet) {
    ctx.save();
    ctx.translate(bullet.x + bullet.width/2, bullet.y + bullet.height/2);
    
    const time = Date.now() * 0.01;
    const pulse = Math.sin(time) * 0.2 + 0.8;
    
    switch (bullet.type) {
      case 'player':
        this.drawPlayerBullet(ctx, bullet, pulse);
        break;
      case 'enemy':
        this.drawEnemyBullet(ctx, bullet, pulse);
        break;
    }
    
    ctx.restore();
  },

  drawPlayerBullet(ctx: CanvasRenderingContext2D, bullet: Bullet, pulse: number) {
    // Player bullets - green energy
    ctx.fillStyle = `rgba(0, 255, 0, ${0.8 + pulse * 0.2})`;
    ctx.shadowColor = '#00FF00';
    ctx.shadowBlur = 8;
    
    ctx.beginPath();
    ctx.moveTo(0, -bullet.height/2);
    ctx.lineTo(-bullet.width/2, bullet.height/2);
    ctx.lineTo(bullet.width/2, bullet.height/2);
    ctx.closePath();
    ctx.fill();
    
    // Core
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(0, -bullet.height/4);
    ctx.lineTo(-bullet.width/4, bullet.height/4);
    ctx.lineTo(bullet.width/4, bullet.height/4);
    ctx.closePath();
    ctx.fill();
  },

  drawEnemyBullet(ctx: CanvasRenderingContext2D, bullet: Bullet, pulse: number) {
    // Enemy bullets - red plasma
    ctx.fillStyle = `rgba(255, 0, 0, ${0.8 + pulse * 0.2})`;
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 6;
    
    ctx.beginPath();
    ctx.moveTo(0, bullet.height/2);
    ctx.lineTo(-bullet.width/2, -bullet.height/2);
    ctx.lineTo(bullet.width/2, -bullet.height/2);
    ctx.closePath();
    ctx.fill();
    
    // Core
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFAA00';
    ctx.beginPath();
    ctx.moveTo(0, bullet.height/4);
    ctx.lineTo(-bullet.width/4, -bullet.height/4);
    ctx.lineTo(bullet.width/4, -bullet.height/4);
    ctx.closePath();
    ctx.fill();
  }
};