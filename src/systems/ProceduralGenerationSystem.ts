export interface ProceduralLevel {
  id: string;
  seed: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme' | 'nightmare';
  duration: number;
  enemies: ProceduralEnemy[];
  powerUps: ProceduralPowerUp[];
  obstacles: ProceduralObstacle[];
  background: ProceduralBackground;
  music: string;
  boss?: ProceduralBoss;
}

export interface ProceduralEnemy {
  id: string;
  type: string;
  x: number;
  y: number;
  spawnTime: number;
  behavior: 'patrol' | 'aggressive' | 'defensive' | 'swarm' | 'boss';
  health: number;
  speed: number;
  damage: number;
  specialAbilities: string[];
}

export interface ProceduralPowerUp {
  id: string;
  type: string;
  x: number;
  y: number;
  spawnTime: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effect: string;
  duration: number;
  value: number;
}

export interface ProceduralObstacle {
  id: string;
  type: 'asteroid' | 'debris' | 'energy_field' | 'black_hole' | 'nebula';
  x: number;
  y: number;
  width: number;
  height: number;
  effect: string;
  damage: number;
  duration: number;
}

export interface ProceduralBackground {
  type: 'space' | 'nebula' | 'asteroid_field' | 'black_hole' | 'galaxy' | 'void';
  color: string;
  particles: boolean;
  parallax: boolean;
  effects: string[];
}

export interface ProceduralBoss {
  id: string;
  name: string;
  type: string;
  health: number;
  phases: number;
  specialAttacks: string[];
  spawnTime: number;
  difficulty: string;
}

export class ProceduralGenerationSystem {
  private seed: number;
  private random: () => number;
  private levels: Map<string, ProceduralLevel> = new Map();
  private currentLevel: ProceduralLevel | null = null;
  private difficulty: 'easy' | 'medium' | 'hard' | 'extreme' | 'nightmare' = 'medium';

  constructor(seed?: number) {
    this.seed = seed || Date.now();
    this.random = this.createSeededRandom(this.seed);
  }

  private createSeededRandom(seed: number): () => number {
    let currentSeed = seed;
    return () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }

  setDifficulty(difficulty: 'easy' | 'medium' | 'hard' | 'extreme' | 'nightmare') {
    this.difficulty = difficulty;
  }

  generateLevel(levelId: string, duration: number = 300000): ProceduralLevel {
    const level: ProceduralLevel = {
      id: levelId,
      seed: this.seed,
      difficulty: this.difficulty,
      duration: duration,
      enemies: [],
      powerUps: [],
      obstacles: [],
      background: this.generateBackground(),
      music: this.generateMusic(),
      boss: this.generateBoss(duration)
    };

    this.generateEnemies(level);
    this.generatePowerUps(level);
    this.generateObstacles(level);
    
    this.levels.set(levelId, level);
    return level;
  }

  private generateBackground(): ProceduralBackground {
    const backgroundTypes = ['space', 'nebula', 'asteroid_field', 'black_hole', 'galaxy', 'void'];
    const type = backgroundTypes[Math.floor(this.random() * backgroundTypes.length)];
    
    const colors = {
      space: '#000011',
      nebula: '#440088',
      asteroid_field: '#220044',
      black_hole: '#000000',
      galaxy: '#110022',
      void: '#001122'
    };

    return {
      type: type as any,
      color: colors[type as keyof typeof colors],
      particles: this.random() > 0.3,
      parallax: this.random() > 0.5,
      effects: this.generateBackgroundEffects()
    };
  }

  private generateBackgroundEffects(): string[] {
    const effects = ['stars', 'nebula_clouds', 'energy_waves', 'cosmic_dust', 'solar_flares'];
    const numEffects = Math.floor(this.random() * 3) + 1;
    const selectedEffects: string[] = [];
    
    for (let i = 0; i < numEffects; i++) {
      const effect = effects[Math.floor(this.random() * effects.length)];
      if (!selectedEffects.includes(effect)) {
        selectedEffects.push(effect);
      }
    }
    
    return selectedEffects;
  }

  private generateMusic(): string {
    const musicTracks = [
      'space_ambient', 'battle_theme', 'exploration', 'boss_battle', 
      'cosmic_journey', 'void_walker', 'galactic_war', 'final_battle'
    ];
    return musicTracks[Math.floor(this.random() * musicTracks.length)];
  }

  private generateEnemies(level: ProceduralLevel) {
    const enemyTypes = ['basic_fighter', 'heavy_fighter', 'fast_scout', 'bomber', 'interceptor', 'destroyer'];
    const enemyCount = this.getEnemyCount(level.difficulty);
    const spawnInterval = level.duration / enemyCount;

    for (let i = 0; i < enemyCount; i++) {
      const enemyType = enemyTypes[Math.floor(this.random() * enemyTypes.length)];
      const spawnTime = i * spawnInterval + (this.random() * spawnInterval * 0.5);
      
      const enemy: ProceduralEnemy = {
        id: `enemy_${i}`,
        type: enemyType,
        x: this.random() * 800, // Assuming 800px width
        y: -50 - (this.random() * 100),
        spawnTime: spawnTime,
        behavior: this.generateEnemyBehavior(),
        health: this.generateEnemyHealth(enemyType, level.difficulty),
        speed: this.generateEnemySpeed(enemyType, level.difficulty),
        damage: this.generateEnemyDamage(enemyType, level.difficulty),
        specialAbilities: this.generateEnemyAbilities(enemyType, level.difficulty)
      };

      level.enemies.push(enemy);
    }
  }

  private generateEnemyBehavior(): 'patrol' | 'aggressive' | 'defensive' | 'swarm' | 'boss' {
    const behaviors = ['patrol', 'aggressive', 'defensive', 'swarm'];
    return behaviors[Math.floor(this.random() * behaviors.length)] as any;
  }

  private generateEnemyHealth(type: string, difficulty: string): number {
    const baseHealth = {
      basic_fighter: 20,
      heavy_fighter: 50,
      fast_scout: 15,
      bomber: 80,
      interceptor: 30,
      destroyer: 120
    };

    const difficultyMultiplier = {
      easy: 1,
      medium: 1.5,
      hard: 2,
      extreme: 3,
      nightmare: 5
    };

    return Math.floor(baseHealth[type as keyof typeof baseHealth] * difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier]);
  }

  private generateEnemySpeed(type: string, difficulty: string): number {
    const baseSpeed = {
      basic_fighter: 2,
      heavy_fighter: 1,
      fast_scout: 4,
      bomber: 1.5,
      interceptor: 3,
      destroyer: 0.5
    };

    const difficultyMultiplier = {
      easy: 1,
      medium: 1.2,
      hard: 1.5,
      extreme: 2,
      nightmare: 3
    };

    return baseSpeed[type as keyof typeof baseSpeed] * difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier];
  }

  private generateEnemyDamage(type: string, difficulty: string): number {
    const baseDamage = {
      basic_fighter: 10,
      heavy_fighter: 25,
      fast_scout: 8,
      bomber: 40,
      interceptor: 15,
      destroyer: 60
    };

    const difficultyMultiplier = {
      easy: 1,
      medium: 1.3,
      hard: 1.8,
      extreme: 2.5,
      nightmare: 4
    };

    return Math.floor(baseDamage[type as keyof typeof baseDamage] * difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier]);
  }

  private generateEnemyAbilities(type: string, difficulty: string): string[] {
    const allAbilities = ['shield', 'regeneration', 'teleport', 'invisibility', 'rapid_fire', 'homing_missiles', 'energy_blast', 'time_dilation'];
    const numAbilities = Math.floor(this.random() * 3) + 1;
    const abilities: string[] = [];

    for (let i = 0; i < numAbilities; i++) {
      const ability = allAbilities[Math.floor(this.random() * allAbilities.length)];
      if (!abilities.includes(ability)) {
        abilities.push(ability);
      }
    }

    return abilities;
  }

  private generatePowerUps(level: ProceduralLevel) {
    const powerUpTypes = ['health', 'speed', 'rapid', 'shield', 'wing', 'weapon', 'score', 'life'];
    const powerUpCount = this.getPowerUpCount(level.difficulty);
    const spawnInterval = level.duration / powerUpCount;

    for (let i = 0; i < powerUpCount; i++) {
      const powerUpType = powerUpTypes[Math.floor(this.random() * powerUpTypes.length)];
      const spawnTime = i * spawnInterval + (this.random() * spawnInterval * 0.5);
      
      const powerUp: ProceduralPowerUp = {
        id: `powerup_${i}`,
        type: powerUpType,
        x: this.random() * 800,
        y: -50 - (this.random() * 100),
        spawnTime: spawnTime,
        rarity: this.generatePowerUpRarity(),
        effect: this.generatePowerUpEffect(powerUpType),
        duration: this.generatePowerUpDuration(powerUpType),
        value: this.generatePowerUpValue(powerUpType)
      };

      level.powerUps.push(powerUp);
    }
  }

  private generatePowerUpRarity(): 'common' | 'rare' | 'epic' | 'legendary' {
    const rarity = this.random();
    if (rarity < 0.6) return 'common';
    if (rarity < 0.8) return 'rare';
    if (rarity < 0.95) return 'epic';
    return 'legendary';
  }

  private generatePowerUpEffect(type: string): string {
    const effects = {
      health: 'restore_health',
      speed: 'increase_speed',
      rapid: 'rapid_fire',
      shield: 'energy_shield',
      wing: 'wing_fighter',
      weapon: 'weapon_upgrade',
      score: 'score_multiplier',
      life: 'extra_life'
    };
    return effects[type as keyof typeof effects];
  }

  private generatePowerUpDuration(type: string): number {
    const durations = {
      health: 0,
      speed: 10000,
      rapid: 15000,
      shield: 20000,
      wing: 0,
      weapon: 0,
      score: 30000,
      life: 0
    };
    return durations[type as keyof typeof durations];
  }

  private generatePowerUpValue(type: string): number {
    const values = {
      health: 25,
      speed: 2,
      rapid: 3,
      shield: 50,
      wing: 1,
      weapon: 1,
      score: 2,
      life: 1
    };
    return values[type as keyof typeof values];
  }

  private generateObstacles(level: ProceduralLevel) {
    const obstacleTypes = ['asteroid', 'debris', 'energy_field', 'black_hole', 'nebula'];
    const obstacleCount = this.getObstacleCount(level.difficulty);
    const spawnInterval = level.duration / obstacleCount;

    for (let i = 0; i < obstacleCount; i++) {
      const obstacleType = obstacleTypes[Math.floor(this.random() * obstacleTypes.length)];
      const spawnTime = i * spawnInterval + (this.random() * spawnInterval * 0.5);
      
      const obstacle: ProceduralObstacle = {
        id: `obstacle_${i}`,
        type: obstacleType as any,
        x: this.random() * 800,
        y: -50 - (this.random() * 100),
        width: this.generateObstacleSize(obstacleType),
        height: this.generateObstacleSize(obstacleType),
        effect: this.generateObstacleEffect(obstacleType),
        damage: this.generateObstacleDamage(obstacleType),
        duration: this.generateObstacleDuration(obstacleType)
      };

      level.obstacles.push(obstacle);
    }
  }

  private generateObstacleSize(type: string): number {
    const sizes = {
      asteroid: 30 + (this.random() * 40),
      debris: 20 + (this.random() * 30),
      energy_field: 50 + (this.random() * 100),
      black_hole: 80 + (this.random() * 120),
      nebula: 100 + (this.random() * 200)
    };
    return sizes[type as keyof typeof sizes];
  }

  private generateObstacleEffect(type: string): string {
    const effects = {
      asteroid: 'collision_damage',
      debris: 'slow_movement',
      energy_field: 'energy_drain',
      black_hole: 'gravitational_pull',
      nebula: 'visibility_reduction'
    };
    return effects[type as keyof typeof effects];
  }

  private generateObstacleDamage(type: string): number {
    const damages = {
      asteroid: 20,
      debris: 10,
      energy_field: 5,
      black_hole: 50,
      nebula: 0
    };
    return damages[type as keyof typeof damages];
  }

  private generateObstacleDuration(type: string): number {
    const durations = {
      asteroid: 0,
      debris: 0,
      energy_field: 15000,
      black_hole: 30000,
      nebula: 20000
    };
    return durations[type as keyof typeof durations];
  }

  private generateBoss(duration: number): ProceduralBoss | undefined {
    if (this.random() > 0.7) { // 30% chance of boss
      const bossTypes = ['destroyer', 'leviathan', 'void_lord', 'cosmic_entity', 'temporal_guardian'];
      const bossType = bossTypes[Math.floor(this.random() * bossTypes.length)];
      
      return {
        id: `boss_${Date.now()}`,
        name: this.generateBossName(bossType),
        type: bossType,
        health: this.generateBossHealth(bossType),
        phases: Math.floor(this.random() * 3) + 2,
        specialAttacks: this.generateBossAttacks(bossType),
        spawnTime: duration * 0.8, // Spawn at 80% of level duration
        difficulty: this.difficulty
      };
    }
    return undefined;
  }

  private generateBossName(type: string): string {
    const names = {
      destroyer: ['The Destroyer', 'Void Destroyer', 'Cosmic Destroyer', 'Temporal Destroyer'],
      leviathan: ['The Leviathan', 'Void Leviathan', 'Cosmic Leviathan', 'Temporal Leviathan'],
      void_lord: ['Void Lord', 'Void Master', 'Void King', 'Void Emperor'],
      cosmic_entity: ['Cosmic Entity', 'Cosmic Being', 'Cosmic Guardian', 'Cosmic Lord'],
      temporal_guardian: ['Temporal Guardian', 'Time Guardian', 'Temporal Keeper', 'Time Keeper']
    };
    const typeNames = names[type as keyof typeof names];
    return typeNames[Math.floor(this.random() * typeNames.length)];
  }

  private generateBossHealth(type: string): number {
    const baseHealth = {
      destroyer: 500,
      leviathan: 800,
      void_lord: 1200,
      cosmic_entity: 1000,
      temporal_guardian: 900
    };

    const difficultyMultiplier = {
      easy: 1,
      medium: 1.5,
      hard: 2,
      extreme: 3,
      nightmare: 5
    };

    return Math.floor(baseHealth[type as keyof typeof baseHealth] * difficultyMultiplier[this.difficulty as keyof typeof difficultyMultiplier]);
  }

  private generateBossAttacks(type: string): string[] {
    const allAttacks = ['plasma_cannon', 'missile_swarm', 'energy_blast', 'reality_tear', 'time_stop', 'spatial_warp', 'cosmic_ray', 'void_blast'];
    const numAttacks = Math.floor(this.random() * 4) + 3;
    const attacks: string[] = [];

    for (let i = 0; i < numAttacks; i++) {
      const attack = allAttacks[Math.floor(this.random() * allAttacks.length)];
      if (!attacks.includes(attack)) {
        attacks.push(attack);
      }
    }

    return attacks;
  }

  private getEnemyCount(difficulty: string): number {
    const counts = {
      easy: 20,
      medium: 40,
      hard: 80,
      extreme: 160,
      nightmare: 320
    };
    return counts[difficulty as keyof typeof counts];
  }

  private getPowerUpCount(difficulty: string): number {
    const counts = {
      easy: 10,
      medium: 20,
      hard: 30,
      extreme: 40,
      nightmare: 50
    };
    return counts[difficulty as keyof typeof counts];
  }

  private getObstacleCount(difficulty: string): number {
    const counts = {
      easy: 5,
      medium: 10,
      hard: 20,
      extreme: 30,
      nightmare: 40
    };
    return counts[difficulty as keyof typeof counts];
  }

  getLevel(levelId: string): ProceduralLevel | undefined {
    return this.levels.get(levelId);
  }

  getAllLevels(): ProceduralLevel[] {
    return Array.from(this.levels.values());
  }

  getCurrentLevel(): ProceduralLevel | null {
    return this.currentLevel;
  }

  setCurrentLevel(levelId: string): boolean {
    const level = this.levels.get(levelId);
    if (level) {
      this.currentLevel = level;
      return true;
    }
    return false;
  }

  generateNewSeed(): number {
    this.seed = Date.now();
    this.random = this.createSeededRandom(this.seed);
    return this.seed;
  }

  getSeed(): number {
    return this.seed;
  }

  setSeed(seed: number) {
    this.seed = seed;
    this.random = this.createSeededRandom(this.seed);
  }

  getLevelStats(levelId: string): any {
    const level = this.levels.get(levelId);
    if (!level) return null;

    return {
      id: level.id,
      difficulty: level.difficulty,
      duration: level.duration,
      enemyCount: level.enemies.length,
      powerUpCount: level.powerUps.length,
      obstacleCount: level.obstacles.length,
      hasBoss: !!level.boss,
      background: level.background.type,
      music: level.music
    };
  }
}
