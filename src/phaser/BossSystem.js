// Boss Battle System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class BossSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentBoss = null;
    this.bossPhase = 1;
    this.bossHealth = 0;
    this.maxBossHealth = 0;
    this.bossTypes = {
      ALIEN_QUEEN: {
        name: 'Alien Queen',
        emoji: '👑',
        health: 100,
        phases: 3,
        attacks: ['spawn_minions', 'laser_beam', 'charge_attack'],
        description: 'The mighty Alien Queen with multiple attack phases'
      },
      SPACE_DRAGON: {
        name: 'Space Dragon',
        emoji: '🐉',
        health: 150,
        phases: 4,
        attacks: ['fire_breath', 'wing_attack', 'dive_bomb', 'meteor_storm'],
        description: 'Ancient space dragon with devastating fire attacks'
      },
      CYBER_TITAN: {
        name: 'Cyber Titan',
        emoji: '🤖',
        health: 200,
        phases: 5,
        attacks: ['missile_barrage', 'shield_wall', 'laser_cannon', 'emp_blast', 'self_destruct'],
        description: 'Massive robotic titan with advanced weaponry'
      },
      VOID_LORD: {
        name: 'Void Lord',
        emoji: '👽',
        health: 250,
        phases: 6,
        attacks: ['void_blast', 'teleport_strike', 'gravity_well', 'dark_matter', 'dimension_rip', 'cosmic_storm'],
        description: 'Mysterious entity from the void between dimensions'
      },
      NEBULA_BEAST: {
        name: 'Nebula Beast',
        emoji: '🌌',
        health: 180,
        phases: 4,
        attacks: ['nebula_blast', 'star_formation', 'cosmic_wind', 'black_hole'],
        description: 'Living nebula with cosmic powers'
      },
      CRYSTAL_GOLEM: {
        name: 'Crystal Golem',
        emoji: '💎',
        health: 160,
        phases: 3,
        attacks: ['crystal_shard', 'energy_beam', 'crystal_prison'],
        description: 'Ancient crystal construct with energy attacks'
      },
      SHADOW_WRAITH: {
        name: 'Shadow Wraith',
        emoji: '👻',
        health: 120,
        phases: 4,
        attacks: ['shadow_bolt', 'phase_shift', 'soul_drain', 'nightmare_blast'],
        description: 'Ethereal wraith with shadow magic'
      },
      MECHANICAL_LEVIATHAN: {
        name: 'Mechanical Leviathan',
        emoji: '🐋',
        health: 300,
        phases: 6,
        attacks: ['sonic_blast', 'tentacle_swipe', 'depth_charge', 'whirlpool', 'tsunami', 'final_rampage'],
        description: 'Massive mechanical sea creature with devastating attacks'
      }
    };
  }

  createBossSprite(bossType) {
    const config = this.bossTypes[bossType];
    const text = this.scene.add.text(0, 0, config.emoji, {
      fontSize: '64px',
      fill: '#ffffff'
    });
    text.generateTexture(`boss_${bossType}`, 80, 80);
    text.destroy();
  }

  spawnBoss(bossType) {
    const config = this.bossTypes[bossType];
    if (!config) return null;

    const centerX = this.scene.scale.width / 2;
    const boss = this.scene.physics.add.sprite(centerX, 100, `boss_${bossType}`);
    
    // Set boss properties
    boss.setData('type', bossType);
    boss.setData('health', config.health);
    boss.setData('maxHealth', config.health);
    boss.setData('phases', config.phases);
    boss.setData('currentPhase', 1);
    boss.setData('attacks', config.attacks);
    boss.setData('lastAttack', 0);
    boss.setData('attackCooldown', 2000);
    
    // Set boss size and physics
    boss.setScale(2);
    boss.setCollideWorldBounds(true);
    boss.setImmovable(true);
    
    // Store boss reference
    this.currentBoss = boss;
    this.bossHealth = config.health;
    this.maxBossHealth = config.health;
    this.bossPhase = 1;
    
    // Start boss battle
    this.startBossBattle();
    
    return boss;
  }

  startBossBattle() {
    if (!this.currentBoss) return;
    
    // Play boss music
    this.scene.soundSystem.playBossMusic();
    
    // Create boss health bar
    this.createBossHealthBar();
    
    // Start boss AI
    this.startBossAI();
    
    // Show boss introduction
    this.showBossIntroduction();
  }

  createBossHealthBar() {
    const centerX = this.scene.scale.width / 2;
    const barWidth = 400;
    const barHeight = 20;
    
    // Background
    this.bossHealthBarBg = this.scene.add.rectangle(centerX, 50, barWidth, barHeight, 0x000000, 0.8);
    this.bossHealthBarBg.setStrokeStyle(2, 0xffffff);
    
    // Health bar
    this.bossHealthBar = this.scene.add.rectangle(centerX, 50, barWidth, barHeight, 0xff0000, 0.8);
    
    // Boss name
    this.bossNameText = this.scene.add.text(centerX, 20, this.currentBoss.getData('type').replace('_', ' '), {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    });
    this.bossNameText.setOrigin(0.5);
  }

  startBossAI() {
    // Boss movement pattern
    this.scene.time.addEvent({
      delay: 100,
      callback: this.updateBossMovement,
      callbackScope: this,
      loop: true
    });
    
    // Boss attacks
    this.scene.time.addEvent({
      delay: 2000,
      callback: this.executeBossAttack,
      callbackScope: this,
      loop: true
    });
  }

  updateBossMovement() {
    if (!this.currentBoss || !this.currentBoss.active) return;
    
    const time = this.scene.time.now;
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 3;
    
    // Boss movement pattern based on phase
    switch (this.bossPhase) {
      case 1:
        // Slow horizontal movement
        this.currentBoss.setVelocityX(Math.sin(time * 0.001) * 50);
        break;
      case 2:
        // Figure-8 pattern
        this.currentBoss.setVelocityX(Math.sin(time * 0.002) * 100);
        this.currentBoss.setVelocityY(Math.sin(time * 0.004) * 50);
        break;
      case 3:
        // Aggressive movement
        this.currentBoss.setVelocityX(Math.sin(time * 0.003) * 150);
        this.currentBoss.setVelocityY(Math.sin(time * 0.006) * 100);
        break;
      default:
        // Chaotic movement
        this.currentBoss.setVelocityX(Math.sin(time * 0.005) * 200);
        this.currentBoss.setVelocityY(Math.cos(time * 0.007) * 150);
        break;
    }
  }

  executeBossAttack() {
    if (!this.currentBoss || !this.currentBoss.active) return;
    
    const attacks = this.currentBoss.getData('attacks');
    const randomAttack = Phaser.Utils.Array.GetRandom(attacks);
    
    switch (randomAttack) {
      case 'spawn_minions':
        this.spawnMinions();
        break;
      case 'laser_beam':
        this.laserBeam();
        break;
      case 'charge_attack':
        this.chargeAttack();
        break;
      case 'fire_breath':
        this.fireBreath();
        break;
      case 'wing_attack':
        this.wingAttack();
        break;
      case 'dive_bomb':
        this.diveBomb();
        break;
      case 'meteor_storm':
        this.meteorStorm();
        break;
      case 'missile_barrage':
        this.missileBarrage();
        break;
      case 'shield_wall':
        this.shieldWall();
        break;
      case 'laser_cannon':
        this.laserCannon();
        break;
      case 'emp_blast':
        this.empBlast();
        break;
      case 'self_destruct':
        this.selfDestruct();
        break;
      case 'void_blast':
        this.voidBlast();
        break;
      case 'teleport_strike':
        this.teleportStrike();
        break;
      case 'gravity_well':
        this.gravityWell();
        break;
      case 'dark_matter':
        this.darkMatter();
        break;
      case 'dimension_rip':
        this.dimensionRip();
        break;
      case 'cosmic_storm':
        this.cosmicStorm();
        break;
      case 'nebula_blast':
        this.nebulaBlast();
        break;
      case 'star_formation':
        this.starFormation();
        break;
      case 'cosmic_wind':
        this.cosmicWind();
        break;
      case 'black_hole':
        this.blackHole();
        break;
      case 'crystal_shard':
        this.crystalShard();
        break;
      case 'energy_beam':
        this.energyBeam();
        break;
      case 'crystal_prison':
        this.crystalPrison();
        break;
      case 'shadow_bolt':
        this.shadowBolt();
        break;
      case 'phase_shift':
        this.phaseShift();
        break;
      case 'soul_drain':
        this.soulDrain();
        break;
      case 'nightmare_blast':
        this.nightmareBlast();
        break;
      case 'sonic_blast':
        this.sonicBlast();
        break;
      case 'tentacle_swipe':
        this.tentacleSwipe();
        break;
      case 'depth_charge':
        this.depthCharge();
        break;
      case 'whirlpool':
        this.whirlpool();
        break;
      case 'tsunami':
        this.tsunami();
        break;
      case 'final_rampage':
        this.finalRampage();
        break;
    }
  }

  // Attack implementations
  spawnMinions() {
    for (let i = 0; i < 3; i++) {
      const minion = this.scene.enemySystem.spawnEnemy('BASIC');
      minion.setPosition(
        this.currentBoss.x + Phaser.Math.Between(-100, 100),
        this.currentBoss.y + Phaser.Math.Between(-50, 50)
      );
      this.scene.enemies.add(minion);
    }
  }

  laserBeam() {
    const laser = this.scene.add.rectangle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      20, 
      this.scene.scale.height, 
      0xff0000, 
      0.8
    );
    laser.setDepth(1);
    
    this.scene.time.delayedCall(1000, () => {
      laser.destroy();
    });
  }

  chargeAttack() {
    const targetX = this.scene.player.x;
    const targetY = this.scene.player.y;
    
    this.scene.tweens.add({
      targets: this.currentBoss,
      x: targetX,
      y: targetY,
      duration: 500,
      ease: 'Power2.easeOut'
    });
  }

  fireBreath() {
    for (let i = 0; i < 5; i++) {
      const fireball = this.scene.enemyBullets.create(
        this.currentBoss.x + (i - 2) * 30,
        this.currentBoss.y,
        'bulletSprite'
      );
      fireball.setVelocityY(200);
      fireball.setTint(0xff4400);
      fireball.setScale(1.5);
    }
  }

  wingAttack() {
    // Create wing attack effect
    const wing1 = this.scene.add.rectangle(
      this.currentBoss.x - 100, 
      this.currentBoss.y, 
      200, 
      20, 
      0x888888, 
      0.8
    );
    const wing2 = this.scene.add.rectangle(
      this.currentBoss.x + 100, 
      this.currentBoss.y, 
      200, 
      20, 
      0x888888, 
      0.8
    );
    
    this.scene.time.delayedCall(2000, () => {
      wing1.destroy();
      wing2.destroy();
    });
  }

  diveBomb() {
    this.scene.tweens.add({
      targets: this.currentBoss,
      y: this.scene.scale.height - 100,
      duration: 300,
      ease: 'Power2.easeIn',
      yoyo: true,
      repeat: 1
    });
  }

  meteorStorm() {
    for (let i = 0; i < 10; i++) {
      this.scene.time.delayedCall(i * 200, () => {
        const meteor = this.scene.enemyBullets.create(
          Phaser.Math.Between(0, this.scene.scale.width),
          -50,
          'bulletSprite'
        );
        meteor.setVelocityY(300);
        meteor.setTint(0xff6600);
        meteor.setScale(2);
      });
    }
  }

  missileBarrage() {
    for (let i = 0; i < 8; i++) {
      this.scene.time.delayedCall(i * 100, () => {
        const missile = this.scene.enemyBullets.create(
          this.currentBoss.x + (i - 4) * 40,
          this.currentBoss.y,
          'bulletSprite'
        );
        missile.setVelocityY(250);
        missile.setTint(0x00ff00);
        missile.setScale(1.2);
      });
    }
  }

  shieldWall() {
    // Create shield effect
    const shield = this.scene.add.circle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      100, 
      0x00aaff, 
      0.3
    );
    shield.setStrokeStyle(5, 0x00aaff);
    
    this.scene.time.delayedCall(5000, () => {
      shield.destroy();
    });
  }

  laserCannon() {
    const laser = this.scene.add.rectangle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      40, 
      this.scene.scale.height, 
      0xff0000, 
      0.9
    );
    laser.setDepth(1);
    
    this.scene.time.delayedCall(2000, () => {
      laser.destroy();
    });
  }

  empBlast() {
    // Create EMP effect
    const emp = this.scene.add.circle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      200, 
      0xffff00, 
      0.5
    );
    
    this.scene.time.delayedCall(1000, () => {
      emp.destroy();
    });
  }

  selfDestruct() {
    // Create self-destruct countdown
    const countdown = this.scene.add.text(
      this.currentBoss.x, 
      this.currentBoss.y, 
      '3', 
      {
        fontSize: '48px',
        fill: '#ff0000',
        fontStyle: 'bold'
      }
    );
    countdown.setOrigin(0.5);
    
    this.scene.time.delayedCall(1000, () => {
      countdown.setText('2');
    });
    
    this.scene.time.delayedCall(2000, () => {
      countdown.setText('1');
    });
    
    this.scene.time.delayedCall(3000, () => {
      countdown.destroy();
      this.scene.particleSystem.createExplosion(this.currentBoss.x, this.currentBoss.y, 'boss');
    });
  }

  voidBlast() {
    const voidBlast = this.scene.add.circle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      150, 
      0x8800ff, 
      0.8
    );
    
    this.scene.time.delayedCall(1500, () => {
      voidBlast.destroy();
    });
  }

  teleportStrike() {
    const oldX = this.currentBoss.x;
    const oldY = this.currentBoss.y;
    
    this.currentBoss.setPosition(
      Phaser.Math.Between(100, this.scene.scale.width - 100),
      Phaser.Math.Between(100, this.scene.scale.height / 2)
    );
    
    this.scene.time.delayedCall(1000, () => {
      this.currentBoss.setPosition(oldX, oldY);
    });
  }

  gravityWell() {
    // Create gravity well effect
    const well = this.scene.add.circle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      300, 
      0x000000, 
      0.5
    );
    
    this.scene.time.delayedCall(3000, () => {
      well.destroy();
    });
  }

  darkMatter() {
    for (let i = 0; i < 6; i++) {
      const darkMatter = this.scene.enemyBullets.create(
        this.currentBoss.x + Math.cos(i * Math.PI / 3) * 100,
        this.currentBoss.y + Math.sin(i * Math.PI / 3) * 100,
        'bulletSprite'
      );
      darkMatter.setVelocityY(200);
      darkMatter.setTint(0x440088);
      darkMatter.setScale(1.5);
    }
  }

  dimensionRip() {
    const rip = this.scene.add.rectangle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      200, 
      20, 
      0xff00ff, 
      0.8
    );
    rip.setRotation(Math.PI / 4);
    
    this.scene.time.delayedCall(2000, () => {
      rip.destroy();
    });
  }

  cosmicStorm() {
    for (let i = 0; i < 15; i++) {
      this.scene.time.delayedCall(i * 100, () => {
        const cosmic = this.scene.enemyBullets.create(
          Phaser.Math.Between(0, this.scene.scale.width),
          -50,
          'bulletSprite'
        );
        cosmic.setVelocityY(250);
        cosmic.setTint(0x00ffff);
        cosmic.setScale(1.3);
      });
    }
  }

  nebulaBlast() {
    const nebula = this.scene.add.circle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      200, 
      0x8800ff, 
      0.6
    );
    
    this.scene.time.delayedCall(2000, () => {
      nebula.destroy();
    });
  }

  starFormation() {
    for (let i = 0; i < 8; i++) {
      const star = this.scene.enemyBullets.create(
        this.currentBoss.x + Math.cos(i * Math.PI / 4) * 150,
        this.currentBoss.y + Math.sin(i * Math.PI / 4) * 150,
        'bulletSprite'
      );
      star.setVelocityY(180);
      star.setTint(0xffff00);
      star.setScale(1.2);
    }
  }

  cosmicWind() {
    // Create wind effect
    const wind = this.scene.add.rectangle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      this.scene.scale.width, 
      100, 
      0x00ffff, 
      0.3
    );
    
    this.scene.time.delayedCall(3000, () => {
      wind.destroy();
    });
  }

  blackHole() {
    const blackHole = this.scene.add.circle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      250, 
      0x000000, 
      0.8
    );
    
    this.scene.time.delayedCall(4000, () => {
      blackHole.destroy();
    });
  }

  crystalShard() {
    for (let i = 0; i < 6; i++) {
      const shard = this.scene.enemyBullets.create(
        this.currentBoss.x,
        this.currentBoss.y,
        'bulletSprite'
      );
      shard.setVelocityY(200);
      shard.setTint(0x00ffff);
      shard.setScale(1.1);
    }
  }

  energyBeam() {
    const beam = this.scene.add.rectangle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      30, 
      this.scene.scale.height, 
      0x00ff00, 
      0.9
    );
    beam.setDepth(1);
    
    this.scene.time.delayedCall(1500, () => {
      beam.destroy();
    });
  }

  crystalPrison() {
    // Create prison effect
    const prison = this.scene.add.rectangle(
      this.scene.player.x, 
      this.scene.player.y, 
      100, 
      100, 
      0x00ffff, 
      0.5
    );
    prison.setStrokeStyle(3, 0x00ffff);
    
    this.scene.time.delayedCall(3000, () => {
      prison.destroy();
    });
  }

  shadowBolt() {
    const bolt = this.scene.enemyBullets.create(
      this.currentBoss.x,
      this.currentBoss.y,
      'bulletSprite'
    );
    bolt.setVelocityY(300);
    bolt.setTint(0x440088);
    bolt.setScale(1.3);
  }

  phaseShift() {
    this.currentBoss.setAlpha(0.5);
    this.scene.time.delayedCall(2000, () => {
      this.currentBoss.setAlpha(1);
    });
  }

  soulDrain() {
    // Create soul drain effect
    const drain = this.scene.add.circle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      300, 
      0x8800ff, 
      0.4
    );
    
    this.scene.time.delayedCall(3000, () => {
      drain.destroy();
    });
  }

  nightmareBlast() {
    const nightmare = this.scene.add.circle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      200, 
      0x440088, 
      0.8
    );
    
    this.scene.time.delayedCall(2000, () => {
      nightmare.destroy();
    });
  }

  sonicBlast() {
    const sonic = this.scene.add.circle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      250, 
      0xffff00, 
      0.6
    );
    
    this.scene.time.delayedCall(1500, () => {
      sonic.destroy();
    });
  }

  tentacleSwipe() {
    // Create tentacle effect
    const tentacle = this.scene.add.rectangle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      300, 
      20, 
      0x006600, 
      0.8
    );
    tentacle.setRotation(Math.PI / 4);
    
    this.scene.time.delayedCall(2000, () => {
      tentacle.destroy();
    });
  }

  depthCharge() {
    for (let i = 0; i < 5; i++) {
      this.scene.time.delayedCall(i * 300, () => {
        const charge = this.scene.enemyBullets.create(
          this.currentBoss.x + (i - 2) * 50,
          this.currentBoss.y,
          'bulletSprite'
        );
        charge.setVelocityY(200);
        charge.setTint(0x006600);
        charge.setScale(1.5);
      });
    }
  }

  whirlpool() {
    const whirlpool = this.scene.add.circle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      200, 
      0x0066ff, 
      0.6
    );
    
    this.scene.time.delayedCall(3000, () => {
      whirlpool.destroy();
    });
  }

  tsunami() {
    const tsunami = this.scene.add.rectangle(
      this.currentBoss.x, 
      this.currentBoss.y, 
      this.scene.scale.width, 
      100, 
      0x0066ff, 
      0.8
    );
    
    this.scene.time.delayedCall(2000, () => {
      tsunami.destroy();
    });
  }

  finalRampage() {
    // Create final rampage effect
    this.scene.particleSystem.createScreenShake(3, 1000);
    this.scene.particleSystem.createScreenFlash(0xff0000, 500);
  }

  showBossIntroduction() {
    const bossName = this.currentBoss.getData('type').replace('_', ' ');
    const introText = this.scene.add.text(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2, 
      `${bossName} appears!`, 
      {
        fontSize: '48px',
        fill: '#ff0000',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    introText.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: introText,
      alpha: 0,
      duration: 3000,
      onComplete: () => introText.destroy()
    });
  }

  damageBoss(damage) {
    if (!this.currentBoss || !this.currentBoss.active) return;
    
    this.bossHealth -= damage;
    this.currentBoss.setData('health', this.bossHealth);
    
    // Update health bar
    this.updateBossHealthBar();
    
    // Check for phase change
    const healthPercentage = this.bossHealth / this.maxBossHealth;
    const newPhase = Math.ceil((1 - healthPercentage) * this.currentBoss.getData('phases')) + 1;
    
    if (newPhase > this.bossPhase) {
      this.bossPhase = newPhase;
      this.enterNewPhase();
    }
    
    // Check for boss death
    if (this.bossHealth <= 0) {
      this.defeatBoss();
    }
  }

  updateBossHealthBar() {
    if (!this.bossHealthBar) return;
    
    const healthPercentage = this.bossHealth / this.maxBossHealth;
    const barWidth = 400 * healthPercentage;
    
    this.bossHealthBar.setSize(barWidth, 20);
    this.bossHealthBar.setPosition(
      this.scene.scale.width / 2 - (400 - barWidth) / 2, 
      50
    );
  }

  enterNewPhase() {
    // Show phase change notification
    const phaseText = this.scene.add.text(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2, 
      `Phase ${this.bossPhase}!`, 
      {
        fontSize: '36px',
        fill: '#ffff00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    phaseText.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: phaseText,
      alpha: 0,
      duration: 2000,
      onComplete: () => phaseText.destroy()
    });
    
    // Increase boss aggression
    this.currentBoss.setData('attackCooldown', Math.max(500, this.currentBoss.getData('attackCooldown') - 200));
  }

  defeatBoss() {
    if (!this.currentBoss) return;
    
    // Play victory sound
    this.scene.soundSystem.playVictorySound();
    
    // Create victory effects
    this.scene.particleSystem.createExplosion(this.currentBoss.x, this.currentBoss.y, 'boss');
    this.scene.particleSystem.createScreenShake(2, 1000);
    
    // Update game stats
    this.scene.gameStats.bossesKilled++;
    
    // Show victory message
    this.showVictoryMessage();
    
    // Destroy boss
    this.currentBoss.destroy();
    this.currentBoss = null;
    
    // Clean up UI
    if (this.bossHealthBar) this.bossHealthBar.destroy();
    if (this.bossHealthBarBg) this.bossHealthBarBg.destroy();
    if (this.bossNameText) this.bossNameText.destroy();
  }

  showVictoryMessage() {
    const victoryText = this.scene.add.text(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2, 
      'BOSS DEFEATED!', 
      {
        fontSize: '48px',
        fill: '#00ff00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    victoryText.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: victoryText,
      alpha: 0,
      duration: 3000,
      onComplete: () => victoryText.destroy()
    });
  }

  getCurrentBoss() {
    return this.currentBoss;
  }

  isBossActive() {
    return this.currentBoss && this.currentBoss.active;
  }

  getAllBossTypes() {
    return Object.keys(this.bossTypes).map(key => ({
      key,
      ...this.bossTypes[key]
    }));
  }
}
