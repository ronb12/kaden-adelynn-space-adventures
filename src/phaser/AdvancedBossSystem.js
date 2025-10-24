// Advanced Boss System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class AdvancedBossSystem {
  constructor(scene) {
    this.scene = scene;
    this.activeBosses = new Map();
    this.bossTypes = {
      // 15 New Epic Boss Battles
      GALACTIC_EMPEROR: {
        emoji: '👑',
        name: 'Galactic Emperor',
        health: 200,
        speed: 30,
        points: 2000,
        phases: 4,
        abilities: ['teleport', 'summon', 'laser', 'shield'],
        description: 'Ruler of the galaxy with ultimate power'
      },
      VOID_LORD: {
        emoji: '🌑',
        name: 'Void Lord',
        health: 250,
        speed: 25,
        points: 2500,
        phases: 5,
        abilities: ['void_blast', 'darkness', 'summon_shadows', 'phase_shift'],
        description: 'Master of the void dimension'
      },
      NEBULA_DRAGON: {
        emoji: '🐉',
        name: 'Nebula Dragon',
        health: 300,
        speed: 40,
        points: 3000,
        phases: 6,
        abilities: ['fire_breath', 'wing_attack', 'dive_bomb', 'roar'],
        description: 'Ancient dragon from the nebula'
      },
      QUANTUM_TITAN: {
        emoji: '⚛️',
        name: 'Quantum Titan',
        health: 350,
        speed: 20,
        points: 3500,
        phases: 7,
        abilities: ['quantum_blast', 'reality_warp', 'time_manipulation', 'dimension_shift'],
        description: 'Entity that exists in multiple dimensions'
      },
      STAR_DEVOURER: {
        emoji: '⭐',
        name: 'Star Devourer',
        health: 400,
        speed: 35,
        points: 4000,
        phases: 8,
        abilities: ['gravity_well', 'stellar_flare', 'black_hole', 'nova_blast'],
        description: 'Cosmic entity that consumes stars'
      },
      CYBER_OVERLORD: {
        emoji: '🤖',
        name: 'Cyber Overlord',
        health: 180,
        speed: 50,
        points: 1800,
        phases: 3,
        abilities: ['hack', 'virus_attack', 'system_override', 'data_storm'],
        description: 'AI that has taken over the digital realm'
      },
      CRYSTAL_GOLEM: {
        emoji: '💎',
        name: 'Crystal Golem',
        health: 220,
        speed: 15,
        points: 2200,
        phases: 4,
        abilities: ['crystal_spikes', 'reflect', 'shatter', 'regenerate'],
        description: 'Massive golem made of living crystal'
      },
      SHADOW_WRAITH: {
        emoji: '👻',
        name: 'Shadow Wraith',
        health: 160,
        speed: 60,
        points: 1600,
        phases: 3,
        abilities: ['shadow_teleport', 'fear_aura', 'possess', 'shadow_clone'],
        description: 'Ethereal being of pure darkness'
      },
      MECHANICAL_LEVIATHAN: {
        emoji: '🦾',
        name: 'Mechanical Leviathan',
        health: 500,
        speed: 10,
        points: 5000,
        phases: 10,
        abilities: ['missile_barrage', 'laser_cannon', 'shield_generator', 'self_repair'],
        description: 'Giant mechanical sea monster'
      },
      ELEMENTAL_PRIME: {
        emoji: '🌪️',
        name: 'Elemental Prime',
        health: 280,
        speed: 45,
        points: 2800,
        phases: 6,
        abilities: ['fire_storm', 'ice_prison', 'lightning_chain', 'earth_quake'],
        description: 'Master of all elemental forces'
      },
      SPACE_KRAKEN: {
        emoji: '🦑',
        name: 'Space Kraken',
        health: 320,
        speed: 25,
        points: 3200,
        phases: 5,
        abilities: ['tentacle_grab', 'ink_cloud', 'squeeze', 'regenerate'],
        description: 'Giant cephalopod from the depths of space'
      },
      TIME_MASTER: {
        emoji: '⏰',
        name: 'Time Master',
        health: 200,
        speed: 70,
        points: 2000,
        phases: 4,
        abilities: ['time_stop', 'time_reverse', 'temporal_clone', 'age_accelerate'],
        description: 'Being that controls the flow of time'
      },
      DIMENSION_GUARDIAN: {
        emoji: '🔮',
        name: 'Dimension Guardian',
        health: 380,
        speed: 30,
        points: 3800,
        phases: 8,
        abilities: ['portal_summon', 'dimension_shift', 'reality_anchor', 'void_beam'],
        description: 'Guardian of the dimensional barriers'
      },
      COSMIC_HORROR: {
        emoji: '👽',
        name: 'Cosmic Horror',
        health: 450,
        speed: 20,
        points: 4500,
        phases: 9,
        abilities: ['madness_aura', 'tentacle_attack', 'mind_control', 'reality_distort'],
        description: 'Ancient being from beyond the stars'
      },
      FINAL_NEMESIS: {
        emoji: '💀',
        name: 'Final Nemesis',
        health: 1000,
        speed: 40,
        points: 10000,
        phases: 15,
        abilities: ['all_powers', 'ultimate_form', 'reality_break', 'existence_end'],
        description: 'The ultimate final boss of the game'
      }
    };
  }

  createBossSprite(type) {
    const config = this.bossTypes[type];
    const canvas = this.scene.textures.createCanvas(`boss_${type}`, 80, 80);
    const context = canvas.getContext();
    context.font = '48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(config.emoji, 40, 40);
    canvas.refresh();
  }

  createBossSprites() {
    Object.keys(this.bossTypes).forEach(type => {
      this.createBossSprite(type);
    });
  }

  spawnBoss(type, x, y) {
    const config = this.bossTypes[type];
    const boss = this.scene.physics.add.sprite(x, y, `boss_${type}`);
    
    boss.setData('type', type);
    boss.setData('health', config.health);
    boss.setData('maxHealth', config.health);
    boss.setData('phase', 1);
    boss.setData('abilities', config.abilities);
    boss.setData('points', config.points);
    
    // Boss scaling
    boss.setScale(2);
    boss.setTint(0xff0000);
    
    // Boss AI
    this.setupBossAI(boss, config);
    
    return boss;
  }

  setupBossAI(boss, config) {
    // Boss movement patterns
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        if (boss.active) {
          this.executeBossAbility(boss);
        }
      },
      loop: true
    });

    // Phase transitions
    boss.setData('phaseThresholds', this.calculatePhaseThresholds(config));
  }

  executeBossAbility(boss) {
    const abilities = boss.getData('abilities');
    const currentPhase = boss.getData('phase');
    const randomAbility = Phaser.Utils.Array.GetRandom(abilities);
    
    switch (randomAbility) {
      case 'teleport':
        this.bossTeleport(boss);
        break;
      case 'summon':
        this.bossSummon(boss);
        break;
      case 'laser':
        this.bossLaser(boss);
        break;
      case 'shield':
        this.bossShield(boss);
        break;
      case 'void_blast':
        this.bossVoidBlast(boss);
        break;
      case 'darkness':
        this.bossDarkness(boss);
        break;
      case 'fire_breath':
        this.bossFireBreath(boss);
        break;
      case 'wing_attack':
        this.bossWingAttack(boss);
        break;
      case 'quantum_blast':
        this.bossQuantumBlast(boss);
        break;
      case 'gravity_well':
        this.bossGravityWell(boss);
        break;
      // Add more ability implementations
    }
  }

  bossTeleport(boss) {
    const x = Phaser.Math.Between(100, this.scene.scale.width - 100);
    const y = Phaser.Math.Between(100, this.scene.scale.height - 100);
    
    this.scene.tweens.add({
      targets: boss,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        boss.setPosition(x, y);
        this.scene.tweens.add({
          targets: boss,
          alpha: 1,
          duration: 200
        });
      }
    });
  }

  bossSummon(boss) {
    // Summon minions around the boss
    for (let i = 0; i < 3; i++) {
      const angle = (i * 120) * Math.PI / 180;
      const x = boss.x + Math.cos(angle) * 100;
      const y = boss.y + Math.sin(angle) * 100;
      
      this.scene.enemySystem.spawnEnemy('BASIC', x, y);
    }
  }

  bossLaser(boss) {
    // Create laser beam from boss to player
    const player = this.scene.player;
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(10, 0xff0000);
    graphics.moveTo(boss.x, boss.y);
    graphics.lineTo(player.x, player.y);
    
    // Damage player if hit
    if (Phaser.Geom.Line.Length(boss.x, boss.y, player.x, player.y) < 200) {
      this.scene.player.takeDamage(10);
    }
    
    this.scene.time.delayedCall(1000, () => graphics.destroy());
  }

  bossShield(boss) {
    // Create shield around boss
    const shield = this.scene.add.circle(boss.x, boss.y, 100, 0x00aaff, 0.3);
    boss.setData('shield', shield);
    
    this.scene.time.delayedCall(5000, () => {
      if (shield.active) shield.destroy();
    });
  }

  bossVoidBlast(boss) {
    // Create void energy explosion
    const explosion = this.scene.add.circle(boss.x, boss.y, 50, 0x330066, 0.8);
    
    this.scene.tweens.add({
      targets: explosion,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 1000,
      onComplete: () => explosion.destroy()
    });
  }

  bossDarkness(boss) {
    // Create darkness effect
    const darkness = this.scene.add.rectangle(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2, 
      this.scene.scale.width, 
      this.scene.scale.height, 
      0x000000, 
      0.5
    );
    
    this.scene.time.delayedCall(3000, () => {
      if (darkness.active) darkness.destroy();
    });
  }

  bossFireBreath(boss) {
    // Create fire breath attack
    const fire = this.scene.add.rectangle(boss.x, boss.y, 200, 20, 0xff4400, 0.8);
    
    this.scene.tweens.add({
      targets: fire,
      scaleX: 2,
      duration: 1000,
      onComplete: () => fire.destroy()
    });
  }

  bossWingAttack(boss) {
    // Create wing attack effect
    const wing1 = this.scene.add.ellipse(boss.x - 50, boss.y, 100, 50, 0xff8800, 0.6);
    const wing2 = this.scene.add.ellipse(boss.x + 50, boss.y, 100, 50, 0xff8800, 0.6);
    
    this.scene.tweens.add({
      targets: [wing1, wing2],
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 500,
      yoyo: true,
      onComplete: () => {
        wing1.destroy();
        wing2.destroy();
      }
    });
  }

  bossQuantumBlast(boss) {
    // Create quantum energy blast
    const quantum = this.scene.add.circle(boss.x, boss.y, 30, 0x00ffff, 0.9);
    
    this.scene.tweens.add({
      targets: quantum,
      scaleX: 4,
      scaleY: 4,
      alpha: 0,
      duration: 1500,
      onComplete: () => quantum.destroy()
    });
  }

  bossGravityWell(boss) {
    // Create gravity well effect
    const gravity = this.scene.add.circle(boss.x, boss.y, 80, 0x330066, 0.4);
    
    this.scene.tweens.add({
      targets: gravity,
      scaleX: 2,
      scaleY: 2,
      duration: 2000,
      onComplete: () => gravity.destroy()
    });
  }

  damageBoss(boss, damage) {
    const currentHealth = boss.getData('health');
    const newHealth = Math.max(0, currentHealth - damage);
    boss.setData('health', newHealth);
    
    // Check for phase transitions
    this.checkPhaseTransition(boss);
    
    // Boss damage effect
    boss.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (boss.active) boss.setTint(0xffffff);
    });
    
    if (newHealth <= 0) {
      this.defeatBoss(boss);
    }
  }

  checkPhaseTransition(boss) {
    const health = boss.getData('health');
    const maxHealth = boss.getData('maxHealth');
    const currentPhase = boss.getData('phase');
    const config = this.bossTypes[boss.getData('type')];
    
    const healthPercentage = health / maxHealth;
    const newPhase = Math.ceil((1 - healthPercentage) * config.phases);
    
    if (newPhase > currentPhase) {
      boss.setData('phase', newPhase);
      this.triggerPhaseTransition(boss, newPhase);
    }
  }

  triggerPhaseTransition(boss, phase) {
    // Phase transition effects
    boss.setTint(0xffff00);
    this.scene.cameras.main.shake(500, 0.02);
    
    // Increase boss speed and abilities
    boss.setData('speed', boss.getData('speed') * 1.2);
    
    this.scene.time.delayedCall(1000, () => {
      if (boss.active) boss.setTint(0xffffff);
    });
  }

  defeatBoss(boss) {
    const points = boss.getData('points');
    this.scene.score += points;
    
    // Boss defeat effects
    this.createBossDefeatEffect(boss);
    
    // Remove boss
    boss.destroy();
  }

  createBossDefeatEffect(boss) {
    // Explosion effect
    const explosion = this.scene.add.circle(boss.x, boss.y, 100, 0xff0000, 0.8);
    
    this.scene.tweens.add({
      targets: explosion,
      scaleX: 5,
      scaleY: 5,
      alpha: 0,
      duration: 2000,
      onComplete: () => explosion.destroy()
    });
    
    // Screen shake
    this.scene.cameras.main.shake(1000, 0.05);
  }

  calculatePhaseThresholds(config) {
    const thresholds = [];
    for (let i = 1; i <= config.phases; i++) {
      thresholds.push((config.health * (config.phases - i)) / config.phases);
    }
    return thresholds;
  }
}
