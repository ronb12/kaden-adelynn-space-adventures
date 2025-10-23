import { Player } from '../types/GameTypes';

export class ShieldSystem {
  private shieldActive: boolean = false;
  private shieldTime: number = 0;
  private shieldEnergy: number = 100;
  private maxShieldEnergy: number = 100;

  activateShield(player: Player, duration: number = 5000): void {
    player.hasShield = true;
    player.shieldTime = duration;
    this.shieldActive = true;
    this.shieldTime = duration;
    this.shieldEnergy = this.maxShieldEnergy;
  }

  updateShield(player: Player, deltaTime: number): boolean {
    if (player.hasShield && player.shieldTime > 0) {
      player.shieldTime -= deltaTime;
      this.shieldTime -= deltaTime;
      
      // Shield energy decreases over time
      this.shieldEnergy -= (deltaTime / 1000) * 10; // 10 energy per second
      
      if (player.shieldTime <= 0 || this.shieldEnergy <= 0) {
        this.deactivateShield(player);
        return false;
      }
      return true;
    }
    return false;
  }

  deactivateShield(player: Player): void {
    player.hasShield = false;
    player.shieldTime = 0;
    this.shieldActive = false;
    this.shieldTime = 0;
    this.shieldEnergy = 0;
  }

  takeDamage(player: Player, damage: number): boolean {
    if (player.hasShield && this.shieldEnergy > 0) {
      this.shieldEnergy -= damage * 10; // Shield absorbs damage
      
      if (this.shieldEnergy <= 0) {
        this.deactivateShield(player);
        return false; // Shield broken, no damage to player
      }
      return true; // Shield absorbed damage
    }
    return false; // No shield, damage goes to player
  }

  drawShield(ctx: CanvasRenderingContext2D, player: Player): void {
    if (player.hasShield && this.shieldEnergy > 0) {
      const shieldRadius = 30 + (this.shieldEnergy / this.maxShieldEnergy) * 10;
      const shieldAlpha = (this.shieldEnergy / this.maxShieldEnergy) * 0.3;
      
      ctx.save();
      ctx.globalAlpha = shieldAlpha;
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(
        player.x + player.width / 2,
        player.y + player.height / 2,
        shieldRadius,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      
      // Shield energy bar
      const barWidth = 60;
      const barHeight = 8;
      const barX = player.x + player.width / 2 - barWidth / 2;
      const barY = player.y - 20;
      
      // Background
      ctx.fillStyle = '#333333';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // Energy fill
      const energyWidth = (this.shieldEnergy / this.maxShieldEnergy) * barWidth;
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(barX, barY, energyWidth, barHeight);
      
      ctx.restore();
    }
  }

  getShieldEnergy(): number {
    return this.shieldEnergy;
  }

  getMaxShieldEnergy(): number {
    return this.maxShieldEnergy;
  }

  isShieldActive(): boolean {
    return this.shieldActive;
  }

  rechargeShield(amount: number): void {
    if (this.shieldActive) {
      this.shieldEnergy = Math.min(this.maxShieldEnergy, this.shieldEnergy + amount);
    }
  }
}
