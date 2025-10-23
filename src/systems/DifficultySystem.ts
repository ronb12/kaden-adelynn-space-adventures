export interface DifficultySettings {
  name: string;
  enemySpawnRate: number;
  enemySpeed: number;
  enemyHealth: number;
  bossSpawnRate: number;
  bossHealth: number;
  powerUpSpawnRate: number;
  playerHealth: number;
  playerSpeed: number;
  scoreMultiplier: number;
}

export class DifficultySystem {
  private currentDifficulty: 'easy' | 'medium' | 'hard' = 'medium';
  private difficultySettings: { [key: string]: DifficultySettings } = {
    easy: {
      name: 'Easy',
      enemySpawnRate: 2000, // 2 seconds
      enemySpeed: 1.5,
      enemyHealth: 1,
      bossSpawnRate: 60000, // 1 minute
      bossHealth: 50,
      powerUpSpawnRate: 8000, // 8 seconds
      playerHealth: 100,
      playerSpeed: 5,
      scoreMultiplier: 1.0
    },
    medium: {
      name: 'Medium',
      enemySpawnRate: 1000, // 1 second
      enemySpeed: 2.0,
      enemyHealth: 1,
      bossSpawnRate: 30000, // 30 seconds
      bossHealth: 100,
      powerUpSpawnRate: 5000, // 5 seconds
      playerHealth: 50,
      playerSpeed: 4,
      scoreMultiplier: 1.5
    },
    hard: {
      name: 'Hard',
      enemySpawnRate: 500, // 0.5 seconds
      enemySpeed: 3.0,
      enemyHealth: 2,
      bossSpawnRate: 20000, // 20 seconds
      bossHealth: 200,
      powerUpSpawnRate: 3000, // 3 seconds
      playerHealth: 25,
      playerSpeed: 3,
      scoreMultiplier: 2.0
    }
  };

  getCurrentDifficulty(): 'easy' | 'medium' | 'hard' {
    return this.currentDifficulty;
  }

  setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    this.currentDifficulty = difficulty;
  }

  getDifficultySettings(): DifficultySettings {
    return this.difficultySettings[this.currentDifficulty];
  }

  getDifficultySettingsFor(difficulty: 'easy' | 'medium' | 'hard'): DifficultySettings {
    return this.difficultySettings[difficulty];
  }

  getAllDifficulties(): DifficultySettings[] {
    return Object.values(this.difficultySettings);
  }

  getDifficultyName(): string {
    return this.difficultySettings[this.currentDifficulty].name;
  }

  getEnemySpawnRate(): number {
    return this.difficultySettings[this.currentDifficulty].enemySpawnRate;
  }

  getEnemySpeed(): number {
    return this.difficultySettings[this.currentDifficulty].enemySpeed;
  }

  getEnemyHealth(): number {
    return this.difficultySettings[this.currentDifficulty].enemyHealth;
  }

  getBossSpawnRate(): number {
    return this.difficultySettings[this.currentDifficulty].bossSpawnRate;
  }

  getBossHealth(): number {
    return this.difficultySettings[this.currentDifficulty].bossHealth;
  }

  getPowerUpSpawnRate(): number {
    return this.difficultySettings[this.currentDifficulty].powerUpSpawnRate;
  }

  getPlayerHealth(): number {
    return this.difficultySettings[this.currentDifficulty].playerHealth;
  }

  getPlayerSpeed(): number {
    return this.difficultySettings[this.currentDifficulty].playerSpeed;
  }

  getScoreMultiplier(): number {
    return this.difficultySettings[this.currentDifficulty].scoreMultiplier;
  }

  // Dynamic difficulty adjustment based on player performance
  adjustDifficultyBasedOnPerformance(score: number, lives: number, gameTime: number): void {
    const performanceScore = (score / 1000) + (lives * 100) + (gameTime / 1000);
    
    if (performanceScore > 1000 && this.currentDifficulty === 'easy') {
      this.currentDifficulty = 'medium';
    } else if (performanceScore > 2000 && this.currentDifficulty === 'medium') {
      this.currentDifficulty = 'hard';
    } else if (performanceScore < 500 && this.currentDifficulty === 'hard') {
      this.currentDifficulty = 'medium';
    } else if (performanceScore < 200 && this.currentDifficulty === 'medium') {
      this.currentDifficulty = 'easy';
    }
  }

  // Progressive difficulty increase
  increaseDifficulty(score: number): void {
    const scoreThresholds = {
      easy: 10000,
      medium: 50000,
      hard: 100000
    };

    if (score >= scoreThresholds[this.currentDifficulty]) {
      switch (this.currentDifficulty) {
        case 'easy':
          this.currentDifficulty = 'medium';
          break;
        case 'medium':
          this.currentDifficulty = 'hard';
          break;
        case 'hard':
          // Already at maximum difficulty
          break;
      }
    }
  }

  // Get difficulty description
  getDifficultyDescription(): string {
    switch (this.currentDifficulty) {
      case 'easy':
        return 'Relaxed gameplay with slower enemies and more health';
      case 'medium':
        return 'Balanced challenge with moderate enemy speed and health';
      case 'hard':
        return 'Intense gameplay with fast enemies and limited health';
      default:
        return 'Unknown difficulty';
    }
  }

  // Get difficulty color for UI
  getDifficultyColor(): string {
    switch (this.currentDifficulty) {
      case 'easy':
        return '#00ff00';
      case 'medium':
        return '#ffaa00';
      case 'hard':
        return '#ff0000';
      default:
        return '#ffffff';
    }
  }
}
