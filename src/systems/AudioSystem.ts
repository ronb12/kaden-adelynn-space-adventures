export class AudioSystem {
  private audioContext: AudioContext | null = null;
  private sounds: { [key: string]: AudioBuffer } = {};
  private musicEnabled: boolean = true;
  private soundEnabled: boolean = true;
  private currentMusic: AudioBufferSourceNode | null = null;

  constructor() {
    // Don't initialize audio context immediately - wait for user interaction
  }

  private async initializeAudio(): Promise<void> {
    if (this.audioContext) return; // Already initialized
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.loadSounds();
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  }

  // Initialize audio on first user interaction
  public async initOnUserInteraction(): Promise<void> {
    if (!this.audioContext) {
      await this.initializeAudio();
    }
  }

  private async loadSounds(): Promise<void> {
    if (!this.audioContext) return;

    // Generate sound effects programmatically
    this.sounds['shoot'] = this.generateTone(800, 0.1, 'square');
    this.sounds['enemy_hit'] = this.generateTone(200, 0.2, 'sawtooth');
    this.sounds['enemy_destroy'] = this.generateTone(150, 0.3, 'triangle');
    this.sounds['power_up'] = this.generateTone(600, 0.5, 'sine');
    this.sounds['boss_hit'] = this.generateTone(100, 0.4, 'square');
    this.sounds['boss_destroy'] = this.generateTone(80, 0.6, 'sawtooth');
    this.sounds['achievement'] = this.generateTone(1000, 0.8, 'sine');
    this.sounds['combo'] = this.generateTone(1200, 0.3, 'square');
    this.sounds['streak'] = this.generateTone(1400, 0.4, 'triangle');
  }

  private generateTone(frequency: number, duration: number, waveType: OscillatorType): AudioBuffer {
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

      // Apply envelope (fade out)
      const envelope = Math.exp(-time * 3);
      data[i] = value * envelope * 0.3;
    }

    return buffer;
  }

  playSound(soundName: string, volume: number = 1): void {
    if (!this.audioContext || !this.soundEnabled || !this.sounds[soundName]) return;

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = this.sounds[soundName];
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  playMusic(musicName: string, loop: boolean = true): void {
    if (!this.audioContext || !this.musicEnabled || !this.sounds[musicName]) return;

    this.stopMusic();

    try {
      this.currentMusic = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      this.currentMusic.buffer = this.sounds[musicName];
      this.currentMusic.loop = loop;
      gainNode.gain.value = 0.5; // Lower volume for music

      this.currentMusic.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      this.currentMusic.start();
    } catch (error) {
      console.warn('Error playing music:', error);
    }
  }

  stopMusic(): void {
    if (this.currentMusic) {
      try {
        this.currentMusic.stop();
      } catch (error) {
        // Ignore errors when stopping music
      }
      this.currentMusic = null;
    }
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  // Sound effect methods for game events
  playShootSound(): void {
    this.playSound('shoot', 0.5);
  }

  playEnemyHitSound(): void {
    this.playSound('enemy_hit', 0.6);
  }

  playEnemyDestroySound(): void {
    this.playSound('enemy_destroy', 0.7);
  }

  playPowerUpSound(): void {
    this.playSound('power_up', 0.8);
  }

  playBossHitSound(): void {
    this.playSound('boss_hit', 0.9);
  }

  playBossDestroySound(): void {
    this.playSound('boss_destroy', 1.0);
  }

  playAchievementSound(): void {
    this.playSound('achievement', 0.9);
  }

  playComboSound(): void {
    this.playSound('combo', 0.7);
  }

  playStreakSound(): void {
    this.playSound('streak', 0.8);
  }
}
