// Menu Scene for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
    this.selectedCharacter = 'kaden';
  }

  preload() {
    // Create character sprites
    this.createCharacterSprites();
    
    // Create background
    this.createBackground();
  }

  create() {
    // Professional background with parallax layers
    this.createProfessionalBackground();
    
    // Animated title with professional styling
    this.createProfessionalTitle();
    
    // Character selection with modern cards
    this.createProfessionalCharacterSelection();
    
    // Professional menu buttons with animations
    this.createProfessionalMenuButtons();
    
    // Game info with modern layout
    this.createProfessionalGameInfo();
    
    // Professional branding
    this.createProfessionalBranding();
    
    // Add ambient sound effects (optional)
    this.createAmbientEffects();
  }

  createCharacterSprites() {
    // Create human emoji textures for characters using canvas
    // Kaden - using boy emoji
    const kadenCanvas = this.textures.createCanvas('kadenSprite', 80, 80);
    const kadenContext = kadenCanvas.getContext();
    kadenContext.font = '60px Arial';
    kadenContext.textAlign = 'center';
    kadenContext.textBaseline = 'middle';
    kadenContext.fillText('👦🏿', 40, 40);
    kadenCanvas.refresh();
    
    // Adelynn - using girl emoji
    const adelynnCanvas = this.textures.createCanvas('adelynnSprite', 80, 80);
    const adelynnContext = adelynnCanvas.getContext();
    adelynnContext.font = '60px Arial';
    adelynnContext.textAlign = 'center';
    adelynnContext.textBaseline = 'middle';
    adelynnContext.fillText('👧', 40, 40);
    adelynnCanvas.refresh();
  }

  createBackground() {
    // Gradient background - full screen
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x000033, 0x000066, 0x000099, 0x0000cc);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);
  }

  createProfessionalBackground() {
    // Multi-layer parallax background
    this.createParallaxStars();
    this.createNebulaEffect();
    this.createParticleField();
    this.createAmbientGlow();
  }

  createParallaxStars() {
    // Far stars (slow moving)
    for (let i = 0; i < 30; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, this.scale.width),
        Phaser.Math.Between(0, this.scale.height),
        Phaser.Math.Between(1, 2),
        0xffffff,
        0.6
      );
      
      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1
      });
    }
    
    // Near stars (fast moving)
    for (let i = 0; i < 20; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, this.scale.width),
        Phaser.Math.Between(0, this.scale.height),
        Phaser.Math.Between(2, 4),
        0x00aaff,
        0.8
      );
      
      this.tweens.add({
        targets: star,
        alpha: 0.3,
        duration: Phaser.Math.Between(1500, 3000),
        yoyo: true,
        repeat: -1
      });
    }
  }

  createNebulaEffect() {
    // Create nebula-like gradient effect
    const nebula = this.add.graphics();
    nebula.fillGradientStyle(0x000033, 0x000066, 0x000099, 0x0000cc, 0.3);
    nebula.fillRect(0, 0, this.scale.width, this.scale.height);
    
    this.tweens.add({
      targets: nebula,
      alpha: 0.1,
      duration: 4000,
      yoyo: true,
      repeat: -1
    });
  }

  createParticleField() {
    // Floating particles
    for (let i = 0; i < 15; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, this.scale.width),
        Phaser.Math.Between(0, this.scale.height),
        Phaser.Math.Between(1, 3),
        0x00ffff,
        0.4
      );
      
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-50, 50),
        y: particle.y + Phaser.Math.Between(-50, 50),
        alpha: 0.1,
        duration: Phaser.Math.Between(4000, 8000),
        yoyo: true,
        repeat: -1
      });
    }
  }

  createAmbientGlow() {
    // Ambient light effect
    const glow = this.add.circle(this.scale.width / 2, this.scale.height / 2, 200, 0x00aaff, 0.05);
    
    this.tweens.add({
      targets: glow,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0.1,
      duration: 3000,
      yoyo: true,
      repeat: -1
    });
  }

  createProfessionalTitle() {
    const centerX = this.scale.width / 2;
    
    // Main title with professional styling
    const title = this.add.text(centerX, 80, 'KADEN & ADELYNN', {
      fontSize: '56px',
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#00aaff',
      strokeThickness: 6,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: '#000000',
        blur: 8,
        fill: true
      }
    });
    title.setOrigin(0.5);
    
    // Professional glow animation
    this.tweens.add({
      targets: title,
      alpha: 0.8,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Subtitle with professional styling
    const subtitle = this.add.text(centerX, 130, 'SPACE ADVENTURES', {
      fontSize: '28px',
      fill: '#00aaff',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 2,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 4,
        fill: true
      }
    });
    subtitle.setOrigin(0.5);
    
    // Tagline
    const tagline = this.add.text(centerX, 160, 'Epic 2D Space Shooter Adventure', {
      fontSize: '18px',
      fill: '#cccccc',
      fontStyle: 'italic'
    });
    tagline.setOrigin(0.5);
    
    // Animate subtitle entrance
    subtitle.setAlpha(0);
    tagline.setAlpha(0);
    
    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 1000,
      delay: 500,
      ease: 'Power2.easeOut'
    });
    
    this.tweens.add({
      targets: tagline,
      alpha: 1,
      duration: 1000,
      delay: 800,
      ease: 'Power2.easeOut'
    });
  }

  createProfessionalCharacterSelection() {
    // Professional section title as a button
    const sectionButton = this.add.rectangle(this.scale.width / 2, 200, 300, 50, 0x00aaff, 0.8);
    sectionButton.setStrokeStyle(3, 0xffffff);
    sectionButton.setInteractive();
    sectionButton.setDepth(2);
    
    const sectionTitle = this.add.text(this.scale.width / 2, 200, 'SELECT YOUR PILOT', {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    });
    sectionTitle.setOrigin(0.5);
    sectionTitle.setDepth(3);
    
    // Button hover effects
    sectionButton.on('pointerover', () => {
      sectionButton.setFillStyle(0x00ccff, 0.9);
      sectionButton.setScale(1.05);
      sectionTitle.setScale(1.05);
    });
    
    sectionButton.on('pointerout', () => {
      sectionButton.setFillStyle(0x00aaff, 0.8);
      sectionButton.setScale(1);
      sectionTitle.setScale(1);
    });
    
    sectionButton.on('pointerdown', () => {
      // Click animation
      this.tweens.add({
        targets: [sectionButton, sectionTitle],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true
      });
      
      // Open character selection modal
      this.openCharacterModal();
    });
  }

  createProfessionalMenuButtons() {
    const centerX = this.scale.width / 2;
    
    // Professional Start Game button
    const startButton = this.add.rectangle(centerX, 480, 250, 60, 0x00aaff, 0.8);
    startButton.setStrokeStyle(3, 0xffffff);
    startButton.setInteractive();
    startButton.setDepth(2);
    
    const startText = this.add.text(centerX, 480, '🚀 START MISSION', {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    });
    startText.setOrigin(0.5);
    startText.setDepth(3);
    
    // Professional Settings button
    const settingsButton = this.add.rectangle(centerX, 560, 200, 50, 0x666666, 0.8);
    settingsButton.setStrokeStyle(2, 0xffffff);
    settingsButton.setInteractive();
    settingsButton.setDepth(2);
    
    const settingsText = this.add.text(centerX, 560, '⚙️ SETTINGS', {
      fontSize: '20px',
      fill: '#ffffff',
      fontStyle: 'bold'
    });
    settingsText.setOrigin(0.5);
    settingsText.setDepth(3);
    
    // Professional button animations and interactions
    startButton.on('pointerover', () => {
      startButton.setFillStyle(0x00ccff, 0.9);
      startButton.setScale(1.05);
      startText.setScale(1.05);
    });
    
    startButton.on('pointerout', () => {
      startButton.setFillStyle(0x00aaff, 0.8);
      startButton.setScale(1);
      startText.setScale(1);
    });
    
    startButton.on('pointerdown', () => {
      // Professional click animation
      this.tweens.add({
        targets: [startButton, startText],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.scene.start('GameScene');
        }
      });
    });
    
    settingsButton.on('pointerover', () => {
      settingsButton.setFillStyle(0x888888, 0.9);
      settingsButton.setScale(1.05);
      settingsText.setScale(1.05);
    });
    
    settingsButton.on('pointerout', () => {
      settingsButton.setFillStyle(0x666666, 0.8);
      settingsButton.setScale(1);
      settingsText.setScale(1);
    });
    
    settingsButton.on('pointerdown', () => {
      // Professional click animation
      this.tweens.add({
        targets: [settingsButton, settingsText],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true
      });
    });
    
    // Professional entrance animations
    startButton.setAlpha(0);
    startText.setAlpha(0);
    settingsButton.setAlpha(0);
    settingsText.setAlpha(0);
    
    this.tweens.add({
      targets: [startButton, startText],
      alpha: 1,
      duration: 1000,
      delay: 1200,
      ease: 'Power2.easeOut'
    });
    
    this.tweens.add({
      targets: [settingsButton, settingsText],
      alpha: 1,
      duration: 1000,
      delay: 1400,
      ease: 'Power2.easeOut'
    });
  }

  createProfessionalGameInfo() {
    const centerX = this.scale.width / 2;
    
    // Professional info panel
    const infoPanel = this.add.rectangle(centerX, 570, 600, 40, 0x000000, 0.3);
    infoPanel.setStrokeStyle(1, 0x00aaff);
    infoPanel.setDepth(1);
    
    const infoText = this.add.text(centerX, 570, '🎮 ARROW KEYS TO MOVE • SPACE TO SHOOT • WASD ALTERNATIVE', {
      fontSize: '14px',
      fill: '#00aaff',
      fontStyle: 'bold'
    });
    infoText.setOrigin(0.5);
    infoText.setDepth(2);
    
    // Animate info panel entrance
    infoPanel.setAlpha(0);
    infoText.setAlpha(0);
    
    this.tweens.add({
      targets: [infoPanel, infoText],
      alpha: 1,
      duration: 1000,
      delay: 1600,
      ease: 'Power2.easeOut'
    });
  }

  createProfessionalBranding() {
    const centerX = this.scale.width / 2;
    const branding = this.add.text(centerX, 590, '© 2025 Bradley Virtual Solutions, LLC', {
      fontSize: '12px',
      fill: '#666666',
      fontStyle: 'italic'
    });
    branding.setOrigin(0.5);
    branding.setAlpha(0);
    
    this.tweens.add({
      targets: branding,
      alpha: 1,
      duration: 1000,
      delay: 1800,
      ease: 'Power2.easeOut'
    });
  }

  createAmbientEffects() {
    // Professional ambient effects
    this.createFloatingParticles();
    this.createScreenGlow();
  }

  createFloatingParticles() {
    // Professional floating particles
    for (let i = 0; i < 10; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, this.scale.width),
        Phaser.Math.Between(0, this.scale.height),
        Phaser.Math.Between(1, 2),
        0x00ffff,
        0.3
      );
      
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-100, 100),
        y: particle.y + Phaser.Math.Between(-100, 100),
        alpha: 0.1,
        duration: Phaser.Math.Between(6000, 12000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createScreenGlow() {
    // Professional screen glow effect
    const glow = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x00aaff, 0.02);
    
    this.tweens.add({
      targets: glow,
      alpha: 0.05,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}
