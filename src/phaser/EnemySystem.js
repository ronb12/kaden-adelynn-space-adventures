// Enemy System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class EnemySystem {
  constructor(scene) {
    this.scene = scene;
    this.enemyTypes = {
      // Original 20 enemies
      BASIC: { emoji: '👾', health: 1, speed: 100, points: 10, behavior: 'straight' },
      FAST: { emoji: '💨', health: 1, speed: 200, points: 15, behavior: 'straight' },
      TANK: { emoji: '🛡️', health: 3, speed: 50, points: 25, behavior: 'straight' },
      ZIGZAG: { emoji: '🌊', health: 1, speed: 80, points: 20, behavior: 'zigzag' },
      CIRCLE: { emoji: '🌀', health: 2, speed: 60, points: 30, behavior: 'circle' },
      SINE: { emoji: '🌙', health: 1, speed: 100, points: 20, behavior: 'sine' },
      CHARGER: { emoji: '⚡', health: 2, speed: 150, points: 25, behavior: 'charge' },
      BOMBER: { emoji: '💣', health: 2, speed: 80, points: 30, behavior: 'bomber' },
      SPLITTER: { emoji: '🔀', health: 2, speed: 100, points: 35, behavior: 'splitter' },
      HOMING: { emoji: '🎯', health: 1, speed: 120, points: 25, behavior: 'homing' },
      TELEPORT: { emoji: '✨', health: 2, speed: 100, points: 40, behavior: 'teleport' },
      SHIELD: { emoji: '🔒', health: 3, speed: 70, points: 35, behavior: 'shield' },
      SWARM: { emoji: '🐝', health: 1, speed: 90, points: 15, behavior: 'swarm' },
      BOSS1: { emoji: '👑', health: 20, speed: 40, points: 200, behavior: 'boss1' },
      BOSS2: { emoji: '🐉', health: 30, speed: 30, points: 300, behavior: 'boss2' },
      BOSS3: { emoji: '👽', health: 40, speed: 35, points: 400, behavior: 'boss3' },
      MINI_BOSS: { emoji: '🤖', health: 10, speed: 60, points: 100, behavior: 'miniBoss' },
      ELITE: { emoji: '⭐', health: 5, speed: 110, points: 50, behavior: 'elite' },
      STEALTH: { emoji: '👻', health: 1, speed: 130, points: 30, behavior: 'stealth' },
      KAMIKAZE: { emoji: '💥', health: 1, speed: 180, points: 20, behavior: 'kamikaze' },
      
      // 30 New Enemy Types
      // Advanced AI Enemies
      PREDATOR: { emoji: '🦅', health: 2, speed: 140, points: 35, behavior: 'predator' },
      HUNTER: { emoji: '🏹', health: 3, speed: 120, points: 40, behavior: 'hunter' },
      STALKER: { emoji: '👁️', health: 2, speed: 110, points: 30, behavior: 'stalker' },
      TRACKER: { emoji: '🔍', health: 1, speed: 160, points: 25, behavior: 'tracker' },
      INTERCEPTOR: { emoji: '🚀', health: 2, speed: 180, points: 35, behavior: 'interceptor' },
      AMBUSH: { emoji: '🕳️', health: 3, speed: 90, points: 40, behavior: 'ambush' },
      PATROL: { emoji: '🚁', health: 2, speed: 100, points: 30, behavior: 'patrol' },
      SCOUT: { emoji: '🔭', health: 1, speed: 150, points: 20, behavior: 'scout' },
      
      // Elemental Enemies
      FIRE_DEMON: { emoji: '🔥', health: 4, speed: 80, points: 50, behavior: 'fireDemon' },
      ICE_GOLEM: { emoji: '🧊', health: 5, speed: 60, points: 60, behavior: 'iceGolem' },
      LIGHTNING_BOLT: { emoji: '⚡', health: 2, speed: 200, points: 40, behavior: 'lightning' },
      EARTH_ELEMENTAL: { emoji: '🗿', health: 6, speed: 40, points: 70, behavior: 'earthElemental' },
      WIND_SPIRIT: { emoji: '💨', health: 2, speed: 160, points: 35, behavior: 'windSpirit' },
      WATER_DRAGON: { emoji: '🐉', health: 4, speed: 100, points: 55, behavior: 'waterDragon' },
      DARK_SHADOW: { emoji: '🌑', health: 3, speed: 120, points: 45, behavior: 'darkShadow' },
      LIGHT_ANGEL: { emoji: '👼', health: 3, speed: 110, points: 50, behavior: 'lightAngel' },
      
      // Mechanical Enemies
      DRONE: { emoji: '🤖', health: 1, speed: 130, points: 25, behavior: 'drone' },
      TURRET: { emoji: '🔫', health: 4, speed: 0, points: 60, behavior: 'turret' },
      MECH: { emoji: '🦾', health: 6, speed: 70, points: 80, behavior: 'mech' },
      CYBORG: { emoji: '🤖', health: 4, speed: 100, points: 55, behavior: 'cyborg' },
      ANDROID: { emoji: '👤', health: 3, speed: 120, points: 45, behavior: 'android' },
      ROBOT: { emoji: '🤖', health: 5, speed: 80, points: 65, behavior: 'robot' },
      AUTOMATON: { emoji: '⚙️', health: 4, speed: 90, points: 50, behavior: 'automaton' },
      SYNTHETIC: { emoji: '🧬', health: 3, speed: 110, points: 40, behavior: 'synthetic' },
      
      // Space Creatures
      ALIEN: { emoji: '👽', health: 3, speed: 100, points: 40, behavior: 'alien' },
      MUTANT: { emoji: '🧬', health: 4, speed: 90, points: 50, behavior: 'mutant' },
      PARASITE: { emoji: '🦠', health: 1, speed: 140, points: 30, behavior: 'parasite' },
      VIRUS: { emoji: '🦠', health: 1, speed: 160, points: 25, behavior: 'virus' },
      BACTERIA: { emoji: '🦠', health: 1, speed: 180, points: 20, behavior: 'bacteria' },
      SPORE: { emoji: '🍄', health: 1, speed: 120, points: 15, behavior: 'spore' },
      TENTACLE: { emoji: '🦑', health: 3, speed: 80, points: 45, behavior: 'tentacle' },
      EYE: { emoji: '👁️', health: 2, speed: 100, points: 35, behavior: 'eye' },
      
      // Boss Variants
      MEGA_BOSS: { emoji: '👑', health: 50, speed: 30, points: 500, behavior: 'megaBoss' },
      ULTRA_BOSS: { emoji: '🐉', health: 75, speed: 25, points: 750, behavior: 'ultraBoss' },
      OMEGA_BOSS: { emoji: '👽', health: 100, speed: 20, points: 1000, behavior: 'omegaBoss' },
      FINAL_BOSS: { emoji: '👑', health: 150, speed: 15, points: 1500, behavior: 'finalBoss' }
    };
  }

  createEnemySprite(type) {
    const config = this.enemyTypes[type];
    const canvas = this.scene.textures.createCanvas(`enemy_${type}`, 40, 40);
    const context = canvas.getContext();
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(config.emoji, 20, 20);
    canvas.refresh();
  }

  createEnemySprites() {
    // Create sprites for all enemy types
    Object.keys(this.enemyTypes).forEach(type => {
      this.createEnemySprite(type);
    });
  }

  spawnEnemy(type = null) {
    if (!type) {
      const types = Object.keys(this.enemyTypes);
      type = Phaser.Utils.Array.GetRandom(types);
    }
    
    const config = this.enemyTypes[type];
    const x = Phaser.Math.Between(50, this.scene.scale.width - 50);
    const enemy = this.scene.physics.add.sprite(x, -50, `enemy_${type}`);
    
    // Set enemy properties
    enemy.setData('type', type);
    enemy.setData('health', config.health);
    enemy.setData('maxHealth', config.health);
    enemy.setData('points', config.points);
    enemy.setData('behavior', config.behavior);
    enemy.setData('startTime', this.scene.time.now);
    
    // Set initial velocity based on behavior
    this.setEnemyBehavior(enemy, config);
    
    return enemy;
  }

  setEnemyBehavior(enemy, config) {
    const behavior = config.behavior;
    const speed = config.speed;
    
    switch (behavior) {
      case 'straight':
        enemy.setVelocityY(speed);
        break;
      case 'zigzag':
        enemy.setVelocityY(speed * 0.7);
        this.createZigzagMovement(enemy);
        break;
      case 'circle':
        enemy.setVelocityY(speed * 0.5);
        this.createCircleMovement(enemy);
        break;
      case 'sine':
        enemy.setVelocityY(speed * 0.8);
        this.createSineMovement(enemy);
        break;
      case 'charge':
        enemy.setVelocityY(speed * 0.3);
        this.createChargeBehavior(enemy);
        break;
      case 'bomber':
        enemy.setVelocityY(speed * 0.6);
        this.createBomberBehavior(enemy);
        break;
      case 'splitter':
        enemy.setVelocityY(speed * 0.7);
        break;
      case 'homing':
        enemy.setVelocityY(speed * 0.5);
        this.createHomingBehavior(enemy);
        break;
      case 'teleport':
        enemy.setVelocityY(speed * 0.6);
        this.createTeleportBehavior(enemy);
        break;
      case 'shield':
        enemy.setVelocityY(speed * 0.4);
        this.createShieldBehavior(enemy);
        break;
      case 'swarm':
        enemy.setVelocityY(speed * 0.8);
        this.createSwarmBehavior(enemy);
        break;
      case 'boss1':
        enemy.setVelocityY(speed * 0.2);
        this.createBoss1Behavior(enemy);
        break;
      case 'boss2':
        enemy.setVelocityY(speed * 0.15);
        this.createBoss2Behavior(enemy);
        break;
      case 'boss3':
        enemy.setVelocityY(speed * 0.1);
        this.createBoss3Behavior(enemy);
        break;
      case 'miniBoss':
        enemy.setVelocityY(speed * 0.3);
        this.createMiniBossBehavior(enemy);
        break;
      case 'elite':
        enemy.setVelocityY(speed * 0.6);
        this.createEliteBehavior(enemy);
        break;
      case 'stealth':
        enemy.setVelocityY(speed * 0.7);
        this.createStealthBehavior(enemy);
        break;
      case 'kamikaze':
        enemy.setVelocityY(speed);
        this.createKamikazeBehavior(enemy);
        break;
    }
  }

  createZigzagMovement(enemy) {
    this.scene.tweens.add({
      targets: enemy,
      x: enemy.x + Phaser.Math.Between(-100, 100),
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createCircleMovement(enemy) {
    const centerX = enemy.x;
    const radius = 50;
    
    this.scene.tweens.add({
      targets: enemy,
      x: centerX + radius,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createSineMovement(enemy) {
    const startX = enemy.x;
    const amplitude = 100;
    
    this.scene.tweens.add({
      targets: enemy,
      x: startX + amplitude,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createChargeBehavior(enemy) {
    this.scene.time.delayedCall(2000, () => {
      if (enemy.active) {
        enemy.setVelocityY(300);
      }
    });
  }

  createBomberBehavior(enemy) {
    this.scene.time.addEvent({
      delay: 1500,
      callback: () => {
        if (enemy.active) {
          this.scene.enemySystem.enemyShoot(enemy);
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  createHomingBehavior(enemy) {
    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        if (enemy.active && this.scene.player) {
          const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.scene.player.x, this.scene.player.y);
          enemy.setVelocityX(Math.cos(angle) * 100);
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  createTeleportBehavior(enemy) {
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        if (enemy.active) {
          enemy.setPosition(Phaser.Math.Between(50, this.scene.scale.width - 50), enemy.y);
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  createShieldBehavior(enemy) {
    enemy.setTint(0x00aaff);
    enemy.setData('shielded', true);
  }

  createSwarmBehavior(enemy) {
    // Swarm enemies move in groups
    const swarmSize = 3;
    for (let i = 0; i < swarmSize; i++) {
      this.scene.time.delayedCall(i * 200, () => {
        const swarmEnemy = this.spawnEnemy('BASIC');
        swarmEnemy.setPosition(enemy.x + (i - 1) * 60, enemy.y);
      });
    }
  }

  createBoss1Behavior(enemy) {
    // Boss 1: Moves side to side, shoots in patterns
    this.scene.tweens.add({
      targets: enemy,
      x: this.scene.scale.width - 100,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        if (enemy.active) {
          this.scene.enemySystem.enemyShoot(enemy);
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  createBoss2Behavior(enemy) {
    // Boss 2: Spiral movement with rapid fire
    this.scene.tweens.add({
      targets: enemy,
      rotation: Math.PI * 2,
      duration: 2000,
      repeat: -1,
      ease: 'Linear'
    });
    
    this.scene.time.addEvent({
      delay: 500,
      callback: () => {
        if (enemy.active) {
          this.scene.enemySystem.enemyShoot(enemy);
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  createBoss3Behavior(enemy) {
    // Boss 3: Complex pattern with multiple phases
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        if (enemy.active) {
          this.scene.enemySystem.enemyShoot(enemy);
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  createMiniBossBehavior(enemy) {
    // Mini boss: Faster movement with special attacks
    this.scene.tweens.add({
      targets: enemy,
      x: this.scene.scale.width - 100,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createEliteBehavior(enemy) {
    // Elite: Advanced AI with dodging
    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        if (enemy.active && this.scene.player) {
          // Dodge player bullets
          const bullets = this.scene.bullets.children.entries;
          bullets.forEach(bullet => {
            if (Phaser.Math.Distance.Between(enemy.x, enemy.y, bullet.x, bullet.y) < 100) {
              enemy.setVelocityX(enemy.x < bullet.x ? -150 : 150);
            }
          });
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  createStealthBehavior(enemy) {
    // Stealth: Becomes invisible periodically
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        if (enemy.active) {
          enemy.setAlpha(0.3);
          this.scene.time.delayedCall(1000, () => {
            if (enemy.active) {
              enemy.setAlpha(1);
            }
          });
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  createKamikazeBehavior(enemy) {
    // Kamikaze: Accelerates towards player
    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        if (enemy.active && this.scene.player) {
          const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.scene.player.x, this.scene.player.y);
          enemy.setVelocityX(Math.cos(angle) * 200);
          enemy.setVelocityY(Math.sin(angle) * 200);
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  enemyShoot(enemy) {
    const bullet = this.scene.enemyBullets.create(enemy.x, enemy.y + 20, 'bulletSprite');
    bullet.setVelocityY(200);
    bullet.setTint(0xff4444);
    bullet.setScale(1.2);
  }

  damageEnemy(enemy, damage) {
    const currentHealth = enemy.getData('health');
    const newHealth = Math.max(0, currentHealth - damage);
    enemy.setData('health', newHealth);
    
    // Visual damage effect
    enemy.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (enemy.active) {
        enemy.setTint(0xffffff);
      }
    });
    
    if (newHealth <= 0) {
      this.destroyEnemy(enemy);
    }
  }

  destroyEnemy(enemy) {
    const points = enemy.getData('points');
    this.scene.score += points;
    this.scene.scoreText.setText('Score: ' + this.scene.score);
    
    // Explosion effect
    this.scene.createExplosion(enemy.x, enemy.y);
    
    // Check for splitter behavior
    if (enemy.getData('behavior') === 'splitter') {
      this.createSplitterEffect(enemy.x, enemy.y);
    }
    
    enemy.destroy();
  }

  createSplitterEffect(x, y) {
    // Create two smaller enemies
    for (let i = 0; i < 2; i++) {
      const splitEnemy = this.spawnEnemy('BASIC');
      splitEnemy.setPosition(x + (i - 0.5) * 40, y);
      splitEnemy.setScale(0.7);
    }
  }
}
