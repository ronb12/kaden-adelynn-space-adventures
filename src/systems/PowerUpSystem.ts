import { PowerUp } from '../types/GameTypes';

export class PowerUpSystem {
  private powerUps: PowerUp[] = [];
  private spawnTimer: number = 0;
  private spawnInterval: number = 5000; // 5 seconds

  spawnPowerUp(canvas: HTMLCanvasElement, score: number): PowerUp | null {
    const currentTime = Date.now();
    
    // Spawn power-up every 5 seconds or when score reaches certain thresholds
    if (currentTime - this.spawnTimer > this.spawnInterval || 
        (score > 0 && score % 2000 === 0)) {
      
      const powerUpTypes = [
        {
          type: 'score',
          color: '#ffff00',
          icon: '💎',
          duration: 0,
          value: 500
        },
        {
          type: 'health',
          color: '#ff0000',
          icon: '❤️',
          duration: 0,
          value: 25
        },
        {
          type: 'life',
          color: '#ff00ff',
          icon: '👤',
          duration: 0,
          value: 1
        },
        {
          type: 'rapid',
          color: '#00ffff',
          icon: '⚡',
          duration: 3000,
          value: 1
        },
        {
          type: 'shield',
          color: '#0000ff',
          icon: '🛡️',
          duration: 5000,
          value: 1
        },
        {
          type: 'weapon',
          color: '#00ff00',
          icon: '🔫',
          duration: 0,
          value: 1
        },
        {
          type: 'double',
          color: '#ff6600',
          icon: '🔫⚡',
          duration: 10000,
          value: 1
        },
        {
          type: 'speed',
          color: '#6600ff',
          icon: '🚀',
          duration: 8000,
          value: 2
        },
        {
          type: 'wing',
          color: '#ff0066',
          icon: '✈️',
          duration: 0,
          value: 1
        }
      ];
      
      const powerUpType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
      
      const powerUp: PowerUp = {
        x: Math.random() * (canvas.width - 20),
        y: -20,
        width: 20,
        height: 20,
        type: powerUpType.type,
        color: powerUpType.color,
        icon: powerUpType.icon,
        duration: powerUpType.duration,
        value: powerUpType.value
      };

      this.powerUps.push(powerUp);
      this.spawnTimer = currentTime;
      
      return powerUp;
    }
    
    return null;
  }

  updatePowerUps(canvas: HTMLCanvasElement): void {
    this.powerUps = this.powerUps.filter(powerUp => {
      powerUp.y += 2;
      return powerUp.y < canvas.height + powerUp.height;
    });
  }

  getPowerUps(): PowerUp[] {
    return this.powerUps;
  }

  removePowerUp(powerUpId: number): void {
    this.powerUps.splice(powerUpId, 1);
  }

  collectPowerUp(powerUp: PowerUp, player: any): void {
    switch (powerUp.type) {
      case 'score':
        player.score += powerUp.value;
        break;
      case 'health':
        player.health = Math.min(player.maxHealth, player.health + powerUp.value);
        break;
      case 'life':
        player.lives += powerUp.value;
        break;
      case 'rapid':
        player.rapidFire = true;
        player.rapidFireTime = powerUp.duration;
        break;
      case 'shield':
        player.hasShield = true;
        player.shieldTime = powerUp.duration;
        break;
      case 'double':
        player.doubleShot = true;
        break;
      case 'speed':
        player.speed = Math.min(player.maxSpeed, player.speed + powerUp.value);
        break;
      case 'wing':
        if (player.wingFighters.length < 2) {
          player.wingFighters.push({
            id: `wing_${Date.now()}`,
            x: player.x - 50,
            y: player.y,
            width: player.width,
            height: player.height,
            speed: player.speed,
            targetX: player.x - 50,
            targetY: player.y,
            offset: player.wingFighters.length === 0 ? -50 : 50
          });
        }
        break;
    }
  }
}
