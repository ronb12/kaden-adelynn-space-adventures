export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  maxSpeed: number;
  health: number;
  maxHealth: number;
  invulnerable: boolean;
  invulnerabilityTime: number;
  level: number;
  xp: number;
  maxXP: number;
  hasShield: boolean;
  shieldTime: number;
  rapidFire: boolean;
  rapidFireTime: number;
  doubleShot: boolean;
  wingFighters: WingFighter[];
}

export interface WingFighter {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  targetX: number;
  targetY: number;
  offset: number;
}

export interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  maxHealth: number;
  type: string;
  color: string;
  movementPattern: string;
  lastDirectionChange: number;
  direction: number;
}

export interface Boss {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  speed: number;
  type: string;
  color: string;
  attackPattern: string;
  lastAttack: number;
  attackCooldown: number;
  phase: number;
  maxPhase: number;
}

export interface Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: string;
  color: string;
  damage: number;
  owner: 'player' | 'enemy' | 'boss';
}

export interface PowerUp {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  color: string;
  icon: string;
  duration: number;
  value: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  lives: number;
  health: number;
  maxHealth: number;
  combo: number;
  killStreak: number;
  maxCombo: number;
  maxKillStreak: number;
  playerLevel: number;
  playerXP: number;
  bossesDefeated: number;
  enemiesDestroyed: number;
  powerUpsCollected: number;
  gameTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  wingFighters: number;
  shieldsUsed: number;
  weaponsUsed: number;
  livesLost: number;
  shieldTime: number;
  rapidFireTime: number;
  doubleShotTime: number;
  rapidFireUses: number;
  doubleShotUses: number;
  shieldUses: number;
  speedBoostUses: number;
  healthBoostUses: number;
  scoreMultiplierUses: number;
}

export interface GameState {
  state: 'menu' | 'playing' | 'paused' | 'gameOver' | 'settings';
  difficulty: 'easy' | 'medium' | 'hard';
  showAchievements: boolean;
  showSettings: boolean;
  specialEvent: string | null;
  specialEventTime: number;
}