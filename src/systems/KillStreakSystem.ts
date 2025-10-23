import { GameStats } from '../types/GameTypes';

export class KillStreakSystem {
  private currentStreak: number = 0;
  private maxStreak: number = 0;
  private streakTimer: number = 0;
  private streakTimeout: number = 3000; // 3 seconds to maintain streak
  private lastKillTime: number = 0;
  private streakBonuses: { [key: number]: { name: string; multiplier: number } } = {
    5: { name: 'Killing Spree', multiplier: 1.5 },
    10: { name: 'Rampage', multiplier: 2.0 },
    15: { name: 'Dominating', multiplier: 2.5 },
    20: { name: 'Unstoppable', multiplier: 3.0 },
    25: { name: 'Godlike', multiplier: 4.0 }
  };

  addKill(): { streak: number; bonus?: string; multiplier: number } {
    const currentTime = Date.now();
    
    // Reset streak if too much time has passed
    if (currentTime - this.lastKillTime > this.streakTimeout) {
      this.currentStreak = 0;
    }
    
    this.currentStreak++;
    this.maxStreak = Math.max(this.maxStreak, this.currentStreak);
    this.streakTimer = this.streakTimeout;
    this.lastKillTime = currentTime;
    
    const bonus = this.getStreakBonus();
    const multiplier = bonus ? bonus.multiplier : 1;
    
    return {
      streak: this.currentStreak,
      bonus: bonus ? bonus.name : undefined,
      multiplier: multiplier
    };
  }

  updateStreak(deltaTime: number): void {
    if (this.currentStreak > 0) {
      this.streakTimer -= deltaTime;
      
      if (this.streakTimer <= 0) {
        this.resetStreak();
      }
    }
  }

  resetStreak(): void {
    this.currentStreak = 0;
    this.streakTimer = 0;
  }

  getStreakBonus(): { name: string; multiplier: number } | null {
    for (let threshold = 25; threshold >= 5; threshold -= 5) {
      if (this.currentStreak >= threshold) {
        return this.streakBonuses[threshold];
      }
    }
    return null;
  }

  getStreakMultiplier(): number {
    const bonus = this.getStreakBonus();
    return bonus ? bonus.multiplier : 1;
  }

  getCurrentStreak(): number {
    return this.currentStreak;
  }

  getMaxStreak(): number {
    return this.maxStreak;
  }

  getStreakTimeRemaining(): number {
    return Math.max(0, this.streakTimer);
  }

  getStreakProgress(): number {
    const nextThreshold = this.getNextThreshold();
    if (!nextThreshold) return 1;
    
    const currentThreshold = Math.floor(this.currentStreak / 5) * 5;
    const progress = (this.currentStreak - currentThreshold) / 5;
    return Math.min(1, progress);
  }

  getNextThreshold(): number | null {
    for (let threshold = 5; threshold <= 25; threshold += 5) {
      if (this.currentStreak < threshold) {
        return threshold;
      }
    }
    return null;
  }

  updateGameStats(gameStats: GameStats): void {
    gameStats.killStreak = this.currentStreak;
    gameStats.maxKillStreak = this.maxStreak;
  }

  drawStreakUI(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    if (this.currentStreak > 0) {
      const bonus = this.getStreakBonus();
      const progress = this.getStreakProgress();
      const timeRemaining = this.getStreakTimeRemaining();
      
      // Streak display
      ctx.fillStyle = '#ff6600';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${this.currentStreak} KILL STREAK`,
        canvas.width / 2,
        160
      );
      
      if (bonus) {
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(
          bonus.name,
          canvas.width / 2,
          190
        );
      }
      
      // Streak progress bar
      const nextThreshold = this.getNextThreshold();
      if (nextThreshold) {
        const barWidth = 200;
        const barHeight = 8;
        const barX = canvas.width / 2 - barWidth / 2;
        const barY = 210;
        
        // Background
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Progress fill
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(barX, barY, barWidth * progress, barHeight);
        
        // Next threshold indicator
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.fillText(
          `Next: ${nextThreshold}`,
          canvas.width / 2,
          barY + 25
        );
      }
      
      // Time remaining indicator
      ctx.fillStyle = '#ffff00';
      ctx.font = '16px Arial';
      ctx.fillText(
        `${Math.ceil(timeRemaining / 1000)}s`,
        canvas.width / 2,
        240
      );
      
      ctx.textAlign = 'left';
    }
  }
}
