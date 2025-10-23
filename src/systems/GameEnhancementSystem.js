// Game Enhancement System - Making Kaden & Adelynn Space Adventures #1

export const GameEnhancementSystem = {
  // Visual Enhancements
  visual: {
    // Particle Systems
    particles: {
      explosion: {
        count: 50,
        colors: ['#FF6B6B', '#FFD93D', '#6BCF7F', '#4D96FF'],
        size: [2, 8],
        speed: [1, 5],
        life: [500, 1500]
      },
      engine: {
        count: 20,
        colors: ['#00AAFF', '#0066FF'],
        size: [1, 3],
        speed: [2, 4],
        life: [200, 400]
      },
      powerUp: {
        count: 30,
        colors: ['#FFD700', '#FF69B4', '#9370DB'],
        size: [1, 4],
        speed: [0.5, 2],
        life: [800, 1200]
      }
    },
    
    // Screen Effects
    effects: {
      screenShake: {
        intensity: 5,
        duration: 200,
        frequency: 0.1
      },
      slowMotion: {
        factor: 0.3,
        duration: 1000
      },
      flash: {
        color: '#FFFFFF',
        alpha: 0.8,
        duration: 100
      }
    },
    
    // Lighting System
    lighting: {
      ambient: '#001122',
      player: '#00AAFF',
      enemy: '#FF4444',
      powerUp: '#FFD700',
      boss: '#FF6600'
    }
  },
  
  // Audio Enhancements
  audio: {
    sfx: {
      shoot: {
        frequency: [800, 1200],
        duration: 0.1,
        volume: 0.3
      },
      explosion: {
        frequency: [200, 400],
        duration: 0.5,
        volume: 0.6
      },
      powerUp: {
        frequency: [600, 800],
        duration: 0.3,
        volume: 0.4
      },
      bossSpawn: {
        frequency: [150, 300],
        duration: 1.0,
        volume: 0.8
      }
    },
    
    music: {
      menu: {
        tempo: 120,
        key: 'C major',
        style: 'epic orchestral'
      },
      gameplay: {
        tempo: 140,
        key: 'A minor',
        style: 'electronic rock'
      },
      boss: {
        tempo: 160,
        key: 'D minor',
        style: 'intense orchestral'
      }
    }
  },
  
  // Gameplay Enhancements
  gameplay: {
    // Difficulty Scaling
    difficulty: {
      easy: {
        enemySpeed: 0.7,
        enemyHealth: 0.8,
        enemySpawnRate: 0.6,
        powerUpRate: 1.5
      },
      medium: {
        enemySpeed: 1.0,
        enemyHealth: 1.0,
        enemySpawnRate: 1.0,
        powerUpRate: 1.0
      },
      hard: {
        enemySpeed: 1.3,
        enemyHealth: 1.5,
        enemySpawnRate: 1.5,
        powerUpRate: 0.7
      }
    },
    
    // Power-up System
    powerUps: {
      rapidFire: {
        duration: 5000,
        effect: 'double fire rate',
        color: '#FFFF00',
        icon: '⚡'
      },
      shield: {
        duration: 8000,
        effect: 'invulnerability',
        color: '#00FF00',
        icon: '🛡️'
      },
      multiShot: {
        duration: 6000,
        effect: 'triple shot',
        color: '#FF00FF',
        icon: '💥'
      },
      speedBoost: {
        duration: 4000,
        effect: 'increased speed',
        color: '#00FFFF',
        icon: '🚀'
      }
    },
    
    // Boss System
    bosses: {
      phases: {
        1: { health: 100, attacks: ['spawn', 'shoot'], speed: 1.0 },
        2: { health: 50, attacks: ['spawn', 'shoot', 'laser'], speed: 1.2 },
        3: { health: 25, attacks: ['spawn', 'shoot', 'laser', 'explode'], speed: 1.5 }
      },
      attacks: {
        spawn: { frequency: 2000, count: 3 },
        shoot: { frequency: 500, damage: 1 },
        laser: { frequency: 3000, damage: 2 },
        explode: { frequency: 5000, damage: 3 }
      }
    }
  },
  
  // UI Enhancements
  ui: {
    // HUD Elements
    hud: {
      healthBar: {
        position: 'top-left',
        style: 'gradient',
        colors: ['#FF0000', '#FFFF00', '#00FF00']
      },
      score: {
        position: 'top-right',
        style: 'glowing',
        animation: 'pulse'
      },
      minimap: {
        position: 'bottom-right',
        size: 100,
        opacity: 0.7
      }
    },
    
    // Menu Enhancements
    menu: {
      background: {
        type: 'animated',
        particles: true,
        parallax: true
      },
      buttons: {
        style: 'neon',
        animation: 'glow',
        sound: true
      }
    }
  },
  
  // Performance Optimizations
  performance: {
    // Object Pooling
    pooling: {
      bullets: 100,
      enemies: 50,
      particles: 200,
      explosions: 20
    },
    
    // Rendering Optimizations
    rendering: {
      culling: true,
      batching: true,
      compression: true,
      lod: true // Level of Detail
    },
    
    // Memory Management
    memory: {
      cleanup: true,
      garbageCollection: true,
      assetOptimization: true
    }
  }
};

// Enhanced Game Mechanics
export const EnhancedGameMechanics = {
  // Combo System
  combo: {
    multiplier: {
      5: 1.2,
      10: 1.5,
      15: 2.0,
      20: 2.5,
      25: 3.0
    },
    bonuses: {
      rapidKills: 'speed boost',
      perfectDodges: 'shield charge',
      powerUpChains: 'double points'
    }
  },
  
  // Achievement System
  achievements: {
    firstBlood: {
      name: 'First Blood',
      description: 'Destroy your first enemy',
      reward: '100 points',
      icon: '🩸'
    },
    comboMaster: {
      name: 'Combo Master',
      description: 'Achieve a 20x combo',
      reward: 'Speed boost',
      icon: '🔥'
    },
    bossSlayer: {
      name: 'Boss Slayer',
      description: 'Defeat your first boss',
      reward: 'New weapon',
      icon: '⚔️'
    },
    survivor: {
      name: 'Survivor',
      description: 'Survive for 5 minutes',
      reward: 'Extra life',
      icon: '🛡️'
    }
  },
  
  // Progression System
  progression: {
    levels: [
      { level: 1, xp: 0, unlocks: ['basic ship'] },
      { level: 2, xp: 100, unlocks: ['rapid fire'] },
      { level: 3, xp: 250, unlocks: ['shield'] },
      { level: 4, xp: 500, unlocks: ['multi-shot'] },
      { level: 5, xp: 1000, unlocks: ['boss mode'] }
    ],
    
    upgrades: {
      weapon: {
        damage: [1, 2, 3, 4, 5],
        fireRate: [1, 1.2, 1.5, 2, 2.5],
        range: [100, 120, 150, 180, 200]
      },
      ship: {
        speed: [1, 1.1, 1.2, 1.3, 1.5],
        health: [100, 120, 150, 180, 200],
        shield: [0, 50, 100, 150, 200]
      }
    }
  }
};

export default GameEnhancementSystem;
