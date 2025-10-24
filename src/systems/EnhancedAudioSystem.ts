// Enhanced Audio System - Complete Audio Implementation

export class EnhancedAudioSystem {
  private audioContext: AudioContext | null = null;
  private masterVolume: number = 0.8;
  private musicVolume: number = 0.7;
  private sfxVolume: number = 0.9;
  private voiceVolume: number = 0.85;
  
  // Audio buffers for different sounds
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private musicTracks: Map<string, AudioBufferSourceNode> = new Map();
  private currentMusic: AudioBufferSourceNode | null = null;
  
  // Procedural audio generation
  private proceduralAudio: boolean = true;
  private audioNodes: Map<string, AudioNode> = new Map();
  
  constructor() {
    this.initializeAudioContext();
    this.generateProceduralAudio();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      console.log('Audio context initialized');
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  // Generate procedural audio for all game sounds
  private generateProceduralAudio() {
    if (!this.audioContext) return;

    // Generate shooting sounds
    this.generateShootingSounds();
    
    // Generate explosion sounds
    this.generateExplosionSounds();
    
    // Generate power-up sounds
    this.generatePowerUpSounds();
    
    // Generate boss sounds
    this.generateBossSounds();
    
    // Generate UI sounds
    this.generateUISounds();
    
    // Generate ambient sounds
    this.generateAmbientSounds();
    
    // Generate music tracks
    this.generateMusicTracks();
  }

  private generateShootingSounds() {
    if (!this.audioContext) return;

    // Basic laser sound
    const laserBuffer = this.createToneBuffer(800, 0.1, 'sine');
    this.audioBuffers.set('laser_shoot', laserBuffer);
    
    // Rapid fire sound
    const rapidBuffer = this.createToneBuffer(1200, 0.05, 'square');
    this.audioBuffers.set('rapid_fire', rapidBuffer);
    
    // Plasma sound
    const plasmaBuffer = this.createToneBuffer(600, 0.2, 'sawtooth');
    this.audioBuffers.set('plasma_shoot', plasmaBuffer);
    
    // Homing missile sound
    const missileBuffer = this.createToneBuffer(400, 0.3, 'triangle');
    this.audioBuffers.set('missile_shoot', missileBuffer);
  }

  private generateExplosionSounds() {
    if (!this.audioContext) return;

    // Small explosion
    const smallExplosion = this.createNoiseBuffer(0.3, 0.1);
    this.audioBuffers.set('explosion_small', smallExplosion);
    
    // Large explosion
    const largeExplosion = this.createNoiseBuffer(0.8, 0.5);
    this.audioBuffers.set('explosion_large', largeExplosion);
    
    // Boss explosion
    const bossExplosion = this.createNoiseBuffer(1.0, 1.0);
    this.audioBuffers.set('explosion_boss', bossExplosion);
  }

  private generatePowerUpSounds() {
    if (!this.audioContext) return;

    // Power-up collection sound
    const powerUpBuffer = this.createToneBuffer(1000, 0.2, 'sine');
    this.audioBuffers.set('powerup_collect', powerUpBuffer);
    
    // Health power-up
    const healthBuffer = this.createToneBuffer(600, 0.3, 'sine');
    this.audioBuffers.set('powerup_health', healthBuffer);
    
    // Speed power-up
    const speedBuffer = this.createToneBuffer(800, 0.2, 'square');
    this.audioBuffers.set('powerup_speed', speedBuffer);
    
    // Shield power-up
    const shieldBuffer = this.createToneBuffer(400, 0.4, 'triangle');
    this.audioBuffers.set('powerup_shield', shieldBuffer);
  }

  private generateBossSounds() {
    if (!this.audioContext) return;

    // Boss spawn sound
    const bossSpawn = this.createToneBuffer(200, 2.0, 'sawtooth');
    this.audioBuffers.set('boss_spawn', bossSpawn);
    
    // Boss attack sound
    const bossAttack = this.createToneBuffer(300, 0.5, 'square');
    this.audioBuffers.set('boss_attack', bossAttack);
    
    // Boss special attack
    const bossSpecial = this.createToneBuffer(150, 1.0, 'sawtooth');
    this.audioBuffers.set('boss_special', bossSpecial);
  }

  private generateUISounds() {
    if (!this.audioContext) return;

    // Button click
    const buttonClick = this.createToneBuffer(1000, 0.1, 'sine');
    this.audioBuffers.set('ui_click', buttonClick);
    
    // Button hover
    const buttonHover = this.createToneBuffer(800, 0.05, 'sine');
    this.audioBuffers.set('ui_hover', buttonHover);
    
    // Achievement unlock
    const achievement = this.createToneBuffer(1200, 0.5, 'sine');
    this.audioBuffers.set('achievement', achievement);
    
    // Menu transition
    const menuTransition = this.createToneBuffer(600, 0.2, 'triangle');
    this.audioBuffers.set('menu_transition', menuTransition);
  }

  private generateAmbientSounds() {
    if (!this.audioContext) return;

    // Space ambient
    const spaceAmbient = this.createNoiseBuffer(0.1, 10.0);
    this.audioBuffers.set('space_ambient', spaceAmbient);
    
    // Engine hum
    const engineHum = this.createToneBuffer(60, 5.0, 'sine');
    this.audioBuffers.set('engine_hum', engineHum);
  }

  private generateMusicTracks() {
    if (!this.audioContext) return;

    // Menu music
    const menuMusic = this.createMusicBuffer('menu');
    this.audioBuffers.set('music_menu', menuMusic);
    
    // Gameplay music
    const gameplayMusic = this.createMusicBuffer('gameplay');
    this.audioBuffers.set('music_gameplay', gameplayMusic);
    
    // Boss music
    const bossMusic = this.createMusicBuffer('boss');
    this.audioBuffers.set('music_boss', bossMusic);
  }

  // Create tone buffer
  private createToneBuffer(frequency: number, duration: number, waveType: OscillatorType): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');
    
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;
      let value = 0;
      
      switch (waveType) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * time);
          break;
        case 'square':
          value = Math.sin(2 * Math.PI * frequency * time) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          value = 2 * (time * frequency - Math.floor(time * frequency + 0.5));
          break;
        case 'triangle':
          value = 2 * Math.abs(2 * (time * frequency - Math.floor(time * frequency + 0.5))) - 1;
          break;
      }
      
      // Apply envelope
      const envelope = Math.exp(-time * 3);
      data[i] = value * envelope * 0.3;
    }
    
    return buffer;
  }

  // Create noise buffer
  private createNoiseBuffer(volume: number, duration: number): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');
    
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * volume;
    }
    
    return buffer;
  }

  // Create music buffer
  private createMusicBuffer(type: string): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');
    
    const sampleRate = this.audioContext.sampleRate;
    const duration = 30; // 30 seconds
    const buffer = this.audioContext.createBuffer(2, sampleRate * duration, sampleRate);
    
    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);
    
    // Generate procedural music based on type
    for (let i = 0; i < leftChannel.length; i++) {
      const time = i / sampleRate;
      let leftValue = 0;
      let rightValue = 0;
      
      switch (type) {
        case 'menu':
          leftValue = this.generateMenuMelody(time);
          rightValue = this.generateMenuHarmony(time);
          break;
        case 'gameplay':
          leftValue = this.generateGameplayMelody(time);
          rightValue = this.generateGameplayHarmony(time);
          break;
        case 'boss':
          leftValue = this.generateBossMelody(time);
          rightValue = this.generateBossHarmony(time);
          break;
      }
      
      leftChannel[i] = leftValue * 0.3;
      rightChannel[i] = rightValue * 0.3;
    }
    
    return buffer;
  }

  // Generate menu melody
  private generateMenuMelody(time: number): number {
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C major scale
    const noteIndex = Math.floor(time * 2) % notes.length;
    const frequency = notes[noteIndex];
    
    return Math.sin(2 * Math.PI * frequency * time) * 0.5;
  }

  // Generate menu harmony
  private generateMenuHarmony(time: number): number {
    const notes = [130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63]; // C major scale octave lower
    const noteIndex = Math.floor(time * 1.5) % notes.length;
    const frequency = notes[noteIndex];
    
    return Math.sin(2 * Math.PI * frequency * time) * 0.3;
  }

  // Generate gameplay melody
  private generateGameplayMelody(time: number): number {
    const notes = [440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00]; // A minor scale
    const noteIndex = Math.floor(time * 4) % notes.length;
    const frequency = notes[noteIndex];
    
    return Math.sin(2 * Math.PI * frequency * time) * 0.6;
  }

  // Generate gameplay harmony
  private generateGameplayHarmony(time: number): number {
    const notes = [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00]; // A minor scale octave lower
    const noteIndex = Math.floor(time * 3) % notes.length;
    const frequency = notes[noteIndex];
    
    return Math.sin(2 * Math.PI * frequency * time) * 0.4;
  }

  // Generate boss melody
  private generateBossMelody(time: number): number {
    const notes = [146.83, 164.81, 185.00, 196.00, 220.00, 246.94, 277.18, 293.66]; // D minor scale
    const noteIndex = Math.floor(time * 6) % notes.length;
    const frequency = notes[noteIndex];
    
    return Math.sin(2 * Math.PI * frequency * time) * 0.8;
  }

  // Generate boss harmony
  private generateBossHarmony(time: number): number {
    const notes = [73.42, 82.41, 92.50, 98.00, 110.00, 123.47, 138.59, 146.83]; // D minor scale octave lower
    const noteIndex = Math.floor(time * 4.5) % notes.length;
    const frequency = notes[noteIndex];
    
    return Math.sin(2 * Math.PI * frequency * time) * 0.6;
  }

  // Play sound effect
  playSound(soundName: string, volume: number = 1.0) {
    if (!this.audioContext || !this.audioBuffers.has(soundName)) return;
    
    const buffer = this.audioBuffers.get(soundName);
    if (!buffer) return;
    
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    gainNode.gain.value = volume * this.sfxVolume * this.masterVolume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start();
  }

  // Play music
  playMusic(musicName: string, loop: boolean = true) {
    if (!this.audioContext || !this.audioBuffers.has(musicName)) return;
    
    // Stop current music
    this.stopMusic();
    
    const buffer = this.audioBuffers.get(musicName);
    if (!buffer) return;
    
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    source.loop = loop;
    gainNode.gain.value = this.musicVolume * this.masterVolume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start();
    this.currentMusic = source;
  }

  // Stop music
  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  // Set volume levels
  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  setSFXVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setVoiceVolume(volume: number) {
    this.voiceVolume = Math.max(0, Math.min(1, volume));
  }

  // Get volume levels
  getMasterVolume(): number {
    return this.masterVolume;
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  getSFXVolume(): number {
    return this.sfxVolume;
  }

  getVoiceVolume(): number {
    return this.voiceVolume;
  }

  // Update audio system
  update(deltaTime: number) {
    // Update any ongoing audio effects
    this.updateAudioEffects(deltaTime);
  }

  private updateAudioEffects(deltaTime: number) {
    // Update any procedural audio effects
    // This could include dynamic music changes based on game state
  }

  // Cleanup
  destroy() {
    this.stopMusic();
    this.audioBuffers.clear();
    this.musicTracks.clear();
    this.audioNodes.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export default EnhancedAudioSystem;
