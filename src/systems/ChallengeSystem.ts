// Challenge System - Complete Challenge Implementation
export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'special' | 'survival' | 'boss_rush' | 'speed_run' | 'precision' | 'combo';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  objectives: ChallengeObjective[];
  rewards: ChallengeReward[];
  timeLimit: number;
  isActive: boolean;
  isCompleted: boolean;
  startTime: number;
  endTime: number;
  progress: number;
  maxProgress: number;
}

export interface ChallengeObjective {
  id: string;
  description: string;
  type: 'kill' | 'survive' | 'score' | 'accuracy' | 'combo' | 'time' | 'collect' | 'boss';
  target: number;
  current: number;
  completed: boolean;
}

export interface ChallengeReward {
  type: 'xp' | 'points' | 'weapon' | 'powerup' | 'achievement' | 'currency';
  value: any;
  description: string;
}

export interface ChallengeLeaderboard {
  challengeId: string;
  entries: LeaderboardEntry[];
  lastUpdated: number;
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  score: number;
  time: number;
  rank: number;
  timestamp: number;
}

export class ChallengeSystem {
  private challenges: Map<string, Challenge> = new Map();
  private activeChallenges: Set<string> = new Set();
  private completedChallenges: Set<string> = new Set();
  private leaderboards: Map<string, ChallengeLeaderboard> = new Map();
  private challengeHistory: Challenge[] = [];
  
  // Event callbacks
  private onChallengeStart: ((challenge: Challenge) => void) | null = null;
  private onChallengeComplete: ((challenge: Challenge) => void) | null = null;
  private onObjectiveComplete: ((objective: ChallengeObjective) => void) | null = null;
  private onRewardEarned: ((reward: ChallengeReward) => void) | null = null;
  private onLeaderboardUpdate: ((leaderboard: ChallengeLeaderboard) => void) | null = null;

  constructor() {
    this.initializeChallenges();
    this.loadChallengeProgress();
  }

  private initializeChallenges() {
    const challenges: Challenge[] = [
      // Daily Challenges
      {
        id: 'daily_kill_50',
        name: 'Daily Destroyer',
        description: 'Destroy 50 enemy ships today',
        type: 'daily',
        difficulty: 'easy',
        objectives: [
          {
            id: 'obj_daily_kill',
            description: 'Destroy 50 enemy ships',
            type: 'kill',
            target: 50,
            current: 0,
            completed: false
          }
        ],
        rewards: [
          { type: 'xp', value: 100, description: '100 XP' },
          { type: 'points', value: 500, description: '500 Points' }
        ],
        timeLimit: 86400000, // 24 hours
        isActive: false,
        isCompleted: false,
        startTime: 0,
        endTime: 0,
        progress: 0,
        maxProgress: 50
      },
      {
        id: 'daily_survive_5min',
        name: 'Daily Survivor',
        description: 'Survive for 5 minutes today',
        type: 'daily',
        difficulty: 'medium',
        objectives: [
          {
            id: 'obj_daily_survive',
            description: 'Survive for 5 minutes',
            type: 'survive',
            target: 300,
            current: 0,
            completed: false
          }
        ],
        rewards: [
          { type: 'xp', value: 200, description: '200 XP' },
          { type: 'powerup', value: 'shield', description: 'Shield Power-up' }
        ],
        timeLimit: 86400000,
        isActive: false,
        isCompleted: false,
        startTime: 0,
        endTime: 0,
        progress: 0,
        maxProgress: 300
      },
      
      // Weekly Challenges
      {
        id: 'weekly_score_100k',
        name: 'Weekly Score Master',
        description: 'Achieve 100,000 points this week',
        type: 'weekly',
        difficulty: 'hard',
        objectives: [
          {
            id: 'obj_weekly_score',
            description: 'Achieve 100,000 points',
            type: 'score',
            target: 100000,
            current: 0,
            completed: false
          }
        ],
        rewards: [
          { type: 'xp', value: 1000, description: '1000 XP' },
          { type: 'weapon', value: 'laser_beam', description: 'Laser Beam Weapon' },
          { type: 'achievement', value: 'score_master', description: 'Score Master Achievement' }
        ],
        timeLimit: 604800000, // 7 days
        isActive: false,
        isCompleted: false,
        startTime: 0,
        endTime: 0,
        progress: 0,
        maxProgress: 100000
      },
      
      // Special Challenges
      {
        id: 'special_boss_rush',
        name: 'Boss Rush',
        description: 'Defeat all bosses in sequence',
        type: 'special',
        difficulty: 'expert',
        objectives: [
          {
            id: 'obj_boss_rush',
            description: 'Defeat all bosses',
            type: 'boss',
            target: 3,
            current: 0,
            completed: false
          }
        ],
        rewards: [
          { type: 'xp', value: 2000, description: '2000 XP' },
          { type: 'weapon', value: 'ultimate_weapon', description: 'Ultimate Weapon' },
          { type: 'achievement', value: 'boss_slayer', description: 'Boss Slayer Achievement' }
        ],
        timeLimit: 1800000, // 30 minutes
        isActive: false,
        isCompleted: false,
        startTime: 0,
        endTime: 0,
        progress: 0,
        maxProgress: 3
      },
      
      // Survival Challenges
      {
        id: 'survival_10min',
        name: 'Survival Master',
        description: 'Survive for 10 minutes without dying',
        type: 'survival',
        difficulty: 'hard',
        objectives: [
          {
            id: 'obj_survival_10min',
            description: 'Survive for 10 minutes',
            type: 'survive',
            target: 600,
            current: 0,
            completed: false
          }
        ],
        rewards: [
          { type: 'xp', value: 1500, description: '1500 XP' },
          { type: 'achievement', value: 'survival_master', description: 'Survival Master Achievement' }
        ],
        timeLimit: 0,
        isActive: false,
        isCompleted: false,
        startTime: 0,
        endTime: 0,
        progress: 0,
        maxProgress: 600
      },
      
      // Speed Run Challenges
      {
        id: 'speedrun_2min',
        name: 'Speed Demon',
        description: 'Complete a level in under 2 minutes',
        type: 'speed_run',
        difficulty: 'medium',
        objectives: [
          {
            id: 'obj_speedrun_2min',
            description: 'Complete level in under 2 minutes',
            type: 'time',
            target: 120,
            current: 0,
            completed: false
          }
        ],
        rewards: [
          { type: 'xp', value: 800, description: '800 XP' },
          { type: 'achievement', value: 'speed_demon', description: 'Speed Demon Achievement' }
        ],
        timeLimit: 0,
        isActive: false,
        isCompleted: false,
        startTime: 0,
        endTime: 0,
        progress: 0,
        maxProgress: 120
      },
      
      // Precision Challenges
      {
        id: 'precision_90acc',
        name: 'Sharpshooter',
        description: 'Achieve 90% accuracy with 100+ shots',
        type: 'precision',
        difficulty: 'hard',
        objectives: [
          {
            id: 'obj_precision_90acc',
            description: 'Achieve 90% accuracy',
            type: 'accuracy',
            target: 90,
            current: 0,
            completed: false
          }
        ],
        rewards: [
          { type: 'xp', value: 1200, description: '1200 XP' },
          { type: 'achievement', value: 'sharpshooter', description: 'Sharpshooter Achievement' }
        ],
        timeLimit: 0,
        isActive: false,
        isCompleted: false,
        startTime: 0,
        endTime: 0,
        progress: 0,
        maxProgress: 90
      },
      
      // Combo Challenges
      {
        id: 'combo_50x',
        name: 'Combo Master',
        description: 'Achieve a 50x combo',
        type: 'combo',
        difficulty: 'expert',
        objectives: [
          {
            id: 'obj_combo_50x',
            description: 'Achieve 50x combo',
            type: 'combo',
            target: 50,
            current: 0,
            completed: false
          }
        ],
        rewards: [
          { type: 'xp', value: 2500, description: '2500 XP' },
          { type: 'achievement', value: 'combo_master', description: 'Combo Master Achievement' }
        ],
        timeLimit: 0,
        isActive: false,
        isCompleted: false,
        startTime: 0,
        endTime: 0,
        progress: 0,
        maxProgress: 50
      }
    ];

    challenges.forEach(challenge => {
      this.challenges.set(challenge.id, challenge);
    });
  }

  // Challenge management
  startChallenge(challengeId: string): boolean {
    const challenge = this.challenges.get(challengeId);
    if (!challenge || challenge.isActive || challenge.isCompleted) return false;

    challenge.isActive = true;
    challenge.startTime = Date.now();
    challenge.endTime = challenge.startTime + challenge.timeLimit;
    challenge.progress = 0;
    
    this.activeChallenges.add(challengeId);
    this.onChallengeStart?.(challenge);
    
    return true;
  }

  completeChallenge(challengeId: string): boolean {
    const challenge = this.challenges.get(challengeId);
    if (!challenge || !challenge.isActive) return false;

    challenge.isCompleted = true;
    challenge.isActive = false;
    
    this.activeChallenges.delete(challengeId);
    this.completedChallenges.add(challengeId);
    this.challengeHistory.push(challenge);
    
    // Award rewards
    challenge.rewards.forEach(reward => {
      this.awardReward(reward);
    });
    
    this.onChallengeComplete?.(challenge);
    
    return true;
  }

  // Objective management
  updateObjective(challengeId: string, objectiveId: string, progress: number): boolean {
    const challenge = this.challenges.get(challengeId);
    if (!challenge || !challenge.isActive) return false;

    const objective = challenge.objectives.find(obj => obj.id === objectiveId);
    if (!objective) return false;

    objective.current = Math.min(objective.current + progress, objective.target);
    challenge.progress = this.calculateChallengeProgress(challenge);
    
    if (objective.current >= objective.target && !objective.completed) {
      objective.completed = true;
      this.onObjectiveComplete?.(objective);
    }

    // Check if challenge is completed
    if (this.isChallengeCompleted(challenge)) {
      this.completeChallenge(challengeId);
    }

    return true;
  }

  private calculateChallengeProgress(challenge: Challenge): number {
    const totalObjectives = challenge.objectives.length;
    const completedObjectives = challenge.objectives.filter(obj => obj.completed).length;
    return (completedObjectives / totalObjectives) * 100;
  }

  private isChallengeCompleted(challenge: Challenge): boolean {
    return challenge.objectives.every(obj => obj.completed);
  }

  // Daily challenge rotation
  rotateDailyChallenges() {
    const dailyChallenges = Array.from(this.challenges.values())
      .filter(challenge => challenge.type === 'daily');
    
    dailyChallenges.forEach(challenge => {
      challenge.isActive = false;
      challenge.isCompleted = false;
      challenge.progress = 0;
      challenge.objectives.forEach(obj => {
        obj.current = 0;
        obj.completed = false;
      });
    });
    
    // Activate random daily challenges
    const randomDaily = this.getRandomChallenges(dailyChallenges, 2);
    randomDaily.forEach(challenge => {
      this.startChallenge(challenge.id);
    });
  }

  // Weekly challenge rotation
  rotateWeeklyChallenges() {
    const weeklyChallenges = Array.from(this.challenges.values())
      .filter(challenge => challenge.type === 'weekly');
    
    weeklyChallenges.forEach(challenge => {
      challenge.isActive = false;
      challenge.isCompleted = false;
      challenge.progress = 0;
      challenge.objectives.forEach(obj => {
        obj.current = 0;
        obj.completed = false;
      });
    });
    
    // Activate random weekly challenges
    const randomWeekly = this.getRandomChallenges(weeklyChallenges, 1);
    randomWeekly.forEach(challenge => {
      this.startChallenge(challenge.id);
    });
  }

  private getRandomChallenges(challenges: Challenge[], count: number): Challenge[] {
    const shuffled = [...challenges].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Leaderboard management
  updateLeaderboard(challengeId: string, playerId: string, playerName: string, score: number, time: number) {
    let leaderboard = this.leaderboards.get(challengeId);
    if (!leaderboard) {
      leaderboard = {
        challengeId,
        entries: [],
        lastUpdated: Date.now()
      };
      this.leaderboards.set(challengeId, leaderboard);
    }

    // Update or add entry
    const existingEntry = leaderboard.entries.find(entry => entry.playerId === playerId);
    if (existingEntry) {
      existingEntry.score = Math.max(existingEntry.score, score);
      existingEntry.time = Math.min(existingEntry.time, time);
      existingEntry.timestamp = Date.now();
    } else {
      leaderboard.entries.push({
        playerId,
        playerName,
        score,
        time,
        rank: 0,
        timestamp: Date.now()
      });
    }

    // Sort and rank entries
    leaderboard.entries.sort((a, b) => b.score - a.score);
    leaderboard.entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // Keep only top 10
    leaderboard.entries = leaderboard.entries.slice(0, 10);
    leaderboard.lastUpdated = Date.now();

    this.onLeaderboardUpdate?.(leaderboard);
  }

  // Reward system
  private awardReward(reward: ChallengeReward) {
    switch (reward.type) {
      case 'xp':
        console.log(`XP awarded: ${reward.value}`);
        break;
      case 'points':
        console.log(`Points awarded: ${reward.value}`);
        break;
      case 'weapon':
        console.log(`Weapon unlocked: ${reward.value}`);
        break;
      case 'powerup':
        console.log(`Power-up unlocked: ${reward.value}`);
        break;
      case 'achievement':
        console.log(`Achievement unlocked: ${reward.value}`);
        break;
      case 'currency':
        console.log(`Currency awarded: ${reward.value}`);
        break;
    }

    this.onRewardEarned?.(reward);
  }

  // Getters
  getChallenge(challengeId: string): Challenge | null {
    return this.challenges.get(challengeId) || null;
  }

  getActiveChallenges(): Challenge[] {
    return Array.from(this.activeChallenges)
      .map(id => this.challenges.get(id))
      .filter(challenge => challenge !== undefined) as Challenge[];
  }

  getCompletedChallenges(): Challenge[] {
    return Array.from(this.completedChallenges)
      .map(id => this.challenges.get(id))
      .filter(challenge => challenge !== undefined) as Challenge[];
  }

  getChallengesByType(type: string): Challenge[] {
    return Array.from(this.challenges.values())
      .filter(challenge => challenge.type === type);
  }

  getChallengesByDifficulty(difficulty: string): Challenge[] {
    return Array.from(this.challenges.values())
      .filter(challenge => challenge.difficulty === difficulty);
  }

  getLeaderboard(challengeId: string): ChallengeLeaderboard | null {
    return this.leaderboards.get(challengeId) || null;
  }

  getChallengeHistory(): Challenge[] {
    return this.challengeHistory;
  }

  // Event setters
  setOnChallengeStart(callback: (challenge: Challenge) => void) {
    this.onChallengeStart = callback;
  }

  setOnChallengeComplete(callback: (challenge: Challenge) => void) {
    this.onChallengeComplete = callback;
  }

  setOnObjectiveComplete(callback: (objective: ChallengeObjective) => void) {
    this.onObjectiveComplete = callback;
  }

  setOnRewardEarned(callback: (reward: ChallengeReward) => void) {
    this.onRewardEarned = callback;
  }

  setOnLeaderboardUpdate(callback: (leaderboard: ChallengeLeaderboard) => void) {
    this.onLeaderboardUpdate = callback;
  }

  // Update method
  update(deltaTime: number) {
    const currentTime = Date.now();
    
    // Check for expired challenges
    this.activeChallenges.forEach(challengeId => {
      const challenge = this.challenges.get(challengeId);
      if (challenge && challenge.endTime > 0 && currentTime > challenge.endTime) {
        challenge.isActive = false;
        this.activeChallenges.delete(challengeId);
      }
    });
  }

  // Save/Load
  saveChallengeProgress() {
    const progress = {
      activeChallenges: Array.from(this.activeChallenges),
      completedChallenges: Array.from(this.completedChallenges),
      challengeHistory: this.challengeHistory,
      leaderboards: Array.from(this.leaderboards.entries())
    };
    
    localStorage.setItem('challengeProgress', JSON.stringify(progress));
  }

  loadChallengeProgress() {
    const saved = localStorage.getItem('challengeProgress');
    if (!saved) return;

    try {
      const progress = JSON.parse(saved);
      
      this.activeChallenges = new Set(progress.activeChallenges);
      this.completedChallenges = new Set(progress.completedChallenges);
      this.challengeHistory = progress.challengeHistory;
      
      this.leaderboards.clear();
      progress.leaderboards.forEach(([id, leaderboard]: [string, ChallengeLeaderboard]) => {
        this.leaderboards.set(id, leaderboard);
      });
    } catch (error) {
      console.error('Failed to load challenge progress:', error);
    }
  }
}

export default ChallengeSystem;
