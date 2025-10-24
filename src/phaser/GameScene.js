// Main Game Scene for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';
import { PowerUpSystem } from './PowerUpSystem.js';
import { EnemySystem } from './EnemySystem.js';
import { WeaponSystem } from './WeaponSystem.js';
import { AchievementSystem } from './AchievementSystem.js';
import { ParticleSystem } from './ParticleSystem.js';
import { SoundSystem } from './SoundSystem.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.health = 100;
    this.maxHealth = 100;
    this.shield = 0;
    this.gameOver = false;
    this.selectedCharacter = 'kaden';
    this.gameStats = {
      enemiesKilled: 0,
      bossesKilled: 0,
      killStreak: 0,
      maxKillStreak: 0,
      powerUpsCollected: 0,
      weaponsUsed: 0,
      perfectHits: 0,
      shotsFired: 0,
      bulletsDodged: 0,
      damageTaken: 0,
      survivalTime: 0,
      levelTime: 0,
      maxCombo: 0,
      currentCombo: 0,
      survivedWith1HP: false,
      powerUpTypesCollected: new Set(),
      achievementsUnlocked: 0
    };
  }

  preload() {
    // Create sprites programmatically
    this.createSprites();
  }

  create() {
    // Initialize game systems
    this.initializeSystems();
    
    // Create game objects
    this.createPlayer();
    this.createGroups();
    this.createUI();
    this.createControls();
    this.createCollisions();
    this.createEvents();
    this.createBackground();
    
    // Start game music
    this.soundSystem.playGameStartSound();
  }

  initializeSystems() {
    // Initialize all game systems
    this.powerUpSystem = new PowerUpSystem(this);
    this.enemySystem = new EnemySystem(this);
    this.weaponSystem = new WeaponSystem(this);
    this.achievementSystem = new AchievementSystem(this);
    this.particleSystem = new ParticleSystem(this);
    this.soundSystem = new SoundSystem(this);
    
    // Create system sprites
    this.powerUpSystem.createPowerUpSprites();
    this.enemySystem.createEnemySprites();
    this.weaponSystem.createWeaponSprites();
    this.soundSystem.createSoundSprites();
  }

  update() {
    if (this.gameOver) return;
    
    // Update game stats
    this.updateGameStats();
    
    // Update systems
    this.powerUpSystem.updatePowerUps();
    this.weaponSystem.updateBullets();
    this.updateEnemies();
    
    // Handle input
    this.handleInput();
    
    // Check achievements
    this.checkAchievements();
  }

  updateGameStats() {
    this.gameStats.survivalTime += this.time.delta;
    this.gameStats.levelTime += this.time.delta;
  }

  checkAchievements() {
    const newAchievements = this.achievementSystem.checkAchievements(this.gameStats);
    newAchievements.forEach(achievement => {
      this.soundSystem.playAchievementSound();
      this.particleSystem.createMagicEffect(this.player.x, this.player.y, 'sparkles');
    });
  }

  createSprites() {
    // Player sprite
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0x00aaff);
    playerGraphics.fillRect(0, 0, 50, 60);
    playerGraphics.generateTexture('playerSprite', 50, 60);
    playerGraphics.destroy();
    
    // Enemy sprite
    const enemyGraphics = this.add.graphics();
    enemyGraphics.fillStyle(0xff4444);
    enemyGraphics.fillRect(0, 0, 40, 40);
    enemyGraphics.generateTexture('enemySprite', 40, 40);
    enemyGraphics.destroy();
    
    // Bullet sprite
    const bulletGraphics = this.add.graphics();
    bulletGraphics.fillStyle(0xffff00);
    bulletGraphics.fillRect(0, 0, 4, 10);
    bulletGraphics.generateTexture('bulletSprite', 4, 10);
    bulletGraphics.destroy();
  }

  createPlayer() {
    this.player = this.physics.add.sprite(400, 500, 'playerSprite');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1);
  }

  createGroups() {
    this.enemies = this.physics.add.group();
    this.bullets = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();
    this.powerUps = this.physics.add.group();
  }

  createUI() {
    // Score
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      fill: '#00aaff'
    });
    
    // Health text
    this.healthText = this.add.text(16, 50, 'Health: 100', {
      fontSize: '24px',
      fill: '#ffffff'
    });
    
    // Health bar
    this.healthBar = this.add.graphics();
    this.updateHealthBar();
  }

  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
  }

  createCollisions() {
    this.physics.add.collider(this.bullets, this.enemies, this.hitEnemy, null, this);
    this.physics.add.collider(this.player, this.enemies, this.hitPlayer, null, this);
    this.physics.add.collider(this.player, this.enemyBullets, this.hitPlayerBullet, null, this);
    this.physics.add.collider(this.player, this.powerUps, this.collectPowerUp, null, this);
  }

  createEvents() {
    // Enemy spawning
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
    
    // Enemy shooting
    this.time.addEvent({
      delay: 3000,
      callback: this.enemyShoot,
      callbackScope: this,
      loop: true
    });
    
    // Power-up spawning
    this.time.addEvent({
      delay: 10000,
      callback: this.spawnPowerUp,
      callbackScope: this,
      loop: true
    });
  }

  createBackground() {
    // Animated stars
    for (let i = 0; i < 100; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 600),
        Phaser.Math.Between(1, 3),
        0xffffff,
        0.8
      );
      
      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1
      });
    }
  }

  handleInput() {
    // Movement
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }
    
    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      this.player.setVelocityY(-200);
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      this.player.setVelocityY(200);
    } else {
      this.player.setVelocityY(0);
    }
    
    // Shooting
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.shoot();
    }
  }

  updateBullets() {
    // Remove bullets that are off screen
    this.bullets.children.entries.forEach(bullet => {
      if (bullet.y < 0) {
        bullet.destroy();
      }
    });
    
    this.enemyBullets.children.entries.forEach(bullet => {
      if (bullet.y > 600) {
        bullet.destroy();
      }
    });
  }

  updateEnemies() {
    this.enemies.children.entries.forEach(enemy => {
      if (enemy.y > 600) {
        enemy.destroy();
      }
    });
  }

  shoot() {
    if (this.weaponSystem.canFire()) {
      this.weaponSystem.fireWeapon(this.player.x, this.player.y);
      this.gameStats.shotsFired++;
      this.soundSystem.playShootSound(this.weaponSystem.currentWeapon);
    }
  }

  enemyShoot() {
    if (this.enemies.children.entries.length > 0) {
      const randomEnemy = Phaser.Utils.Array.GetRandom(this.enemies.children.entries);
      const bullet = this.enemyBullets.create(randomEnemy.x, randomEnemy.y + 20, 'bulletSprite');
      bullet.setVelocityY(200);
      bullet.setTint(0xff4444);
    }
  }

  spawnEnemy() {
    const enemy = this.enemySystem.spawnEnemy();
    this.enemies.add(enemy);
  }

  spawnPowerUp() {
    const x = Phaser.Math.Between(50, this.scale.width - 50);
    const powerUp = this.powerUpSystem.spawnPowerUp(x, -50);
    this.powerUps.add(powerUp);
  }

  hitEnemy(bullet, enemy) {
    const damage = bullet.getData('damage') || 1;
    const enemyType = enemy.getData('type');
    
    // Apply damage to enemy
    this.enemySystem.damageEnemy(enemy, damage);
    
    // Update game stats
    this.gameStats.enemiesKilled++;
    this.gameStats.killStreak++;
    this.gameStats.maxKillStreak = Math.max(this.gameStats.maxKillStreak, this.gameStats.killStreak);
    
    // Update score
    const points = enemy.getData('points') || 10;
    this.score += points;
    this.scoreText.setText('Score: ' + this.score);
    
    // Play sounds and effects
    this.soundSystem.playEnemyHitSound(enemyType);
    this.particleSystem.createExplosion(enemy.x, enemy.y);
    
    // Check for combo
    if (this.gameStats.killStreak > 1) {
      this.gameStats.currentCombo = this.gameStats.killStreak;
      this.gameStats.maxCombo = Math.max(this.gameStats.maxCombo, this.gameStats.currentCombo);
      this.particleSystem.createComboEffect(enemy.x, enemy.y, this.gameStats.currentCombo);
      this.soundSystem.playComboSound(this.gameStats.currentCombo);
    }
    
    // Destroy bullet if not piercing
    if (!bullet.getData('pierce')) {
      bullet.destroy();
    }
  }

  hitPlayer(player, enemy) {
    enemy.destroy();
    this.health -= 20;
    this.updateHealthBar();
    
    if (this.health <= 0) {
      this.gameOver = true;
      this.showGameOver();
    }
  }

  hitPlayerBullet(player, bullet) {
    bullet.destroy();
    this.health -= 10;
    this.updateHealthBar();
    
    if (this.health <= 0) {
      this.gameOver = true;
      this.showGameOver();
    }
  }

  collectPowerUp(player, powerUp) {
    const powerUpType = powerUp.getData('type');
    
    // Collect power-up using the system
    this.powerUpSystem.collectPowerUp(player, powerUp);
    
    // Update game stats
    this.gameStats.powerUpsCollected++;
    this.gameStats.powerUpTypesCollected.add(powerUpType);
    
    // Play sound and effects
    this.soundSystem.playPowerUpSound(powerUpType);
    this.particleSystem.createPowerUpEffect(player.x, player.y, powerUpType);
    
    // Update UI
    this.updateHealthBar();
  }

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0xff0000);
    this.healthBar.fillRect(16, 70, 200, 20);
    this.healthBar.fillStyle(0x00ff00);
    this.healthBar.fillRect(16, 70, this.health * 2, 20);
    
    // Safety check for healthText
    if (this.healthText) {
      this.healthText.setText('Health: ' + this.health);
    }
  }

  createExplosion(x, y) {
    const particles = this.add.particles(x, y, 'bulletSprite', {
      speed: { min: 50, max: 100 },
      scale: { start: 1, end: 0 },
      lifespan: 500
    });
    
    this.time.delayedCall(500, () => {
      particles.destroy();
    });
  }

  showGameOver() {
    // Play game over sound
    this.soundSystem.playGameOverSound();
    
    const gameOverText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'GAME OVER\nFinal Score: ' + this.score, {
      fontSize: '48px',
      fill: '#ff0000',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4
    });
    gameOverText.setOrigin(0.5);
    
    const restartText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Press R to Restart or M for Menu', {
      fontSize: '24px',
      fill: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    });
    restartText.setOrigin(0.5);
    
    // Show final stats
    const statsText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 
      `Enemies Killed: ${this.gameStats.enemiesKilled}\nMax Combo: ${this.gameStats.maxCombo}\nSurvival Time: ${Math.floor(this.gameStats.survivalTime / 1000)}s`, {
      fontSize: '18px',
      fill: '#cccccc',
      align: 'center'
    });
    statsText.setOrigin(0.5);
    
    // Restart on R key
    this.input.keyboard.on('keydown-R', () => {
      this.scene.restart();
    });
    
    // Menu on M key
    this.input.keyboard.on('keydown-M', () => {
      this.scene.start('MenuScene');
    });
  }
}
