export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  score: number;
  achievements: string[];
  rank: number;
  joinDate: Date;
  lastActive: Date;
  stats: PlayerStats;
}

export interface PlayerStats {
  totalScore: number;
  gamesPlayed: number;
  enemiesKilled: number;
  bossesDefeated: number;
  powerUpsCollected: number;
  survivalTime: number;
  accuracy: number;
  maxCombo: number;
  favoriteWeapon: string;
  favoriteShip: string;
}

export interface LeaderboardEntry {
  rank: number;
  player: PlayerProfile;
  score: number;
  level: number;
  achievements: number;
  lastActive: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'ultimate';
  points: number;
  requirements: AchievementRequirement[];
  unlocked: boolean;
  unlockedDate?: Date;
}

export interface AchievementRequirement {
  type: 'score' | 'enemies' | 'bosses' | 'powerups' | 'survival' | 'accuracy' | 'combo' | 'weapons' | 'ships' | 'missions';
  target: number;
  description: string;
}

export interface SocialPost {
  id: string;
  playerId: string;
  playerName: string;
  type: 'achievement' | 'score' | 'boss_defeat' | 'milestone' | 'screenshot' | 'video';
  content: string;
  data: any;
  timestamp: Date;
  likes: number;
  comments: SocialComment[];
  shares: number;
}

export interface SocialComment {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  timestamp: Date;
  likes: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: number;
  online: boolean;
  lastActive: Date;
  status: 'online' | 'offline' | 'playing' | 'away';
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  requirements: ChallengeRequirement[];
  rewards: ChallengeReward[];
  startDate: Date;
  endDate: Date;
  participants: string[];
  leaderboard: ChallengeLeaderboardEntry[];
}

export interface ChallengeRequirement {
  type: 'score' | 'enemies' | 'bosses' | 'powerups' | 'survival' | 'accuracy' | 'combo';
  target: number;
  description: string;
}

export interface ChallengeReward {
  type: 'score' | 'weapon' | 'ship' | 'powerup' | 'currency' | 'achievement';
  value: string | number;
  description: string;
}

export interface ChallengeLeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  progress: number;
}

export class SocialFeaturesSystem {
  private players: Map<string, PlayerProfile> = new Map();
  private leaderboards: Map<string, LeaderboardEntry[]> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private socialPosts: SocialPost[] = [];
  private friends: Map<string, Friend[]> = new Map();
  private challenges: Map<string, Challenge> = new Map();
  private currentPlayer: PlayerProfile | null = null;

  constructor() {
    this.initializeAchievements();
    this.initializeChallenges();
  }

  private initializeAchievements() {
    const achievementList: Achievement[] = [
      {
        id: 'first_kill',
        name: 'First Blood',
        description: 'Kill your first enemy',
        icon: '🔴',
        rarity: 'common',
        points: 10,
        requirements: [{ type: 'enemies', target: 1, description: 'Kill 1 enemy' }],
        unlocked: false
      },
      {
        id: 'score_master',
        name: 'Score Master',
        description: 'Reach 10,000 points',
        icon: '⭐',
        rarity: 'common',
        points: 25,
        requirements: [{ type: 'score', target: 10000, description: 'Reach 10,000 points' }],
        unlocked: false
      },
      {
        id: 'boss_slayer',
        name: 'Boss Slayer',
        description: 'Defeat your first boss',
        icon: '👹',
        rarity: 'rare',
        points: 50,
        requirements: [{ type: 'bosses', target: 1, description: 'Defeat 1 boss' }],
        unlocked: false
      },
      {
        id: 'survival_expert',
        name: 'Survival Expert',
        description: 'Survive for 5 minutes',
        icon: '⏰',
        rarity: 'rare',
        points: 75,
        requirements: [{ type: 'survival', target: 300, description: 'Survive for 5 minutes' }],
        unlocked: false
      },
      {
        id: 'accuracy_master',
        name: 'Accuracy Master',
        description: 'Maintain 90% accuracy',
        icon: '🎯',
        rarity: 'epic',
        points: 100,
        requirements: [{ type: 'accuracy', target: 90, description: 'Maintain 90% accuracy' }],
        unlocked: false
      },
      {
        id: 'combo_king',
        name: 'Combo King',
        description: 'Achieve a 50x combo',
        icon: '🔥',
        rarity: 'epic',
        points: 125,
        requirements: [{ type: 'combo', target: 50, description: 'Achieve a 50x combo' }],
        unlocked: false
      },
      {
        id: 'weapon_collector',
        name: 'Weapon Collector',
        description: 'Unlock 10 different weapons',
        icon: '🔫',
        rarity: 'legendary',
        points: 200,
        requirements: [{ type: 'weapons', target: 10, description: 'Unlock 10 different weapons' }],
        unlocked: false
      },
      {
        id: 'ship_master',
        name: 'Ship Master',
        description: 'Unlock 5 different ships',
        icon: '🚀',
        rarity: 'legendary',
        points: 250,
        requirements: [{ type: 'ships', target: 5, description: 'Unlock 5 different ships' }],
        unlocked: false
      },
      {
        id: 'mission_complete',
        name: 'Mission Complete',
        description: 'Complete 10 missions',
        icon: '✅',
        rarity: 'legendary',
        points: 300,
        requirements: [{ type: 'missions', target: 10, description: 'Complete 10 missions' }],
        unlocked: false
      },
      {
        id: 'ultimate_warrior',
        name: 'Ultimate Warrior',
        description: 'Reach level 50',
        icon: '👑',
        rarity: 'ultimate',
        points: 500,
        requirements: [{ type: 'score', target: 100000, description: 'Reach level 50' }],
        unlocked: false
      }
    ];

    achievementList.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  private initializeChallenges() {
    const challengeList: Challenge[] = [
      {
        id: 'daily_score',
        name: 'Daily Score Challenge',
        description: 'Score 5,000 points today',
        type: 'daily',
        requirements: [{ type: 'score', target: 5000, description: 'Score 5,000 points' }],
        rewards: [{ type: 'currency', value: 100, description: '100 space credits' }],
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        participants: [],
        leaderboard: []
      },
      {
        id: 'weekly_boss',
        name: 'Weekly Boss Challenge',
        description: 'Defeat 5 bosses this week',
        type: 'weekly',
        requirements: [{ type: 'bosses', target: 5, description: 'Defeat 5 bosses' }],
        rewards: [{ type: 'weapon', value: 'rare_weapon', description: 'Rare weapon unlock' }],
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        participants: [],
        leaderboard: []
      },
      {
        id: 'monthly_survival',
        name: 'Monthly Survival Challenge',
        description: 'Survive for 10 minutes this month',
        type: 'monthly',
        requirements: [{ type: 'survival', target: 600, description: 'Survive for 10 minutes' }],
        rewards: [{ type: 'ship', value: 'legendary_ship', description: 'Legendary ship unlock' }],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        participants: [],
        leaderboard: []
      }
    ];

    challengeList.forEach(challenge => {
      this.challenges.set(challenge.id, challenge);
    });
  }

  createPlayer(name: string, avatar: string): PlayerProfile {
    const player: PlayerProfile = {
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name,
      avatar: avatar,
      level: 1,
      score: 0,
      achievements: [],
      rank: 0,
      joinDate: new Date(),
      lastActive: new Date(),
      stats: {
        totalScore: 0,
        gamesPlayed: 0,
        enemiesKilled: 0,
        bossesDefeated: 0,
        powerUpsCollected: 0,
        survivalTime: 0,
        accuracy: 0,
        maxCombo: 0,
        favoriteWeapon: 'basic',
        favoriteShip: 'default'
      }
    };

    this.players.set(player.id, player);
    this.currentPlayer = player;
    return player;
  }

  getCurrentPlayer(): PlayerProfile | null {
    return this.currentPlayer;
  }

  updatePlayerStats(playerId: string, stats: Partial<PlayerStats>): void {
    const player = this.players.get(playerId);
    if (player) {
      Object.assign(player.stats, stats);
      player.lastActive = new Date();
      this.updateLeaderboards();
      this.checkAchievements(playerId);
    }
  }

  private updateLeaderboards(): void {
    const players = Array.from(this.players.values());
    
    // Global leaderboard
    const globalLeaderboard = players
      .sort((a, b) => b.stats.totalScore - a.stats.totalScore)
      .map((player, index) => ({
        rank: index + 1,
        player: player,
        score: player.stats.totalScore,
        level: player.level,
        achievements: player.achievements.length,
        lastActive: player.lastActive
      }));

    this.leaderboards.set('global', globalLeaderboard);

    // Weekly leaderboard
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyLeaderboard = players
      .filter(player => player.lastActive > weekAgo)
      .sort((a, b) => b.stats.totalScore - a.stats.totalScore)
      .map((player, index) => ({
        rank: index + 1,
        player: player,
        score: player.stats.totalScore,
        level: player.level,
        achievements: player.achievements.length,
        lastActive: player.lastActive
      }));

    this.leaderboards.set('weekly', weeklyLeaderboard);

    // Daily leaderboard
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyLeaderboard = players
      .filter(player => player.lastActive > dayAgo)
      .sort((a, b) => b.stats.totalScore - a.stats.totalScore)
      .map((player, index) => ({
        rank: index + 1,
        player: player,
        score: player.stats.totalScore,
        level: player.level,
        achievements: player.achievements.length,
        lastActive: player.lastActive
      }));

    this.leaderboards.set('daily', dailyLeaderboard);
  }

  getLeaderboard(type: string = 'global'): LeaderboardEntry[] {
    return this.leaderboards.get(type) || [];
  }

  getPlayerRank(playerId: string, type: string = 'global'): number {
    const leaderboard = this.getLeaderboard(type);
    const entry = leaderboard.find(entry => entry.player.id === playerId);
    return entry ? entry.rank : 0;
  }

  private checkAchievements(playerId: string): void {
    const player = this.players.get(playerId);
    if (!player) return;

    this.achievements.forEach(achievement => {
      if (!achievement.unlocked && this.checkAchievementRequirements(player, achievement)) {
        this.unlockAchievement(playerId, achievement.id);
      }
    });
  }

  private checkAchievementRequirements(player: PlayerProfile, achievement: Achievement): boolean {
    return achievement.requirements.every(requirement => {
      switch (requirement.type) {
        case 'score':
          return player.stats.totalScore >= requirement.target;
        case 'enemies':
          return player.stats.enemiesKilled >= requirement.target;
        case 'bosses':
          return player.stats.bossesDefeated >= requirement.target;
        case 'powerups':
          return player.stats.powerUpsCollected >= requirement.target;
        case 'survival':
          return player.stats.survivalTime >= requirement.target;
        case 'accuracy':
          return player.stats.accuracy >= requirement.target;
        case 'combo':
          return player.stats.maxCombo >= requirement.target;
        case 'weapons':
          return this.getUnlockedWeaponsCount(playerId) >= requirement.target;
        case 'ships':
          return this.getUnlockedShipsCount(playerId) >= requirement.target;
        case 'missions':
          return this.getCompletedMissionsCount(playerId) >= requirement.target;
        default:
          return false;
      }
    });
  }

  private getUnlockedWeaponsCount(playerId: string): number {
    // This would be implemented based on your weapon system
    return 0;
  }

  private getUnlockedShipsCount(playerId: string): number {
    // This would be implemented based on your ship system
    return 0;
  }

  private getCompletedMissionsCount(playerId: string): number {
    // This would be implemented based on your mission system
    return 0;
  }

  unlockAchievement(playerId: string, achievementId: string): boolean {
    const player = this.players.get(playerId);
    const achievement = this.achievements.get(achievementId);
    
    if (player && achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedDate = new Date();
      player.achievements.push(achievementId);
      
      // Create social post for achievement
      this.createSocialPost(playerId, 'achievement', {
        achievement: achievement,
        message: `${player.name} unlocked the achievement "${achievement.name}"!`
      });
      
      return true;
    }
    
    return false;
  }

  getAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  getPlayerAchievements(playerId: string): Achievement[] {
    const player = this.players.get(playerId);
    if (!player) return [];
    
    return player.achievements.map(id => this.achievements.get(id)).filter(Boolean) as Achievement[];
  }

  createSocialPost(playerId: string, type: string, data: any): SocialPost {
    const player = this.players.get(playerId);
    if (!player) throw new Error('Player not found');

    const post: SocialPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId: playerId,
      playerName: player.name,
      type: type as any,
      content: data.message || '',
      data: data,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      shares: 0
    };

    this.socialPosts.push(post);
    return post;
  }

  getSocialPosts(limit: number = 20): SocialPost[] {
    return this.socialPosts
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  likePost(postId: string, playerId: string): boolean {
    const post = this.socialPosts.find(p => p.id === postId);
    if (post) {
      post.likes++;
      return true;
    }
    return false;
  }

  sharePost(postId: string, playerId: string): boolean {
    const post = this.socialPosts.find(p => p.id === postId);
    if (post) {
      post.shares++;
      return true;
    }
    return false;
  }

  addFriend(playerId: string, friendId: string): boolean {
    const player = this.players.get(playerId);
    const friend = this.players.get(friendId);
    
    if (player && friend) {
      if (!this.friends.has(playerId)) {
        this.friends.set(playerId, []);
      }
      
      const friendList = this.friends.get(playerId)!;
      if (!friendList.find(f => f.id === friendId)) {
        friendList.push({
          id: friend.id,
          name: friend.name,
          avatar: friend.avatar,
          level: friend.level,
          online: true,
          lastActive: friend.lastActive,
          status: 'online'
        });
        return true;
      }
    }
    
    return false;
  }

  getFriends(playerId: string): Friend[] {
    return this.friends.get(playerId) || [];
  }

  getChallenges(): Challenge[] {
    return Array.from(this.challenges.values());
  }

  joinChallenge(playerId: string, challengeId: string): boolean {
    const challenge = this.challenges.get(challengeId);
    if (challenge && !challenge.participants.includes(playerId)) {
      challenge.participants.push(playerId);
      return true;
    }
    return false;
  }

  updateChallengeProgress(playerId: string, challengeId: string, progress: number): void {
    const challenge = this.challenges.get(challengeId);
    if (challenge) {
      let entry = challenge.leaderboard.find(e => e.playerId === playerId);
      if (!entry) {
        entry = {
          rank: 0,
          playerId: playerId,
          playerName: this.players.get(playerId)?.name || 'Unknown',
          score: 0,
          progress: 0
        };
        challenge.leaderboard.push(entry);
      }
      
      entry.progress = progress;
      entry.score = progress;
      
      // Sort leaderboard
      challenge.leaderboard.sort((a, b) => b.score - a.score);
      challenge.leaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
      });
    }
  }

  getChallengeLeaderboard(challengeId: string): ChallengeLeaderboardEntry[] {
    const challenge = this.challenges.get(challengeId);
    return challenge ? challenge.leaderboard : [];
  }

  getPlayerStats(playerId: string): PlayerStats | null {
    const player = this.players.get(playerId);
    return player ? player.stats : null;
  }

  getPlayerProfile(playerId: string): PlayerProfile | null {
    return this.players.get(playerId) || null;
  }

  getAllPlayers(): PlayerProfile[] {
    return Array.from(this.players.values());
  }

  getTopPlayers(limit: number = 10): PlayerProfile[] {
    return this.getLeaderboard('global')
      .slice(0, limit)
      .map(entry => entry.player);
  }

  getRecentAchievements(limit: number = 10): Achievement[] {
    return this.getAchievements()
      .filter(achievement => achievement.unlocked)
      .sort((a, b) => (b.unlockedDate?.getTime() || 0) - (a.unlockedDate?.getTime() || 0))
      .slice(0, limit);
  }
}
