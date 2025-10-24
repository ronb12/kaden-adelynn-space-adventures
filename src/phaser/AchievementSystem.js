// Achievement System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class AchievementSystem {
  constructor(scene) {
    this.scene = scene;
    this.achievements = new Map();
    this.unlockedAchievements = new Set();
    this.initializeAchievements();
  }

  initializeAchievements() {
    // Combat Achievements
    this.achievements.set('FIRST_KILL', {
      id: 'FIRST_KILL',
      name: 'First Blood',
      description: 'Destroy your first enemy',
      emoji: '🎯',
      condition: 'enemiesKilled >= 1',
      reward: { score: 100, experience: 50 }
    });

    this.achievements.set('KILL_STREAK_10', {
      id: 'KILL_STREAK_10',
      name: 'Killing Spree',
      description: 'Destroy 10 enemies in a row',
      emoji: '⚔️',
      condition: 'killStreak >= 10',
      reward: { score: 500, experience: 200 }
    });

    this.achievements.set('KILL_STREAK_50', {
      id: 'KILL_STREAK_50',
      name: 'Unstoppable',
      description: 'Destroy 50 enemies in a row',
      emoji: '🔥',
      condition: 'killStreak >= 50',
      reward: { score: 2000, experience: 1000 }
    });

    this.achievements.set('BOSS_KILLER', {
      id: 'BOSS_KILLER',
      name: 'Boss Slayer',
      description: 'Defeat your first boss',
      emoji: '👑',
      condition: 'bossesKilled >= 1',
      reward: { score: 1000, experience: 500 }
    });

    this.achievements.set('BOSS_MASTER', {
      id: 'BOSS_MASTER',
      name: 'Boss Master',
      description: 'Defeat 10 bosses',
      emoji: '🐉',
      condition: 'bossesKilled >= 10',
      reward: { score: 5000, experience: 2500 }
    });

    // Score Achievements
    this.achievements.set('SCORE_1000', {
      id: 'SCORE_1000',
      name: 'Getting Started',
      description: 'Reach 1,000 points',
      emoji: '⭐',
      condition: 'score >= 1000',
      reward: { score: 200, experience: 100 }
    });

    this.achievements.set('SCORE_10000', {
      id: 'SCORE_10000',
      name: 'High Scorer',
      description: 'Reach 10,000 points',
      emoji: '🌟',
      condition: 'score >= 10000',
      reward: { score: 1000, experience: 500 }
    });

    this.achievements.set('SCORE_100000', {
      id: 'SCORE_100000',
      name: 'Score Master',
      description: 'Reach 100,000 points',
      emoji: '💫',
      condition: 'score >= 100000',
      reward: { score: 5000, experience: 2500 }
    });

    // Survival Achievements
    this.achievements.set('SURVIVE_1_MIN', {
      id: 'SURVIVE_1_MIN',
      name: 'Survivor',
      description: 'Survive for 1 minute',
      emoji: '⏰',
      condition: 'survivalTime >= 60000',
      reward: { score: 300, experience: 150 }
    });

    this.achievements.set('SURVIVE_5_MIN', {
      id: 'SURVIVE_5_MIN',
      name: 'Endurance',
      description: 'Survive for 5 minutes',
      emoji: '🏃',
      condition: 'survivalTime >= 300000',
      reward: { score: 1500, experience: 750 }
    });

    this.achievements.set('SURVIVE_10_MIN', {
      id: 'SURVIVE_10_MIN',
      name: 'Iron Will',
      description: 'Survive for 10 minutes',
      emoji: '💪',
      condition: 'survivalTime >= 600000',
      reward: { score: 3000, experience: 1500 }
    });

    // Power-up Achievements
    this.achievements.set('POWER_UP_COLLECTOR', {
      id: 'POWER_UP_COLLECTOR',
      name: 'Power Collector',
      description: 'Collect 10 power-ups',
      emoji: '💎',
      condition: 'powerUpsCollected >= 10',
      reward: { score: 500, experience: 250 }
    });

    this.achievements.set('POWER_UP_MASTER', {
      id: 'POWER_UP_MASTER',
      name: 'Power Master',
      description: 'Collect 100 power-ups',
      emoji: '⚡',
      condition: 'powerUpsCollected >= 100',
      reward: { score: 2000, experience: 1000 }
    });

    // Weapon Achievements
    this.achievements.set('WEAPON_MASTER', {
      id: 'WEAPON_MASTER',
      name: 'Weapon Master',
      description: 'Use all weapon types',
      emoji: '🔫',
      condition: 'weaponsUsed >= 10',
      reward: { score: 1000, experience: 500 }
    });

    this.achievements.set('PERFECT_SHOT', {
      id: 'PERFECT_SHOT',
      name: 'Perfect Shot',
      description: 'Hit 100 enemies without missing',
      emoji: '🎯',
      condition: 'perfectHits >= 100',
      reward: { score: 1500, experience: 750 }
    });

    // Special Achievements
    this.achievements.set('LUCKY', {
      id: 'LUCKY',
      name: 'Lucky',
      description: 'Survive with 1 health point',
      emoji: '🍀',
      condition: 'survivedWith1HP',
      reward: { score: 1000, experience: 500 }
    });

    this.achievements.set('SPEED_DEMON', {
      id: 'SPEED_DEMON',
      name: 'Speed Demon',
      description: 'Complete a level in under 2 minutes',
      emoji: '⚡',
      condition: 'levelTime <= 120000',
      reward: { score: 800, experience: 400 }
    });

    this.achievements.set('PACIFIST', {
      id: 'PACIFIST',
      name: 'Pacifist',
      description: 'Complete a level without shooting',
      emoji: '🕊️',
      condition: 'shotsFired === 0',
      reward: { score: 2000, experience: 1000 }
    });

    this.achievements.set('DODGE_MASTER', {
      id: 'DODGE_MASTER',
      name: 'Dodge Master',
      description: 'Dodge 100 enemy bullets',
      emoji: '💨',
      condition: 'bulletsDodged >= 100',
      reward: { score: 1200, experience: 600 }
    });

    this.achievements.set('COMBO_MASTER', {
      id: 'COMBO_MASTER',
      name: 'Combo Master',
      description: 'Achieve a 20x combo',
      emoji: '🔥',
      condition: 'maxCombo >= 20',
      reward: { score: 1500, experience: 750 }
    });

    this.achievements.set('PERFECT_GAME', {
      id: 'PERFECT_GAME',
      name: 'Perfect Game',
      description: 'Complete a level without taking damage',
      emoji: '💎',
      condition: 'damageTaken === 0',
      reward: { score: 3000, experience: 1500 }
    });

    this.achievements.set('COLLECTOR', {
      id: 'COLLECTOR',
      name: 'Collector',
      description: 'Collect all power-up types',
      emoji: '📦',
      condition: 'powerUpTypesCollected >= 15',
      reward: { score: 2000, experience: 1000 }
    });

    this.achievements.set('LEGEND', {
      id: 'LEGEND',
      name: 'Legend',
      description: 'Unlock all achievements',
      emoji: '🏆',
      condition: 'achievementsUnlocked >= 24',
      reward: { score: 10000, experience: 5000 }
    });
  }

  checkAchievements(gameStats) {
    const newAchievements = [];
    
    this.achievements.forEach((achievement, id) => {
      if (!this.unlockedAchievements.has(id)) {
        if (this.evaluateCondition(achievement.condition, gameStats)) {
          this.unlockAchievement(achievement);
          newAchievements.push(achievement);
        }
      }
    });
    
    return newAchievements;
  }

  evaluateCondition(condition, gameStats) {
    // Simple condition evaluator
    const conditions = {
      'enemiesKilled >= 1': gameStats.enemiesKilled >= 1,
      'killStreak >= 10': gameStats.killStreak >= 10,
      'killStreak >= 50': gameStats.killStreak >= 50,
      'bossesKilled >= 1': gameStats.bossesKilled >= 1,
      'bossesKilled >= 10': gameStats.bossesKilled >= 10,
      'score >= 1000': gameStats.score >= 1000,
      'score >= 10000': gameStats.score >= 10000,
      'score >= 100000': gameStats.score >= 100000,
      'survivalTime >= 60000': gameStats.survivalTime >= 60000,
      'survivalTime >= 300000': gameStats.survivalTime >= 300000,
      'survivalTime >= 600000': gameStats.survivalTime >= 600000,
      'powerUpsCollected >= 10': gameStats.powerUpsCollected >= 10,
      'powerUpsCollected >= 100': gameStats.powerUpsCollected >= 100,
      'weaponsUsed >= 10': gameStats.weaponsUsed >= 10,
      'perfectHits >= 100': gameStats.perfectHits >= 100,
      'survivedWith1HP': gameStats.survivedWith1HP,
      'levelTime <= 120000': gameStats.levelTime <= 120000,
      'shotsFired === 0': gameStats.shotsFired === 0,
      'bulletsDodged >= 100': gameStats.bulletsDodged >= 100,
      'maxCombo >= 20': gameStats.maxCombo >= 20,
      'damageTaken === 0': gameStats.damageTaken === 0,
      'powerUpTypesCollected >= 15': gameStats.powerUpTypesCollected >= 15,
      'achievementsUnlocked >= 24': this.unlockedAchievements.size >= 24
    };
    
    return conditions[condition] || false;
  }

  unlockAchievement(achievement) {
    this.unlockedAchievements.add(achievement.id);
    this.showAchievementNotification(achievement);
    this.applyReward(achievement.reward);
  }

  showAchievementNotification(achievement) {
    const notification = this.scene.add.container(this.scene.scale.width / 2, 100);
    
    // Background
    const bg = this.scene.add.rectangle(0, 0, 400, 80, 0x000000, 0.8);
    bg.setStrokeStyle(3, 0x00ff00);
    notification.add(bg);
    
    // Achievement icon
    const icon = this.scene.add.text(-150, 0, achievement.emoji, {
      fontSize: '32px'
    });
    icon.setOrigin(0.5);
    notification.add(icon);
    
    // Achievement text
    const title = this.scene.add.text(-50, -10, achievement.name, {
      fontSize: '18px',
      fill: '#00ff00',
      fontStyle: 'bold'
    });
    title.setOrigin(0, 0.5);
    notification.add(title);
    
    const desc = this.scene.add.text(-50, 10, achievement.description, {
      fontSize: '14px',
      fill: '#ffffff'
    });
    desc.setOrigin(0, 0.5);
    notification.add(desc);
    
    // Animation
    notification.setAlpha(0);
    notification.setScale(0.5);
    
    this.scene.tweens.add({
      targets: notification,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.time.delayedCall(3000, () => {
          this.scene.tweens.add({
            targets: notification,
            alpha: 0,
            y: notification.y - 50,
            duration: 500,
            onComplete: () => notification.destroy()
          });
        });
      }
    });
  }

  applyReward(reward) {
    if (reward.score) {
      this.scene.score += reward.score;
    }
    if (reward.experience) {
      // Add experience system later
    }
  }

  getUnlockedAchievements() {
    return Array.from(this.unlockedAchievements).map(id => this.achievements.get(id));
  }

  getAllAchievements() {
    return Array.from(this.achievements.values());
  }

  getAchievementProgress() {
    const total = this.achievements.size;
    const unlocked = this.unlockedAchievements.size;
    return { unlocked, total, percentage: (unlocked / total) * 100 };
  }
}
