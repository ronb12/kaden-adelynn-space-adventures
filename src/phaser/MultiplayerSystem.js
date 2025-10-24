// Multiplayer System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class MultiplayerSystem {
  constructor(scene) {
    this.scene = scene;
    this.isMultiplayer = false;
    this.players = [];
    this.player1 = null;
    this.player2 = null;
    this.player1Score = 0;
    this.player2Score = 0;
    this.player1Health = 100;
    this.player2Health = 100;
    this.player1Shield = 0;
    this.player2Shield = 0;
    this.player1Controls = null;
    this.player2Controls = null;
    this.player1Weapon = 'BASIC';
    this.player2Weapon = 'BASIC';
    this.player1PowerUps = [];
    this.player2PowerUps = [];
    this.player1Stats = {
      enemiesKilled: 0,
      bossesKilled: 0,
      killStreak: 0,
      maxKillStreak: 0,
      powerUpsCollected: 0,
      shotsFired: 0,
      damageDealt: 0,
      damageTaken: 0
    };
    this.player2Stats = {
      enemiesKilled: 0,
      bossesKilled: 0,
      killStreak: 0,
      maxKillStreak: 0,
      powerUpsCollected: 0,
      shotsFired: 0,
      damageDealt: 0,
      damageTaken: 0
    };
  }

  enableMultiplayer() {
    this.isMultiplayer = true;
    this.createPlayer2();
    this.setupMultiplayerControls();
    this.createMultiplayerUI();
    this.scene.soundSystem.playSound('BUTTON_CLICK');
  }

  disableMultiplayer() {
    this.isMultiplayer = false;
    if (this.player2) {
      this.player2.destroy();
      this.player2 = null;
    }
    this.scene.soundSystem.playSound('BUTTON_CLICK');
  }

  createPlayer2() {
    if (this.player2) return;
    
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;
    
    // Create player 2 sprite
    const player2Graphics = this.scene.add.graphics();
    player2Graphics.fillStyle(0xff69b4);
    player2Graphics.fillRect(0, 0, 50, 60);
    player2Graphics.generateTexture('player2Sprite', 50, 60);
    player2Graphics.destroy();
    
    // Create player 2
    this.player2 = this.scene.physics.add.sprite(centerX + 100, centerY + 100, 'player2Sprite');
    this.player2.setCollideWorldBounds(true);
    this.player2.setScale(1);
    this.player2.setData('player', 2);
    this.player2.setData('health', 100);
    this.player2.setData('shield', 0);
    this.player2.setData('weapon', 'BASIC');
    this.player2.setData('powerUps', []);
    
    // Add to players array
    this.players.push(this.player2);
    
    // Set player 1 reference
    this.player1 = this.scene.player;
    this.player1.setData('player', 1);
    this.players.push(this.player1);
  }

  setupMultiplayerControls() {
    // Player 1 controls (WASD + Space)
    this.player1Controls = {
      up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      shoot: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    };
    
    // Player 2 controls (Arrow Keys + Enter)
    this.player2Controls = {
      up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      shoot: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    };
  }

  createMultiplayerUI() {
    // Player 1 UI
    this.player1ScoreText = this.scene.add.text(16, 16, 'Player 1: 0', {
      fontSize: '24px',
      fill: '#00aaff'
    });
    
    this.player1HealthText = this.scene.add.text(16, 40, 'Health: 100', {
      fontSize: '18px',
      fill: '#ffffff'
    });
    
    this.player1HealthBar = this.scene.add.graphics();
    this.updatePlayer1HealthBar();
    
    // Player 2 UI
    this.player2ScoreText = this.scene.add.text(this.scene.scale.width - 200, 16, 'Player 2: 0', {
      fontSize: '24px',
      fill: '#ff69b4'
    });
    
    this.player2HealthText = this.scene.add.text(this.scene.scale.width - 200, 40, 'Health: 100', {
      fontSize: '18px',
      fill: '#ffffff'
    });
    
    this.player2HealthBar = this.scene.add.graphics();
    this.updatePlayer2HealthBar();
    
    // Multiplayer status
    this.multiplayerStatusText = this.scene.add.text(
      this.scene.scale.width / 2, 
      16, 
      'MULTIPLAYER MODE', 
      {
        fontSize: '20px',
        fill: '#ffff00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }
    );
    this.multiplayerStatusText.setOrigin(0.5);
  }

  updateMultiplayer() {
    if (!this.isMultiplayer) return;
    
    this.handlePlayer1Input();
    this.handlePlayer2Input();
    this.updateMultiplayerUI();
    this.checkMultiplayerCollisions();
  }

  handlePlayer1Input() {
    if (!this.player1 || !this.player1Controls) return;
    
    // Movement
    if (this.player1Controls.left.isDown) {
      this.player1.setVelocityX(-200);
    } else if (this.player1Controls.right.isDown) {
      this.player1.setVelocityX(200);
    } else {
      this.player1.setVelocityX(0);
    }
    
    if (this.player1Controls.up.isDown) {
      this.player1.setVelocityY(-200);
    } else if (this.player1Controls.down.isDown) {
      this.player1.setVelocityY(200);
    } else {
      this.player1.setVelocityY(0);
    }
    
    // Shooting
    if (Phaser.Input.Keyboard.JustDown(this.player1Controls.shoot)) {
      this.shootPlayer1();
    }
  }

  handlePlayer2Input() {
    if (!this.player2 || !this.player2Controls) return;
    
    // Movement
    if (this.player2Controls.left.isDown) {
      this.player2.setVelocityX(-200);
    } else if (this.player2Controls.right.isDown) {
      this.player2.setVelocityX(200);
    } else {
      this.player2.setVelocityX(0);
    }
    
    if (this.player2Controls.up.isDown) {
      this.player2.setVelocityY(-200);
    } else if (this.player2Controls.down.isDown) {
      this.player2.setVelocityY(200);
    } else {
      this.player2.setVelocityY(0);
    }
    
    // Shooting
    if (Phaser.Input.Keyboard.JustDown(this.player2Controls.shoot)) {
      this.shootPlayer2();
    }
  }

  shootPlayer1() {
    if (this.scene.weaponSystem.canFire()) {
      this.scene.weaponSystem.fireWeapon(this.player1.x, this.player1.y);
      this.player1Stats.shotsFired++;
      this.scene.soundSystem.playShootSound(this.player1Weapon);
    }
  }

  shootPlayer2() {
    if (this.scene.weaponSystem.canFire()) {
      this.scene.weaponSystem.fireWeapon(this.player2.x, this.player2.y);
      this.player2Stats.shotsFired++;
      this.scene.soundSystem.playShootSound(this.player2Weapon);
    }
  }

  updateMultiplayerUI() {
    // Update player 1 UI
    this.player1ScoreText.setText(`Player 1: ${this.player1Score}`);
    this.player1HealthText.setText(`Health: ${this.player1Health}`);
    this.updatePlayer1HealthBar();
    
    // Update player 2 UI
    this.player2ScoreText.setText(`Player 2: ${this.player2Score}`);
    this.player2HealthText.setText(`Health: ${this.player2Health}`);
    this.updatePlayer2HealthBar();
  }

  updatePlayer1HealthBar() {
    this.player1HealthBar.clear();
    this.player1HealthBar.fillStyle(0xff0000);
    this.player1HealthBar.fillRect(16, 60, 200, 20);
    this.player1HealthBar.fillStyle(0x00ff00);
    this.player1HealthBar.fillRect(16, 60, this.player1Health * 2, 20);
  }

  updatePlayer2HealthBar() {
    this.player2HealthBar.clear();
    this.player2HealthBar.fillStyle(0xff0000);
    this.player2HealthBar.fillRect(this.scene.scale.width - 216, 60, 200, 20);
    this.player2HealthBar.fillStyle(0x00ff00);
    this.player2HealthBar.fillRect(this.scene.scale.width - 216, 60, this.player2Health * 2, 20);
  }

  checkMultiplayerCollisions() {
    // Check player collisions with enemies
    this.scene.enemies.children.entries.forEach(enemy => {
      if (this.player1 && Phaser.Geom.Rectangle.Overlaps(this.player1.getBounds(), enemy.getBounds())) {
        this.hitPlayer(1, enemy);
      }
      if (this.player2 && Phaser.Geom.Rectangle.Overlaps(this.player2.getBounds(), enemy.getBounds())) {
        this.hitPlayer(2, enemy);
      }
    });
    
    // Check player collisions with enemy bullets
    this.scene.enemyBullets.children.entries.forEach(bullet => {
      if (this.player1 && Phaser.Geom.Rectangle.Overlaps(this.player1.getBounds(), bullet.getBounds())) {
        this.hitPlayerBullet(1, bullet);
      }
      if (this.player2 && Phaser.Geom.Rectangle.Overlaps(this.player2.getBounds(), bullet.getBounds())) {
        this.hitPlayerBullet(2, bullet);
      }
    });
    
    // Check player collisions with power-ups
    this.scene.powerUps.children.entries.forEach(powerUp => {
      if (this.player1 && Phaser.Geom.Rectangle.Overlaps(this.player1.getBounds(), powerUp.getBounds())) {
        this.collectPowerUp(1, powerUp);
      }
      if (this.player2 && Phaser.Geom.Rectangle.Overlaps(this.player2.getBounds(), powerUp.getBounds())) {
        this.collectPowerUp(2, powerUp);
      }
    });
  }

  hitPlayer(playerNum, enemy) {
    enemy.destroy();
    
    if (playerNum === 1) {
      this.player1Health -= 20;
      this.player1Stats.damageTaken += 20;
    } else {
      this.player2Health -= 20;
      this.player2Stats.damageTaken += 20;
    }
    
    this.scene.soundSystem.playPlayerHitSound();
    
    if (this.player1Health <= 0 || this.player2Health <= 0) {
      this.showMultiplayerGameOver();
    }
  }

  hitPlayerBullet(playerNum, bullet) {
    bullet.destroy();
    
    if (playerNum === 1) {
      this.player1Health -= 10;
      this.player1Stats.damageTaken += 10;
    } else {
      this.player2Health -= 10;
      this.player2Stats.damageTaken += 10;
    }
    
    this.scene.soundSystem.playPlayerHitSound();
    
    if (this.player1Health <= 0 || this.player2Health <= 0) {
      this.showMultiplayerGameOver();
    }
  }

  collectPowerUp(playerNum, powerUp) {
    const powerUpType = powerUp.getData('type');
    
    if (playerNum === 1) {
      this.player1PowerUps.push(powerUpType);
      this.player1Stats.powerUpsCollected++;
    } else {
      this.player2PowerUps.push(powerUpType);
      this.player2Stats.powerUpsCollected++;
    }
    
    this.scene.soundSystem.playPowerUpSound(powerUpType);
    this.scene.particleSystem.createPowerUpEffect(
      playerNum === 1 ? this.player1.x : this.player2.x,
      playerNum === 1 ? this.player1.y : this.player2.y,
      powerUpType
    );
    
    powerUp.destroy();
  }

  showMultiplayerGameOver() {
    const winner = this.player1Health > 0 ? 1 : 2;
    const winnerScore = winner === 1 ? this.player1Score : this.player2Score;
    
    this.scene.soundSystem.playGameOverSound();
    
    const gameOverText = this.scene.add.text(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2 - 50, 
      `Player ${winner} Wins!\nFinal Score: ${winnerScore}`, 
      {
        fontSize: '48px',
        fill: winner === 1 ? '#00aaff' : '#ff69b4',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    gameOverText.setOrigin(0.5);
    
    const statsText = this.scene.add.text(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2 + 50, 
      `Player 1: ${this.player1Score} | Player 2: ${this.player2Score}`, 
      {
        fontSize: '24px',
        fill: '#ffffff',
        align: 'center'
      }
    );
    statsText.setOrigin(0.5);
    
    const restartText = this.scene.add.text(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2 + 100, 
      'Press R to Restart or M for Menu', 
      {
        fontSize: '20px',
        fill: '#ffffff',
        align: 'center'
      }
    );
    restartText.setOrigin(0.5);
    
    // Restart on R key
    this.scene.input.keyboard.on('keydown-R', () => {
      this.scene.scene.restart();
    });
    
    // Menu on M key
    this.scene.input.keyboard.on('keydown-M', () => {
      this.scene.scene.start('MenuScene');
    });
  }

  getMultiplayerStats() {
    return {
      isMultiplayer: this.isMultiplayer,
      player1: {
        score: this.player1Score,
        health: this.player1Health,
        shield: this.player1Shield,
        weapon: this.player1Weapon,
        powerUps: this.player1PowerUps,
        stats: this.player1Stats
      },
      player2: {
        score: this.player2Score,
        health: this.player2Health,
        shield: this.player2Shield,
        weapon: this.player2Weapon,
        powerUps: this.player2PowerUps,
        stats: this.player2Stats
      }
    };
  }

  resetMultiplayer() {
    this.player1Score = 0;
    this.player2Score = 0;
    this.player1Health = 100;
    this.player2Health = 100;
    this.player1Shield = 0;
    this.player2Shield = 0;
    this.player1Weapon = 'BASIC';
    this.player2Weapon = 'BASIC';
    this.player1PowerUps = [];
    this.player2PowerUps = [];
    this.player1Stats = {
      enemiesKilled: 0,
      bossesKilled: 0,
      killStreak: 0,
      maxKillStreak: 0,
      powerUpsCollected: 0,
      shotsFired: 0,
      damageDealt: 0,
      damageTaken: 0
    };
    this.player2Stats = {
      enemiesKilled: 0,
      bossesKilled: 0,
      killStreak: 0,
      maxKillStreak: 0,
      powerUpsCollected: 0,
      shotsFired: 0,
      damageDealt: 0,
      damageTaken: 0
    };
  }

  isPlayerAlive(playerNum) {
    if (playerNum === 1) {
      return this.player1Health > 0;
    } else {
      return this.player2Health > 0;
    }
  }

  getAlivePlayers() {
    const alivePlayers = [];
    if (this.player1Health > 0) alivePlayers.push(1);
    if (this.player2Health > 0) alivePlayers.push(2);
    return alivePlayers;
  }

  getWinner() {
    const alivePlayers = this.getAlivePlayers();
    if (alivePlayers.length === 1) {
      return alivePlayers[0];
    }
    return null;
  }

  isGameOver() {
    return this.getAlivePlayers().length === 0;
  }
}
