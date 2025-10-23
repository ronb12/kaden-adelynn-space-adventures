import { Achievement, GameStats } from '../types/GameTypes';

export class EnhancedAchievementSystem {
  private achievements: Achievement[] = [];
  private unlockedAchievements: Achievement[] = [];
  private showAchievement: Achievement | null = null;
  private achievementDisplayTime: number = 0;
  private achievementDisplayDuration: number = 3000; // 3 seconds

  constructor() {
    this.initializeAchievements();
  }

  private initializeAchievements(): void {
    this.achievements = [
      {
        id: 'first_kill',
        name: 'First Blood',
        description: 'Destroy your first enemy',
        icon: '🎯',
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'combo_master',
        name: 'Combo Master',
        description: 'Achieve a 10-kill combo',
        icon: '🔥',
        unlocked: false,
        progress: 0,
        maxProgress: 10
      },
      {
        id: 'streak_warrior',
        name: 'Streak Warrior',
        description: 'Get a 20-kill streak',
        icon: '⚔️',
        unlocked: false,
        progress: 0,
        maxProgress: 20
      },
      {
        id: 'boss_slayer',
        name: 'Boss Slayer',
        description: 'Defeat 5 bosses',
        icon: '👹',
        unlocked: false,
        progress: 0,
        maxProgress: 5
      },
      {
        id: 'power_up_collector',
        name: 'Power-Up Collector',
        description: 'Collect 50 power-ups',
        icon: '💎',
        unlocked: false,
        progress: 0,
        maxProgress: 50
      },
      {
        id: 'score_hunter',
        name: 'Score Hunter',
        description: 'Reach 100,000 points',
        icon: '🏆',
        unlocked: false,
        progress: 0,
        maxProgress: 100000
      },
      {
        id: 'survivor',
        name: 'Survivor',
        description: 'Survive for 5 minutes',
        icon: '⏰',
        unlocked: false,
        progress: 0,
        maxProgress: 300000 // 5 minutes in milliseconds
      },
      {
        id: 'wing_commander',
        name: 'Wing Commander',
        description: 'Get 2 wing fighters',
        icon: '✈️',
        unlocked: false,
        progress: 0,
        maxProgress: 2
      },
      {
        id: 'shield_master',
        name: 'Shield Master',
        description: 'Use shield for 30 seconds',
        icon: '🛡️',
        unlocked: false,
        progress: 0,
        maxProgress: 30000 // 30 seconds in milliseconds
      },
      {
        id: 'rapid_fire',
        name: 'Rapid Fire',
        description: 'Use rapid fire 10 times',
        icon: '⚡',
        unlocked: false,
        progress: 0,
        maxProgress: 10
      },
      {
        id: 'double_trouble',
        name: 'Double Trouble',
        description: 'Use double shot 5 times',
        icon: '🔫',
        unlocked: false,
        progress: 0,
        maxProgress: 5
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Use speed boost 15 times',
        icon: '🚀',
        unlocked: false,
        progress: 0,
        maxProgress: 15
      },
      {
        id: 'perfect_game',
        name: 'Perfect Game',
        description: 'Complete a game without dying',
        icon: '💯',
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'high_scorer',
        name: 'High Scorer',
        description: 'Reach 500,000 points',
        icon: '🌟',
        unlocked: false,
        progress: 0,
        maxProgress: 500000
      },
      {
        id: 'legend',
        name: 'Legend',
        description: 'Reach 1,000,000 points',
        icon: '👑',
        unlocked: false,
        progress: 0,
        maxProgress: 1000000
      }
    ];
  }

  updateAchievements(gameStats: GameStats): Achievement | null {
    let newAchievement: Achievement | null = null;

    this.achievements.forEach(achievement => {
      if (!achievement.unlocked) {
        let progress = 0;
        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first_kill':
            progress = gameStats.enemiesDestroyed > 0 ? 1 : 0;
            shouldUnlock = gameStats.enemiesDestroyed >= 1;
            break;

          case 'combo_master':
            progress = Math.min(gameStats.maxCombo, achievement.maxProgress);
            shouldUnlock = gameStats.maxCombo >= 10;
            break;

          case 'streak_warrior':
            progress = Math.min(gameStats.maxKillStreak, achievement.maxProgress);
            shouldUnlock = gameStats.maxKillStreak >= 20;
            break;

          case 'boss_slayer':
            progress = Math.min(gameStats.bossesDefeated, achievement.maxProgress);
            shouldUnlock = gameStats.bossesDefeated >= 5;
            break;

          case 'power_up_collector':
            progress = Math.min(gameStats.powerUpsCollected, achievement.maxProgress);
            shouldUnlock = gameStats.powerUpsCollected >= 50;
            break;

          case 'score_hunter':
            progress = Math.min(gameStats.score, achievement.maxProgress);
            shouldUnlock = gameStats.score >= 100000;
            break;

          case 'survivor':
            progress = Math.min(gameStats.gameTime, achievement.maxProgress);
            shouldUnlock = gameStats.gameTime >= 300000;
            break;

          case 'wing_commander':
            progress = gameStats.wingFighters || 0;
            shouldUnlock = (gameStats.wingFighters || 0) >= 2;
            break;

          case 'shield_master':
            progress = Math.min(gameStats.shieldTime || 0, achievement.maxProgress);
            shouldUnlock = (gameStats.shieldTime || 0) >= 30000;
            break;

          case 'rapid_fire':
            progress = Math.min(gameStats.rapidFireUses || 0, achievement.maxProgress);
            shouldUnlock = (gameStats.rapidFireUses || 0) >= 10;
            break;

          case 'double_trouble':
            progress = Math.min(gameStats.doubleShotUses || 0, achievement.maxProgress);
            shouldUnlock = (gameStats.doubleShotUses || 0) >= 5;
            break;

          case 'speed_demon':
            progress = Math.min(gameStats.speedBoostUses || 0, achievement.maxProgress);
            shouldUnlock = (gameStats.speedBoostUses || 0) >= 15;
            break;

          case 'perfect_game':
            progress = gameStats.lives > 0 ? 1 : 0;
            shouldUnlock = gameStats.lives > 0 && gameStats.gameTime > 60000; // 1 minute minimum
            break;

          case 'high_scorer':
            progress = Math.min(gameStats.score, achievement.maxProgress);
            shouldUnlock = gameStats.score >= 500000;
            break;

          case 'legend':
            progress = Math.min(gameStats.score, achievement.maxProgress);
            shouldUnlock = gameStats.score >= 1000000;
            break;
        }

        achievement.progress = progress;

        if (shouldUnlock && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date();
          this.unlockedAchievements.push(achievement);
          newAchievement = achievement;
        }
      }
    });

    return newAchievement;
  }

  displayAchievement(achievement: Achievement): void {
    this.showAchievement = achievement;
    this.achievementDisplayTime = Date.now();
  }

  updateAchievementDisplay(): void {
    if (this.showAchievement && Date.now() - this.achievementDisplayTime > this.achievementDisplayDuration) {
      this.showAchievement = null;
    }
  }

  getAchievements(): Achievement[] {
    return this.achievements;
  }

  getUnlockedAchievements(): Achievement[] {
    return this.unlockedAchievements;
  }

  getCurrentDisplayAchievement(): Achievement | null {
    return this.showAchievement;
  }

  getAchievementProgress(achievementId: string): number {
    const achievement = this.achievements.find(a => a.id === achievementId);
    return achievement ? achievement.progress : 0;
  }

  isAchievementUnlocked(achievementId: string): boolean {
    const achievement = this.achievements.find(a => a.id === achievementId);
    return achievement ? achievement.unlocked : false;
  }

  drawAchievementNotification(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    if (this.showAchievement) {
      const achievement = this.showAchievement;
      const timeRemaining = this.achievementDisplayDuration - (Date.now() - this.achievementDisplayTime);
      const alpha = Math.min(1, timeRemaining / 1000);

      ctx.save();
      ctx.globalAlpha = alpha;

      // Achievement background
      const bgWidth = 300;
      const bgHeight = 80;
      const bgX = canvas.width - bgWidth - 20;
      const bgY = 20;

      ctx.fillStyle = '#000000';
      ctx.fillRect(bgX, bgY, bgWidth, bgHeight);

      ctx.strokeStyle = '#ffaa00';
      ctx.lineWidth = 3;
      ctx.strokeRect(bgX, bgY, bgWidth, bgHeight);

      // Achievement icon
      ctx.font = '30px Arial';
      ctx.fillStyle = '#ffaa00';
      ctx.textAlign = 'center';
      ctx.fillText(achievement.icon, bgX + 40, bgY + 50);

      // Achievement text
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(achievement.name, bgX + 70, bgY + 30);

      ctx.font = '12px Arial';
      ctx.fillStyle = '#cccccc';
      ctx.fillText(achievement.description, bgX + 70, bgY + 50);

      ctx.restore();
    }
  }
}
