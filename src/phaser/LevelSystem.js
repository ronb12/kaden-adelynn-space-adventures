// Level System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class LevelSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentLevel = 1;
    this.maxLevel = 12;
    this.levelData = {
      1: {
        name: 'Asteroid Field',
        emoji: '☄️',
        description: 'Navigate through dangerous asteroid field',
        background: 'asteroid_field',
        enemies: ['BASIC', 'FAST'],
        boss: null,
        powerUps: ['HEALTH', 'SHIELD'],
        difficulty: 1,
        duration: 60000
      },
      2: {
        name: 'Nebula Zone',
        emoji: '🌌',
        description: 'Fight through colorful nebula clouds',
        background: 'nebula_zone',
        enemies: ['BASIC', 'FAST', 'TANK'],
        boss: null,
        powerUps: ['HEALTH', 'SHIELD', 'SPEED'],
        difficulty: 2,
        duration: 90000
      },
      3: {
        name: 'Space Station',
        emoji: '🛰️',
        description: 'Assault the enemy space station',
        background: 'space_station',
        enemies: ['BASIC', 'FAST', 'TANK', 'ZIGZAG'],
        boss: 'ALIEN_QUEEN',
        powerUps: ['HEALTH', 'SHIELD', 'SPEED', 'MULTI_SHOT'],
        difficulty: 3,
        duration: 120000
      },
      4: {
        name: 'Crystal Caves',
        emoji: '💎',
        description: 'Explore mysterious crystal formations',
        background: 'crystal_caves',
        enemies: ['BASIC', 'FAST', 'TANK', 'ZIGZAG', 'CIRCLE'],
        boss: 'CRYSTAL_GOLEM',
        powerUps: ['HEALTH', 'SHIELD', 'SPEED', 'MULTI_SHOT', 'RAPID_FIRE'],
        difficulty: 4,
        duration: 150000
      },
      5: {
        name: 'Void Dimension',
        emoji: '👽',
        description: 'Enter the mysterious void dimension',
        background: 'void_dimension',
        enemies: ['BASIC', 'FAST', 'TANK', 'ZIGZAG', 'CIRCLE', 'SINE'],
        boss: 'VOID_LORD',
        powerUps: ['HEALTH', 'SHIELD', 'SPEED', 'MULTI_SHOT', 'RAPID_FIRE', 'SPREAD_SHOT'],
        difficulty: 5,
        duration: 180000
      },
      6: {
        name: 'Dragon\'s Lair',
        emoji: '🐉',
        description: 'Face the ancient space dragon',
        background: 'dragons_lair',
        enemies: ['BASIC', 'FAST', 'TANK', 'ZIGZAG', 'CIRCLE', 'SINE', 'CHARGER'],
        boss: 'SPACE_DRAGON',
        powerUps: ['HEALTH', 'SHIELD', 'SPEED', 'MULTI_SHOT', 'RAPID_FIRE', 'SPREAD_SHOT', 'PIERCE_SHOT'],
        difficulty: 6,
        duration: 210000
      },
      7: {
        name: 'Shadow Realm',
        emoji: '👻',
        description: 'Battle in the ethereal shadow realm',
        background: 'shadow_realm',
        enemies: ['BASIC', 'FAST', 'TANK', 'ZIGZAG', 'CIRCLE', 'SINE', 'CHARGER', 'BOMBER'],
        boss: 'SHADOW_WRAITH',
        powerUps: ['HEALTH', 'SHIELD', 'SPEED', 'MULTI_SHOT', 'RAPID_FIRE', 'SPREAD_SHOT', 'PIERCE_SHOT', 'HOMING_SHOT'],
        difficulty: 7,
        duration: 240000
      },
      8: {
        name: 'Nebula Core',
        emoji: '🌌',
        description: 'Reach the heart of the nebula',
        background: 'nebula_core',
        enemies: ['BASIC', 'FAST', 'TANK', 'ZIGZAG', 'CIRCLE', 'SINE', 'CHARGER', 'BOMBER', 'SPLITTER'],
        boss: 'NEBULA_BEAST',
        powerUps: ['HEALTH', 'SHIELD', 'SPEED', 'MULTI_SHOT', 'RAPID_FIRE', 'SPREAD_SHOT', 'PIERCE_SHOT', 'HOMING_SHOT', 'FREEZE'],
        difficulty: 8,
        duration: 270000
      },
      9: {
        name: 'Cyber Fortress',
        emoji: '🤖',
        description: 'Infiltrate the robotic fortress',
        background: 'cyber_fortress',
        enemies: ['BASIC', 'FAST', 'TANK', 'ZIGZAG', 'CIRCLE', 'SINE', 'CHARGER', 'BOMBER', 'SPLITTER', 'HOMING'],
        boss: 'CYBER_TITAN',
        powerUps: ['HEALTH', 'SHIELD', 'SPEED', 'MULTI_SHOT', 'RAPID_FIRE', 'SPREAD_SHOT', 'PIERCE_SHOT', 'HOMING_SHOT', 'FREEZE', 'INVINCIBLE'],
        difficulty: 9,
        duration: 300000
      },
      10: {
        name: 'Abyssal Depths',
        emoji: '🐋',
        description: 'Dive into the deepest space abyss',
        background: 'abyssal_depths',
        enemies: ['BASIC', 'FAST', 'TANK', 'ZIGZAG', 'CIRCLE', 'SINE', 'CHARGER', 'BOMBER', 'SPLITTER', 'HOMING', 'TELEPORT'],
        boss: 'MECHANICAL_LEVIATHAN',
        powerUps: ['HEALTH', 'SHIELD', 'SPEED', 'MULTI_SHOT', 'RAPID_FIRE', 'SPREAD_SHOT', 'PIERCE_SHOT', 'HOMING_SHOT', 'FREEZE', 'INVINCIBLE', 'MAGNET'],
        difficulty: 10,
        duration: 330000
      },
      11: {
        name: 'Cosmic Storm',
        emoji: '⚡',
        description: 'Survive the ultimate cosmic storm',
        background: 'cosmic_storm',
        enemies: ['BASIC', 'FAST', 'TANK', 'ZIGZAG', 'CIRCLE', 'SINE', 'CHARGER', 'BOMBER', 'SPLITTER', 'HOMING', 'TELEPORT', 'SHIELD'],
        boss: 'VOID_LORD',
        powerUps: ['HEALTH', 'SHIELD', 'SPEED', 'MULTI_SHOT', 'RAPID_FIRE', 'SPREAD_SHOT', 'PIERCE_SHOT', 'HOMING_SHOT', 'FREEZE', 'INVINCIBLE', 'MAGNET', 'EXPLOSIVE'],
        difficulty: 11,
        duration: 360000
      },
      12: {
        name: 'Final Confrontation',
        emoji: '👑',
        description: 'The ultimate battle for the galaxy',
        background: 'final_battle',
        enemies: ['BASIC', 'FAST', 'TANK', 'ZIGZAG', 'CIRCLE', 'SINE', 'CHARGER', 'BOMBER', 'SPLITTER', 'HOMING', 'TELEPORT', 'SHIELD', 'SWARM', 'ELITE'],
        boss: 'ALIEN_QUEEN',
        powerUps: ['HEALTH', 'SHIELD', 'SPEED', 'MULTI_SHOT', 'RAPID_FIRE', 'SPREAD_SHOT', 'PIERCE_SHOT', 'HOMING_SHOT', 'FREEZE', 'INVINCIBLE', 'MAGNET', 'EXPLOSIVE', 'LASER', 'TIME_SLOW', 'SCORE_BOOST'],
        difficulty: 12,
        duration: 420000
      }
    };
  }

  getCurrentLevelData() {
    return this.levelData[this.currentLevel];
  }

  getLevelData(level) {
    return this.levelData[level];
  }

  advanceLevel() {
    if (this.currentLevel < this.maxLevel) {
      this.currentLevel++;
      return true;
    }
    return false;
  }

  setLevel(level) {
    if (level >= 1 && level <= this.maxLevel) {
      this.currentLevel = level;
    }
  }

  createLevelBackground() {
    const levelData = this.getCurrentLevelData();
    const background = this.scene.add.graphics();
    
    switch (levelData.background) {
      case 'asteroid_field':
        this.createAsteroidFieldBackground(background);
        break;
      case 'nebula_zone':
        this.createNebulaZoneBackground(background);
        break;
      case 'space_station':
        this.createSpaceStationBackground(background);
        break;
      case 'crystal_caves':
        this.createCrystalCavesBackground(background);
        break;
      case 'void_dimension':
        this.createVoidDimensionBackground(background);
        break;
      case 'dragons_lair':
        this.createDragonsLairBackground(background);
        break;
      case 'shadow_realm':
        this.createShadowRealmBackground(background);
        break;
      case 'nebula_core':
        this.createNebulaCoreBackground(background);
        break;
      case 'cyber_fortress':
        this.createCyberFortressBackground(background);
        break;
      case 'abyssal_depths':
        this.createAbyssalDepthsBackground(background);
        break;
      case 'cosmic_storm':
        this.createCosmicStormBackground(background);
        break;
      case 'final_battle':
        this.createFinalBattleBackground(background);
        break;
      default:
        this.createDefaultBackground(background);
        break;
    }
    
    return background;
  }

  createAsteroidFieldBackground(graphics) {
    // Create asteroid field background
    graphics.fillGradientStyle(0x000033, 0x000066, 0x000099, 0x0000cc);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    
    // Add floating asteroids
    for (let i = 0; i < 20; i++) {
      const asteroid = this.scene.add.circle(
        Phaser.Math.Between(0, this.scene.scale.width),
        Phaser.Math.Between(0, this.scene.scale.height),
        Phaser.Math.Between(5, 15),
        0x666666,
        0.8
      );
      
      this.scene.tweens.add({
        targets: asteroid,
        x: asteroid.x + Phaser.Math.Between(-50, 50),
        y: asteroid.y + Phaser.Math.Between(-50, 50),
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createNebulaZoneBackground(graphics) {
    // Create nebula zone background
    graphics.fillGradientStyle(0x440088, 0x8800ff, 0xff00ff, 0x00ffff);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    
    // Add nebula clouds
    for (let i = 0; i < 15; i++) {
      const cloud = this.scene.add.circle(
        Phaser.Math.Between(0, this.scene.scale.width),
        Phaser.Math.Between(0, this.scene.scale.height),
        Phaser.Math.Between(30, 80),
        0x8800ff,
        0.3
      );
      
      this.scene.tweens.add({
        targets: cloud,
        alpha: 0.1,
        duration: Phaser.Math.Between(4000, 8000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createSpaceStationBackground(graphics) {
    // Create space station background
    graphics.fillGradientStyle(0x000066, 0x000099, 0x0000cc, 0x0000ff);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    
    // Add station lights
    for (let i = 0; i < 30; i++) {
      const light = this.scene.add.circle(
        Phaser.Math.Between(0, this.scene.scale.width),
        Phaser.Math.Between(0, this.scene.scale.height),
        Phaser.Math.Between(2, 6),
        0x00ffff,
        0.8
      );
      
      this.scene.tweens.add({
        targets: light,
        alpha: 0.2,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createCrystalCavesBackground(graphics) {
    // Create crystal caves background
    graphics.fillGradientStyle(0x000044, 0x000088, 0x0000cc, 0x0000ff);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    
    // Add crystal formations
    for (let i = 0; i < 25; i++) {
      const crystal = this.scene.add.circle(
        Phaser.Math.Between(0, this.scene.scale.width),
        Phaser.Math.Between(0, this.scene.scale.height),
        Phaser.Math.Between(10, 25),
        0x00ffff,
        0.6
      );
      
      this.scene.tweens.add({
        targets: crystal,
        scaleX: 1.5,
        scaleY: 1.5,
        alpha: 0.3,
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createVoidDimensionBackground(graphics) {
    // Create void dimension background
    graphics.fillGradientStyle(0x000000, 0x220022, 0x440044, 0x660066);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    
    // Add void portals
    for (let i = 0; i < 10; i++) {
      const portal = this.scene.add.circle(
        Phaser.Math.Between(0, this.scene.scale.width),
        Phaser.Math.Between(0, this.scene.scale.height),
        Phaser.Math.Between(20, 40),
        0x8800ff,
        0.4
      );
      
      this.scene.tweens.add({
        targets: portal,
        rotation: Math.PI * 2,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        ease: 'Linear'
      });
    }
  }

  createDragonsLairBackground(graphics) {
    // Create dragon's lair background
    graphics.fillGradientStyle(0x440000, 0x880000, 0xcc0000, 0xff0000);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    
    // Add fire effects
    for (let i = 0; i < 20; i++) {
      const fire = this.scene.add.circle(
        Phaser.Math.Between(0, this.scene.scale.width),
        Phaser.Math.Between(0, this.scene.scale.height),
        Phaser.Math.Between(5, 15),
        0xff4400,
        0.7
      );
      
      this.scene.tweens.add({
        targets: fire,
        y: fire.y - 20,
        alpha: 0.2,
        duration: Phaser.Math.Between(1000, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createShadowRealmBackground(graphics) {
    // Create shadow realm background
    graphics.fillGradientStyle(0x000000, 0x220022, 0x440044, 0x660066);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    
    // Add shadow wisps
    for (let i = 0; i < 15; i++) {
      const wisp = this.scene.add.circle(
        Phaser.Math.Between(0, this.scene.scale.width),
        Phaser.Math.Between(0, this.scene.scale.height),
        Phaser.Math.Between(8, 20),
        0x440088,
        0.5
      );
      
      this.scene.tweens.add({
        targets: wisp,
        x: wisp.x + Phaser.Math.Between(-100, 100),
        y: wisp.y + Phaser.Math.Between(-100, 100),
        alpha: 0.1,
        duration: Phaser.Math.Between(4000, 8000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createNebulaCoreBackground(graphics) {
    // Create nebula core background
    graphics.fillGradientStyle(0x220022, 0x440044, 0x660066, 0x880088);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    
    // Add core energy
    for (let i = 0; i < 20; i++) {
      const energy = this.scene.add.circle(
        Phaser.Math.Between(0, this.scene.scale.width),
        Phaser.Math.Between(0, this.scene.scale.height),
        Phaser.Math.Between(15, 35),
        0xff00ff,
        0.6
      );
      
      this.scene.tweens.add({
        targets: energy,
        scaleX: 2,
        scaleY: 2,
        alpha: 0.2,
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createCyberFortressBackground(graphics) {
    // Create cyber fortress background
    graphics.fillGradientStyle(0x000044, 0x000088, 0x0000cc, 0x0000ff);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    
    // Add cyber elements
    for (let i = 0; i < 25; i++) {
      const element = this.scene.add.rectangle(
        Phaser.Math.Between(0, this.scene.scale.width),
        Phaser.Math.Between(0, this.scene.scale.height),
        Phaser.Math.Between(10, 30),
        Phaser.Math.Between(10, 30),
        0x00ffff,
        0.8
      );
      
      this.scene.tweens.add({
        targets: element,
        rotation: Math.PI * 2,
        duration: Phaser.Math.Between(2000, 4000),
        repeat: -1,
        ease: 'Linear'
      });
    }
  }

  createAbyssalDepthsBackground(graphics) {
    // Create abyssal depths background
    graphics.fillGradientStyle(0x000000, 0x000022, 0x000044, 0x000066);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    
    // Add depth effects
    for (let i = 0; i < 30; i++) {
      const depth = this.scene.add.circle(
        Phaser.Math.Between(0, this.scene.scale.width),
        Phaser.Math.Between(0, this.scene.scale.height),
        Phaser.Math.Between(3, 8),
        0x0066ff,
        0.4
      );
      
      this.scene.tweens.add({
        targets: depth,
        alpha: 0.1,
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createCosmicStormBackground(graphics) {
    // Create cosmic storm background
    graphics.fillGradientStyle(0x220022, 0x440044, 0x660066, 0x880088);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    
    // Add storm effects
    for (let i = 0; i < 40; i++) {
      const storm = this.scene.add.circle(
        Phaser.Math.Between(0, this.scene.scale.width),
        Phaser.Math.Between(0, this.scene.scale.height),
        Phaser.Math.Between(2, 6),
        0xffff00,
        0.8
      );
      
      this.scene.tweens.add({
        targets: storm,
        x: storm.x + Phaser.Math.Between(-200, 200),
        y: storm.y + Phaser.Math.Between(-200, 200),
        alpha: 0.1,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createFinalBattleBackground(graphics) {
    // Create final battle background
    graphics.fillGradientStyle(0x000000, 0x220022, 0x440044, 0x660066);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    
    // Add epic effects
    for (let i = 0; i < 50; i++) {
      const effect = this.scene.add.circle(
        Phaser.Math.Between(0, this.scene.scale.width),
        Phaser.Math.Between(0, this.scene.scale.height),
        Phaser.Math.Between(1, 4),
        0xffffff,
        0.9
      );
      
      this.scene.tweens.add({
        targets: effect,
        alpha: 0.2,
        duration: Phaser.Math.Between(500, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createDefaultBackground(graphics) {
    // Create default space background
    graphics.fillGradientStyle(0x000033, 0x000066, 0x000099, 0x0000cc);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
  }

  showLevelIntroduction() {
    const levelData = this.getCurrentLevelData();
    
    // Create level introduction
    const introContainer = this.scene.add.container(this.scene.scale.width / 2, this.scene.scale.height / 2);
    
    // Background
    const introBg = this.scene.add.rectangle(0, 0, 600, 300, 0x000000, 0.8);
    introBg.setStrokeStyle(3, 0x00aaff);
    introContainer.add(introBg);
    
    // Level name
    const levelName = this.scene.add.text(0, -80, `Level ${this.currentLevel}: ${levelData.name}`, {
      fontSize: '32px',
      fill: '#00aaff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    });
    levelName.setOrigin(0.5);
    introContainer.add(levelName);
    
    // Level emoji
    const levelEmoji = this.scene.add.text(0, -40, levelData.emoji, {
      fontSize: '64px'
    });
    levelEmoji.setOrigin(0.5);
    introContainer.add(levelEmoji);
    
    // Level description
    const levelDesc = this.scene.add.text(0, 20, levelData.description, {
      fontSize: '18px',
      fill: '#ffffff',
      align: 'center'
    });
    levelDesc.setOrigin(0.5);
    introContainer.add(levelDesc);
    
    // Difficulty indicator
    const difficulty = this.scene.add.text(0, 60, `Difficulty: ${'★'.repeat(levelData.difficulty)}`, {
      fontSize: '16px',
      fill: '#ffff00'
    });
    difficulty.setOrigin(0.5);
    introContainer.add(difficulty);
    
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

  getLevelProgress() {
    return {
      current: this.currentLevel,
      max: this.maxLevel,
      percentage: (this.currentLevel / this.maxLevel) * 100
    };
  }

  getAllLevels() {
    return Object.keys(this.levelData).map(level => ({
      level: parseInt(level),
      ...this.levelData[level]
    }));
  }

  isLevelComplete() {
    return this.currentLevel >= this.maxLevel;
  }

  getNextLevel() {
    if (this.currentLevel < this.maxLevel) {
      return this.currentLevel + 1;
    }
    return null;
  }
}
