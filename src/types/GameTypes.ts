// Game Types for Triangle Ship Space Adventure
export interface Player {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  maxHealth: number;
  lives: number;
  score: number;
  invulnerable: boolean;
  invulnerabilityTime: number;
  character: 'kaden' | 'adelynn';
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  maxHealth: number;
  type: 'basic' | 'fast' | 'heavy' | 'zigzag';
  direction: number;
  shootTimer: number;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: number;
  type: 'player' | 'enemy';
  damage: number;
  owner: string;
}

export interface Collectible {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'health' | 'shield' | 'score' | 'power' | 'speed' | 'ammo';
  value: number;
  duration?: number;
  collected: boolean;
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
  type: 'destroyer' | 'battleship';
  shootTimer: number;
  phase: number;
}

export interface GameState {
  score: number;
  lives: number;
  health: number;
  level: number;
  gameTime: number;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
}

export type GameScene = 'menu' | 'playing' | 'paused' | 'gameOver' | 'character' | 'settings';
