import { Enemy, Bullet } from '../types/GameTypes';
import { ShipRenderer } from '../graphics/ShipDesigns';

export class EnhancedEnemySystem {
  private enemies: Enemy[] = [];
  private enemySpawnTimer: number = 0;
  private enemySpawnInterval: number = 1000; // 1 second
  private enemyTypes = ['basic', 'fast', 'heavy', 'zigzag', 'kamikaze', 'shooter'];

  spawnEnemy(canvas: HTMLCanvasElement, score: number): Enemy | null {
    const currentTime = Date.now();
    
    if (currentTime - this.enemySpawnTimer > this.enemySpawnInterval) {
      const enemyType = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
      
      const enemy: Enemy = {
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: this.getEnemySpeed(enemyType, score),
        health: this.getEnemyHealth(enemyType, score),
        maxHealth: this.getEnemyHealth(enemyType, score),
        type: enemyType,
        color: this.getEnemyColor(enemyType),
        movementPattern: this.getEnemyMovementPattern(enemyType),
        lastDirectionChange: currentTime,
        direction: Math.random() > 0.5 ? 1 : -1
      };

      this.enemies.push(enemy);
      this.enemySpawnTimer = currentTime;
      
      return enemy;
    }
    
    return null;
  }

  private getEnemySpeed(type: string, score: number): number {
    const baseSpeed: { [key: string]: number } = {
      'basic': 2,
      'fast': 4,
      'heavy': 1,
      'zigzag': 3,
      'kamikaze': 5,
      'shooter': 2
    };
    
    const speedIncrease = Math.floor(score / 5000) * 0.5;
    return Math.min(8, baseSpeed[type] + speedIncrease);
  }

  private getEnemyHealth(type: string, score: number): number {
    const baseHealth: { [key: string]: number } = {
      'basic': 1,
      'fast': 1,
      'heavy': 3,
      'zigzag': 2,
      'kamikaze': 1,
      'shooter': 2
    };
    
    const healthIncrease = Math.floor(score / 10000);
    return baseHealth[type] + healthIncrease;
  }

  private getEnemyColor(type: string): string {
    const colors: { [key: string]: string } = {
      'basic': '#ff0000',
      'fast': '#00ff00',
      'heavy': '#0000ff',
      'zigzag': '#ffff00',
      'kamikaze': '#ff6600',
      'shooter': '#ff00ff'
    };
    
    return colors[type] || '#ff0000';
  }

  private getEnemyMovementPattern(type: string): string {
    const patterns: { [key: string]: string } = {
      'basic': 'straight',
      'fast': 'straight',
      'heavy': 'straight',
      'zigzag': 'zigzag',
      'kamikaze': 'kamikaze',
      'shooter': 'straight'
    };
    
    return patterns[type] || 'straight';
  }

  updateEnemies(canvas: HTMLCanvasElement, player: any): Bullet[] {
    const bullets: Bullet[] = [];
    const currentTime = Date.now();
    
    this.enemies.forEach((enemy, index) => {
      // Update enemy position based on movement pattern
      this.updateEnemyMovement(enemy, canvas, currentTime);
      
      // Enemy attacks (for shooter type)
      if (enemy.type === 'shooter' && currentTime - enemy.lastDirectionChange > 2000) {
        bullets.push({
          x: enemy.x + enemy.width / 2 - 2,
          y: enemy.y + enemy.height,
          width: 4,
          height: 8,
          speed: 3,
          type: 'enemy_laser',
          color: '#ff00ff',
          damage: 1,
          owner: 'enemy'
        });
        enemy.lastDirectionChange = currentTime;
      }
      
      // Remove enemy if destroyed or off-screen
      if (enemy.health <= 0 || enemy.y > canvas.height + enemy.height) {
        this.enemies.splice(index, 1);
      }
    });
    
    return bullets;
  }

  private updateEnemyMovement(enemy: Enemy, canvas: HTMLCanvasElement, currentTime: number): void {
    switch (enemy.movementPattern) {
      case 'straight':
        enemy.y += enemy.speed;
        break;
        
      case 'zigzag':
        enemy.y += enemy.speed;
        enemy.x += enemy.direction * enemy.speed;
        
        // Change direction when hitting edges
        if (enemy.x <= 0 || enemy.x >= canvas.width - enemy.width) {
          enemy.direction *= -1;
        }
        break;
        
      case 'kamikaze':
        // Move towards player
        const player = { x: canvas.width / 2, y: canvas.height - 100 }; // Simplified player position
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          enemy.x += (dx / distance) * enemy.speed;
          enemy.y += (dy / distance) * enemy.speed;
        }
        break;
    }
  }

  // Enhanced AI movement patterns
  updateEnemyAI(enemy: Enemy, playerX: number, playerY: number, canvas: HTMLCanvasElement, deltaTime: number): void {
    const currentTime = Date.now();
    
    switch (enemy.movementPattern) {
      case 'straight':
        enemy.y += enemy.speed;
        break;
        
      case 'zigzag':
        enemy.y += enemy.speed;
        if (currentTime - enemy.lastDirectionChange > 1000) {
          enemy.direction *= -1;
          enemy.lastDirectionChange = currentTime;
        }
        enemy.x += enemy.direction * 2;
        break;
        
      case 'hover':
        enemy.y += enemy.speed * 0.5;
        if (currentTime - enemy.lastDirectionChange > 2000) {
          enemy.direction *= -1;
          enemy.lastDirectionChange = currentTime;
        }
        enemy.x += enemy.direction * 1.5;
        break;
        
      case 'kamikaze':
        // Move towards player
        const dx = playerX - enemy.x;
        const dy = playerY - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
          enemy.x += (dx / distance) * enemy.speed;
          enemy.y += (dy / distance) * enemy.speed;
        }
        break;
        
      case 'circle':
        // Circular movement pattern
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 3;
        const radius = 100;
        const angle = (currentTime * 0.002) % (Math.PI * 2);
        enemy.x = centerX + Math.cos(angle) * radius;
        enemy.y = centerY + Math.sin(angle) * radius;
        break;
        
      case 'spiral':
        // Spiral movement pattern
        const spiralAngle = (currentTime * 0.003) % (Math.PI * 2);
        const spiralRadius = 50 + (currentTime * 0.01) % 100;
        enemy.x = canvas.width / 2 + Math.cos(spiralAngle) * spiralRadius;
        enemy.y = canvas.height / 3 + Math.sin(spiralAngle) * spiralRadius;
        break;
    }
    
    // Keep enemies within bounds
    enemy.x = Math.max(0, Math.min(canvas.width - enemy.width, enemy.x));
  }

  drawEnemies(ctx: CanvasRenderingContext2D): void {
    this.enemies.forEach(enemy => {
      // Draw enhanced enemy ship using ShipRenderer
      ShipRenderer.drawEnemyShip(ctx, enemy.x, enemy.y, enemy.width, enemy.height, enemy.type, 0);
      
      // Draw health bar for enemies with more than 1 health
      if (enemy.maxHealth > 1) {
        const barWidth = enemy.width;
        const barHeight = 4;
        const barX = enemy.x;
        const barY = enemy.y - 8;
        
        // Background
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health fill
        const healthPercent = enemy.health / enemy.maxHealth;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
      }
    });
  }

  getEnemies(): Enemy[] {
    return this.enemies;
  }

  removeEnemy(enemyIndex: number): void {
    this.enemies.splice(enemyIndex, 1);
  }

  damageEnemy(enemyIndex: number, damage: number): boolean {
    if (enemyIndex >= 0 && enemyIndex < this.enemies.length) {
      this.enemies[enemyIndex].health -= damage;
      return this.enemies[enemyIndex].health <= 0;
    }
    return false;
  }
}
