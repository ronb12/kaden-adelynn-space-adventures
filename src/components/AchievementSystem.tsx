import React from 'react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export class AchievementSystem {
  private achievements: Achievement[] = [];
  private unlockedAchievements: Achievement[] = [];

  constructor() {
    this.initializeAchievements();
  }

  private initializeAchievements(): void {
    this.achievements = [
      {
        id: 'first_kill',
        name: 'First Blood',
        description: 'Destroy your first enemy',
        icon: '🔫',
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'combo_master',
        name: 'Combo Master',
        description: 'Achieve a 10x combo',
        icon: '🔥',
        unlocked: false,
        progress: 0,
        maxProgress: 10
      },
      {
        id: 'kill_streak',
        name: 'Kill Streak',
        description: 'Achieve a 20 kill streak',
        icon: '⚡',
        unlocked: false,
        progress: 0,
        maxProgress: 20
      },
      {
        id: 'score_hunter',
        name: 'Score Hunter',
        description: 'Reach 10,000 points',
        icon: '🎯',
        unlocked: false,
        progress: 0,
        maxProgress: 10000
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
        id: 'survivor',
        name: 'Survivor',
        description: 'Survive for 5 minutes',
        icon: '⏰',
        unlocked: false,
        progress: 0,
        maxProgress: 300 // 5 minutes in seconds
      },
      {
        id: 'weapon_master',
        name: 'Weapon Master',
        description: 'Use all 6 weapons',
        icon: '🔧',
        unlocked: false,
        progress: 0,
        maxProgress: 6
      },
      {
        id: 'perfect_game',
        name: 'Perfect Game',
        description: 'Complete a game without losing a life',
        icon: '💎',
        unlocked: false,
        progress: 0,
        maxProgress: 1
      }
    ];
  }

  updateAchievements(gameState: {
    score: number;
    combo: number;
    killStreak: number;
    bossesDefeated: number;
    gameTime: number;
    weaponsUsed: string[];
    livesLost: number;
  }): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let progress = 0;
      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_kill':
          progress = gameState.score > 0 ? 1 : 0;
          shouldUnlock = progress >= achievement.maxProgress;
          break;
          
        case 'combo_master':
          progress = Math.min(gameState.combo, achievement.maxProgress);
          shouldUnlock = progress >= achievement.maxProgress;
          break;
          
        case 'kill_streak':
          progress = Math.min(gameState.killStreak, achievement.maxProgress);
          shouldUnlock = progress >= achievement.maxProgress;
          break;
          
        case 'score_hunter':
          progress = Math.min(gameState.score, achievement.maxProgress);
          shouldUnlock = progress >= achievement.maxProgress;
          break;
          
        case 'boss_slayer':
          progress = Math.min(gameState.bossesDefeated, achievement.maxProgress);
          shouldUnlock = progress >= achievement.maxProgress;
          break;
          
        case 'survivor':
          progress = Math.min(gameState.gameTime, achievement.maxProgress);
          shouldUnlock = progress >= achievement.maxProgress;
          break;
          
        case 'weapon_master':
          progress = gameState.weaponsUsed.length;
          shouldUnlock = progress >= achievement.maxProgress;
          break;
          
        case 'perfect_game':
          progress = gameState.livesLost === 0 ? 1 : 0;
          shouldUnlock = progress >= achievement.maxProgress;
          break;
      }

      achievement.progress = progress;

      if (shouldUnlock && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        this.unlockedAchievements.push(achievement);
        newlyUnlocked.push(achievement);
      }
    });

    return newlyUnlocked;
  }

  getAchievements(): Achievement[] {
    return this.achievements;
  }

  getUnlockedAchievements(): Achievement[] {
    return this.unlockedAchievements;
  }

  getAchievementProgress(achievementId: string): number {
    const achievement = this.achievements.find(a => a.id === achievementId);
    return achievement ? achievement.progress : 0;
  }

  isAchievementUnlocked(achievementId: string): boolean {
    const achievement = this.achievements.find(a => a.id === achievementId);
    return achievement ? achievement.unlocked : false;
  }

  getAchievementCompletionPercentage(): number {
    const unlockedCount = this.achievements.filter(a => a.unlocked).length;
    return (unlockedCount / this.achievements.length) * 100;
  }
}