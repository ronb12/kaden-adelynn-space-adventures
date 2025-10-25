export interface GameSaveData {
  version: string;
  timestamp: number;
  playerStats: {
    score: number;
    health: number;
    maxHealth: number;
    level: number;
    enemiesKilled: number;
    bossesKilled: number;
    powerUpsCollected: number;
    killStreak: number;
    maxKillStreak: number;
    survivalTime: number;
    maxCombo: number;
    achievementsUnlocked: number;
  };
  moneyData: {
    coins: number;
    gems: number;
    credits: number;
    energyCores: number;
    totalValue: number;
  };
  upgrades: Array<{
    id: string;
    level: number;
    unlocked: boolean;
  }>;
  achievements: Array<{
    id: string;
    unlocked: boolean;
    progress: number;
  }>;
  settings: {
    audio: {
      masterVolume: number;
      musicVolume: number;
      soundEffectsVolume: number;
    };
    graphics: {
      quality: string;
      particles: boolean;
      shadows: boolean;
    };
    controls: {
      touchEnabled: boolean;
      controllerEnabled: boolean;
    };
  };
  gameProgress: {
    currentScene: string;
    selectedCharacter: string;
    selectedBoss?: string;
    challengeMode?: string;
    multiplayerMode?: string;
  };
}

export class SaveLoadSystem {
  private readonly SAVE_KEY = 'kaden_adelynn_space_adventures_save';
  private readonly MAX_SAVES = 3;
  private readonly VERSION = '1.0.0';

  saveGame(gameData: Partial<GameSaveData>): boolean {
    try {
      const saveData: GameSaveData = {
        version: this.VERSION,
        timestamp: Date.now(),
        playerStats: {
          score: 0,
          health: 100,
          maxHealth: 100,
          level: 1,
          enemiesKilled: 0,
          bossesKilled: 0,
          powerUpsCollected: 0,
          killStreak: 0,
          maxKillStreak: 0,
          survivalTime: 0,
          maxCombo: 0,
          achievementsUnlocked: 0,
          ...gameData.playerStats
        },
        moneyData: {
          coins: 0,
          gems: 0,
          credits: 0,
          energyCores: 0,
          totalValue: 0,
          ...gameData.moneyData
        },
        upgrades: gameData.upgrades || [],
        achievements: gameData.achievements || [],
        settings: {
          audio: {
            masterVolume: 80,
            musicVolume: 70,
            soundEffectsVolume: 90
          },
          graphics: {
            quality: 'high',
            particles: true,
            shadows: true
          },
          controls: {
            touchEnabled: true,
            controllerEnabled: false
          },
          ...gameData.settings
        },
        gameProgress: {
          currentScene: 'menu',
          selectedCharacter: 'kaden',
          ...gameData.gameProgress
        }
      };

      // Get existing saves
      const existingSaves = this.getAllSaves();
      
      // Add new save
      existingSaves.unshift(saveData);
      
      // Keep only the most recent saves
      const recentSaves = existingSaves.slice(0, this.MAX_SAVES);
      
      // Save to localStorage
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(recentSaves));
      
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  loadGame(saveIndex: number = 0): GameSaveData | null {
    try {
      const saves = this.getAllSaves();
      if (saveIndex >= saves.length) {
        return null;
      }
      
      const saveData = saves[saveIndex];
      
      // Check version compatibility
      if (saveData.version !== this.VERSION) {
        console.warn('Save version mismatch, attempting to migrate...');
        return this.migrateSave(saveData);
      }
      
      return saveData;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  getAllSaves(): GameSaveData[] {
    try {
      const savesData = localStorage.getItem(this.SAVE_KEY);
      if (!savesData) return [];
      
      const saves = JSON.parse(savesData);
      return Array.isArray(saves) ? saves : [];
    } catch (error) {
      console.error('Failed to get saves:', error);
      return [];
    }
  }

  deleteSave(saveIndex: number): boolean {
    try {
      const saves = this.getAllSaves();
      if (saveIndex >= saves.length) return false;
      
      saves.splice(saveIndex, 1);
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saves));
      return true;
    } catch (error) {
      console.error('Failed to delete save:', error);
      return false;
    }
  }

  exportSave(saveIndex: number = 0): string | null {
    try {
      const saves = this.getAllSaves();
      if (saveIndex >= saves.length) return null;
      
      return JSON.stringify(saves[saveIndex], null, 2);
    } catch (error) {
      console.error('Failed to export save:', error);
      return null;
    }
  }

  importSave(saveData: string): boolean {
    try {
      const save = JSON.parse(saveData);
      if (!this.validateSaveData(save)) {
        return false;
      }
      
      const existingSaves = this.getAllSaves();
      existingSaves.unshift(save);
      
      // Keep only the most recent saves
      const recentSaves = existingSaves.slice(0, this.MAX_SAVES);
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(recentSaves));
      
      return true;
    } catch (error) {
      console.error('Failed to import save:', error);
      return false;
    }
  }

  private validateSaveData(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      data.version &&
      data.timestamp &&
      data.playerStats &&
      data.moneyData &&
      data.upgrades &&
      data.achievements &&
      data.settings &&
      data.gameProgress
    );
  }

  private migrateSave(saveData: any): GameSaveData | null {
    // Handle version migration here
    // For now, return the save data as-is
    return saveData as GameSaveData;
  }

  getSaveInfo(saveIndex: number = 0): { timestamp: number; score: number; level: number } | null {
    try {
      const saves = this.getAllSaves();
      if (saveIndex >= saves.length) return null;
      
      const save = saves[saveIndex];
      return {
        timestamp: save.timestamp,
        score: save.playerStats.score,
        level: save.playerStats.level
      };
    } catch (error) {
      console.error('Failed to get save info:', error);
      return null;
    }
  }

  clearAllSaves(): boolean {
    try {
      localStorage.removeItem(this.SAVE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear saves:', error);
      return false;
    }
  }

  getSaveCount(): number {
    return this.getAllSaves().length;
  }

  hasSaves(): boolean {
    return this.getSaveCount() > 0;
  }
}

