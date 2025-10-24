import React from 'react';

export interface Boss {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  maxHealth: number;
  health: number;
  speed: number;
  type: string;
  color: string;
  attackPattern: string;
  lastAttack: number;
  attackCooldown: number;
  phase: number;
  maxPhase: number;
}

export class BossSystem {
  private bosses: Boss[] = [];
  private spawnTimer: number = 0;
  private spawnInterval: number = 30000; // 30 seconds
  private lastBossSpawn: number = 0;

  spawnBoss(canvas: HTMLCanvasElement, score: number): Boss | null {
    const currentTime = Date.now();
    
    // Spawn boss every 30 seconds or when score reaches certain thresholds
    if (currentTime - this.lastBossSpawn > this.spawnInterval || 
        (score > 0 && score % 5000 === 0)) {
      
      const bossTypes = [
        {
          type: 'destroyer',
          maxHealth: 50,
          speed: 1,
          color: '#ff0000',
          attackPattern: 'spiral',
          attackCooldown: 1000,
          width: 80,
          height: 80
        },
        {
          type: 'cruiser',
          maxHealth: 75,
          speed: 0.5,
          color: '#ff6600',
          attackPattern: 'burst',
          attackCooldown: 1500,
          width: 100,
          height: 100
        },
        {
          type: 'dreadnought',
          maxHealth: 100,
          speed: 0.3,
          color: '#ff0066',
          attackPattern: 'laser',
          attackCooldown: 2000,
          width: 120,
          height: 120
        }
      ];

      const bossType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
      
      const boss: Boss = {
        id: `boss_${currentTime}`,
        x: canvas.width / 2 - bossType.width / 2,
        y: -bossType.height,
        width: bossType.width,
        height: bossType.height,
        maxHealth: bossType.maxHealth,
        health: bossType.maxHealth,
        speed: bossType.speed,
        type: bossType.type,
        color: bossType.color,
        attackPattern: bossType.attackPattern,
        lastAttack: currentTime,
        attackCooldown: bossType.attackCooldown,
        phase: 1,
        maxPhase: 3
      };

      this.bosses.push(boss);
      this.lastBossSpawn = currentTime;
      
      return boss;
    }
    
    return null;
  }

  updateBosses(canvas: HTMLCanvasElement): void {
    this.bosses = this.bosses.filter(boss => {
      // Move boss down
      boss.y += boss.speed;
      
      // Remove boss if it goes off screen
      if (boss.y > canvas.height + boss.height) {
        return false;
      }
      
      // Update boss phases based on health
      const healthPercentage = boss.health / boss.maxHealth;
      if (healthPercentage > 0.66) {
        boss.phase = 1;
      } else if (healthPercentage > 0.33) {
        boss.phase = 2;
      } else {
        boss.phase = 3;
      }
      
      return true;
    });
  }

  getBosses(): Boss[] {
    return this.bosses;
  }

  damageBoss(bossId: string, damage: number): boolean {
    const boss = this.bosses.find(b => b.id === bossId);
    if (boss) {
      boss.health -= damage;
      return boss.health <= 0;
    }
    return false;
  }

  removeBoss(bossId: string): void {
    this.bosses = this.bosses.filter(boss => boss.id !== bossId);
  }

  canBossAttack(boss: Boss): boolean {
    const currentTime = Date.now();
    return currentTime - boss.lastAttack > boss.attackCooldown;
  }

  updateBossAttackTime(boss: Boss): void {
    boss.lastAttack = Date.now();
  }

  getBossBullets(boss: Boss): Array<{x: number, y: number, speed: number, color: string}> {
    const bullets: Array<{x: number, y: number, speed: number, color: string}> = [];
    
    if (!this.canBossAttack(boss)) {
      return bullets;
    }

    switch (boss.attackPattern) {
      case 'spiral':
        // Spiral attack pattern
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          bullets.push({
            x: boss.x + boss.width / 2,
            y: boss.y + boss.height,
            speed: 3,
            color: '#ff0000'
          });
        }
        break;
        
      case 'burst':
        // Burst attack pattern
        for (let i = -2; i <= 2; i++) {
          bullets.push({
            x: boss.x + boss.width / 2 + (i * 20),
            y: boss.y + boss.height,
            speed: 4,
            color: '#ff6600'
          });
        }
        break;
        
      case 'laser':
        // Laser attack pattern
        bullets.push({
          x: boss.x + boss.width / 2,
          y: boss.y + boss.height,
          speed: 6,
          color: '#ff0066'
        });
        break;
    }
    
    this.updateBossAttackTime(boss);
    return bullets;
  }
}