import { Boss, Bullet } from '../types/GameTypes';
import { ShipRenderer } from '../graphics/ShipDesigns';

export class EnhancedBossSystem {
  private bosses: Boss[] = [];
  private bossSpawnTimer: number = 0;
  private bossSpawnInterval: number = 30000; // 30 seconds
  private currentBossPhase: number = 1;
  private maxBossPhases: number = 3;

  spawnBoss(canvas: HTMLCanvasElement, score: number): Boss | null {
    const currentTime = Date.now();
    
    // Spawn boss every 30 seconds or when score reaches certain thresholds
    if (currentTime - this.bossSpawnTimer > this.bossSpawnInterval || 
        (score > 0 && score % 10000 === 0)) {
      
      const bossTypes = [
        // Original Bosses
        {
          type: 'destroyer',
          color: '#ff0000',
          width: 80,
          height: 60,
          health: 100,
          speed: 2,
          attackPattern: 'spiral'
        },
        {
          type: 'battleship',
          color: '#6600ff',
          width: 100,
          height: 80,
          health: 150,
          speed: 1,
          attackPattern: 'wave'
        },
        {
          type: 'mothership',
          color: '#ff6600',
          width: 120,
          height: 100,
          health: 200,
          speed: 1,
          attackPattern: 'burst'
        },
        // New Bosses - Cosmic Entities
        {
          type: 'space_dragon',
          color: '#8B0000',
          width: 140,
          height: 120,
          health: 300,
          speed: 1.5,
          attackPattern: 'dragon_breath'
        },
        {
          type: 'void_reaper',
          color: '#4B0082',
          width: 110,
          height: 90,
          health: 250,
          speed: 2.5,
          attackPattern: 'void_storm'
        },
        {
          type: 'mech_titan',
          color: '#2F4F4F',
          width: 160,
          height: 140,
          health: 400,
          speed: 0.8,
          attackPattern: 'plasma_cannon'
        },
        // New Bosses - Alien Species
        {
          type: 'crystal_guardian',
          color: '#00CED1',
          width: 100,
          height: 100,
          health: 180,
          speed: 1.2,
          attackPattern: 'crystal_shard'
        },
        {
          type: 'plasma_beast',
          color: '#FF1493',
          width: 90,
          height: 70,
          health: 160,
          speed: 2.8,
          attackPattern: 'plasma_swarm'
        },
        {
          type: 'quantum_entity',
          color: '#9370DB',
          width: 130,
          height: 110,
          health: 220,
          speed: 1.8,
          attackPattern: 'quantum_phase'
        },
        // New Bosses - Mechanical Threats
        {
          type: 'cyber_dreadnought',
          color: '#32CD32',
          width: 150,
          height: 130,
          health: 350,
          speed: 1.0,
          attackPattern: 'cyber_assault'
        },
        {
          type: 'neural_network',
          color: '#FFD700',
          width: 120,
          height: 100,
          health: 280,
          speed: 1.5,
          attackPattern: 'neural_override'
        },
        {
          type: 'gravity_well',
          color: '#DC143C',
          width: 180,
          height: 160,
          health: 450,
          speed: 0.5,
          attackPattern: 'gravity_pull'
        },
        // New Bosses - Elemental Forces
        {
          type: 'solar_flare',
          color: '#FF4500',
          width: 95,
          height: 85,
          health: 190,
          speed: 2.2,
          attackPattern: 'solar_burst'
        },
        {
          type: 'ice_leviathan',
          color: '#87CEEB',
          width: 170,
          height: 150,
          health: 380,
          speed: 0.9,
          attackPattern: 'ice_shard'
        },
        {
          type: 'storm_king',
          color: '#4169E1',
          width: 125,
          height: 105,
          health: 240,
          speed: 1.6,
          attackPattern: 'lightning_storm'
        }
      ];
      
      const bossType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
      
      const boss: Boss = {
        id: `boss_${Date.now()}`,
        x: canvas.width / 2 - bossType.width / 2,
        y: -bossType.height,
        width: bossType.width,
        height: bossType.height,
        health: bossType.health * this.currentBossPhase,
        maxHealth: bossType.health * this.currentBossPhase,
        speed: bossType.speed,
        type: bossType.type,
        color: bossType.color,
        attackPattern: bossType.attackPattern,
        lastAttack: 0,
        attackCooldown: 1000,
        phase: this.currentBossPhase,
        maxPhase: this.maxBossPhases
      };

      this.bosses.push(boss);
      this.bossSpawnTimer = currentTime;
      
      return boss;
    }
    
    return null;
  }

  updateBosses(canvas: HTMLCanvasElement, player: any): Bullet[] {
    const bullets: Bullet[] = [];
    const currentTime = Date.now();
    
    this.bosses.forEach((boss, index) => {
      // Update boss position
      if (boss.y < 100) {
        boss.y += boss.speed;
      }
      
      // Boss movement patterns
      switch (boss.attackPattern) {
        case 'spiral':
          boss.x += Math.sin(currentTime / 500) * 2;
          break;
        case 'wave':
          boss.x += Math.cos(currentTime / 300) * 1.5;
          break;
        case 'burst':
          if (currentTime % 2000 < 100) {
            boss.x += (Math.random() - 0.5) * 4;
          }
          break;
      }
      
      // Keep boss within screen bounds
      boss.x = Math.max(0, Math.min(canvas.width - boss.width, boss.x));
      
      // Boss attacks
      if (currentTime - boss.lastAttack > boss.attackCooldown) {
        const bossBullets = this.generateBossBullets(boss, player);
        bullets.push(...bossBullets);
        boss.lastAttack = currentTime;
      }
      
      // Remove boss if destroyed or off-screen
      if (boss.health <= 0 || boss.y > canvas.height + boss.height) {
        this.bosses.splice(index, 1);
        
        // Increase boss phase for next spawn
        if (boss.health <= 0) {
          this.currentBossPhase = Math.min(this.maxBossPhases, this.currentBossPhase + 1);
        }
      }
    });
    
    return bullets;
  }

  private generateBossBullets(boss: Boss, player: any): Bullet[] {
    const bullets: Bullet[] = [];
    const currentTime = Date.now();
    
    switch (boss.attackPattern) {
      case 'spiral':
        // Spiral bullet pattern
        for (let i = 0; i < 8; i++) {
          const angle = (currentTime / 100) + (i * Math.PI / 4);
          bullets.push({
            x: boss.x + boss.width / 2 + Math.cos(angle) * 20,
            y: boss.y + boss.height + Math.sin(angle) * 20,
            width: 6,
            height: 6,
            speed: 3,
            type: 'boss_spiral',
            color: '#ff0000',
            damage: 1,
            owner: 'boss'
          });
        }
        break;
        
      case 'wave':
        // Wave bullet pattern
        for (let i = 0; i < 5; i++) {
          bullets.push({
            x: boss.x + (i * boss.width / 4),
            y: boss.y + boss.height,
            width: 8,
            height: 8,
            speed: 4,
            type: 'boss_wave',
            color: '#6600ff',
            damage: 1,
            owner: 'boss'
          });
        }
        break;
        
      case 'burst':
        // Burst bullet pattern
        const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
        for (let i = -2; i <= 2; i++) {
          const spreadAngle = angle + (i * Math.PI / 8);
          bullets.push({
            x: boss.x + boss.width / 2,
            y: boss.y + boss.height / 2,
            width: 10,
            height: 10,
            speed: 5,
            type: 'boss_burst',
            color: '#ff6600',
            damage: 2,
            owner: 'boss',
            direction: spreadAngle
          });
        }
        break;
    }
    
    return bullets;
  }

  drawBosses(ctx: CanvasRenderingContext2D): void {
    this.bosses.forEach(boss => {
      // Draw enhanced boss ship using ShipRenderer with boss type
      ShipRenderer.drawBossShip(ctx, boss.x, boss.y, boss.width, boss.height, boss.health, boss.maxHealth, boss.type);
      
      // Draw boss health bar
      const barWidth = boss.width;
      const barHeight = 8;
      const barX = boss.x;
      const barY = boss.y - 15;
      
      // Background
      ctx.fillStyle = '#333333';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // Health fill
      const healthPercent = boss.health / boss.maxHealth;
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
      
      // Health text
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${boss.health}/${boss.maxHealth}`,
        boss.x + boss.width / 2,
        barY - 5
      );
      
      ctx.textAlign = 'left';
    });
  }

  getBosses(): Boss[] {
    return this.bosses;
  }

  removeBoss(bossId: string): void {
    this.bosses = this.bosses.filter(boss => boss.id !== bossId);
  }

  getCurrentBossPhase(): number {
    return this.currentBossPhase;
  }

  setBossPhase(phase: number): void {
    this.currentBossPhase = Math.max(1, Math.min(this.maxBossPhases, phase));
  }
}
