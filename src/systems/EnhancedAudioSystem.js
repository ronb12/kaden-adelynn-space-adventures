// Enhanced Audio System for #1 Space Shooter Game

export class EnhancedAudioSystem {
  constructor() {
    this.audioContext = null;
    this.sounds = new Map();
    this.music = new Map();
    this.masterVolume = 0.7;
    this.sfxVolume = 0.8;
    this.musicVolume = 0.6;
    this.isMuted = false;
    this.currentMusic = null;
    this.audioNodes = new Map();
  }

  // Initialize audio context
  async init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Create audio nodes
      this.createAudioNodes();
      
      // Generate sound effects
      this.generateSoundEffects();
      
      // Generate background music
      this.generateBackgroundMusic();
      
      console.log('✅ Enhanced Audio System initialized');
    } catch (error) {
      console.error('❌ Audio system initialization failed:', error);
    }
  }

  // Create audio nodes
  createAudioNodes() {
    // Master gain node
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = this.masterVolume;

    // SFX gain node
    this.sfxGain = this.audioContext.createGain();
    this.sfxGain.connect(this.masterGain);
    this.sfxGain.gain.value = this.sfxVolume;

    // Music gain node
    this.musicGain = this.audioContext.createGain();
    this.musicGain.connect(this.masterGain);
    this.musicGain.gain.value = this.musicVolume;

    // Reverb effect
    this.reverb = this.audioContext.createConvolver();
    this.reverb.connect(this.musicGain);
    
    // Low-pass filter for music
    this.musicFilter = this.audioContext.createBiquadFilter();
    this.musicFilter.type = 'lowpass';
    this.musicFilter.frequency.value = 2000;
    this.musicFilter.connect(this.reverb);
  }

  // Generate sound effects using Web Audio API
  generateSoundEffects() {
    // Shoot sound
    this.sounds.set('shoot', this.createShootSound());
    
    // Explosion sound
    this.sounds.set('explosion', this.createExplosionSound());
    
    // Power-up collection sound
    this.sounds.set('powerUp', this.createPowerUpSound());
    
    // Enemy hit sound
    this.sounds.set('enemyHit', this.createEnemyHitSound());
    
    // Player hit sound
    this.sounds.set('playerHit', this.createPlayerHitSound());
    
    // Boss spawn sound
    this.sounds.set('bossSpawn', this.createBossSpawnSound());
    
    // Game over sound
    this.sounds.set('gameOver', this.createGameOverSound());
    
    // Victory sound
    this.sounds.set('victory', this.createVictorySound());
  }

  // Generate background music
  generateBackgroundMusic() {
    // Menu music
    this.music.set('menu', this.createMenuMusic());
    
    // Gameplay music
    this.music.set('gameplay', this.createGameplayMusic());
    
    // Boss music
    this.music.set('boss', this.createBossMusic());
    
    // Victory music
    this.music.set('victory', this.createVictoryMusic());
  }

  // Create shoot sound
  createShootSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    };
  }

  // Create explosion sound
  createExplosionSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    };
  }

  // Create power-up collection sound
  createPowerUpSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    };
  }

  // Create enemy hit sound
  createEnemyHitSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    };
  }

  // Create player hit sound
  createPlayerHitSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    };
  }

  // Create boss spawn sound
  createBossSpawnSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 1.0);
      
      gainNode.gain.setValueAtTime(0.6, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 1.0);
    };
  }

  // Create game over sound
  createGameOverSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 2.0);
      
      gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2.0);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 2.0);
    };
  }

  // Create victory sound
  createVictorySound() {
    return () => {
      if (!this.audioContext) return;
      
      const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
      
      notes.forEach((note, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note, this.audioContext.currentTime + index * 0.2);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime + index * 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.2 + 0.5);
        
        oscillator.start(this.audioContext.currentTime + index * 0.2);
        oscillator.stop(this.audioContext.currentTime + index * 0.2 + 0.5);
      });
    };
  }

  // Create menu music
  createMenuMusic() {
    return () => {
      if (!this.audioContext) return;
      
      // Create a simple ambient melody
      const melody = [261, 329, 392, 523]; // C4, E4, G4, C5
      
      melody.forEach((note, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.musicFilter);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note, this.audioContext.currentTime + index * 0.5);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime + index * 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.5 + 1.0);
        
        oscillator.start(this.audioContext.currentTime + index * 0.5);
        oscillator.stop(this.audioContext.currentTime + index * 0.5 + 1.0);
      });
    };
  }

  // Create gameplay music
  createGameplayMusic() {
    return () => {
      if (!this.audioContext) return;
      
      // Create intense gameplay music
      const bassLine = [110, 123, 138, 146]; // A2, B2, C#3, D3
      
      bassLine.forEach((note, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.musicFilter);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(note, this.audioContext.currentTime + index * 0.25);
        
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime + index * 0.25);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.25 + 0.5);
        
        oscillator.start(this.audioContext.currentTime + index * 0.25);
        oscillator.stop(this.audioContext.currentTime + index * 0.25 + 0.5);
      });
    };
  }

  // Create boss music
  createBossMusic() {
    return () => {
      if (!this.audioContext) return;
      
      // Create dramatic boss music
      const bossNotes = [82, 98, 110, 123]; // E2, G2, A2, B2
      
      bossNotes.forEach((note, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.musicFilter);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(note, this.audioContext.currentTime + index * 0.5);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime + index * 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.5 + 1.0);
        
        oscillator.start(this.audioContext.currentTime + index * 0.5);
        oscillator.stop(this.audioContext.currentTime + index * 0.5 + 1.0);
      });
    };
  }

  // Create victory music
  createVictoryMusic() {
    return () => {
      if (!this.audioContext) return;
      
      // Create triumphant victory music
      const victoryNotes = [523, 659, 784, 1047, 1319]; // C5, E5, G5, C6, E6
      
      victoryNotes.forEach((note, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.musicFilter);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note, this.audioContext.currentTime + index * 0.3);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime + index * 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.3 + 0.8);
        
        oscillator.start(this.audioContext.currentTime + index * 0.3);
        oscillator.stop(this.audioContext.currentTime + index * 0.3 + 0.8);
      });
    };
  }

  // Play sound effect
  playSound(soundName) {
    if (this.isMuted || !this.sounds.has(soundName)) return;
    
    try {
      this.sounds.get(soundName)();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  // Play music
  playMusic(musicName) {
    if (this.isMuted || !this.music.has(musicName)) return;
    
    try {
      if (this.currentMusic !== musicName) {
        this.currentMusic = musicName;
        this.music.get(musicName)();
      }
    } catch (error) {
      console.error('Error playing music:', error);
    }
  }

  // Stop music
  stopMusic() {
    this.currentMusic = null;
  }

  // Set master volume
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.masterVolume;
    }
  }

  // Set SFX volume
  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
  }

  // Set music volume
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicVolume;
    }
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : this.masterVolume;
    }
  }

  // Get audio settings
  getAudioSettings() {
    return {
      masterVolume: this.masterVolume,
      sfxVolume: this.sfxVolume,
      musicVolume: this.musicVolume,
      isMuted: this.isMuted
    };
  }
}

export default EnhancedAudioSystem;
