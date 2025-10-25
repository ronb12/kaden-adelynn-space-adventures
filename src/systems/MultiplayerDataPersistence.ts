// Multiplayer Data Persistence System
export interface PlayerProgress {
  playerId: string;
  name: string;
  level: number;
  experience: number;
  achievements: string[];
  stats: {
    gamesPlayed: number;
    wins: number;
    kills: number;
    deaths: number;
    totalScore: number;
    playTime: number;
    favoriteGameMode: string;
    bestScore: number;
    longestSurvival: number;
  };
  unlockedShips: string[];
  unlockedWeapons: string[];
  unlockedAbilities: string[];
  customization: {
    shipHull: string;
    shipWeapons: string[];
    shipEngines: string;
    shipShields: string;
    shipPaint: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  preferences: {
    controls: any;
    graphics: any;
    audio: any;
    multiplayer: any;
  };
  lastPlayed: number;
  createdAt: number;
}

export interface GameSession {
  sessionId: string;
  roomId: string;
  gameMode: string;
  players: string[];
  startTime: number;
  endTime?: number;
  duration?: number;
  winner?: string;
  finalScores: { [playerId: string]: number };
  achievements: { [playerId: string]: string[] };
  gameData: any;
}

export interface LeaderboardEntry {
  playerId: string;
  name: string;
  score: number;
  rank: number;
  gameMode: string;
  timestamp: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'multiplayer' | 'combat' | 'survival' | 'teamwork' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: string;
    value: number;
    description: string;
  }[];
  rewards: {
    experience: number;
    credits: number;
    items: string[];
  };
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
}

export class MultiplayerDataPersistence {
  private storageKey = 'multiplayer_game_data';
  private cloudSyncEnabled = false;
  private cloudSyncUrl = '';
  private autoSaveInterval = 30000; // 30 seconds
  private autoSaveTimer: NodeJS.Timeout | null = null;

  constructor(cloudSyncUrl?: string) {
    if (cloudSyncUrl) {
      this.cloudSyncEnabled = true;
      this.cloudSyncUrl = cloudSyncUrl;
    }
    this.startAutoSave();
  }

  // Player Progress Management
  async savePlayerProgress(progress: PlayerProgress): Promise<boolean> {
    try {
      // Save to localStorage
      const existingData = this.loadAllData();
      existingData.players = existingData.players || new Map();
      existingData.players.set(progress.playerId, progress);
      
      localStorage.setItem(this.storageKey, JSON.stringify({
        ...existingData,
        lastUpdated: Date.now()
      }));

      // Sync to cloud if enabled
      if (this.cloudSyncEnabled) {
        await this.syncToCloud('player', progress);
      }

      console.log('💾 Player progress saved');
      return true;
    } catch (error) {
      console.error('❌ Failed to save player progress:', error);
      return false;
    }
  }

  async loadPlayerProgress(playerId: string): Promise<PlayerProgress | null> {
    try {
      const data = this.loadAllData();
      return data.players?.get(playerId) || null;
    } catch (error) {
      console.error('❌ Failed to load player progress:', error);
      return null;
    }
  }

  async updatePlayerStats(playerId: string, stats: Partial<PlayerProgress['stats']>): Promise<boolean> {
    try {
      const progress = await this.loadPlayerProgress(playerId);
      if (progress) {
        progress.stats = { ...progress.stats, ...stats };
        progress.lastPlayed = Date.now();
        return await this.savePlayerProgress(progress);
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to update player stats:', error);
      return false;
    }
  }

  async unlockAchievement(playerId: string, achievementId: string): Promise<boolean> {
    try {
      const progress = await this.loadPlayerProgress(playerId);
      if (progress && !progress.achievements.includes(achievementId)) {
        progress.achievements.push(achievementId);
        progress.lastPlayed = Date.now();
        return await this.savePlayerProgress(progress);
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to unlock achievement:', error);
      return false;
    }
  }

  // Game Session Management
  async saveGameSession(session: GameSession): Promise<boolean> {
    try {
      const existingData = this.loadAllData();
      existingData.sessions = existingData.sessions || [];
      existingData.sessions.push(session);
      
      localStorage.setItem(this.storageKey, JSON.stringify({
        ...existingData,
        lastUpdated: Date.now()
      }));

      if (this.cloudSyncEnabled) {
        await this.syncToCloud('session', session);
      }

      console.log('💾 Game session saved');
      return true;
    } catch (error) {
      console.error('❌ Failed to save game session:', error);
      return false;
    }
  }

  async loadGameSessions(playerId?: string): Promise<GameSession[]> {
    try {
      const data = this.loadAllData();
      let sessions = data.sessions || [];
      
      if (playerId) {
        sessions = sessions.filter((session: GameSession) => session.players.includes(playerId));
      }
      
      return sessions.sort((a: GameSession, b: GameSession) => b.startTime - a.startTime);
    } catch (error) {
      console.error('❌ Failed to load game sessions:', error);
      return [];
    }
  }

  // Leaderboard Management
  async updateLeaderboard(entry: LeaderboardEntry): Promise<boolean> {
    try {
      const existingData = this.loadAllData();
      existingData.leaderboards = existingData.leaderboards || [];
      
      // Remove existing entry for this player and game mode
      existingData.leaderboards = existingData.leaderboards.filter(
        (e: LeaderboardEntry) => !(e.playerId === entry.playerId && e.gameMode === entry.gameMode)
      );
      
      // Add new entry
      existingData.leaderboards.push(entry);
      
      // Sort by score and update ranks
      existingData.leaderboards.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);
      existingData.leaderboards.forEach((e: LeaderboardEntry, index: number) => {
        e.rank = index + 1;
      });
      
      localStorage.setItem(this.storageKey, JSON.stringify({
        ...existingData,
        lastUpdated: Date.now()
      }));

      if (this.cloudSyncEnabled) {
        await this.syncToCloud('leaderboard', entry);
      }

      return true;
    } catch (error) {
      console.error('❌ Failed to update leaderboard:', error);
      return false;
    }
  }

  async getLeaderboard(gameMode?: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const data = this.loadAllData();
      let leaderboard = data.leaderboards || [];
      
      if (gameMode) {
        leaderboard = leaderboard.filter((entry: LeaderboardEntry) => entry.gameMode === gameMode);
      }
      
      return leaderboard.slice(0, limit);
    } catch (error) {
      console.error('❌ Failed to get leaderboard:', error);
      return [];
    }
  }

  // Achievement System
  async saveAchievements(achievements: Achievement[]): Promise<boolean> {
    try {
      const existingData = this.loadAllData();
      existingData.achievements = achievements;
      
      localStorage.setItem(this.storageKey, JSON.stringify({
        ...existingData,
        lastUpdated: Date.now()
      }));

      return true;
    } catch (error) {
      console.error('❌ Failed to save achievements:', error);
      return false;
    }
  }

  async loadAchievements(): Promise<Achievement[]> {
    try {
      const data = this.loadAllData();
      return data.achievements || [];
    } catch (error) {
      console.error('❌ Failed to load achievements:', error);
      return [];
    }
  }

  async checkAchievementProgress(playerId: string, achievementId: string, progress: number): Promise<boolean> {
    try {
      const achievements = await this.loadAchievements();
      const achievement = achievements.find(a => a.id === achievementId);
      
      if (achievement && !achievement.unlocked) {
        achievement.progress = Math.min(progress, achievement.maxProgress);
        
        if (achievement.progress >= achievement.maxProgress) {
          achievement.unlocked = true;
          achievement.unlockedAt = Date.now();
          await this.unlockAchievement(playerId, achievementId);
        }
        
        await this.saveAchievements(achievements);
        return achievement.unlocked;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Failed to check achievement progress:', error);
      return false;
    }
  }

  // Data Management
  private loadAllData(): any {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        // Convert arrays back to Maps for players
        if (parsed.players && Array.isArray(parsed.players)) {
          parsed.players = new Map(parsed.players);
        }
        return parsed;
      }
      return {
        players: new Map(),
        sessions: [],
        leaderboards: [],
        achievements: [],
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      return {
        players: new Map(),
        sessions: [],
        leaderboards: [],
        achievements: [],
        lastUpdated: Date.now()
      };
    }
  }

  private startAutoSave(): void {
    this.autoSaveTimer = setInterval(() => {
      this.performAutoSave();
    }, this.autoSaveInterval);
  }

  private async performAutoSave(): Promise<void> {
    try {
      const data = this.loadAllData();
      if (this.cloudSyncEnabled) {
        await this.syncToCloud('backup', data);
      }
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
    }
  }

  private async syncToCloud(type: string, data: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.cloudSyncUrl}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data, timestamp: Date.now() })
      });
      
      return response.ok;
    } catch (error) {
      console.error('❌ Cloud sync failed:', error);
      return false;
    }
  }

  // Utility Methods
  async exportData(): Promise<string> {
    try {
      const data = this.loadAllData();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('❌ Failed to export data:', error);
      return '';
    }
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('❌ Failed to import data:', error);
      return false;
    }
  }

  async clearAllData(): Promise<boolean> {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
      return false;
    }
  }

  // Cleanup
  destroy(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }
}
