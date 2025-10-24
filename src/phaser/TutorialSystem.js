// Tutorial System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class TutorialSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentTutorial = null;
    this.tutorialStep = 0;
    this.isInTutorial = false;
    this.tutorialData = {
      basic_controls: {
        name: 'Basic Controls',
        emoji: '🎮',
        description: 'Learn the basic controls for movement and shooting',
        steps: [
          {
            id: 'movement',
            title: 'Movement',
            text: 'Use WASD or Arrow Keys to move your ship around',
            emoji: '⬅️➡️⬆️⬇️',
            action: 'highlight_controls',
            duration: 3000
          },
          {
            id: 'shooting',
            title: 'Shooting',
            text: 'Press SPACE to shoot at enemies',
            emoji: '🔫',
            action: 'highlight_shoot',
            duration: 3000
          },
          {
            id: 'enemies',
            title: 'Enemies',
            text: 'Avoid red enemies and shoot them to earn points',
            emoji: '👾',
            action: 'highlight_enemies',
            duration: 4000
          }
        ]
      },
      power_ups: {
        name: 'Power-ups',
        emoji: '💎',
        description: 'Learn about power-ups and how to collect them',
        steps: [
          {
            id: 'power_up_intro',
            title: 'Power-ups',
            text: 'Green items are power-ups that give you special abilities',
            emoji: '💎',
            action: 'highlight_power_ups',
            duration: 3000
          },
          {
            id: 'health_power_up',
            title: 'Health Power-up',
            text: 'Red hearts restore your health',
            emoji: '❤️',
            action: 'highlight_health',
            duration: 3000
          },
          {
            id: 'shield_power_up',
            title: 'Shield Power-up',
            text: 'Blue shields protect you from damage',
            emoji: '🛡️',
            action: 'highlight_shield',
            duration: 3000
          },
          {
            id: 'weapon_power_up',
            title: 'Weapon Power-up',
            text: 'Yellow stars upgrade your weapons',
            emoji: '⭐',
            action: 'highlight_weapon',
            duration: 3000
          }
        ]
      },
      weapons: {
        name: 'Weapons',
        emoji: '🔫',
        description: 'Learn about different weapons and how to use them',
        steps: [
          {
            id: 'basic_weapon',
            title: 'Basic Weapon',
            text: 'Your basic blaster fires single shots',
            emoji: '🔫',
            action: 'highlight_basic_weapon',
            duration: 3000
          },
          {
            id: 'spread_shot',
            title: 'Spread Shot',
            text: 'Spread shot fires multiple bullets in a spread pattern',
            emoji: '🌟',
            action: 'highlight_spread_shot',
            duration: 3000
          },
          {
            id: 'laser',
            title: 'Laser',
            text: 'Laser weapons deal high damage but fire slowly',
            emoji: '🔴',
            action: 'highlight_laser',
            duration: 3000
          },
          {
            id: 'homing_missiles',
            title: 'Homing Missiles',
            text: 'Homing missiles track enemies automatically',
            emoji: '🎯',
            action: 'highlight_homing',
            duration: 3000
          }
        ]
      },
      enemies: {
        name: 'Enemies',
        emoji: '👾',
        description: 'Learn about different enemy types and how to defeat them',
        steps: [
          {
            id: 'basic_enemy',
            title: 'Basic Enemy',
            text: 'Red squares are basic enemies. They move slowly and are easy to defeat',
            emoji: '👾',
            action: 'highlight_basic_enemy',
            duration: 3000
          },
          {
            id: 'fast_enemy',
            title: 'Fast Enemy',
            text: 'Fast enemies move quickly and are harder to hit',
            emoji: '💨',
            action: 'highlight_fast_enemy',
            duration: 3000
          },
          {
            id: 'tank_enemy',
            title: 'Tank Enemy',
            text: 'Tank enemies have more health and take multiple hits to destroy',
            emoji: '🛡️',
            action: 'highlight_tank_enemy',
            duration: 3000
          },
          {
            id: 'boss_enemy',
            title: 'Boss Enemy',
            text: 'Boss enemies are large and powerful. They require strategy to defeat',
            emoji: '👑',
            action: 'highlight_boss_enemy',
            duration: 4000
          }
        ]
      },
      combos: {
        name: 'Combos',
        emoji: '🔥',
        description: 'Learn about combo systems and how to achieve high scores',
        steps: [
          {
            id: 'combo_intro',
            title: 'Combo System',
            text: 'Destroying enemies in quick succession builds up your combo multiplier',
            emoji: '🔥',
            action: 'highlight_combo',
            duration: 3000
          },
          {
            id: 'combo_benefits',
            title: 'Combo Benefits',
            text: 'Higher combos give you more points and special effects',
            emoji: '⭐',
            action: 'highlight_combo_benefits',
            duration: 3000
          },
          {
            id: 'combo_maintenance',
            title: 'Maintaining Combos',
            text: 'Don\'t let too much time pass between kills to maintain your combo',
            emoji: '⏰',
            action: 'highlight_combo_timer',
            duration: 3000
          }
        ]
      },
      achievements: {
        name: 'Achievements',
        emoji: '🏆',
        description: 'Learn about achievements and how to unlock them',
        steps: [
          {
            id: 'achievement_intro',
            title: 'Achievements',
            text: 'Achievements are special goals you can complete for rewards',
            emoji: '🏆',
            action: 'highlight_achievements',
            duration: 3000
          },
          {
            id: 'achievement_types',
            title: 'Achievement Types',
            text: 'There are different types of achievements: combat, survival, and special',
            emoji: '📋',
            action: 'highlight_achievement_types',
            duration: 3000
          },
          {
            id: 'achievement_rewards',
            title: 'Achievement Rewards',
            text: 'Completing achievements gives you experience points and score bonuses',
            emoji: '🎁',
            action: 'highlight_achievement_rewards',
            duration: 3000
          }
        ]
      }
    };
  }

  startTutorial(tutorialType) {
    const tutorial = this.tutorialData[tutorialType];
    if (!tutorial) return false;
    
    this.currentTutorial = tutorialType;
    this.tutorialStep = 0;
    this.isInTutorial = true;
    
    this.showTutorialIntroduction(tutorial);
    return true;
  }

  showTutorialIntroduction(tutorial) {
    const introContainer = this.scene.add.container(this.scene.scale.width / 2, this.scene.scale.height / 2);
    introContainer.setDepth(1000);
    
    // Background
    const background = this.scene.add.rectangle(0, 0, 600, 300, 0x000000, 0.9);
    background.setStrokeStyle(3, 0x00aaff);
    introContainer.add(background);
    
    // Tutorial name
    const tutorialName = this.scene.add.text(0, -100, tutorial.name, {
      fontSize: '32px',
      fill: '#00aaff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    tutorialName.setOrigin(0.5);
    introContainer.add(tutorialName);
    
    // Tutorial emoji
    const tutorialEmoji = this.scene.add.text(0, -50, tutorial.emoji, {
      fontSize: '64px'
    });
    tutorialEmoji.setOrigin(0.5);
    introContainer.add(tutorialEmoji);
    
    // Tutorial description
    const tutorialDesc = this.scene.add.text(0, 20, tutorial.description, {
      fontSize: '18px',
      fill: '#ffffff',
      align: 'center'
    });
    tutorialDesc.setOrigin(0.5);
    introContainer.add(tutorialDesc);
    
    // Start prompt
    const startPrompt = this.scene.add.text(0, 100, 'Press SPACE to start tutorial', {
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
            onComplete: () => {
              introContainer.destroy();
              this.nextTutorialStep();
            }
          });
        });
      }
    });
  }

  nextTutorialStep() {
    const tutorial = this.tutorialData[this.currentTutorial];
    const step = tutorial.steps[this.tutorialStep];
    
    if (!step) {
      this.endTutorial();
      return;
    }
    
    this.showTutorialStep(step);
  }

  showTutorialStep(step) {
    const stepContainer = this.scene.add.container(this.scene.scale.width / 2, this.scene.scale.height / 2);
    stepContainer.setDepth(1000);
    
    // Background
    const background = this.scene.add.rectangle(0, 0, 500, 200, 0x000000, 0.9);
    background.setStrokeStyle(2, 0x00aaff);
    stepContainer.add(background);
    
    // Step title
    const stepTitle = this.scene.add.text(0, -60, step.title, {
      fontSize: '24px',
      fill: '#00aaff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    });
    stepTitle.setOrigin(0.5);
    stepContainer.add(stepTitle);
    
    // Step emoji
    const stepEmoji = this.scene.add.text(0, -20, step.emoji, {
      fontSize: '32px'
    });
    stepEmoji.setOrigin(0.5);
    stepContainer.add(stepEmoji);
    
    // Step text
    const stepText = this.scene.add.text(0, 20, step.text, {
      fontSize: '16px',
      fill: '#ffffff',
      align: 'center'
    });
    stepText.setOrigin(0.5);
    stepContainer.add(stepText);
    
    // Continue prompt
    const continuePrompt = this.scene.add.text(0, 70, 'Press SPACE to continue', {
      fontSize: '14px',
      fill: '#ffff00'
    });
    continuePrompt.setOrigin(0.5);
    stepContainer.add(continuePrompt);
    
    // Animate step
    stepContainer.setAlpha(0);
    stepContainer.setScale(0.5);
    
    this.scene.tweens.add({
      targets: stepContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.time.delayedCall(step.duration, () => {
          this.scene.tweens.add({
            targets: stepContainer,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 300,
            onComplete: () => {
              stepContainer.destroy();
              this.tutorialStep++;
              this.nextTutorialStep();
            }
          });
        });
      }
    });
    
    // Handle continue input
    const continueKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const continueHandler = () => {
      continueKey.off('down', continueHandler);
      this.scene.tweens.add({
        targets: stepContainer,
        alpha: 0,
        scaleX: 0.5,
        scaleY: 0.5,
        duration: 300,
        onComplete: () => {
          stepContainer.destroy();
          this.tutorialStep++;
          this.nextTutorialStep();
        }
      });
    };
    continueKey.on('down', continueHandler);
    
    // Execute step action
    this.executeTutorialAction(step.action);
  }

  executeTutorialAction(action) {
    switch (action) {
      case 'highlight_controls':
        this.highlightControls();
        break;
      case 'highlight_shoot':
        this.highlightShoot();
        break;
      case 'highlight_enemies':
        this.highlightEnemies();
        break;
      case 'highlight_power_ups':
        this.highlightPowerUps();
        break;
      case 'highlight_health':
        this.highlightHealth();
        break;
      case 'highlight_shield':
        this.highlightShield();
        break;
      case 'highlight_weapon':
        this.highlightWeapon();
        break;
      case 'highlight_basic_weapon':
        this.highlightBasicWeapon();
        break;
      case 'highlight_spread_shot':
        this.highlightSpreadShot();
        break;
      case 'highlight_laser':
        this.highlightLaser();
        break;
      case 'highlight_homing':
        this.highlightHoming();
        break;
      case 'highlight_basic_enemy':
        this.highlightBasicEnemy();
        break;
      case 'highlight_fast_enemy':
        this.highlightFastEnemy();
        break;
      case 'highlight_tank_enemy':
        this.highlightTankEnemy();
        break;
      case 'highlight_boss_enemy':
        this.highlightBossEnemy();
        break;
      case 'highlight_combo':
        this.highlightCombo();
        break;
      case 'highlight_combo_benefits':
        this.highlightComboBenefits();
        break;
      case 'highlight_combo_timer':
        this.highlightComboTimer();
        break;
      case 'highlight_achievements':
        this.highlightAchievements();
        break;
      case 'highlight_achievement_types':
        this.highlightAchievementTypes();
        break;
      case 'highlight_achievement_rewards':
        this.highlightAchievementRewards();
        break;
    }
  }

  highlightControls() {
    // Create highlight effect for controls
    const highlight = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height - 100,
      200,
      100,
      0x00ff00,
      0.3
    );
    highlight.setStrokeStyle(3, 0x00ff00);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightShoot() {
    // Create highlight effect for shoot button
    const highlight = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height - 50,
      100,
      50,
      0x00ff00,
      0.3
    );
    highlight.setStrokeStyle(3, 0x00ff00);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightEnemies() {
    // Create highlight effect for enemies
    this.scene.enemies.children.entries.forEach(enemy => {
      const highlight = this.scene.add.circle(
        enemy.x,
        enemy.y,
        enemy.width / 2 + 10,
        0xff0000,
        0.3
      );
      highlight.setStrokeStyle(3, 0xff0000);
      
      this.scene.time.delayedCall(3000, () => {
        highlight.destroy();
      });
    });
  }

  highlightPowerUps() {
    // Create highlight effect for power-ups
    this.scene.powerUps.children.entries.forEach(powerUp => {
      const highlight = this.scene.add.circle(
        powerUp.x,
        powerUp.y,
        powerUp.width / 2 + 10,
        0x00ff00,
        0.3
      );
      highlight.setStrokeStyle(3, 0x00ff00);
      
      this.scene.time.delayedCall(3000, () => {
        highlight.destroy();
      });
    });
  }

  highlightHealth() {
    // Create highlight effect for health power-up
    const highlight = this.scene.add.circle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      50,
      0xff0000,
      0.3
    );
    highlight.setStrokeStyle(3, 0xff0000);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightShield() {
    // Create highlight effect for shield power-up
    const highlight = this.scene.add.circle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      50,
      0x00aaff,
      0.3
    );
    highlight.setStrokeStyle(3, 0x00aaff);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightWeapon() {
    // Create highlight effect for weapon power-up
    const highlight = this.scene.add.circle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      50,
      0xffff00,
      0.3
    );
    highlight.setStrokeStyle(3, 0xffff00);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightBasicWeapon() {
    // Create highlight effect for basic weapon
    const highlight = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      100,
      20,
      0x00ff00,
      0.3
    );
    highlight.setStrokeStyle(3, 0x00ff00);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightSpreadShot() {
    // Create highlight effect for spread shot
    const highlight = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      150,
      20,
      0x00ff00,
      0.3
    );
    highlight.setStrokeStyle(3, 0x00ff00);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightLaser() {
    // Create highlight effect for laser
    const highlight = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      200,
      20,
      0xff0000,
      0.3
    );
    highlight.setStrokeStyle(3, 0xff0000);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightHoming() {
    // Create highlight effect for homing missiles
    const highlight = this.scene.add.circle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      50,
      0x00ff00,
      0.3
    );
    highlight.setStrokeStyle(3, 0x00ff00);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightBasicEnemy() {
    // Create highlight effect for basic enemy
    const highlight = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      40,
      40,
      0xff0000,
      0.3
    );
    highlight.setStrokeStyle(3, 0xff0000);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightFastEnemy() {
    // Create highlight effect for fast enemy
    const highlight = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      30,
      30,
      0xff0000,
      0.3
    );
    highlight.setStrokeStyle(3, 0xff0000);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightTankEnemy() {
    // Create highlight effect for tank enemy
    const highlight = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      60,
      60,
      0xff0000,
      0.3
    );
    highlight.setStrokeStyle(3, 0xff0000);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightBossEnemy() {
    // Create highlight effect for boss enemy
    const highlight = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      100,
      100,
      0xff0000,
      0.3
    );
    highlight.setStrokeStyle(3, 0xff0000);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightCombo() {
    // Create highlight effect for combo
    const highlight = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      'COMBO!',
      {
        fontSize: '32px',
        fill: '#ffff00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    highlight.setOrigin(0.5);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightComboBenefits() {
    // Create highlight effect for combo benefits
    const highlight = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      'BONUS POINTS!',
      {
        fontSize: '24px',
        fill: '#00ff00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }
    );
    highlight.setOrigin(0.5);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightComboTimer() {
    // Create highlight effect for combo timer
    const highlight = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      100,
      20,
      0xffff00,
      0.3
    );
    highlight.setStrokeStyle(3, 0xffff00);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightAchievements() {
    // Create highlight effect for achievements
    const highlight = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      200,
      100,
      0x00ff00,
      0.3
    );
    highlight.setStrokeStyle(3, 0x00ff00);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightAchievementTypes() {
    // Create highlight effect for achievement types
    const highlight = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      300,
      150,
      0x00ff00,
      0.3
    );
    highlight.setStrokeStyle(3, 0x00ff00);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  highlightAchievementRewards() {
    // Create highlight effect for achievement rewards
    const highlight = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      250,
      100,
      0x00ff00,
      0.3
    );
    highlight.setStrokeStyle(3, 0x00ff00);
    
    this.scene.time.delayedCall(3000, () => {
      highlight.destroy();
    });
  }

  endTutorial() {
    this.isInTutorial = false;
    this.currentTutorial = null;
    this.tutorialStep = 0;
    
    this.showTutorialComplete();
  }

  showTutorialComplete() {
    const completeContainer = this.scene.add.container(this.scene.scale.width / 2, this.scene.scale.height / 2);
    completeContainer.setDepth(1000);
    
    // Background
    const background = this.scene.add.rectangle(0, 0, 400, 200, 0x000000, 0.9);
    background.setStrokeStyle(3, 0x00ff00);
    completeContainer.add(background);
    
    // Complete message
    const completeMessage = this.scene.add.text(0, -50, 'Tutorial Complete!', {
      fontSize: '28px',
      fill: '#00ff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    completeMessage.setOrigin(0.5);
    completeContainer.add(completeMessage);
    
    // Continue prompt
    const continuePrompt = this.scene.add.text(0, 50, 'Press SPACE to continue', {
      fontSize: '18px',
      fill: '#ffff00',
      fontStyle: 'bold'
    });
    continuePrompt.setOrigin(0.5);
    completeContainer.add(continuePrompt);
    
    // Animate completion
    completeContainer.setAlpha(0);
    completeContainer.setScale(0.5);
    
    this.scene.tweens.add({
      targets: completeContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1000,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.time.delayedCall(2000, () => {
          this.scene.tweens.add({
            targets: completeContainer,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 500,
            onComplete: () => completeContainer.destroy()
          });
        });
      }
    });
  }

  getCurrentTutorial() {
    return this.currentTutorial;
  }

  isTutorialActive() {
    return this.isInTutorial;
  }

  getAllTutorials() {
    return Object.keys(this.tutorialData).map(key => ({
      key,
      ...this.tutorialData[key]
    }));
  }

  getTutorialData(tutorialType) {
    return this.tutorialData[tutorialType];
  }

  getTutorialProgress() {
    if (!this.currentTutorial) return null;
    
    const tutorial = this.tutorialData[this.currentTutorial];
    return {
      tutorial: tutorial.name,
      step: this.tutorialStep,
      totalSteps: tutorial.steps.length,
      progress: (this.tutorialStep / tutorial.steps.length) * 100
    };
  }
}
