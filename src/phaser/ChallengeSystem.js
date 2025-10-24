// Challenge System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class ChallengeSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentChallenge = null;
    this.challengeData = {
      SURVIVAL: {
        name: 'Survival Mode',
        emoji: '⏰',
        description: 'Survive as long as possible against endless waves of enemies',
        difficulty: 'Medium',
        rewards: { score: 1000, experience: 500 },
        rules: {
          timeLimit: 300000, // 5 minutes
          enemySpawnRate: 1000,
          powerUpSpawnRate: 15000,
          bossSpawnRate: 60000,
          healthRegen: false,
          weaponUpgrades: true
        },
        objectives: [
          'Survive for 5 minutes',
          'Kill 50 enemies',
          'Don\'t die'
        ]
      },
      SPEED_RUN: {
        name: 'Speed Run',
        emoji: '⚡',
        description: 'Complete the level as fast as possible',
        difficulty: 'Hard',
        rewards: { score: 2000, experience: 1000 },
        rules: {
          timeLimit: 120000, // 2 minutes
          enemySpawnRate: 500,
          powerUpSpawnRate: 10000,
          bossSpawnRate: 30000,
          healthRegen: false,
          weaponUpgrades: true
        },
        objectives: [
          'Complete in under 2 minutes',
          'Kill all enemies',
          'Don\'t take damage'
        ]
      },
      PACIFIST: {
        name: 'Pacifist Mode',
        emoji: '🕊️',
        description: 'Complete the level without shooting',
        difficulty: 'Very Hard',
        rewards: { score: 3000, experience: 1500 },
        rules: {
          timeLimit: 180000, // 3 minutes
          enemySpawnRate: 2000,
          powerUpSpawnRate: 20000,
          bossSpawnRate: 90000,
          healthRegen: true,
          weaponUpgrades: false,
          noShooting: true
        },
        objectives: [
          'Don\'t shoot any bullets',
          'Survive for 3 minutes',
          'Use only power-ups'
        ]
      },
      BOSS_RUSH: {
        name: 'Boss Rush',
        emoji: '👑',
        description: 'Face all bosses in sequence',
        difficulty: 'Extreme',
        rewards: { score: 5000, experience: 2500 },
        rules: {
          timeLimit: 600000, // 10 minutes
          enemySpawnRate: 0,
          powerUpSpawnRate: 30000,
          bossSpawnRate: 60000,
          healthRegen: false,
          weaponUpgrades: true,
          bossOnly: true
        },
        objectives: [
          'Defeat all 8 bosses',
          'Don\'t die',
          'Complete in under 10 minutes'
        ]
      },
      ENDLESS: {
        name: 'Endless Mode',
        emoji: '♾️',
        description: 'Fight endless waves with increasing difficulty',
        difficulty: 'Variable',
        rewards: { score: 10000, experience: 5000 },
        rules: {
          timeLimit: 0, // No time limit
          enemySpawnRate: 1000,
          powerUpSpawnRate: 20000,
          bossSpawnRate: 120000,
          healthRegen: false,
          weaponUpgrades: true,
          difficultyScaling: true
        },
        objectives: [
          'Survive as long as possible',
          'Reach wave 10',
          'Get the highest score'
        ]
      }
    };
  }

  startChallenge(challengeType) {
    const challenge = this.challengeData[challengeType];
    if (!challenge) return false;
    
    this.currentChallenge = challengeType;
    this.applyChallengeRules(challenge);
    this.showChallengeIntroduction(challenge);
    
    return true;
  }

  applyChallengeRules(challenge) {
    const rules = challenge.rules;
    
    // Apply time limit
    if (rules.timeLimit > 0) {
      this.scene.time.delayedCall(rules.timeLimit, () => {
        this.endChallenge('time_up');
      });
    }
    
    // Apply enemy spawn rate
    this.scene.time.removeAllEvents();
    this.scene.time.addEvent({
      delay: rules.enemySpawnRate,
      callback: this.scene.spawnEnemy,
      callbackScope: this.scene,
      loop: true
    });
    
    // Apply power-up spawn rate
    if (rules.powerUpSpawnRate > 0) {
      this.scene.time.addEvent({
        delay: rules.powerUpSpawnRate,
        callback: this.scene.spawnPowerUp,
        callbackScope: this.scene,
        loop: true
      });
    }
    
    // Apply boss spawn rate
    if (rules.bossSpawnRate > 0) {
      this.scene.time.addEvent({
        delay: rules.bossSpawnRate,
        callback: this.spawnChallengeBoss,
        callbackScope: this,
        loop: true
      });
    }
    
    // Apply health regeneration
    if (rules.healthRegen) {
      this.scene.time.addEvent({
        delay: 5000,
        callback: this.regenerateHealth,
        callbackScope: this,
        loop: true
      });
    }
    
    // Apply difficulty scaling
    if (rules.difficultyScaling) {
      this.scene.time.addEvent({
        delay: 30000,
        callback: this.increaseDifficulty,
        callbackScope: this,
        loop: true
      });
    }
  }

  showChallengeIntroduction(challenge) {
    const introContainer = this.scene.add.container(this.scene.scale.width / 2, this.scene.scale.height / 2);
    introContainer.setDepth(1000);
    
    // Background
    const background = this.scene.add.rectangle(0, 0, 600, 400, 0x000000, 0.9);
    background.setStrokeStyle(3, 0x00aaff);
    introContainer.add(background);
    
    // Challenge name
    const challengeName = this.scene.add.text(0, -150, challenge.name, {
      fontSize: '36px',
      fill: '#00aaff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    challengeName.setOrigin(0.5);
    introContainer.add(challengeName);
    
    // Challenge emoji
    const challengeEmoji = this.scene.add.text(0, -100, challenge.emoji, {
      fontSize: '64px'
    });
    challengeEmoji.setOrigin(0.5);
    introContainer.add(challengeEmoji);
    
    // Challenge description
    const challengeDesc = this.scene.add.text(0, -40, challenge.description, {
      fontSize: '18px',
      fill: '#ffffff',
      align: 'center'
    });
    challengeDesc.setOrigin(0.5);
    introContainer.add(challengeDesc);
    
    // Difficulty
    const difficulty = this.scene.add.text(0, 0, `Difficulty: ${challenge.difficulty}`, {
      fontSize: '20px',
      fill: '#ffff00',
      fontStyle: 'bold'
    });
    difficulty.setOrigin(0.5);
    introContainer.add(difficulty);
    
    // Objectives
    const objectivesTitle = this.scene.add.text(0, 40, 'Objectives:', {
      fontSize: '16px',
      fill: '#00ff00',
      fontStyle: 'bold'
    });
    objectivesTitle.setOrigin(0.5);
    introContainer.add(objectivesTitle);
    
    challenge.objectives.forEach((objective, index) => {
      const objectiveText = this.scene.add.text(0, 60 + (index * 20), `• ${objective}`, {
        fontSize: '14px',
        fill: '#ffffff'
      });
      objectiveText.setOrigin(0.5);
      introContainer.add(objectiveText);
    });
    
    // Start prompt
    const startPrompt = this.scene.add.text(0, 180, 'Press SPACE to start', {
      fontSize: '18px',
      fill: '#ffff00',
      fontStyle: 'bold'
    });
    startPrompt.setOrigin(0.5);
    introContainer.add(startPrompt);
    
    // Animate introduction
    introContainer.setAlpha(0);
    introContainer.setScale(0.5);
    
    this.scene.tweens.add({
      targets: introContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1000,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.time.delayedCall(3000, () => {
          this.scene.tweens.add({
            targets: introContainer,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 500,
            onComplete: () => introContainer.destroy()
          });
        });
      }
    });
  }

  spawnChallengeBoss() {
    if (this.currentChallenge === 'BOSS_RUSH') {
      const bossTypes = ['ALIEN_QUEEN', 'SPACE_DRAGON', 'CYBER_TITAN', 'VOID_LORD', 'NEBULA_BEAST', 'CRYSTAL_GOLEM', 'SHADOW_WRAITH', 'MECHANICAL_LEVIATHAN'];
      const randomBoss = Phaser.Utils.Array.GetRandom(bossTypes);
      this.scene.bossSystem.spawnBoss(randomBoss);
    }
  }

  regenerateHealth() {
    if (this.scene.player && this.scene.player.health < 100) {
      this.scene.player.health = Math.min(100, this.scene.player.health + 5);
      this.scene.updateHealthBar();
    }
  }

  increaseDifficulty() {
    // Increase enemy spawn rate
    this.scene.time.removeAllEvents();
    this.scene.time.addEvent({
      delay: Math.max(200, this.scene.time.now - 1000),
      callback: this.scene.spawnEnemy,
      callbackScope: this.scene,
      loop: true
    });
  }

  checkChallengeObjectives() {
    if (!this.currentChallenge) return;
    
    const challenge = this.challengeData[this.currentChallenge];
    const objectives = challenge.objectives;
    const completed = [];
    
    objectives.forEach(objective => {
      if (this.isObjectiveComplete(objective)) {
        completed.push(objective);
      }
    });
    
    return {
      total: objectives.length,
      completed: completed.length,
      percentage: (completed.length / objectives.length) * 100
    };
  }

  isObjectiveComplete(objective) {
    switch (objective) {
      case 'Survive for 5 minutes':
        return this.scene.time.now >= 300000;
      case 'Kill 50 enemies':
        return this.scene.gameStats.enemiesKilled >= 50;
      case 'Don\'t die':
        return this.scene.player.health > 0;
      case 'Complete in under 2 minutes':
        return this.scene.time.now <= 120000;
      case 'Kill all enemies':
        return this.scene.enemies.children.entries.length === 0;
      case 'Don\'t take damage':
        return this.scene.gameStats.damageTaken === 0;
      case 'Don\'t shoot any bullets':
        return this.scene.gameStats.shotsFired === 0;
      case 'Survive for 3 minutes':
        return this.scene.time.now >= 180000;
      case 'Use only power-ups':
        return this.scene.gameStats.powerUpsCollected > 0;
      case 'Defeat all 8 bosses':
        return this.scene.gameStats.bossesKilled >= 8;
      case 'Complete in under 10 minutes':
        return this.scene.time.now <= 600000;
      case 'Reach wave 10':
        return this.scene.gameStats.enemiesKilled >= 100;
      case 'Get the highest score':
        return this.scene.score >= 10000;
      default:
        return false;
    }
  }

  endChallenge(reason) {
    if (!this.currentChallenge) return;
    
    const challenge = this.challengeData[this.currentChallenge];
    const objectives = this.checkChallengeObjectives();
    
    this.showChallengeResults(challenge, objectives, reason);
    this.currentChallenge = null;
  }

  showChallengeResults(challenge, objectives, reason) {
    const resultsContainer = this.scene.add.container(this.scene.scale.width / 2, this.scene.scale.height / 2);
    resultsContainer.setDepth(1000);
    
    // Background
    const background = this.scene.add.rectangle(0, 0, 600, 400, 0x000000, 0.9);
    background.setStrokeStyle(3, objectives.percentage === 100 ? 0x00ff00 : 0xff0000);
    resultsContainer.add(background);
    
    // Results title
    const resultsTitle = this.scene.add.text(0, -150, 'Challenge Results', {
      fontSize: '32px',
      fill: objectives.percentage === 100 ? '#00ff00' : '#ff0000',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    resultsTitle.setOrigin(0.5);
    resultsContainer.add(resultsTitle);
    
    // Challenge name
    const challengeName = this.scene.add.text(0, -100, challenge.name, {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold'
    });
    challengeName.setOrigin(0.5);
    resultsContainer.add(challengeName);
    
    // Objectives progress
    const objectivesText = this.scene.add.text(0, -50, `Objectives: ${objectives.completed}/${objectives.total}`, {
      fontSize: '20px',
      fill: '#ffff00'
    });
    objectivesText.setOrigin(0.5);
    resultsContainer.add(objectivesText);
    
    // Score
    const scoreText = this.scene.add.text(0, -10, `Score: ${this.scene.score}`, {
      fontSize: '18px',
      fill: '#ffffff'
    });
    scoreText.setOrigin(0.5);
    resultsContainer.add(scoreText);
    
    // Rewards
    if (objectives.percentage === 100) {
      const rewardsText = this.scene.add.text(0, 30, `Rewards: +${challenge.rewards.score} Score, +${challenge.rewards.experience} XP`, {
        fontSize: '16px',
        fill: '#00ff00'
      });
      rewardsText.setOrigin(0.5);
      resultsContainer.add(rewardsText);
    }
    
    // Continue prompt
    const continuePrompt = this.scene.add.text(0, 150, 'Press SPACE to continue', {
      fontSize: '18px',
      fill: '#ffff00',
      fontStyle: 'bold'
    });
    continuePrompt.setOrigin(0.5);
    resultsContainer.add(continuePrompt);
    
    // Animate results
    resultsContainer.setAlpha(0);
    resultsContainer.setScale(0.5);
    
    this.scene.tweens.add({
      targets: resultsContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1000,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.time.delayedCall(3000, () => {
          this.scene.tweens.add({
            targets: resultsContainer,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 500,
            onComplete: () => resultsContainer.destroy()
          });
        });
      }
    });
  }

  getCurrentChallenge() {
    return this.currentChallenge;
  }

  getAllChallenges() {
    return Object.keys(this.challengeData).map(key => ({
      key,
      ...this.challengeData[key]
    }));
  }

  getChallengeData(challengeType) {
    return this.challengeData[challengeType];
  }

  isChallengeActive() {
    return this.currentChallenge !== null;
  }

  getChallengeProgress() {
    if (!this.currentChallenge) return null;
    
    const challenge = this.challengeData[this.currentChallenge];
    const objectives = this.checkChallengeObjectives();
    
    return {
      challenge: challenge.name,
      objectives: objectives,
      timeElapsed: this.scene.time.now,
      score: this.scene.score
    };
  }
}
