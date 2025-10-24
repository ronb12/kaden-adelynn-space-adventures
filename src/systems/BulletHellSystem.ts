export interface BulletPattern {
  id: string;
  name: string;
  type: 'spiral' | 'wave' | 'circle' | 'diamond' | 'cross' | 'star' | 'vortex' | 'chaos' | 'dance' | 'storm';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme' | 'nightmare';
  bullets: BulletPatternBullet[];
  duration: number;
  cooldown: number;
  description: string;
}

export interface BulletPatternBullet {
  id: string;
  type: 'basic' | 'homing' | 'explosive' | 'piercing' | 'freeze' | 'electric' | 'fire' | 'ice' | 'poison' | 'gravity' | 'time' | 'space' | 'quantum' | 'cosmic' | 'ultimate';
  x: number;
  y: number;
  velocity: { x: number; y: number };
  speed: number;
  direction: number;
  size: number;
  color: string;
  damage: number;
  life: number;
  specialEffect?: string;
  homingTarget?: { x: number; y: number };
  explosionRadius?: number;
  chainTargets?: number;
  burnDuration?: number;
  freezeDuration?: number;
  poisonDuration?: number;
  gravityRadius?: number;
  timeDilation?: boolean;
  teleport?: boolean;
  quantum?: boolean;
  cosmic?: boolean;
  ultimate?: boolean;
}

export interface BulletHellWave {
  id: string;
  name: string;
  patterns: BulletPattern[];
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme' | 'nightmare';
  description: string;
}

export class BulletHellSystem {
  private patterns: BulletPattern[] = [];
  private waves: BulletHellWave[] = [];
  private activePatterns: Map<string, BulletPattern> = new Map();
  private activeBullets: BulletPatternBullet[] = [];
  private patternTimers: Map<string, number> = new Map();
  private waveTimers: Map<string, number> = new Map();
  private difficulty: 'easy' | 'medium' | 'hard' | 'extreme' | 'nightmare' = 'medium';

  constructor() {
    this.initializePatterns();
    this.initializeWaves();
  }

  private initializePatterns() {
    this.patterns = [
      // Easy Patterns
      {
        id: 'basic_spiral',
        name: 'Basic Spiral',
        type: 'spiral',
        difficulty: 'easy',
        bullets: [],
        duration: 3000,
        cooldown: 2000,
        description: 'Simple spiral pattern'
      },
      {
        id: 'wave_attack',
        name: 'Wave Attack',
        type: 'wave',
        difficulty: 'easy',
        bullets: [],
        duration: 2000,
        cooldown: 1500,
        description: 'Basic wave pattern'
      },
      {
        id: 'circle_formation',
        name: 'Circle Formation',
        type: 'circle',
        difficulty: 'easy',
        bullets: [],
        duration: 2500,
        cooldown: 1800,
        description: 'Circular bullet formation'
      },

      // Medium Patterns
      {
        id: 'diamond_attack',
        name: 'Diamond Attack',
        type: 'diamond',
        difficulty: 'medium',
        bullets: [],
        duration: 3500,
        cooldown: 2500,
        description: 'Diamond-shaped bullet pattern'
      },
      {
        id: 'cross_fire',
        name: 'Cross Fire',
        type: 'cross',
        difficulty: 'medium',
        bullets: [],
        duration: 3000,
        cooldown: 2000,
        description: 'Cross-shaped bullet pattern'
      },
      {
        id: 'star_burst',
        name: 'Star Burst',
        type: 'star',
        difficulty: 'medium',
        bullets: [],
        duration: 4000,
        cooldown: 3000,
        description: 'Star-shaped bullet burst'
      },

      // Hard Patterns
      {
        id: 'vortex_attack',
        name: 'Vortex Attack',
        type: 'vortex',
        difficulty: 'hard',
        bullets: [],
        duration: 5000,
        cooldown: 4000,
        description: 'Vortex-shaped bullet pattern'
      },
      {
        id: 'chaos_storm',
        name: 'Chaos Storm',
        type: 'chaos',
        difficulty: 'hard',
        bullets: [],
        duration: 6000,
        cooldown: 5000,
        description: 'Chaotic bullet storm'
      },
      {
        id: 'dance_pattern',
        name: 'Dance Pattern',
        type: 'dance',
        difficulty: 'hard',
        bullets: [],
        duration: 4500,
        cooldown: 3500,
        description: 'Dancing bullet pattern'
      },

      // Extreme Patterns
      {
        id: 'storm_attack',
        name: 'Storm Attack',
        type: 'storm',
        difficulty: 'extreme',
        bullets: [],
        duration: 8000,
        cooldown: 6000,
        description: 'Intense bullet storm'
      },
      {
        id: 'nightmare_vortex',
        name: 'Nightmare Vortex',
        type: 'vortex',
        difficulty: 'extreme',
        bullets: [],
        duration: 10000,
        cooldown: 8000,
        description: 'Nightmare-level vortex'
      },
      {
        id: 'ultimate_chaos',
        name: 'Ultimate Chaos',
        type: 'chaos',
        difficulty: 'extreme',
        bullets: [],
        duration: 12000,
        cooldown: 10000,
        description: 'Ultimate chaotic pattern'
      },

      // Nightmare Patterns
      {
        id: 'nightmare_storm',
        name: 'Nightmare Storm',
        type: 'storm',
        difficulty: 'nightmare',
        bullets: [],
        duration: 15000,
        cooldown: 12000,
        description: 'Nightmare-level bullet storm'
      },
      {
        id: 'void_vortex',
        name: 'Void Vortex',
        type: 'vortex',
        difficulty: 'nightmare',
        bullets: [],
        duration: 20000,
        cooldown: 15000,
        description: 'Void-level vortex pattern'
      },
      {
        id: 'reality_tear',
        name: 'Reality Tear',
        type: 'chaos',
        difficulty: 'nightmare',
        bullets: [],
        duration: 25000,
        cooldown: 20000,
        description: 'Reality-tearing bullet pattern'
      }
    ];
  }

  private initializeWaves() {
    this.waves = [
      {
        id: 'wave_1',
        name: 'Training Wave',
        patterns: [this.patterns[0], this.patterns[1], this.patterns[2]],
        duration: 10000,
        difficulty: 'easy',
        description: 'Basic training wave'
      },
      {
        id: 'wave_2',
        name: 'Combat Wave',
        patterns: [this.patterns[3], this.patterns[4], this.patterns[5]],
        duration: 15000,
        difficulty: 'medium',
        description: 'Combat training wave'
      },
      {
        id: 'wave_3',
        name: 'Advanced Wave',
        patterns: [this.patterns[6], this.patterns[7], this.patterns[8]],
        duration: 20000,
        difficulty: 'hard',
        description: 'Advanced combat wave'
      },
      {
        id: 'wave_4',
        name: 'Elite Wave',
        patterns: [this.patterns[9], this.patterns[10], this.patterns[11]],
        duration: 30000,
        difficulty: 'extreme',
        description: 'Elite combat wave'
      },
      {
        id: 'wave_5',
        name: 'Nightmare Wave',
        patterns: [this.patterns[12], this.patterns[13], this.patterns[14]],
        duration: 45000,
        difficulty: 'nightmare',
        description: 'Nightmare-level wave'
      }
    ];
  }

  setDifficulty(difficulty: 'easy' | 'medium' | 'hard' | 'extreme' | 'nightmare') {
    this.difficulty = difficulty;
  }

  getDifficulty(): string {
    return this.difficulty;
  }

  startPattern(patternId: string, x: number, y: number): boolean {
    const pattern = this.patterns.find(p => p.id === patternId);
    if (!pattern) return false;

    this.activePatterns.set(patternId, pattern);
    this.patternTimers.set(patternId, pattern.duration);
    this.generatePatternBullets(pattern, x, y);
    return true;
  }

  startWave(waveId: string, x: number, y: number): boolean {
    const wave = this.waves.find(w => w.id === waveId);
    if (!wave) return false;

    this.waveTimers.set(waveId, wave.duration);
    wave.patterns.forEach(pattern => {
      this.startPattern(pattern.id, x, y);
    });
    return true;
  }

  private generatePatternBullets(pattern: BulletPattern, x: number, y: number) {
    const bullets: BulletPatternBullet[] = [];
    const bulletCount = this.getBulletCount(pattern.difficulty);
    const bulletSpeed = this.getBulletSpeed(pattern.difficulty);

    switch (pattern.type) {
      case 'spiral':
        this.generateSpiralBullets(bullets, x, y, bulletCount, bulletSpeed);
        break;
      case 'wave':
        this.generateWaveBullets(bullets, x, y, bulletCount, bulletSpeed);
        break;
      case 'circle':
        this.generateCircleBullets(bullets, x, y, bulletCount, bulletSpeed);
        break;
      case 'diamond':
        this.generateDiamondBullets(bullets, x, y, bulletCount, bulletSpeed);
        break;
      case 'cross':
        this.generateCrossBullets(bullets, x, y, bulletCount, bulletSpeed);
        break;
      case 'star':
        this.generateStarBullets(bullets, x, y, bulletCount, bulletSpeed);
        break;
      case 'vortex':
        this.generateVortexBullets(bullets, x, y, bulletCount, bulletSpeed);
        break;
      case 'chaos':
        this.generateChaosBullets(bullets, x, y, bulletCount, bulletSpeed);
        break;
      case 'dance':
        this.generateDanceBullets(bullets, x, y, bulletCount, bulletSpeed);
        break;
      case 'storm':
        this.generateStormBullets(bullets, x, y, bulletCount, bulletSpeed);
        break;
    }

    this.activeBullets.push(...bullets);
  }

  private generateSpiralBullets(bullets: BulletPatternBullet[], x: number, y: number, count: number, speed: number) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 4; // 2 full rotations
      const radius = 50 + (i * 2);
      const bulletX = x + Math.cos(angle) * radius;
      const bulletY = y + Math.sin(angle) * radius;
      
      bullets.push({
        id: `spiral_${i}`,
        type: 'basic',
        x: bulletX,
        y: bulletY,
        velocity: { x: Math.cos(angle + Math.PI / 2), y: Math.sin(angle + Math.PI / 2) },
        speed: speed,
        direction: angle + Math.PI / 2,
        size: 4,
        color: '#ff0000',
        damage: 10,
        life: 5000
      });
    }
  }

  private generateWaveBullets(bullets: BulletPatternBullet[], x: number, y: number, count: number, speed: number) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const waveOffset = Math.sin(angle * 3) * 30;
      
      bullets.push({
        id: `wave_${i}`,
        type: 'basic',
        x: x + waveOffset,
        y: y + (i * 10),
        velocity: { x: 0, y: 1 },
        speed: speed,
        direction: Math.PI / 2,
        size: 4,
        color: '#00ff00',
        damage: 10,
        life: 5000
      });
    }
  }

  private generateCircleBullets(bullets: BulletPatternBullet[], x: number, y: number, count: number, speed: number) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 100;
      
      bullets.push({
        id: `circle_${i}`,
        type: 'basic',
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        velocity: { x: Math.cos(angle), y: Math.sin(angle) },
        speed: speed,
        direction: angle,
        size: 4,
        color: '#0000ff',
        damage: 10,
        life: 5000
      });
    }
  }

  private generateDiamondBullets(bullets: BulletPatternBullet[], x: number, y: number, count: number, speed: number) {
    const diamondPoints = [
      { x: 0, y: -50 },
      { x: 50, y: 0 },
      { x: 0, y: 50 },
      { x: -50, y: 0 }
    ];

    for (let i = 0; i < count; i++) {
      const pointIndex = i % diamondPoints.length;
      const point = diamondPoints[pointIndex];
      const angle = Math.atan2(point.y, point.x);
      
      bullets.push({
        id: `diamond_${i}`,
        type: 'basic',
        x: x + point.x,
        y: y + point.y,
        velocity: { x: Math.cos(angle), y: Math.sin(angle) },
        speed: speed,
        direction: angle,
        size: 4,
        color: '#ffff00',
        damage: 10,
        life: 5000
      });
    }
  }

  private generateCrossBullets(bullets: BulletPatternBullet[], x: number, y: number, count: number, speed: number) {
    const crossDirections = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 }
    ];

    for (let i = 0; i < count; i++) {
      const directionIndex = i % crossDirections.length;
      const direction = crossDirections[directionIndex];
      const angle = Math.atan2(direction.y, direction.x);
      
      bullets.push({
        id: `cross_${i}`,
        type: 'basic',
        x: x + direction.x * 50,
        y: y + direction.y * 50,
        velocity: { x: direction.x, y: direction.y },
        speed: speed,
        direction: angle,
        size: 4,
        color: '#ff00ff',
        damage: 10,
        life: 5000
      });
    }
  }

  private generateStarBullets(bullets: BulletPatternBullet[], x: number, y: number, count: number, speed: number) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 80 + Math.sin(angle * 5) * 20;
      
      bullets.push({
        id: `star_${i}`,
        type: 'basic',
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        velocity: { x: Math.cos(angle), y: Math.sin(angle) },
        speed: speed,
        direction: angle,
        size: 4,
        color: '#00ffff',
        damage: 10,
        life: 5000
      });
    }
  }

  private generateVortexBullets(bullets: BulletPatternBullet[], x: number, y: number, count: number, speed: number) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 60 + (i * 2);
      const spiralAngle = angle + (i * 0.1);
      
      bullets.push({
        id: `vortex_${i}`,
        type: 'basic',
        x: x + Math.cos(spiralAngle) * radius,
        y: y + Math.sin(spiralAngle) * radius,
        velocity: { x: Math.cos(spiralAngle), y: Math.sin(spiralAngle) },
        speed: speed,
        direction: spiralAngle,
        size: 4,
        color: '#ff8800',
        damage: 10,
        life: 5000
      });
    }
  }

  private generateChaosBullets(bullets: BulletPatternBullet[], x: number, y: number, count: number, speed: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 100;
      
      bullets.push({
        id: `chaos_${i}`,
        type: 'basic',
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        velocity: { x: Math.cos(angle), y: Math.sin(angle) },
        speed: speed + Math.random() * 2,
        direction: angle,
        size: 4,
        color: this.getRandomColor(),
        damage: 10,
        life: 5000
      });
    }
  }

  private generateDanceBullets(bullets: BulletPatternBullet[], x: number, y: number, count: number, speed: number) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 70 + Math.sin(angle * 3) * 30;
      const danceAngle = angle + Math.sin(angle * 2) * 0.5;
      
      bullets.push({
        id: `dance_${i}`,
        type: 'basic',
        x: x + Math.cos(danceAngle) * radius,
        y: y + Math.sin(danceAngle) * radius,
        velocity: { x: Math.cos(danceAngle), y: Math.sin(danceAngle) },
        speed: speed,
        direction: danceAngle,
        size: 4,
        color: '#ff0088',
        damage: 10,
        life: 5000
      });
    }
  }

  private generateStormBullets(bullets: BulletPatternBullet[], x: number, y: number, count: number, speed: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 150;
      const stormSpeed = speed + Math.random() * 3;
      
      bullets.push({
        id: `storm_${i}`,
        type: 'basic',
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        velocity: { x: Math.cos(angle), y: Math.sin(angle) },
        speed: stormSpeed,
        direction: angle,
        size: 4,
        color: this.getRandomColor(),
        damage: 10,
        life: 5000
      });
    }
  }

  private getBulletCount(difficulty: string): number {
    switch (difficulty) {
      case 'easy': return 8;
      case 'medium': return 16;
      case 'hard': return 32;
      case 'extreme': return 64;
      case 'nightmare': return 128;
      default: return 16;
    }
  }

  private getBulletSpeed(difficulty: string): number {
    switch (difficulty) {
      case 'easy': return 2;
      case 'medium': return 3;
      case 'hard': return 4;
      case 'extreme': return 5;
      case 'nightmare': return 6;
      default: return 3;
    }
  }

  private getRandomColor(): string {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  updateBullets(deltaTime: number) {
    this.activeBullets = this.activeBullets.filter(bullet => {
      bullet.x += bullet.velocity.x * bullet.speed * deltaTime;
      bullet.y += bullet.velocity.y * bullet.speed * deltaTime;
      bullet.life -= deltaTime;
      return bullet.life > 0;
    });

    // Update pattern timers
    this.patternTimers.forEach((time, patternId) => {
      const newTime = time - deltaTime;
      if (newTime <= 0) {
        this.patternTimers.delete(patternId);
        this.activePatterns.delete(patternId);
      } else {
        this.patternTimers.set(patternId, newTime);
      }
    });

    // Update wave timers
    this.waveTimers.forEach((time, waveId) => {
      const newTime = time - deltaTime;
      if (newTime <= 0) {
        this.waveTimers.delete(waveId);
      } else {
        this.waveTimers.set(waveId, newTime);
      }
    });
  }

  getActiveBullets(): BulletPatternBullet[] {
    return this.activeBullets;
  }

  getActivePatterns(): BulletPattern[] {
    return Array.from(this.activePatterns.values());
  }

  getActiveWaves(): BulletHellWave[] {
    return this.waves.filter(wave => this.waveTimers.has(wave.id));
  }

  getPattern(patternId: string): BulletPattern | undefined {
    return this.patterns.find(p => p.id === patternId);
  }

  getWave(waveId: string): BulletHellWave | undefined {
    return this.waves.find(w => w.id === waveId);
  }

  getAllPatterns(): BulletPattern[] {
    return this.patterns;
  }

  getAllWaves(): BulletHellWave[] {
    return this.waves;
  }

  getPatternsByDifficulty(difficulty: string): BulletPattern[] {
    return this.patterns.filter(p => p.difficulty === difficulty);
  }

  getWavesByDifficulty(difficulty: string): BulletHellWave[] {
    return this.waves.filter(w => w.difficulty === difficulty);
  }

  clearAllBullets() {
    this.activeBullets = [];
    this.activePatterns.clear();
    this.patternTimers.clear();
    this.waveTimers.clear();
  }

  getActiveBulletCount(): number {
    return this.activeBullets.length;
  }

  getPatternCount(): number {
    return this.activePatterns.size;
  }

  getWaveCount(): number {
    return this.waveTimers.size;
  }
}
