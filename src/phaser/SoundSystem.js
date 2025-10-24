// Sound System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class SoundSystem {
  constructor(scene) {
    this.scene = scene;
    this.sounds = new Map();
    this.music = new Map();
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.masterVolume = 1.0;
    this.sfxVolume = 0.8;
    this.musicVolume = 0.6;
    this.initializeSounds();
  }

  initializeSounds() {
    // Weapon Sounds
    this.sounds.set('SHOOT_BASIC', { name: 'Basic Shoot', emoji: '🔫', volume: 0.3 });
    this.sounds.set('SHOOT_LASER', { name: 'Laser Shoot', emoji: '🔴', volume: 0.4 });
    this.sounds.set('SHOOT_EXPLOSIVE', { name: 'Explosive Shoot', emoji: '💥', volume: 0.5 });
    this.sounds.set('SHOOT_ELECTRIC', { name: 'Electric Shoot', emoji: '⚡', volume: 0.4 });
    this.sounds.set('SHOOT_PLASMA', { name: 'Plasma Shoot', emoji: '🟣', volume: 0.6 });
    this.sounds.set('SHOOT_FREEZE', { name: 'Freeze Shoot', emoji: '❄️', volume: 0.3 });
    this.sounds.set('SHOOT_HOMING', { name: 'Homing Shoot', emoji: '🎯', volume: 0.4 });
    this.sounds.set('SHOOT_SPREAD', { name: 'Spread Shoot', emoji: '🌟', volume: 0.4 });
    this.sounds.set('SHOOT_RAPID', { name: 'Rapid Shoot', emoji: '⚡', volume: 0.2 });
    this.sounds.set('SHOOT_PIERCE', { name: 'Pierce Shoot', emoji: '⚔️', volume: 0.4 });

    // Enemy Sounds
    this.sounds.set('ENEMY_HIT', { name: 'Enemy Hit', emoji: '💥', volume: 0.4 });
    this.sounds.set('ENEMY_DEATH', { name: 'Enemy Death', emoji: '💀', volume: 0.5 });
    this.sounds.set('BOSS_HIT', { name: 'Boss Hit', emoji: '👑', volume: 0.6 });
    this.sounds.set('BOSS_DEATH', { name: 'Boss Death', emoji: '🐉', volume: 0.8 });
    this.sounds.set('ENEMY_SHOOT', { name: 'Enemy Shoot', emoji: '🔫', volume: 0.3 });
    this.sounds.set('ENEMY_SPAWN', { name: 'Enemy Spawn', emoji: '👾', volume: 0.4 });

    // Player Sounds
    this.sounds.set('PLAYER_HIT', { name: 'Player Hit', emoji: '💔', volume: 0.5 });
    this.sounds.set('PLAYER_DEATH', { name: 'Player Death', emoji: '💀', volume: 0.7 });
    this.sounds.set('SHIELD_HIT', { name: 'Shield Hit', emoji: '🛡️', volume: 0.4 });
    this.sounds.set('SHIELD_BREAK', { name: 'Shield Break', emoji: '💥', volume: 0.6 });

    // Power-up Sounds
    this.sounds.set('POWER_UP_COLLECT', { name: 'Power Up Collect', emoji: '💎', volume: 0.4 });
    this.sounds.set('HEALTH_UP', { name: 'Health Up', emoji: '❤️', volume: 0.3 });
    this.sounds.set('SHIELD_UP', { name: 'Shield Up', emoji: '🛡️', volume: 0.4 });
    this.sounds.set('SPEED_UP', { name: 'Speed Up', emoji: '⚡', volume: 0.3 });
    this.sounds.set('WEAPON_UPGRADE', { name: 'Weapon Upgrade', emoji: '🔫', volume: 0.5 });

    // UI Sounds
    this.sounds.set('BUTTON_CLICK', { name: 'Button Click', emoji: '🔘', volume: 0.3 });
    this.sounds.set('BUTTON_HOVER', { name: 'Button Hover', emoji: '👆', volume: 0.2 });
    this.sounds.set('MENU_OPEN', { name: 'Menu Open', emoji: '📋', volume: 0.4 });
    this.sounds.set('ACHIEVEMENT', { name: 'Achievement', emoji: '🏆', volume: 0.6 });
    this.sounds.set('LEVEL_UP', { name: 'Level Up', emoji: '⬆️', volume: 0.5 });

    // Game Sounds
    this.sounds.set('GAME_START', { name: 'Game Start', emoji: '🚀', volume: 0.6 });
    this.sounds.set('GAME_OVER', { name: 'Game Over', emoji: '💀', volume: 0.7 });
    this.sounds.set('VICTORY', { name: 'Victory', emoji: '🎉', volume: 0.8 });
    this.sounds.set('COMBO', { name: 'Combo', emoji: '🔥', volume: 0.4 });
    this.sounds.set('PERFECT_HIT', { name: 'Perfect Hit', emoji: '🎯', volume: 0.5 });

    // Explosion Sounds
    this.sounds.set('EXPLOSION_SMALL', { name: 'Small Explosion', emoji: '💥', volume: 0.4 });
    this.sounds.set('EXPLOSION_BIG', { name: 'Big Explosion', emoji: '💥', volume: 0.6 });
    this.sounds.set('EXPLOSION_BOSS', { name: 'Boss Explosion', emoji: '💥', volume: 0.8 });

    // Ambient Sounds
    this.sounds.set('ENGINE_HUM', { name: 'Engine Hum', emoji: '🚀', volume: 0.2 });
    this.sounds.set('SPACE_AMBIENT', { name: 'Space Ambient', emoji: '🌌', volume: 0.3 });
    this.sounds.set('WARNING_BEEP', { name: 'Warning Beep', emoji: '⚠️', volume: 0.4 });

    // Music Tracks
    this.music.set('MENU_THEME', { name: 'Menu Theme', emoji: '🎵', volume: 0.5 });
    this.music.set('GAME_THEME', { name: 'Game Theme', emoji: '🎶', volume: 0.4 });
    this.music.set('BOSS_THEME', { name: 'Boss Theme', emoji: '🎼', volume: 0.6 });
    this.music.set('VICTORY_THEME', { name: 'Victory Theme', emoji: '🎊', volume: 0.7 });
    this.music.set('GAME_OVER_THEME', { name: 'Game Over Theme', emoji: '💀', volume: 0.5 });
  }

  createSoundSprites() {
    // Create simple sound sprites using text (for demo purposes)
    // In a real game, you would load actual audio files
    this.sounds.forEach((sound, key) => {
      const text = this.scene.add.text(0, 0, sound.emoji, {
        fontSize: '16px',
        fill: '#ffffff'
      });
      text.generateTexture(`sound_${key}`, 20, 20);
      text.destroy();
    });
  }

  playSound(soundKey, options = {}) {
    if (!this.soundEnabled) return;
    
    const sound = this.sounds.get(soundKey);
    if (!sound) return;

    const volume = (sound.volume * this.sfxVolume * this.masterVolume) * (options.volume || 1);
    
    // Create visual sound indicator (for demo)
    if (options.showVisual) {
      this.createSoundVisual(soundKey, options.x, options.y);
    }
    
    // In a real game, you would play actual audio here
    console.log(`Playing sound: ${sound.name} at volume ${volume}`);
  }

  playMusic(musicKey, options = {}) {
    if (!this.musicEnabled) return;
    
    const music = this.music.get(musicKey);
    if (!music) return;

    const volume = (music.volume * this.musicVolume * this.masterVolume) * (options.volume || 1);
    
    // In a real game, you would play actual music here
    console.log(`Playing music: ${music.name} at volume ${volume}`);
  }

  createSoundVisual(soundKey, x, y) {
    const sound = this.sounds.get(soundKey);
    if (!sound) return;

    const visual = this.scene.add.sprite(x || this.scene.scale.width / 2, y || this.scene.scale.height / 2, `sound_${soundKey}`);
    visual.setScale(0.5);
    visual.setAlpha(0.8);
    
    this.scene.tweens.add({
      targets: visual,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 500,
      onComplete: () => visual.destroy()
    });
  }

  // Weapon Sound Methods
  playShootSound(weaponType) {
    const soundKey = `SHOOT_${weaponType.toUpperCase()}`;
    this.playSound(soundKey, { showVisual: true });
  }

  playEnemyHitSound(enemyType) {
    const soundKey = enemyType === 'boss' ? 'BOSS_HIT' : 'ENEMY_HIT';
    this.playSound(soundKey, { showVisual: true });
  }

  playEnemyDeathSound(enemyType) {
    const soundKey = enemyType === 'boss' ? 'BOSS_DEATH' : 'ENEMY_DEATH';
    this.playSound(soundKey, { showVisual: true });
  }

  playPlayerHitSound() {
    this.playSound('PLAYER_HIT', { showVisual: true });
  }

  playPlayerDeathSound() {
    this.playSound('PLAYER_DEATH', { showVisual: true });
  }

  playPowerUpSound(powerUpType) {
    const soundKey = `POWER_UP_${powerUpType.toUpperCase()}`;
    this.playSound(soundKey, { showVisual: true });
  }

  playExplosionSound(size = 'small') {
    const soundKey = `EXPLOSION_${size.toUpperCase()}`;
    this.playSound(soundKey, { showVisual: true });
  }

  playUISound(action) {
    const soundKey = `BUTTON_${action.toUpperCase()}`;
    this.playSound(soundKey);
  }

  playAchievementSound() {
    this.playSound('ACHIEVEMENT', { showVisual: true });
  }

  playComboSound(combo) {
    this.playSound('COMBO', { volume: Math.min(1, combo / 10) });
  }

  playPerfectHitSound() {
    this.playSound('PERFECT_HIT', { showVisual: true });
  }

  // Music Methods
  playMenuMusic() {
    this.playMusic('MENU_THEME', { loop: true });
  }

  playGameMusic() {
    this.playMusic('GAME_THEME', { loop: true });
  }

  playBossMusic() {
    this.playMusic('BOSS_THEME', { loop: true });
  }

  playVictoryMusic() {
    this.playMusic('VICTORY_THEME', { loop: false });
  }

  playGameOverMusic() {
    this.playMusic('GAME_OVER_THEME', { loop: false });
  }

  // Volume Controls
  setMasterVolume(volume) {
    this.masterVolume = Phaser.Math.Clamp(volume, 0, 1);
  }

  setSFXVolume(volume) {
    this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
  }

  setMusicVolume(volume) {
    this.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    return this.musicEnabled;
  }

  // Sound Effects for Specific Events
  playGameStartSound() {
    this.playSound('GAME_START');
    this.playMusic('GAME_THEME', { loop: true });
  }

  playGameOverSound() {
    this.playSound('GAME_OVER');
    this.playMusic('GAME_OVER_THEME', { loop: false });
  }

  playVictorySound() {
    this.playSound('VICTORY');
    this.playMusic('VICTORY_THEME', { loop: false });
  }

  playLevelUpSound() {
    this.playSound('LEVEL_UP');
  }

  playWarningSound() {
    this.playSound('WARNING_BEEP');
  }

  // Ambient Sounds
  playEngineHum() {
    this.playSound('ENGINE_HUM', { loop: true });
  }

  playSpaceAmbient() {
    this.playSound('SPACE_AMBIENT', { loop: true });
  }

  // Get all sounds for settings menu
  getAllSounds() {
    return Array.from(this.sounds.entries()).map(([key, sound]) => ({
      key,
      name: sound.name,
      emoji: sound.emoji,
      volume: sound.volume
    }));
  }

  getAllMusic() {
    return Array.from(this.music.entries()).map(([key, music]) => ({
      key,
      name: music.name,
      emoji: music.emoji,
      volume: music.volume
    }));
  }
}
