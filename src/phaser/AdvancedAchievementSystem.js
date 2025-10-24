// Advanced Achievement System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class AdvancedAchievementSystem {
  constructor(scene) {
    this.scene = scene;
    this.achievements = new Map();
    this.unlockedAchievements = new Set();
    
    this.achievementTypes = {
      // 20 New Achievement Types
      // Combat Achievements
      MASTER_WARRIOR: {
        id: 'master_warrior',
        name: 'Master Warrior',
        description: 'Defeat 1000 enemies',
        emoji: '⚔️',
        condition: 'enemiesKilled >= 1000',
        points: 1000,
        rarity: 'legendary'
      },
      BOSS_SLAYER: {
        id: 'boss_slayer',
        name: 'Boss Slayer',
        description: 'Defeat 50 bosses',
        emoji: '👑',
        condition: 'bossesKilled >= 50',
        points: 500,
        rarity: 'epic'
      },
      PERFECT_SHOT: {
        id: 'perfect_shot',
        name: 'Perfect Shot',
        description: 'Achieve 100% accuracy in a single game',
        emoji: '🎯',
        condition: 'accuracy >= 100',
        points: 300,
        rarity: 'rare'
      },
      COMBO_MASTER: {
        id: 'combo_master',
        name: 'Combo Master',
        description: 'Achieve a 100-hit combo',
        emoji: '🔥',
        condition: 'maxCombo >= 100',
        points: 400,
        rarity: 'epic'
      },
      SPEED_DEMON: {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a level in under 2 minutes',
        emoji: '💨',
        condition: 'levelTime <= 120000',
        points: 250,
        rarity: 'rare'
      },
      
      // Survival Achievements
      SURVIVOR: {
        id: 'survivor',
        name: 'Survivor',
        description: 'Survive for 10 minutes without taking damage',
        emoji: '🛡️',
        condition: 'survivalTime >= 600000 && damageTaken === 0',
        points: 600,
        rarity: 'legendary'
      },
      IMMORTAL: {
        id: 'immortal',
        name: 'Immortal',
        description: 'Complete 10 levels without dying',
        emoji: '💎',
        condition: 'levelsCompleted >= 10 && deaths === 0',
        points: 800,
        rarity: 'legendary'
      },
      DODGE_MASTER: {
        id: 'dodge_master',
        name: 'Dodge Master',
        description: 'Dodge 500 enemy attacks',
        emoji: '💨',
        condition: 'bulletsDodged >= 500',
        points: 350,
        rarity: 'epic'
      },
      PACIFIST: {
        id: 'pacifist',
        name: 'Pacifist',
        description: 'Complete a level without shooting',
        emoji: '🕊️',
        condition: 'shotsFired === 0 && levelCompleted === true',
        points: 200,
        rarity: 'rare'
      },
      ENDURANCE_RUNNER: {
        id: 'endurance_runner',
        name: 'Endurance Runner',
        description: 'Survive for 30 minutes in endless mode',
        emoji: '🏃',
        condition: 'survivalTime >= 1800000',
        points: 500,
        rarity: 'epic'
      },
      
      // Power-up Achievements
      POWER_COLLECTOR: {
        id: 'power_collector',
        name: 'Power Collector',
        description: 'Collect 1000 power-ups',
        emoji: '⭐',
        condition: 'powerUpsCollected >= 1000',
        points: 400,
        rarity: 'epic'
      },
      ELEMENTAL_MASTER: {
        id: 'elemental_master',
        name: 'Elemental Master',
        description: 'Use all elemental power-ups',
        emoji: '🌪️',
        condition: 'elementalPowerUpsUsed >= 8',
        points: 300,
        rarity: 'rare'
      },
      LUCKY_STREAK: {
        id: 'lucky_streak',
        name: 'Lucky Streak',
        description: 'Get 10 power-ups in a row',
        emoji: '🍀',
        condition: 'powerUpStreak >= 10',
        points: 250,
        rarity: 'rare'
      },
      ULTIMATE_COMBO: {
        id: 'ultimate_combo',
        name: 'Ultimate Combo',
        description: 'Have 5 different power-ups active simultaneously',
        emoji: '💫',
        condition: 'activePowerUps >= 5',
        points: 400,
        rarity: 'epic'
      },
      POWER_HOARDER: {
        id: 'power_hoarder',
        name: 'Power Hoarder',
        description: 'Collect 100 power-ups in a single game',
        emoji: '💎',
        condition: 'powerUpsCollectedInGame >= 100',
        points: 500,
        rarity: 'legendary'
      },
      
      // Score Achievements
      HIGH_SCORER: {
        id: 'high_scorer',
        name: 'High Scorer',
        description: 'Achieve a score of 1,000,000 points',
        emoji: '🏆',
        condition: 'score >= 1000000',
        points: 600,
        rarity: 'legendary'
      },
      PERFECT_GAME: {
        id: 'perfect_game',
        name: 'Perfect Game',
        description: 'Complete a level with perfect score',
        emoji: '💯',
        condition: 'perfectScore === true',
        points: 400,
        rarity: 'epic'
      },
      SCORE_MULTIPLIER: {
        id: 'score_multiplier',
        name: 'Score Multiplier',
        description: 'Achieve a 10x score multiplier',
        emoji: '✨',
        condition: 'scoreMultiplier >= 10',
        points: 300,
        rarity: 'rare'
      },
      COMBO_KING: {
        id: 'combo_king',
        name: 'Combo King',
        description: 'Achieve a 50-hit combo',
        emoji: '👑',
        condition: 'maxCombo >= 50',
        points: 350,
        rarity: 'epic'
      },
      STREAK_MASTER: {
        id: 'streak_master',
        name: 'Streak Master',
        description: 'Maintain a kill streak of 100',
        emoji: '⚡',
        condition: 'killStreak >= 100',
        points: 400,
        rarity: 'epic'
      },
      
      // Special Achievements
      EXPLORER: {
        id: 'explorer',
        name: 'Explorer',
        description: 'Visit all 25 different environments',
        emoji: '🗺️',
        condition: 'environmentsVisited >= 25',
        points: 500,
        rarity: 'epic'
      },
      COLLECTOR: {
        id: 'collector',
        name: 'Collector',
        description: 'Unlock all weapons',
        emoji: '🔫',
        condition: 'weaponsUnlocked >= 30',
        points: 400,
        rarity: 'epic'
      },
      ACHIEVEMENT_HUNTER: {
        id: 'achievement_hunter',
        name: 'Achievement Hunter',
        description: 'Unlock 50 achievements',
        emoji: '🏅',
        condition: 'achievementsUnlocked >= 50',
        points: 600,
        rarity: 'legendary'
      },
      PERFECTIONIST: {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Complete all levels with S-rank',
        emoji: '⭐',
        condition: 'sRankLevels >= 25',
        points: 800,
        rarity: 'legendary'
      },
      LEGEND: {
        id: 'legend',
        name: 'Legend',
        description: 'Unlock all achievements',
        emoji: '👑',
        condition: 'achievementsUnlocked >= 100',
        points: 1000,
        rarity: 'legendary'
      }
    };
  }

  checkAchievements() {
    const gameStats = this.scene.gameStats || {};
    
    Object.values(this.achievementTypes).forEach(achievement => {
      if (!this.unlockedAchievements.has(achievement.id)) {
        if (this.evaluateCondition(achievement.condition, gameStats)) {
          this.unlockAchievement(achievement);
        }
      }
    });
  }

  evaluateCondition(condition, gameStats) {
    // Simple condition evaluator
    try {
      // Replace condition variables with actual values
      let evalCondition = condition;
      
      // Replace common variables
      evalCondition = evalCondition.replace(/enemiesKilled/g, gameStats.enemiesKilled || 0);
      evalCondition = evalCondition.replace(/bossesKilled/g, gameStats.bossesKilled || 0);
      evalCondition = evalCondition.replace(/accuracy/g, this.calculateAccuracy(gameStats));
      evalCondition = evalCondition.replace(/maxCombo/g, gameStats.maxCombo || 0);
      evalCondition = evalCondition.replace(/levelTime/g, gameStats.levelTime || 0);
      evalCondition = evalCondition.replace(/survivalTime/g, gameStats.survivalTime || 0);
      evalCondition = evalCondition.replace(/levelsCompleted/g, gameStats.levelsCompleted || 0);
      evalCondition = evalCondition.replace(/deaths/g, gameStats.deaths || 0);
      evalCondition = evalCondition.replace(/bulletsDodged/g, gameStats.bulletsDodged || 0);
      evalCondition = evalCondition.replace(/shotsFired/g, gameStats.shotsFired || 0);
      evalCondition = evalCondition.replace(/levelCompleted/g, gameStats.levelCompleted || false);
      evalCondition = evalCondition.replace(/powerUpsCollected/g, gameStats.powerUpsCollected || 0);
      evalCondition = evalCondition.replace(/elementalPowerUpsUsed/g, gameStats.elementalPowerUpsUsed || 0);
      evalCondition = evalCondition.replace(/powerUpStreak/g, gameStats.powerUpStreak || 0);
      evalCondition = evalCondition.replace(/activePowerUps/g, gameStats.activePowerUps || 0);
      evalCondition = evalCondition.replace(/powerUpsCollectedInGame/g, gameStats.powerUpsCollectedInGame || 0);
      evalCondition = evalCondition.replace(/score/g, gameStats.score || 0);
      evalCondition = evalCondition.replace(/perfectScore/g, gameStats.perfectScore || false);
      evalCondition = evalCondition.replace(/scoreMultiplier/g, gameStats.scoreMultiplier || 1);
      evalCondition = evalCondition.replace(/killStreak/g, gameStats.killStreak || 0);
      evalCondition = evalCondition.replace(/environmentsVisited/g, gameStats.environmentsVisited || 0);
      evalCondition = evalCondition.replace(/weaponsUnlocked/g, gameStats.weaponsUnlocked || 0);
      evalCondition = evalCondition.replace(/achievementsUnlocked/g, this.unlockedAchievements.size);
      evalCondition = evalCondition.replace(/sRankLevels/g, gameStats.sRankLevels || 0);
      
      return eval(evalCondition);
    } catch (error) {
      console.error('Error evaluating achievement condition:', error);
      return false;
    }
  }

  calculateAccuracy(gameStats) {
    if (!gameStats.shotsFired || gameStats.shotsFired === 0) return 0;
    const hits = gameStats.enemiesKilled || 0;
    return (hits / gameStats.shotsFired) * 100;
  }

  unlockAchievement(achievement) {
    this.unlockedAchievements.add(achievement.id);
    this.achievements.set(achievement.id, achievement);
    
    // Add points to score
    if (this.scene.score !== undefined) {
      this.scene.score += achievement.points;
    }
    
    // Show achievement notification
    this.showAchievementNotification(achievement);
    
    // Play achievement sound
    if (this.scene.soundSystem) {
      this.scene.soundSystem.playAchievementSound();
    }
    
    // Create achievement effect
    this.createAchievementEffect(achievement);
  }

  showAchievementNotification(achievement) {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;
    
    // Create achievement background
    const bg = this.scene.add.rectangle(centerX, centerY, 400, 100, 0x000000, 0.8);
    bg.setStrokeStyle(3, this.getRarityColor(achievement.rarity));
    
    // Create achievement emoji
    const emoji = this.scene.add.text(centerX - 150, centerY, achievement.emoji, {
      fontSize: '48px',
      fill: '#ffffff'
    });
    emoji.setOrigin(0.5);
    
    // Create achievement name
    const name = this.scene.add.text(centerX - 50, centerY - 20, achievement.name, {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold'
    });
    name.setOrigin(0.5);
    
    // Create achievement description
    const description = this.scene.add.text(centerX - 50, centerY + 20, achievement.description, {
      fontSize: '16px',
      fill: '#cccccc'
    });
    description.setOrigin(0.5);
    
    // Create points text
    const points = this.scene.add.text(centerX + 150, centerY, `+${achievement.points}`, {
      fontSize: '20px',
      fill: this.getRarityColor(achievement.rarity),
      fontStyle: 'bold'
    });
    points.setOrigin(0.5);
    
    // Animate achievement notification
    this.scene.tweens.add({
      targets: [bg, emoji, name, description, points],
      alpha: 0,
      y: centerY - 50,
      duration: 3000,
      delay: 2000,
      onComplete: () => {
        bg.destroy();
        emoji.destroy();
        name.destroy();
        description.destroy();
        points.destroy();
      }
    });
    
    // Entrance animation
    this.scene.tweens.add({
      targets: [bg, emoji, name, description, points],
      alpha: 0,
      y: centerY + 50,
      duration: 0
    });
    
    this.scene.tweens.add({
      targets: [bg, emoji, name, description, points],
      alpha: 1,
      y: centerY,
      duration: 500,
      ease: 'Back.easeOut'
    });
  }

  createAchievementEffect(achievement) {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;
    
    // Create particle effect
    const particles = this.scene.add.particles(centerX, centerY, 'sparkle', {
      speed: { min: 100, max: 300 },
      scale: { start: 1, end: 0 },
      lifespan: 2000,
      quantity: 20,
      tint: this.getRarityColor(achievement.rarity)
    });
    
    // Create screen flash
    const flash = this.scene.add.rectangle(
      centerX, centerY, 
      this.scene.scale.width, 
      this.scene.scale.height, 
      this.getRarityColor(achievement.rarity), 
      0.3
    );
    
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 500
    });
    
    // Screen shake
    this.scene.cameras.main.shake(500, 0.01);
  }

  getRarityColor(rarity) {
    switch (rarity) {
      case 'common': return 0xffffff;
      case 'rare': return 0x00ff00;
      case 'epic': return 0x0080ff;
      case 'legendary': return 0xff8000;
      default: return 0xffffff;
    }
  }

  getAchievementProgress(achievementId) {
    const achievement = this.achievementTypes[achievementId];
    if (!achievement) return 0;
    
    const gameStats = this.scene.gameStats || {};
    
    // Calculate progress based on condition
    switch (achievementId) {
      case 'master_warrior':
        return Math.min(100, ((gameStats.enemiesKilled || 0) / 1000) * 100);
      case 'boss_slayer':
        return Math.min(100, ((gameStats.bossesKilled || 0) / 50) * 100);
      case 'power_collector':
        return Math.min(100, ((gameStats.powerUpsCollected || 0) / 1000) * 100);
      case 'high_scorer':
        return Math.min(100, ((gameStats.score || 0) / 1000000) * 100);
      default:
        return 0;
    }
  }

  getUnlockedAchievements() {
    return Array.from(this.unlockedAchievements);
  }

  getAchievementById(id) {
    return this.achievementTypes[id];
  }

  getAllAchievements() {
    return Object.values(this.achievementTypes);
  }

  getAchievementsByRarity(rarity) {
    return Object.values(this.achievementTypes).filter(
      achievement => achievement.rarity === rarity
    );
  }

  getTotalAchievementPoints() {
    let totalPoints = 0;
    this.unlockedAchievements.forEach(achievementId => {
      const achievement = this.achievementTypes[achievementId];
      if (achievement) {
        totalPoints += achievement.points;
      }
    });
    return totalPoints;
  }
}
