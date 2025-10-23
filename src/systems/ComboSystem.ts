import { GameStats } from '../types/GameTypes';

export class ComboSystem {
  private currentCombo: number = 0;
  private maxCombo: number = 0;
  private comboTimer: number = 0;
  private comboTimeout: number = 2000; // 2 seconds to maintain combo
  private lastKillTime: number = 0;

  addKill(): number {
    const currentTime = Date.now();
    
    // Reset combo if too much time has passed
    if (currentTime - this.lastKillTime > this.comboTimeout) {
      this.currentCombo = 0;
    }
    
    this.currentCombo++;
    this.maxCombo = Math.max(this.maxCombo, this.currentCombo);
    this.comboTimer = this.comboTimeout;
    this.lastKillTime = currentTime;
    
    return this.getComboMultiplier();
  }

  updateCombo(deltaTime: number): void {
    if (this.currentCombo > 0) {
      this.comboTimer -= deltaTime;
      
      if (this.comboTimer <= 0) {
        this.resetCombo();
      }
    }
  }

  resetCombo(): void {
    this.currentCombo = 0;
    this.comboTimer = 0;
  }

  getComboMultiplier(): number {
    if (this.currentCombo <= 1) return 1;
    if (this.currentCombo <= 5) return 2;
    if (this.currentCombo <= 10) return 3;
    if (this.currentCombo <= 20) return 4;
    if (this.currentCombo <= 50) return 6;
    return 10; // Max 10x multiplier for insane combos
  }

  getComboReward(): string | null {
    if (this.currentCombo === 10) return 'COMBO MASTER!';
    if (this.currentCombo === 25) return 'UNSTOPPABLE!';
    if (this.currentCombo === 50) return 'LEGENDARY!';
    if (this.currentCombo === 100) return 'GODLIKE!';
    return null;
  }

  getComboBonus(): { health?: number; powerUp?: string } | null {
    if (this.currentCombo === 10) return { health: 10 };
    if (this.currentCombo === 25) return { health: 25, powerUp: 'rapidFire' };
    if (this.currentCombo === 50) return { health: 50, powerUp: 'shield' };
    if (this.currentCombo === 100) return { health: 100, powerUp: 'invincibility' };
    return null;
  }

  getComboScore(baseScore: number): number {
    return baseScore * this.getComboMultiplier();
  }

  getCurrentCombo(): number {
    return this.currentCombo;
  }

  getMaxCombo(): number {
    return this.maxCombo;
  }

  getComboTimeRemaining(): number {
    return Math.max(0, this.comboTimer);
  }

  getComboProgress(): number {
    if (this.currentCombo <= 1) return 0;
    if (this.currentCombo <= 5) return (this.currentCombo - 1) / 4;
    if (this.currentCombo <= 10) return ((this.currentCombo - 5) / 5) + 0.25;
    if (this.currentCombo <= 20) return ((this.currentCombo - 10) / 10) + 0.5;
    return 1;
  }

  updateGameStats(gameStats: GameStats): void {
    gameStats.combo = this.currentCombo;
    gameStats.maxCombo = this.maxCombo;
  }

  drawComboUI(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    if (this.currentCombo > 1) {
      const multiplier = this.getComboMultiplier();
      const progress = this.getComboProgress();
      const timeRemaining = this.getComboTimeRemaining();
      
      // Combo display
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `COMBO x${multiplier}!`,
        canvas.width / 2,
        100
      );
      
      // Combo progress bar
      const barWidth = 200;
      const barHeight = 10;
      const barX = canvas.width / 2 - barWidth / 2;
      const barY = 120;
      
      // Background
      ctx.fillStyle = '#333333';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // Progress fill
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(barX, barY, barWidth * progress, barHeight);
      
      // Time remaining indicator
      ctx.fillStyle = '#ffff00';
      ctx.font = '16px Arial';
      ctx.fillText(
        `${Math.ceil(timeRemaining / 1000)}s`,
        canvas.width / 2,
        barY + 30
      );
      
      ctx.textAlign = 'left';
    }
  }
}
