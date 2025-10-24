// Advanced Sound System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class AdvancedSoundSystem {
  constructor(scene) {
    this.scene = scene;
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.volume = 0.7;
    this.musicVolume = 0.5;
    
    this.soundEffects = {
      // 10 New Sound Effects
      QUANTUM_BLAST: 'quantum_blast',
      DIMENSIONAL_RIFT: 'dimensional_rift',
      VOID_ENERGY: 'void_energy',
      STELLAR_EXPLOSION: 'stellar_explosion',
      GRAVITY_WELL: 'gravity_well',
      COSMIC_WIND: 'cosmic_wind',
      REALITY_DISTORTION: 'reality_distortion',
      SPACE_WARP: 'space_warp',
      ENERGY_STORM: 'energy_storm',
      QUANTUM_FOAM: 'quantum_foam',
      
      // Enhanced existing sounds
      ENHANCED_SHOOT: 'enhanced_shoot',
      ENHANCED_HIT: 'enhanced_hit',
      ENHANCED_POWERUP: 'enhanced_powerup',
      ENHANCED_EXPLOSION: 'enhanced_explosion',
      ENHANCED_COMBO: 'enhanced_combo'
    };
    
    this.musicTracks = {
      // 10 New Music Tracks
      COSMIC_SYMPHONY: 'cosmic_symphony',
      NEBULA_MELODY: 'nebula_melody',
      STELLAR_HARMONY: 'stellar_harmony',
      QUANTUM_RHYTHM: 'quantum_rhythm',
      DIMENSIONAL_CHAOS: 'dimensional_chaos',
      VOID_WHISPERS: 'void_whispers',
      GALACTIC_CENTER: 'galactic_center',
      PULSAR_BEAT: 'pulsar_beat',
      SUPERNOVA_ECHO: 'supernova_echo',
      WORMHOLE_TRANSIT: 'wormhole_transit',
      
      // Enhanced existing tracks
      ENHANCED_MENU: 'enhanced_menu',
      ENHANCED_GAME: 'enhanced_game',
      ENHANCED_BOSS: 'enhanced_boss',
      ENHANCED_VICTORY: 'enhanced_victory',
      ENHANCED_GAME_OVER: 'enhanced_game_over'
    };
  }

  createSoundSprites() {
    // Create programmatic sound effects using Web Audio API
    this.createProgrammaticSounds();
  }

  createProgrammaticSounds() {
    // Create quantum blast sound
    this.createQuantumBlastSound();
    
    // Create dimensional rift sound
    this.createDimensionalRiftSound();
    
    // Create void energy sound
    this.createVoidEnergySound();
    
    // Create stellar explosion sound
    this.createStellarExplosionSound();
    
    // Create gravity well sound
    this.createGravityWellSound();
    
    // Create cosmic wind sound
    this.createCosmicWindSound();
    
    // Create reality distortion sound
    this.createRealityDistortionSound();
    
    // Create space warp sound
    this.createSpaceWarpSound();
    
    // Create energy storm sound
    this.createEnergyStormSound();
    
    // Create quantum foam sound
    this.createQuantumFoamSound();
  }

  createQuantumBlastSound() {
    // Create quantum blast sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.soundEffects.QUANTUM_BLAST = {
      play: () => {
        if (!this.soundEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    };
  }

  createDimensionalRiftSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.soundEffects.DIMENSIONAL_RIFT = {
      play: () => {
        if (!this.soundEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 1);
        
        filter.frequency.setValueAtTime(1000, audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 1);
        
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
      }
    };
  }

  createVoidEnergySound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.soundEffects.VOID_ENERGY = {
      play: () => {
        if (!this.soundEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 0.8);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.8);
        
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.8);
      }
    };
  }

  createStellarExplosionSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.soundEffects.STELLAR_EXPLOSION = {
      play: () => {
        if (!this.soundEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.6, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    };
  }

  createGravityWellSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.soundEffects.GRAVITY_WELL = {
      play: () => {
        if (!this.soundEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 2);
      }
    };
  }

  createCosmicWindSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.soundEffects.COSMIC_WIND = {
      play: () => {
        if (!this.soundEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 1.5);
        
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(200, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1.5);
      }
    };
  }

  createRealityDistortionSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.soundEffects.REALITY_DISTORTION = {
      play: () => {
        if (!this.soundEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    };
  }

  createSpaceWarpSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.soundEffects.SPACE_WARP = {
      play: () => {
        if (!this.soundEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.7);
        
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.7);
      }
    };
  }

  createEnergyStormSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.soundEffects.ENERGY_STORM = {
      play: () => {
        if (!this.soundEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0.7, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      }
    };
  }

  createQuantumFoamSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.soundEffects.QUANTUM_FOAM = {
      play: () => {
        if (!this.soundEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.6);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.6);
      }
    };
  }

  // Music system
  createMusicTracks() {
    // Create programmatic music tracks
    this.createProgrammaticMusic();
  }

  createProgrammaticMusic() {
    // Create cosmic symphony
    this.createCosmicSymphony();
    
    // Create nebula melody
    this.createNebulaMelody();
    
    // Create stellar harmony
    this.createStellarHarmony();
    
    // Create quantum rhythm
    this.createQuantumRhythm();
    
    // Create dimensional chaos
    this.createDimensionalChaos();
  }

  createCosmicSymphony() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.musicTracks.COSMIC_SYMPHONY = {
      play: () => {
        if (!this.musicEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 2);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 2);
      }
    };
  }

  createNebulaMelody() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.musicTracks.NEBULA_MELODY = {
      play: () => {
        if (!this.musicEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(330, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(660, audioContext.currentTime + 3);
        
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 3);
      }
    };
  }

  createStellarHarmony() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.musicTracks.STELLAR_HARMONY = {
      play: () => {
        if (!this.musicEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1047, audioContext.currentTime + 2.5);
        
        gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 2.5);
      }
    };
  }

  createQuantumRhythm() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.musicTracks.QUANTUM_RHYTHM = {
      play: () => {
        if (!this.musicEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 1.5);
        
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1.5);
      }
    };
  }

  createDimensionalChaos() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.musicTracks.DIMENSIONAL_CHAOS = {
      play: () => {
        if (!this.musicEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(110, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 4);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 4);
      }
    };
  }

  // Sound effect methods
  playQuantumBlast() {
    if (this.soundEffects.QUANTUM_BLAST) {
      this.soundEffects.QUANTUM_BLAST.play();
    }
  }

  playDimensionalRift() {
    if (this.soundEffects.DIMENSIONAL_RIFT) {
      this.soundEffects.DIMENSIONAL_RIFT.play();
    }
  }

  playVoidEnergy() {
    if (this.soundEffects.VOID_ENERGY) {
      this.soundEffects.VOID_ENERGY.play();
    }
  }

  playStellarExplosion() {
    if (this.soundEffects.STELLAR_EXPLOSION) {
      this.soundEffects.STELLAR_EXPLOSION.play();
    }
  }

  playGravityWell() {
    if (this.soundEffects.GRAVITY_WELL) {
      this.soundEffects.GRAVITY_WELL.play();
    }
  }

  playCosmicWind() {
    if (this.soundEffects.COSMIC_WIND) {
      this.soundEffects.COSMIC_WIND.play();
    }
  }

  playRealityDistortion() {
    if (this.soundEffects.REALITY_DISTORTION) {
      this.soundEffects.REALITY_DISTORTION.play();
    }
  }

  playSpaceWarp() {
    if (this.soundEffects.SPACE_WARP) {
      this.soundEffects.SPACE_WARP.play();
    }
  }

  playEnergyStorm() {
    if (this.soundEffects.ENERGY_STORM) {
      this.soundEffects.ENERGY_STORM.play();
    }
  }

  playQuantumFoam() {
    if (this.soundEffects.QUANTUM_FOAM) {
      this.soundEffects.QUANTUM_FOAM.play();
    }
  }

  // Music methods
  playCosmicSymphony() {
    if (this.musicTracks.COSMIC_SYMPHONY) {
      this.musicTracks.COSMIC_SYMPHONY.play();
    }
  }

  playNebulaMelody() {
    if (this.musicTracks.NEBULA_MELODY) {
      this.musicTracks.NEBULA_MELODY.play();
    }
  }

  playStellarHarmony() {
    if (this.musicTracks.STELLAR_HARMONY) {
      this.musicTracks.STELLAR_HARMONY.play();
    }
  }

  playQuantumRhythm() {
    if (this.musicTracks.QUANTUM_RHYTHM) {
      this.musicTracks.QUANTUM_RHYTHM.play();
    }
  }

  playDimensionalChaos() {
    if (this.musicTracks.DIMENSIONAL_CHAOS) {
      this.musicTracks.DIMENSIONAL_CHAOS.play();
    }
  }

  // Settings methods
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  // Enhanced existing methods
  playEnhancedShoot() {
    this.playQuantumBlast();
  }

  playEnhancedHit() {
    this.playStellarExplosion();
  }

  playEnhancedPowerUp() {
    this.playQuantumFoam();
  }

  playEnhancedExplosion() {
    this.playStellarExplosion();
  }

  playEnhancedCombo() {
    this.playEnergyStorm();
  }
}
