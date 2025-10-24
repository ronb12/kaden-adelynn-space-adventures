export interface Mission {
  id: string;
  name: string;
  description: string;
  objectives: MissionObjective[];
  rewards: MissionReward[];
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  unlockLevel: number;
  estimatedTime: number; // in seconds
  background: string;
  music: string;
  enemies: EnemyWave[];
  boss?: BossInfo;
  specialConditions?: SpecialCondition[];
}

export interface MissionObjective {
  id: string;
  type: 'destroy_enemies' | 'survive_time' | 'collect_items' | 'rescue_civilians' | 'defeat_boss' | 'no_damage' | 'combo_score' | 'accuracy';
  target: number;
  description: string;
  reward: number;
}

export interface MissionReward {
  type: 'score' | 'weapon' | 'ship' | 'power_up' | 'currency' | 'achievement';
  value: string | number;
  description: string;
}

export interface EnemyWave {
  enemyType: string;
  count: number;
  spawnDelay: number;
  formation: 'line' | 'circle' | 'diamond' | 'random' | 'swarm';
  speed: number;
  health: number;
}

export interface BossInfo {
  id: string;
  name: string;
  health: number;
  phases: number;
  specialAttacks: string[];
}

export interface SpecialCondition {
  type: 'time_limit' | 'fuel_limit' | 'ammo_limit' | 'health_limit' | 'environmental';
  value: number;
  description: string;
}

export class MissionSystem {
  private missions: Mission[] = [];
  private currentMission: Mission | null = null;
  private missionProgress: Map<string, number> = new Map();
  private completedMissions: Set<string> = new Set();
  private unlockedMissions: Set<string> = new Set(['mission_1']);

  constructor() {
    this.initializeMissions();
  }

  private initializeMissions() {
    this.missions = [
      // Mission 1: Training Grounds
      {
        id: 'mission_1',
        name: 'Training Grounds',
        description: 'Learn the basics of space combat in this training mission.',
        objectives: [
          { id: 'destroy_10_enemies', type: 'destroy_enemies', target: 10, description: 'Destroy 10 enemy ships', reward: 100 },
          { id: 'survive_60_seconds', type: 'survive_time', target: 60, description: 'Survive for 60 seconds', reward: 200 }
        ],
        rewards: [
          { type: 'weapon', value: 'rapid', description: 'Unlock Rapid Fire weapon' },
          { type: 'score', value: 500, description: 'Bonus score points' }
        ],
        difficulty: 'easy',
        unlockLevel: 1,
        estimatedTime: 120,
        background: 'space_station',
        music: 'training_theme',
        enemies: [
          { enemyType: 'basic_fighter', count: 5, spawnDelay: 2000, formation: 'line', speed: 2, health: 20 },
          { enemyType: 'basic_fighter', count: 5, spawnDelay: 1000, formation: 'random', speed: 2, health: 20 }
        ]
      },

      // Mission 2: Asteroid Field
      {
        id: 'mission_2',
        name: 'Asteroid Field',
        description: 'Navigate through dangerous asteroid fields while fighting enemies.',
        objectives: [
          { id: 'destroy_20_enemies', type: 'destroy_enemies', target: 20, description: 'Destroy 20 enemy ships', reward: 300 },
          { id: 'collect_5_power_ups', type: 'collect_items', target: 5, description: 'Collect 5 power-ups', reward: 200 },
          { id: 'survive_90_seconds', type: 'survive_time', target: 90, description: 'Survive for 90 seconds', reward: 400 }
        ],
        rewards: [
          { type: 'weapon', value: 'spread', description: 'Unlock Spread Shot weapon' },
          { type: 'ship', value: 'asteroid_hunter', description: 'Unlock Asteroid Hunter ship' }
        ],
        difficulty: 'easy',
        unlockLevel: 2,
        estimatedTime: 150,
        background: 'asteroid_field',
        music: 'asteroid_theme',
        enemies: [
          { enemyType: 'basic_fighter', count: 8, spawnDelay: 1500, formation: 'random', speed: 2, health: 20 },
          { enemyType: 'fast_scout', count: 6, spawnDelay: 2000, formation: 'swarm', speed: 4, health: 15 }
        ]
      },

      // Mission 3: Enemy Base Assault
      {
        id: 'mission_3',
        name: 'Enemy Base Assault',
        description: 'Attack and destroy the enemy base while rescuing civilians.',
        objectives: [
          { id: 'destroy_30_enemies', type: 'destroy_enemies', target: 30, description: 'Destroy 30 enemy ships', reward: 500 },
          { id: 'rescue_10_civilians', type: 'rescue_civilians', target: 10, description: 'Rescue 10 civilians', reward: 1000 },
          { id: 'defeat_boss', type: 'defeat_boss', target: 1, description: 'Defeat the base commander', reward: 2000 }
        ],
        rewards: [
          { type: 'weapon', value: 'homing', description: 'Unlock Homing Missiles' },
          { type: 'achievement', value: 'base_destroyer', description: 'Base Destroyer achievement' }
        ],
        difficulty: 'medium',
        unlockLevel: 3,
        estimatedTime: 300,
        background: 'enemy_base',
        music: 'battle_theme',
        enemies: [
          { enemyType: 'basic_fighter', count: 10, spawnDelay: 1000, formation: 'line', speed: 2, health: 20 },
          { enemyType: 'heavy_fighter', count: 5, spawnDelay: 2000, formation: 'diamond', speed: 1, health: 50 },
          { enemyType: 'fast_scout', count: 8, spawnDelay: 1500, formation: 'swarm', speed: 4, health: 15 }
        ],
        boss: {
          id: 'base_commander',
          name: 'Base Commander',
          health: 200,
          phases: 2,
          specialAttacks: ['missile_barrage', 'shield_boost']
        }
      },

      // Mission 4: Deep Space Patrol
      {
        id: 'mission_4',
        name: 'Deep Space Patrol',
        description: 'Patrol the outer reaches of space and eliminate threats.',
        objectives: [
          { id: 'destroy_40_enemies', type: 'destroy_enemies', target: 40, description: 'Destroy 40 enemy ships', reward: 600 },
          { id: 'combo_score_5000', type: 'combo_score', target: 5000, description: 'Achieve 5000 combo score', reward: 800 },
          { id: 'survive_120_seconds', type: 'survive_time', target: 120, description: 'Survive for 2 minutes', reward: 1000 }
        ],
        rewards: [
          { type: 'weapon', value: 'plasma', description: 'Unlock Plasma Beam' },
          { type: 'currency', value: 1000, description: '1000 space credits' }
        ],
        difficulty: 'medium',
        unlockLevel: 5,
        estimatedTime: 200,
        background: 'deep_space',
        music: 'patrol_theme',
        enemies: [
          { enemyType: 'heavy_fighter', count: 8, spawnDelay: 2000, formation: 'diamond', speed: 1, health: 50 },
          { enemyType: 'fast_scout', count: 12, spawnDelay: 1000, formation: 'swarm', speed: 4, health: 15 },
          { enemyType: 'bomber', count: 4, spawnDelay: 3000, formation: 'line', speed: 1, health: 80 }
        ]
      },

      // Mission 5: Boss Battle - The Destroyer
      {
        id: 'mission_5',
        name: 'The Destroyer',
        description: 'Face off against the massive Destroyer class battleship.',
        objectives: [
          { id: 'defeat_destroyer', type: 'defeat_boss', target: 1, description: 'Defeat the Destroyer', reward: 5000 },
          { id: 'no_damage', type: 'no_damage', target: 1, description: 'Complete without taking damage', reward: 2000 },
          { id: 'accuracy_90', type: 'accuracy', target: 90, description: 'Maintain 90% accuracy', reward: 1500 }
        ],
        rewards: [
          { type: 'weapon', value: 'laser', description: 'Unlock Laser Cannon' },
          { type: 'ship', value: 'destroyer_hunter', description: 'Unlock Destroyer Hunter ship' },
          { type: 'achievement', value: 'destroyer_slayer', description: 'Destroyer Slayer achievement' }
        ],
        difficulty: 'hard',
        unlockLevel: 7,
        estimatedTime: 300,
        background: 'destroyer_battle',
        music: 'boss_theme',
        enemies: [
          { enemyType: 'heavy_fighter', count: 6, spawnDelay: 3000, formation: 'diamond', speed: 1, health: 50 },
          { enemyType: 'bomber', count: 3, spawnDelay: 4000, formation: 'line', speed: 1, health: 80 }
        ],
        boss: {
          id: 'the_destroyer',
          name: 'The Destroyer',
          health: 500,
          phases: 3,
          specialAttacks: ['plasma_cannon', 'missile_swarm', 'energy_shield']
        }
      },

      // Mission 6: Asteroid Mining Operation
      {
        id: 'mission_6',
        name: 'Asteroid Mining Operation',
        description: 'Protect mining operations from pirate attacks.',
        objectives: [
          { id: 'destroy_50_enemies', type: 'destroy_enemies', target: 50, description: 'Destroy 50 enemy ships', reward: 800 },
          { id: 'protect_miners', type: 'rescue_civilians', target: 15, description: 'Protect 15 miners', reward: 1500 },
          { id: 'collect_10_minerals', type: 'collect_items', target: 10, description: 'Collect 10 rare minerals', reward: 1000 }
        ],
        rewards: [
          { type: 'weapon', value: 'multi', description: 'Unlock Multi-Shot' },
          { type: 'currency', value: 2000, description: '2000 space credits' }
        ],
        difficulty: 'medium',
        unlockLevel: 8,
        estimatedTime: 250,
        background: 'mining_operation',
        music: 'mining_theme',
        enemies: [
          { enemyType: 'pirate_fighter', count: 15, spawnDelay: 1000, formation: 'random', speed: 3, health: 25 },
          { enemyType: 'pirate_bomber', count: 8, spawnDelay: 2000, formation: 'line', speed: 2, health: 60 },
          { enemyType: 'pirate_scout', count: 10, spawnDelay: 1500, formation: 'swarm', speed: 5, health: 20 }
        ]
      },

      // Mission 7: Space Station Defense
      {
        id: 'mission_7',
        name: 'Space Station Defense',
        description: 'Defend the space station from waves of enemy attacks.',
        objectives: [
          { id: 'survive_180_seconds', type: 'survive_time', target: 180, description: 'Defend for 3 minutes', reward: 2000 },
          { id: 'destroy_60_enemies', type: 'destroy_enemies', target: 60, description: 'Destroy 60 enemy ships', reward: 1200 },
          { id: 'combo_score_10000', type: 'combo_score', target: 10000, description: 'Achieve 10000 combo score', reward: 1500 }
        ],
        rewards: [
          { type: 'weapon', value: 'explosive', description: 'Unlock Explosive Rounds' },
          { type: 'achievement', value: 'station_defender', description: 'Station Defender achievement' }
        ],
        difficulty: 'hard',
        unlockLevel: 10,
        estimatedTime: 200,
        background: 'space_station',
        music: 'defense_theme',
        enemies: [
          { enemyType: 'heavy_fighter', count: 12, spawnDelay: 2000, formation: 'diamond', speed: 1, health: 50 },
          { enemyType: 'bomber', count: 8, spawnDelay: 3000, formation: 'line', speed: 1, health: 80 },
          { enemyType: 'fast_scout', count: 20, spawnDelay: 1000, formation: 'swarm', speed: 4, health: 15 }
        ]
      },

      // Mission 8: Nebula Exploration
      {
        id: 'mission_8',
        name: 'Nebula Exploration',
        description: 'Explore the mysterious nebula and discover its secrets.',
        objectives: [
          { id: 'destroy_35_enemies', type: 'destroy_enemies', target: 35, description: 'Destroy 35 enemy ships', reward: 700 },
          { id: 'collect_8_artifacts', type: 'collect_items', target: 8, description: 'Collect 8 ancient artifacts', reward: 1200 },
          { id: 'survive_150_seconds', type: 'survive_time', target: 150, description: 'Survive for 2.5 minutes', reward: 1000 }
        ],
        rewards: [
          { type: 'weapon', value: 'piercing', description: 'Unlock Piercing Shot' },
          { type: 'ship', value: 'nebula_explorer', description: 'Unlock Nebula Explorer ship' }
        ],
        difficulty: 'medium',
        unlockLevel: 12,
        estimatedTime: 180,
        background: 'nebula',
        music: 'exploration_theme',
        enemies: [
          { enemyType: 'nebula_creature', count: 10, spawnDelay: 2000, formation: 'random', speed: 2, health: 30 },
          { enemyType: 'energy_being', count: 8, spawnDelay: 2500, formation: 'circle', speed: 3, health: 40 },
          { enemyType: 'ancient_guardian', count: 4, spawnDelay: 4000, formation: 'diamond', speed: 1, health: 100 }
        ]
      },

      // Mission 9: Boss Battle - The Leviathan
      {
        id: 'mission_9',
        name: 'The Leviathan',
        description: 'Face the legendary Leviathan, a massive space creature.',
        objectives: [
          { id: 'defeat_leviathan', type: 'defeat_boss', target: 1, description: 'Defeat the Leviathan', reward: 8000 },
          { id: 'no_damage', type: 'no_damage', target: 1, description: 'Complete without taking damage', reward: 3000 },
          { id: 'accuracy_95', type: 'accuracy', target: 95, description: 'Maintain 95% accuracy', reward: 2500 }
        ],
        rewards: [
          { type: 'weapon', value: 'freeze', description: 'Unlock Freeze Ray' },
          { type: 'ship', value: 'leviathan_hunter', description: 'Unlock Leviathan Hunter ship' },
          { type: 'achievement', value: 'leviathan_slayer', description: 'Leviathan Slayer achievement' }
        ],
        difficulty: 'extreme',
        unlockLevel: 15,
        estimatedTime: 400,
        background: 'leviathan_battle',
        music: 'epic_boss_theme',
        enemies: [
          { enemyType: 'leviathan_spawn', count: 8, spawnDelay: 3000, formation: 'circle', speed: 2, health: 60 },
          { enemyType: 'energy_tentacle', count: 6, spawnDelay: 4000, formation: 'random', speed: 1, health: 80 }
        ],
        boss: {
          id: 'the_leviathan',
          name: 'The Leviathan',
          health: 1000,
          phases: 4,
          specialAttacks: ['tentacle_swipe', 'energy_blast', 'spawn_creation', 'reality_warp']
        }
      },

      // Mission 10: Galactic War
      {
        id: 'mission_10',
        name: 'Galactic War',
        description: 'Participate in the epic galactic war against the enemy fleet.',
        objectives: [
          { id: 'destroy_100_enemies', type: 'destroy_enemies', target: 100, description: 'Destroy 100 enemy ships', reward: 2000 },
          { id: 'survive_300_seconds', type: 'survive_time', target: 300, description: 'Survive for 5 minutes', reward: 3000 },
          { id: 'combo_score_25000', type: 'combo_score', target: 25000, description: 'Achieve 25000 combo score', reward: 2500 }
        ],
        rewards: [
          { type: 'weapon', value: 'electric', description: 'Unlock Lightning Gun' },
          { type: 'currency', value: 5000, description: '5000 space credits' }
        ],
        difficulty: 'extreme',
        unlockLevel: 18,
        estimatedTime: 300,
        background: 'galactic_war',
        music: 'war_theme',
        enemies: [
          { enemyType: 'war_fighter', count: 20, spawnDelay: 1000, formation: 'random', speed: 3, health: 40 },
          { enemyType: 'war_bomber', count: 15, spawnDelay: 1500, formation: 'line', speed: 2, health: 100 },
          { enemyType: 'war_scout', count: 25, spawnDelay: 800, formation: 'swarm', speed: 5, health: 25 }
        ]
      },

      // Mission 11: Time Rift
      {
        id: 'mission_11',
        name: 'Time Rift',
        description: 'Navigate through a temporal anomaly and fight enemies from different time periods.',
        objectives: [
          { id: 'destroy_45_enemies', type: 'destroy_enemies', target: 45, description: 'Destroy 45 enemy ships', reward: 900 },
          { id: 'collect_12_time_crystals', type: 'collect_items', target: 12, description: 'Collect 12 time crystals', reward: 1500 },
          { id: 'survive_120_seconds', type: 'survive_time', target: 120, description: 'Survive for 2 minutes', reward: 1200 }
        ],
        rewards: [
          { type: 'weapon', value: 'fire', description: 'Unlock Flame Thrower' },
          { type: 'ship', value: 'time_traveler', description: 'Unlock Time Traveler ship' }
        ],
        difficulty: 'hard',
        unlockLevel: 20,
        estimatedTime: 150,
        background: 'time_rift',
        music: 'time_theme',
        enemies: [
          { enemyType: 'ancient_fighter', count: 12, spawnDelay: 1500, formation: 'diamond', speed: 2, health: 35 },
          { enemyType: 'future_drone', count: 15, spawnDelay: 1200, formation: 'swarm', speed: 4, health: 25 },
          { enemyType: 'temporal_guardian', count: 6, spawnDelay: 3000, formation: 'circle', speed: 1, health: 80 }
        ]
      },

      // Mission 12: Black Hole Encounter
      {
        id: 'mission_12',
        name: 'Black Hole Encounter',
        description: 'Survive the gravitational pull of a black hole while fighting enemies.',
        objectives: [
          { id: 'destroy_40_enemies', type: 'destroy_enemies', target: 40, description: 'Destroy 40 enemy ships', reward: 1000 },
          { id: 'survive_180_seconds', type: 'survive_time', target: 180, description: 'Survive for 3 minutes', reward: 2000 },
          { id: 'no_damage', type: 'no_damage', target: 1, description: 'Complete without taking damage', reward: 3000 }
        ],
        rewards: [
          { type: 'weapon', value: 'ice', description: 'Unlock Ice Shards' },
          { type: 'achievement', value: 'black_hole_survivor', description: 'Black Hole Survivor achievement' }
        ],
        difficulty: 'extreme',
        unlockLevel: 25,
        estimatedTime: 200,
        background: 'black_hole',
        music: 'cosmic_theme',
        enemies: [
          { enemyType: 'gravity_fighter', count: 10, spawnDelay: 2000, formation: 'random', speed: 2, health: 50 },
          { enemyType: 'black_hole_guardian', count: 4, spawnDelay: 4000, formation: 'diamond', speed: 1, health: 120 }
        ],
        specialConditions: [
          { type: 'environmental', value: 1, description: 'Gravitational pull affects movement' }
        ]
      },

      // Mission 13: Final Boss - The Void Lord
      {
        id: 'mission_13',
        name: 'The Void Lord',
        description: 'Face the ultimate enemy, the Void Lord, in the final battle.',
        objectives: [
          { id: 'defeat_void_lord', type: 'defeat_boss', target: 1, description: 'Defeat the Void Lord', reward: 10000 },
          { id: 'no_damage', type: 'no_damage', target: 1, description: 'Complete without taking damage', reward: 5000 },
          { id: 'accuracy_98', type: 'accuracy', target: 98, description: 'Maintain 98% accuracy', reward: 4000 }
        ],
        rewards: [
          { type: 'weapon', value: 'ultimate', description: 'Unlock Ultimate Destroyer' },
          { type: 'ship', value: 'void_hunter', description: 'Unlock Void Hunter ship' },
          { type: 'achievement', value: 'void_lord_slayer', description: 'Void Lord Slayer achievement' }
        ],
        difficulty: 'extreme',
        unlockLevel: 30,
        estimatedTime: 500,
        background: 'void_dimension',
        music: 'final_boss_theme',
        enemies: [
          { enemyType: 'void_spawn', count: 10, spawnDelay: 2000, formation: 'circle', speed: 3, health: 80 },
          { enemyType: 'void_guardian', count: 6, spawnDelay: 3000, formation: 'diamond', speed: 2, health: 150 }
        ],
        boss: {
          id: 'void_lord',
          name: 'The Void Lord',
          health: 2000,
          phases: 5,
          specialAttacks: ['void_blast', 'reality_tear', 'spawn_army', 'time_stop', 'dimension_shift']
        }
      },

      // Mission 14: Endless Mode
      {
        id: 'mission_14',
        name: 'Endless Mode',
        description: 'Survive as long as possible against endless waves of enemies.',
        objectives: [
          { id: 'survive_600_seconds', type: 'survive_time', target: 600, description: 'Survive for 10 minutes', reward: 5000 },
          { id: 'destroy_200_enemies', type: 'destroy_enemies', target: 200, description: 'Destroy 200 enemy ships', reward: 3000 },
          { id: 'combo_score_50000', type: 'combo_score', target: 50000, description: 'Achieve 50000 combo score', reward: 4000 }
        ],
        rewards: [
          { type: 'weapon', value: 'cosmic', description: 'Unlock Cosmic Ray' },
          { type: 'currency', value: 10000, description: '10000 space credits' }
        ],
        difficulty: 'extreme',
        unlockLevel: 35,
        estimatedTime: 600,
        background: 'endless_void',
        music: 'endless_theme',
        enemies: [
          { enemyType: 'endless_fighter', count: 50, spawnDelay: 500, formation: 'random', speed: 4, health: 60 },
          { enemyType: 'endless_bomber', count: 30, spawnDelay: 1000, formation: 'line', speed: 3, health: 120 },
          { enemyType: 'endless_scout', count: 40, spawnDelay: 800, formation: 'swarm', speed: 6, health: 40 }
        ]
      },

      // Mission 15: Ultimate Challenge
      {
        id: 'mission_15',
        name: 'Ultimate Challenge',
        description: 'The ultimate test of skill - face all bosses in sequence.',
        objectives: [
          { id: 'defeat_all_bosses', type: 'defeat_boss', target: 5, description: 'Defeat all 5 bosses', reward: 15000 },
          { id: 'no_damage', type: 'no_damage', target: 1, description: 'Complete without taking damage', reward: 10000 },
          { id: 'accuracy_99', type: 'accuracy', target: 99, description: 'Maintain 99% accuracy', reward: 8000 }
        ],
        rewards: [
          { type: 'weapon', value: 'quantum', description: 'Unlock Quantum Blaster' },
          { type: 'ship', value: 'ultimate_warrior', description: 'Unlock Ultimate Warrior ship' },
          { type: 'achievement', value: 'ultimate_champion', description: 'Ultimate Champion achievement' }
        ],
        difficulty: 'extreme',
        unlockLevel: 50,
        estimatedTime: 1000,
        background: 'ultimate_arena',
        music: 'ultimate_theme',
        enemies: [
          { enemyType: 'ultimate_fighter', count: 20, spawnDelay: 1000, formation: 'diamond', speed: 5, health: 100 },
          { enemyType: 'ultimate_bomber', count: 15, spawnDelay: 1500, formation: 'line', speed: 4, health: 200 },
          { enemyType: 'ultimate_scout', count: 25, spawnDelay: 800, formation: 'swarm', speed: 8, health: 60 }
        ],
        boss: {
          id: 'ultimate_challenge',
          name: 'Ultimate Challenge',
          health: 5000,
          phases: 10,
          specialAttacks: ['all_boss_attacks', 'reality_manipulation', 'time_control', 'space_warp', 'ultimate_destruction']
        }
      }
    ];
  }

  getMission(id: string): Mission | undefined {
    return this.missions.find(m => m.id === id);
  }

  getAllMissions(): Mission[] {
    return this.missions;
  }

  getUnlockedMissions(): Mission[] {
    return this.missions.filter(m => this.unlockedMissions.has(m.id));
  }

  getCompletedMissions(): Mission[] {
    return this.missions.filter(m => this.completedMissions.has(m.id));
  }

  startMission(missionId: string): boolean {
    const mission = this.getMission(missionId);
    if (mission && this.unlockedMissions.has(missionId)) {
      this.currentMission = mission;
      this.missionProgress.clear();
      return true;
    }
    return false;
  }

  getCurrentMission(): Mission | null {
    return this.currentMission;
  }

  updateMissionProgress(objectiveId: string, progress: number): void {
    if (this.currentMission) {
      this.missionProgress.set(objectiveId, progress);
    }
  }

  getMissionProgress(objectiveId: string): number {
    return this.missionProgress.get(objectiveId) || 0;
  }

  completeMission(): boolean {
    if (!this.currentMission) return false;

    const allObjectivesComplete = this.currentMission.objectives.every(objective => {
      const progress = this.getMissionProgress(objective.id);
      return progress >= objective.target;
    });

    if (allObjectivesComplete) {
      this.completedMissions.add(this.currentMission.id);
      this.unlockNextMissions();
      this.currentMission = null;
      return true;
    }

    return false;
  }

  private unlockNextMissions(): void {
    const currentLevel = this.getPlayerLevel();
    this.missions.forEach(mission => {
      if (mission.unlockLevel <= currentLevel && !this.unlockedMissions.has(mission.id)) {
        this.unlockedMissions.add(mission.id);
      }
    });
  }

  private getPlayerLevel(): number {
    // This would be calculated based on player progress
    return this.completedMissions.size + 1;
  }

  canUnlockMission(missionId: string, playerLevel: number): boolean {
    const mission = this.getMission(missionId);
    if (!mission) return false;
    
    return playerLevel >= mission.unlockLevel && !this.unlockedMissions.has(missionId);
  }

  getMissionRewards(missionId: string): MissionReward[] {
    const mission = this.getMission(missionId);
    return mission ? mission.rewards : [];
  }

  getMissionStats(missionId: string): any {
    const mission = this.getMission(missionId);
    if (!mission) return null;

    return {
      name: mission.name,
      difficulty: mission.difficulty,
      objectives: mission.objectives.length,
      estimatedTime: mission.estimatedTime,
      completed: this.completedMissions.has(missionId),
      unlocked: this.unlockedMissions.has(missionId)
    };
  }
}
