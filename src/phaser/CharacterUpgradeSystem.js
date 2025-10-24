// Character Upgrade System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class CharacterUpgradeSystem {
  constructor(scene) {
    this.scene = scene;
    this.experience = 0;
    this.level = 1;
    this.skillPoints = 0;
    this.characterStats = {
      kaden: {
        name: 'Kaden',
        emoji: '👦',
        baseStats: {
          health: 100,
          speed: 200,
          damage: 1,
          fireRate: 500,
          defense: 0
        },
        skillTree: {
          combat: {
            name: 'Combat',
            emoji: '⚔️',
            skills: {
              damage_boost: { name: 'Damage Boost', emoji: '💥', maxLevel: 5, cost: 1, effect: 'damage' },
              fire_rate: { name: 'Fire Rate', emoji: '⚡', maxLevel: 5, cost: 1, effect: 'fireRate' },
              critical_hit: { name: 'Critical Hit', emoji: '🎯', maxLevel: 3, cost: 2, effect: 'criticalHit' },
              weapon_mastery: { name: 'Weapon Mastery', emoji: '🔫', maxLevel: 3, cost: 3, effect: 'weaponMastery' }
            }
          },
          survival: {
            name: 'Survival',
            emoji: '🛡️',
            skills: {
              health_boost: { name: 'Health Boost', emoji: '❤️', maxLevel: 5, cost: 1, effect: 'health' },
              shield_mastery: { name: 'Shield Mastery', emoji: '🛡️', maxLevel: 3, cost: 2, effect: 'shield' },
              regeneration: { name: 'Regeneration', emoji: '💚', maxLevel: 3, cost: 3, effect: 'regeneration' },
              damage_resistance: { name: 'Damage Resistance', emoji: '💪', maxLevel: 5, cost: 1, effect: 'resistance' }
            }
          },
          mobility: {
            name: 'Mobility',
            emoji: '💨',
            skills: {
              speed_boost: { name: 'Speed Boost', emoji: '⚡', maxLevel: 5, cost: 1, effect: 'speed' },
              dash: { name: 'Dash', emoji: '💨', maxLevel: 3, cost: 2, effect: 'dash' },
              evasion: { name: 'Evasion', emoji: '🌪️', maxLevel: 3, cost: 3, effect: 'evasion' },
              momentum: { name: 'Momentum', emoji: '🚀', maxLevel: 3, cost: 2, effect: 'momentum' }
            }
          },
          special: {
            name: 'Special',
            emoji: '✨',
            skills: {
              power_up_mastery: { name: 'Power-up Mastery', emoji: '💎', maxLevel: 3, cost: 2, effect: 'powerUpMastery' },
              combo_master: { name: 'Combo Master', emoji: '🔥', maxLevel: 3, cost: 3, effect: 'comboMaster' },
              score_multiplier: { name: 'Score Multiplier', emoji: '⭐', maxLevel: 5, cost: 1, effect: 'scoreMultiplier' },
              special_ability: { name: 'Special Ability', emoji: '🌟', maxLevel: 1, cost: 5, effect: 'specialAbility' }
            }
          }
        }
      },
      adelynn: {
        name: 'Adelynn',
        emoji: '👧',
        baseStats: {
          health: 90,
          speed: 220,
          damage: 1,
          fireRate: 450,
          defense: 5
        },
        skillTree: {
          combat: {
            name: 'Combat',
            emoji: '⚔️',
            skills: {
              precision_shot: { name: 'Precision Shot', emoji: '🎯', maxLevel: 5, cost: 1, effect: 'precision' },
              rapid_fire: { name: 'Rapid Fire', emoji: '⚡', maxLevel: 5, cost: 1, effect: 'rapidFire' },
              homing_missiles: { name: 'Homing Missiles', emoji: '🎯', maxLevel: 3, cost: 2, effect: 'homing' },
              energy_weapons: { name: 'Energy Weapons', emoji: '⚡', maxLevel: 3, cost: 3, effect: 'energyWeapons' }
            }
          },
          survival: {
            name: 'Survival',
            emoji: '🛡️',
            skills: {
              health_boost: { name: 'Health Boost', emoji: '❤️', maxLevel: 5, cost: 1, effect: 'health' },
              energy_shield: { name: 'Energy Shield', emoji: '🔋', maxLevel: 3, cost: 2, effect: 'energyShield' },
              healing_aura: { name: 'Healing Aura', emoji: '💚', maxLevel: 3, cost: 3, effect: 'healingAura' },
              damage_absorption: { name: 'Damage Absorption', emoji: '🛡️', maxLevel: 5, cost: 1, effect: 'absorption' }
            }
          },
          mobility: {
            name: 'Mobility',
            emoji: '💨',
            skills: {
              speed_boost: { name: 'Speed Boost', emoji: '⚡', maxLevel: 5, cost: 1, effect: 'speed' },
              teleport: { name: 'Teleport', emoji: '✨', maxLevel: 3, cost: 2, effect: 'teleport' },
              phase_shift: { name: 'Phase Shift', emoji: '👻', maxLevel: 3, cost: 3, effect: 'phaseShift' },
              gravity_control: { name: 'Gravity Control', emoji: '🌌', maxLevel: 3, cost: 2, effect: 'gravityControl' }
            }
          },
          special: {
            name: 'Special',
            emoji: '✨',
            skills: {
              power_up_mastery: { name: 'Power-up Mastery', emoji: '💎', maxLevel: 3, cost: 2, effect: 'powerUpMastery' },
              combo_master: { name: 'Combo Master', emoji: '🔥', maxLevel: 3, cost: 3, effect: 'comboMaster' },
              score_multiplier: { name: 'Score Multiplier', emoji: '⭐', maxLevel: 5, cost: 1, effect: 'scoreMultiplier' },
              special_ability: { name: 'Special Ability', emoji: '🌟', maxLevel: 1, cost: 5, effect: 'specialAbility' }
            }
          }
        }
      }
    };
    
    this.currentCharacter = 'kaden';
    this.skillsLearned = {
      kaden: {},
      adelynn: {}
    };
  }

  getCurrentCharacter() {
    return this.characterStats[this.currentCharacter];
  }

  setCharacter(character) {
    if (this.characterStats[character]) {
      this.currentCharacter = character;
    }
  }

  addExperience(amount) {
    this.experience += amount;
    const newLevel = Math.floor(this.experience / 1000) + 1;
    
    if (newLevel > this.level) {
      this.level = newLevel;
      this.skillPoints += newLevel - this.level;
      this.showLevelUpNotification();
    }
  }

  showLevelUpNotification() {
    const notification = this.scene.add.text(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2, 
      `Level Up! Level ${this.level}`, 
      {
        fontSize: '36px',
        fill: '#00ff00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    notification.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: notification,
      alpha: 0,
      y: notification.y - 100,
      duration: 3000,
      onComplete: () => notification.destroy()
    });
  }

  canLearnSkill(skillPath, skillKey) {
    const character = this.getCurrentCharacter();
    const skill = character.skillTree[skillPath].skills[skillKey];
    
    if (!skill) return false;
    
    const currentLevel = this.skillsLearned[this.currentCharacter][skillKey] || 0;
    const hasPoints = this.skillPoints >= skill.cost;
    const notMaxLevel = currentLevel < skill.maxLevel;
    
    return hasPoints && notMaxLevel;
  }

  learnSkill(skillPath, skillKey) {
    if (!this.canLearnSkill(skillPath, skillKey)) return false;
    
    const character = this.getCurrentCharacter();
    const skill = character.skillTree[skillPath].skills[skillKey];
    
    // Deduct skill points
    this.skillPoints -= skill.cost;
    
    // Learn skill
    if (!this.skillsLearned[this.currentCharacter][skillKey]) {
      this.skillsLearned[this.currentCharacter][skillKey] = 0;
    }
    this.skillsLearned[this.currentCharacter][skillKey]++;
    
    // Apply skill effect
    this.applySkillEffect(skillPath, skillKey);
    
    // Show skill learned notification
    this.showSkillLearnedNotification(skill.name, skill.emoji);
    
    return true;
  }

  applySkillEffect(skillPath, skillKey) {
    const character = this.getCurrentCharacter();
    const skill = character.skillTree[skillPath].skills[skillKey];
    const currentLevel = this.skillsLearned[this.currentCharacter][skillKey];
    
    switch (skill.effect) {
      case 'damage':
        character.baseStats.damage += 0.2;
        break;
      case 'fireRate':
        character.baseStats.fireRate = Math.max(100, character.baseStats.fireRate - 50);
        break;
      case 'criticalHit':
        // Add critical hit chance
        break;
      case 'weaponMastery':
        // Improve weapon effectiveness
        break;
      case 'health':
        character.baseStats.health += 20;
        break;
      case 'shield':
        // Improve shield effectiveness
        break;
      case 'regeneration':
        // Add health regeneration
        break;
      case 'resistance':
        character.baseStats.defense += 5;
        break;
      case 'speed':
        character.baseStats.speed += 20;
        break;
      case 'dash':
        // Add dash ability
        break;
      case 'evasion':
        // Add evasion chance
        break;
      case 'momentum':
        // Add momentum-based bonuses
        break;
      case 'powerUpMastery':
        // Improve power-up effectiveness
        break;
      case 'comboMaster':
        // Improve combo bonuses
        break;
      case 'scoreMultiplier':
        // Add score multiplier
        break;
      case 'specialAbility':
        // Unlock special ability
        break;
      case 'precision':
        // Add precision shot ability
        break;
      case 'rapidFire':
        // Improve rapid fire
        break;
      case 'homing':
        // Add homing missile ability
        break;
      case 'energyWeapons':
        // Unlock energy weapons
        break;
      case 'energyShield':
        // Add energy shield
        break;
      case 'healingAura':
        // Add healing aura
        break;
      case 'absorption':
        // Add damage absorption
        break;
      case 'teleport':
        // Add teleport ability
        break;
      case 'phaseShift':
        // Add phase shift ability
        break;
      case 'gravityControl':
        // Add gravity control
        break;
    }
  }

  showSkillLearnedNotification(skillName, skillEmoji) {
    const notification = this.scene.add.text(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2 + 50, 
      `${skillEmoji} ${skillName} Learned!`, 
      {
        fontSize: '24px',
        fill: '#00aaff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }
    );
    notification.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: notification,
      alpha: 0,
      y: notification.y - 50,
      duration: 2000,
      onComplete: () => notification.destroy()
    });
  }

  getSkillLevel(skillPath, skillKey) {
    return this.skillsLearned[this.currentCharacter][skillKey] || 0;
  }

  getSkillTree() {
    const character = this.getCurrentCharacter();
    return character.skillTree;
  }

  getCharacterStats() {
    const character = this.getCurrentCharacter();
    return {
      ...character.baseStats,
      level: this.level,
      experience: this.experience,
      skillPoints: this.skillPoints
    };
  }

  resetCharacter(character) {
    if (this.characterStats[character]) {
      this.skillsLearned[character] = {};
      this.characterStats[character].baseStats = { ...this.characterStats[character].baseStats };
    }
  }

  getUpgradeMenu() {
    const character = this.getCurrentCharacter();
    const skillTree = character.skillTree;
    
    return {
      character: character.name,
      emoji: character.emoji,
      level: this.level,
      experience: this.experience,
      skillPoints: this.skillPoints,
      skillTree: Object.keys(skillTree).map(category => ({
        name: skillTree[category].name,
        emoji: skillTree[category].emoji,
        skills: Object.keys(skillTree[category].skills).map(skillKey => ({
          key: skillKey,
          name: skillTree[category].skills[skillKey].name,
          emoji: skillTree[category].skills[skillKey].emoji,
          level: this.getSkillLevel(category, skillKey),
          maxLevel: skillTree[category].skills[skillKey].maxLevel,
          cost: skillTree[category].skills[skillKey].cost,
          canLearn: this.canLearnSkill(category, skillKey)
        }))
      }))
    };
  }

  getCharacterComparison() {
    const characters = Object.keys(this.characterStats).map(key => ({
      key,
      name: this.characterStats[key].name,
      emoji: this.characterStats[key].emoji,
      stats: this.characterStats[key].baseStats,
      skillsLearned: Object.keys(this.skillsLearned[key]).length
    }));
    
    return characters;
  }

  getCharacterProgress() {
    const character = this.getCurrentCharacter();
    const totalSkills = Object.values(character.skillTree).reduce((total, category) => {
      return total + Object.keys(category.skills).length;
    }, 0);
    
    const learnedSkills = Object.keys(this.skillsLearned[this.currentCharacter]).length;
    
    return {
      character: character.name,
      level: this.level,
      experience: this.experience,
      skillPoints: this.skillPoints,
      skillsLearned: learnedSkills,
      totalSkills: totalSkills,
      progress: (learnedSkills / totalSkills) * 100
    };
  }

  exportSaveData() {
    return {
      experience: this.experience,
      level: this.level,
      skillPoints: this.skillPoints,
      currentCharacter: this.currentCharacter,
      skillsLearned: this.skillsLearned,
      characterStats: this.characterStats
    };
  }

  importSaveData(saveData) {
    this.experience = saveData.experience || 0;
    this.level = saveData.level || 1;
    this.skillPoints = saveData.skillPoints || 0;
    this.currentCharacter = saveData.currentCharacter || 'kaden';
    this.skillsLearned = saveData.skillsLearned || { kaden: {}, adelynn: {} };
    this.characterStats = saveData.characterStats || this.characterStats;
  }
}
