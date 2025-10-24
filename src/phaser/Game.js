// Kaden & Adelynn Space Adventures - Phaser 3 Game
// High-performance 2D space shooter

import Phaser from 'phaser';

// Game Configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#000033',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// Game Variables
let player;
let enemies;
let bullets;
let enemyBullets;
let cursors;
let spaceKey;
let score = 0;
let scoreText;
let health = 100;
let healthBar;
let gameOver = false;
let selectedCharacter = 'kaden';

// Preload Assets
function preload() {
  // Create simple colored rectangles as sprites
  this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  this.load.image('enemy', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  this.load.image('bullet', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  
  // Create colored rectangles
  this.load.on('filecomplete-image-player', () => {
    createPlayerSprite(this);
  });
  this.load.on('filecomplete-image-enemy', () => {
    createEnemySprite(this);
  });
  this.load.on('filecomplete-image-bullet', () => {
    createBulletSprite(this);
  });
}

// Create Sprites
function createPlayerSprite(scene) {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x00aaff);
  graphics.fillRect(0, 0, 50, 60);
  graphics.generateTexture('playerSprite', 50, 60);
  graphics.destroy();
}

function createEnemySprite(scene) {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0xff4444);
  graphics.fillRect(0, 0, 40, 40);
  graphics.generateTexture('enemySprite', 40, 40);
  graphics.destroy();
}

function createBulletSprite(scene) {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0xffff00);
  graphics.fillRect(0, 0, 4, 10);
  graphics.generateTexture('bulletSprite', 4, 10);
  graphics.destroy();
}

// Create Game Objects
function create() {
  // Create groups
  enemies = this.physics.add.group();
  bullets = this.physics.add.group();
  enemyBullets = this.physics.add.group();
  
  // Create player
  player = this.physics.add.sprite(400, 500, 'playerSprite');
  player.setCollideWorldBounds(true);
  player.setScale(1);
  
  // Create UI
  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#00aaff'
  });
  
  // Health bar
  healthBar = this.add.graphics();
  updateHealthBar();
  
  // Controls
  cursors = this.input.keyboard.createCursorKeys();
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  
  // Collision detection
  this.physics.add.collider(bullets, enemies, hitEnemy, null, this);
  this.physics.add.collider(player, enemies, hitPlayer, null, this);
  this.physics.add.collider(player, enemyBullets, hitPlayerBullet, null, this);
  
  // Enemy spawning
  this.time.addEvent({
    delay: 2000,
    callback: spawnEnemy,
    callbackScope: this,
    loop: true
  });
  
  // Enemy shooting
  this.time.addEvent({
    delay: 3000,
    callback: enemyShoot,
    callbackScope: this,
    loop: true
  });
  
  // Background stars
  createStars(this);
}

// Update Game Loop
function update() {
  if (gameOver) return;
  
  // Player movement
  if (cursors.left.isDown) {
    player.setVelocityX(-200);
  } else if (cursors.right.isDown) {
    player.setVelocityX(200);
  } else {
    player.setVelocityX(0);
  }
  
  if (cursors.up.isDown) {
    player.setVelocityY(-200);
  } else if (cursors.down.isDown) {
    player.setVelocityY(200);
  } else {
    player.setVelocityY(0);
  }
  
  // Shooting
  if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
    shoot();
  }
  
  // Update bullets
  bullets.children.entries.forEach(bullet => {
    if (bullet.y < 0) {
      bullet.destroy();
    }
  });
  
  enemyBullets.children.entries.forEach(bullet => {
    if (bullet.y > 600) {
      bullet.destroy();
    }
  });
  
  // Update enemies
  enemies.children.entries.forEach(enemy => {
    if (enemy.y > 600) {
      enemy.destroy();
    }
  });
}

// Shooting Function
function shoot() {
  const bullet = bullets.create(player.x, player.y - 30, 'bulletSprite');
  bullet.setVelocityY(-300);
  bullet.setScale(1);
}

// Enemy Shooting
function enemyShoot() {
  if (enemies.children.entries.length > 0) {
    const randomEnemy = Phaser.Utils.Array.GetRandom(enemies.children.entries);
    const bullet = enemyBullets.create(randomEnemy.x, randomEnemy.y + 20, 'bulletSprite');
    bullet.setVelocityY(200);
    bullet.setTint(0xff4444);
  }
}

// Spawn Enemy
function spawnEnemy() {
  const x = Phaser.Math.Between(50, 750);
  const enemy = enemies.create(x, -50, 'enemySprite');
  enemy.setVelocityY(100);
  enemy.setScale(1);
}

// Collision Functions
function hitEnemy(bullet, enemy) {
  bullet.destroy();
  enemy.destroy();
  score += 10;
  scoreText.setText('Score: ' + score);
  
  // Explosion effect
  createExplosion(this, enemy.x, enemy.y);
}

function hitPlayer(player, enemy) {
  enemy.destroy();
  health -= 20;
  updateHealthBar();
  
  if (health <= 0) {
    gameOver = true;
    showGameOver();
  }
}

function hitPlayerBullet(player, bullet) {
  bullet.destroy();
  health -= 10;
  updateHealthBar();
  
  if (health <= 0) {
    gameOver = true;
    showGameOver();
  }
}

// Health Bar
function updateHealthBar() {
  healthBar.clear();
  healthBar.fillStyle(0xff0000);
  healthBar.fillRect(16, 50, health * 2, 20);
  healthBar.fillStyle(0x00ff00);
  healthBar.fillRect(16, 50, health * 2, 20);
}

// Explosion Effect
function createExplosion(scene, x, y) {
  const particles = scene.add.particles(x, y, 'bulletSprite', {
    speed: { min: 50, max: 100 },
    scale: { start: 1, end: 0 },
    lifespan: 500
  });
  
  scene.time.delayedCall(500, () => {
    particles.destroy();
  });
}

// Background Stars
function createStars(scene) {
  for (let i = 0; i < 100; i++) {
    const star = scene.add.circle(
      Phaser.Math.Between(0, 800),
      Phaser.Math.Between(0, 600),
      Phaser.Math.Between(1, 3),
      0xffffff,
      0.8
    );
    
    scene.tweens.add({
      targets: star,
      alpha: 0.2,
      duration: Phaser.Math.Between(1000, 3000),
      yoyo: true,
      repeat: -1
    });
  }
}

// Game Over
function showGameOver() {
  const gameOverText = this.add.text(400, 300, 'GAME OVER\nFinal Score: ' + score, {
    fontSize: '48px',
    fill: '#ff0000',
    align: 'center'
  });
  gameOverText.setOrigin(0.5);
  
  const restartText = this.add.text(400, 400, 'Press R to Restart', {
    fontSize: '24px',
    fill: '#ffffff',
    align: 'center'
  });
  restartText.setOrigin(0.5);
  
  // Restart on R key
  this.input.keyboard.on('keydown-R', () => {
    this.scene.restart();
    score = 0;
    health = 100;
    gameOver = false;
  });
}

// Start Game
function startGame() {
  const game = new Phaser.Game(config);
  return game;
}

export { startGame };
